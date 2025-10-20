"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { format, parse } from "date-fns";
import PaymentStripeProvider from "@/app/providers/PaymentStripeProvider";
import { counselorPayments, counselors } from "@/app/lib/api/endpoints";
import { apiGet, apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

// Inner component that uses Stripe hooks
function CounselingPaymentContent({ bookingData, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("saved");
  const [savedPaymentMethodId, setSavedPaymentMethodId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  // Check if Stripe is available
  const isStripeAvailable = stripe && elements;

  useEffect(() => {
    fetchPaymentMethods();
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection...");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://ivyway-backend-iu4z.onrender.com/api"
        }/health`
      );
      console.log("API health check response:", response.status);
    } catch (error) {
      console.error("API connection test failed:", error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true);
      const res = await apiGet("payment-methods");
      const methods = res.data || res.methods || [];

      // Sort methods: default first, then by creation date
      const sortedMethods = methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setPaymentMethods(sortedMethods);

      // Set default payment method if available
      const defaultMethod = sortedMethods.find((m) => m.isDefault);
      if (defaultMethod) {
        setSavedPaymentMethodId(defaultMethod.id);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);

      // Don't show error toast for payment methods - just log it
      // User can still proceed with new payment method
      console.warn(
        "Payment methods not available, user can add new payment method"
      );

      // Set empty array so UI shows "add new payment method" option
      setPaymentMethods([]);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const processPayment = async (e) => {
    if (!isStripeAvailable) {
      toast.error("Payment system is not available. Please try again later.");
      return;
    }

    // Validate booking data
    if (!bookingData || !bookingData.counselorId || !bookingData.amount) {
      toast.error("Invalid booking data. Please start over.");
      router.push("/student/book-counselor");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let paymentMethodId = null;

      if (selectedPaymentMethod === "saved") {
        if (!savedPaymentMethodId) {
          setErrors({ payment: "Please select a payment method" });
          setIsSubmitting(false);
          return;
        }
        paymentMethodId = savedPaymentMethodId;
      } else {
        // Create new payment method
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          setErrors({ card: "Card details are required" });
          setIsSubmitting(false);
          return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          console.error("Stripe payment method creation error:", error);
          setErrors({ card: error.message });
          setIsSubmitting(false);
          return;
        }

        if (!paymentMethod || !paymentMethod.id) {
          setErrors({
            card: "Failed to create payment method. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }

        paymentMethodId = paymentMethod.id;
      }

      // Create payment intent for counseling session
      const paymentData = {
        amount: bookingData.amount,
        currency: bookingData.currency,
        paymentMethodId: paymentMethodId,
        bookingData: {
          counselorId: bookingData.counselorId,
          providerRole: "counselor",
          serviceType: "counseling",
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          sessionType: bookingData.sessionType,
          duration: bookingData.duration,
          notes: bookingData.notes,
          subject: bookingData.subject,
          topic: bookingData.topic,
          status: "pending",
        },
      };

      console.log("Processing counseling payment:", paymentData);

      // Process payment via API with detailed error handling
      let response;
      try {
        console.log("Calling counselorPayments.processPayment...");
        console.log(
          "Payment data being sent:",
          JSON.stringify(paymentData, null, 2)
        );

        // Test direct API call first
        const directResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://ivyway-backend-iu4z.onrender.com/api"
          }/counselor/payments/process`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify(paymentData),
          }
        );

        console.log("Direct API call response status:", directResponse.status);
        const directData = await directResponse.json();
        console.log("Direct API call response data:", directData);

        if (!directResponse.ok) {
          throw {
            status: directResponse.status,
            message: directData.message || `HTTP ${directResponse.status}`,
            data: directData,
          };
        }

        response = directData;
        console.log("Payment processed successfully:", response);
      } catch (apiError) {
        console.error("API call failed with error:", apiError);
        console.error("Error type:", typeof apiError);
        console.error("Error constructor:", apiError?.constructor?.name);
        console.error("Error keys:", Object.keys(apiError || {}));
        console.error("Error stringified:", JSON.stringify(apiError, null, 2));

        // Re-throw the error to be caught by the outer catch block
        throw apiError;
      }

      // Handle different response structures
      const bookingId =
        response?.data?.bookingId || response?.bookingId || response?.id;

      if (!bookingId) {
        throw new Error(
          "Payment successful but booking ID not received. Please contact support."
        );
      }

      toast.success(
        "Payment successful! Your counseling session request has been submitted."
      );

      // Redirect to success page with booking details
      const params = new URLSearchParams({
        booking: bookingId,
        counselor: bookingData.counselorId,
        type: bookingData.sessionType,
        date: bookingData.startTime.split("T")[0],
        time: bookingData.time,
        notes: bookingData.notes || "",
      });

      router.push(`/student/book-counselor/success?${params.toString()}`);
    } catch (error) {
      console.error("Payment error:", error);

      // Extract meaningful error message from API client error structure
      let errorMessage = "Payment processing failed. Please try again.";

      // Handle API client error structure
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.status) {
        // Handle HTTP status errors
        switch (error.status) {
          case 400:
            errorMessage =
              "Invalid payment data. Please check your information.";
            break;
          case 401:
            errorMessage = "Authentication required. Please login again.";
            break;
          case 403:
            errorMessage = "You don't have permission to make this payment.";
            break;
          case 404:
            errorMessage = "Payment service not found. Please try again later.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          case 0:
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = `Payment failed (${error.status}). Please try again.`;
        }
      }

      // Handle CORS errors specifically
      if (error?.isCorsError) {
        errorMessage =
          "Connection error. Please check your internet connection and try again.";
      }

      console.error("Detailed error info:", {
        error,
        message: errorMessage,
        status: error?.status,
        response: error?.response,
        data: error?.data,
        isCorsError: error?.isCorsError,
      });

      // For development/testing purposes, offer a fallback
      if (
        process.env.NODE_ENV === "development" &&
        (error?.status === 0 || !error?.status)
      ) {
        const shouldProceed = window.confirm(
          "Payment API is not available. For testing purposes, would you like to proceed with a mock payment?"
        );

        if (shouldProceed) {
          // Mock successful payment for testing
          toast.success("Mock payment successful! (Development mode)");

          const mockBookingId = `mock_${Date.now()}`;
          const params = new URLSearchParams({
            booking: mockBookingId,
            counselor: bookingData.counselorId,
            type: bookingData.sessionType,
            date: bookingData.startTime.split("T")[0],
            time: bookingData.time,
            notes: bookingData.notes || "",
          });

          router.push(`/student/book-counselor/success?${params.toString()}`);
          return;
        }
      }

      // Additional fallback for any empty error object
      if (!error || Object.keys(error).length === 0) {
        const shouldProceed = window.confirm(
          "Payment processing encountered an unknown error. Would you like to proceed with a test booking? (This will not process actual payment)"
        );

        if (shouldProceed) {
          toast.success("Test booking created successfully!");

          const testBookingId = `test_${Date.now()}`;
          const params = new URLSearchParams({
            booking: testBookingId,
            counselor: bookingData.counselorId,
            type: bookingData.sessionType,
            date: bookingData.startTime.split("T")[0],
            time: bookingData.time,
            notes: bookingData.notes || "",
          });

          router.push(`/student/book-counselor/success?${params.toString()}`);
          return;
        }
      }

      // Offer retry for certain types of errors
      if (
        retryCount < maxRetries &&
        (error?.status === 0 || error?.status >= 500)
      ) {
        const shouldRetry = window.confirm(
          `Payment failed. Would you like to retry? (Attempt ${
            retryCount + 1
          }/${maxRetries})`
        );

        if (shouldRetry) {
          setRetryCount((prev) => prev + 1);
          setErrors({});
          // Retry the payment after a short delay
          setTimeout(() => {
            processPayment();
          }, 1000);
          return;
        }
      }

      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRetryCount(0); // Reset retry count for new submission

    // For testing purposes, add a simple bypass
    const testMode = true; // Set to false for production

    if (testMode) {
      // Test mode - skip actual payment processing
      setIsSubmitting(true);

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create test booking
      const testBookingId = `test_payment_${Date.now()}`;
      const params = new URLSearchParams({
        booking: testBookingId,
        counselor: bookingData.counselorId,
        type: bookingData.sessionType,
        date: bookingData.startTime.split("T")[0],
        time: bookingData.time,
        notes: bookingData.notes || "",
      });

      toast.success("Test payment successful - Booking created!");
      router.push(`/student/book-counselor/success?${params.toString()}`);
      return;
    }

    await processPayment();
  };

  const sessionType =
    bookingData.sessionType === "30min" ? "30 minutes" : "60 minutes";
  const price = bookingData.sessionType === "30min" ? 30 : 40;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Session Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Session Summary
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={bookingData.counselor.avatar}
                alt={bookingData.counselor.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {bookingData.counselor.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {bookingData.counselor.title}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {format(
                    new Date(bookingData.startTime),
                    "EEEE, MMMM d, yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>
                  {format(
                    parse(bookingData.time, "HH:mm", new Date()),
                    "h:mm a"
                  )}{" "}
                  -
                  {format(
                    parse(bookingData.time, "HH:mm", new Date()).setMinutes(
                      parse(
                        bookingData.time,
                        "HH:mm",
                        new Date()
                      ).getMinutes() + bookingData.duration
                    ),
                    "h:mm a"
                  )}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2" />
                <span>{sessionType} Counseling Session</span>
              </div>
            </div>

            {bookingData.notes && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Session Notes
                </h4>
                <p className="text-sm text-gray-600">{bookingData.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>

              <div className="space-y-3">
                {/* Saved Payment Methods */}
                {loadingPaymentMethods ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">
                      Loading payment methods...
                    </p>
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="saved"
                        checked={selectedPaymentMethod === "saved"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Use saved payment method
                          </span>
                        </div>
                        {selectedPaymentMethod === "saved" && (
                          <select
                            value={savedPaymentMethodId}
                            onChange={(e) =>
                              setSavedPaymentMethodId(e.target.value)
                            }
                            className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a payment method</option>
                            {paymentMethods.map((method) => (
                              <option key={method.id} value={method.id}>
                                {method.brand?.toUpperCase()} ••••{" "}
                                {method.last4}
                                {method.isDefault ? " (Default)" : ""}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </label>
                  </div>
                ) : null}

                {/* New Payment Method */}
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="new"
                    checked={selectedPaymentMethod === "new"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        Add new payment method
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Card Element for New Payment Method */}
            {selectedPaymentMethod === "new" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Details
                </label>
                <div className="border border-gray-300 rounded-md p-3">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                {errors.card && (
                  <p className="mt-1 text-sm text-red-600">{errors.card}</p>
                )}
              </div>
            )}

            {/* Error Messages */}
            {errors.payment && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.payment}</p>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-600">{errors.general}</p>
                  {retryCount < maxRetries && (
                    <button
                      type="button"
                      onClick={() => {
                        setRetryCount((prev) => prev + 1);
                        setErrors({});
                        processPayment();
                      }}
                      className="ml-2 text-sm text-red-700 hover:text-red-800 underline"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {sessionType} Counseling Session
                </span>
                <span className="text-sm font-medium text-gray-900">
                  ${price}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${price}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Skip payment for testing
                  const testBookingId = `test_${Date.now()}`;
                  const params = new URLSearchParams({
                    booking: testBookingId,
                    counselor: bookingData.counselorId,
                    type: bookingData.sessionType,
                    date: bookingData.startTime.split("T")[0],
                    time: bookingData.time,
                    notes: bookingData.notes || "",
                  });

                  toast.success(
                    "Payment skipped - Booking created for testing!"
                  );
                  router.push(
                    `/student/book-counselor/success?${params.toString()}`
                  );
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-center"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isStripeAvailable}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Pay ${price}
                  </>
                )}
              </button>
            </div>

            {/* Development/Testing Bypass */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 mb-2">Development Mode</p>
                <button
                  type="button"
                  onClick={() => {
                    const testBookingId = `dev_${Date.now()}`;
                    const params = new URLSearchParams({
                      booking: testBookingId,
                      counselor: bookingData.counselorId,
                      type: bookingData.sessionType,
                      date: bookingData.startTime.split("T")[0],
                      time: bookingData.time,
                      notes: bookingData.notes || "",
                    });

                    toast.success("Development booking created!");
                    router.push(
                      `/student/book-counselor/success?${params.toString()}`
                    );
                  }}
                  className="text-sm text-yellow-700 hover:text-yellow-800 underline"
                >
                  Skip Payment (Development Only)
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CounselingPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const counselorId = searchParams.get("counselor");
    const sessionType = searchParams.get("type");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const notes = searchParams.get("notes");

    if (!counselorId || !sessionType || !date || !time) {
      toast.error("Missing booking information. Please start over.");
      router.push("/student/book-counselor");
      return;
    }

    // Get counselor data from localStorage or fetch from API
    let counselor = null;
    
    // Try to get counselor data from localStorage first
    const storedBookingData = localStorage.getItem("pendingBooking");
    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        if (parsedData.counselor) {
          counselor = parsedData.counselor;
        }
      } catch (e) {
        console.error("Error parsing stored booking data:", e);
      }
    }
    
    // If no counselor data found, create a basic structure
    if (!counselor) {
      counselor = {
        id: counselorId,
        name: `Counselor #${counselorId}`,
        title: "Academic Counselor",
        avatar: "/default-avatar.png",
      };
    }

    const startTime = new Date(date);
    const [hours, minutes] = time.split(":");
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const duration = sessionType === "30min" ? 30 : 60;
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const booking = {
      counselorId,
      counselor,
      sessionType,
      duration,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      time,
      notes: notes || "",
      subject: "Academic Counseling",
      topic: "General Guidance",
      amount: sessionType === "30min" ? 3000 : 4000, // Amount in cents
      currency: "usd",
    };

    setBookingData(booking);
    setLoading(false);
  }, [searchParams, router]);

  const handlePaymentSuccess = (result) => {
    console.log("Payment successful:", result);
    toast.success("Your counseling session has been booked successfully!");
    router.push("/student/my-sessions");
  };

  const handleCancel = () => {
    router.push("/student/book-counselor");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Invalid Booking Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please start the booking process again.
          </p>
          <div className="mt-6">
            <Link
              href="/student/book-counselor"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Book Counseling Session
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center">
            <Link
              href="/student/book-counselor"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Secure payment for your counseling session
              </p>
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="px-4 py-6 sm:px-0">
          <PaymentStripeProvider>
            <CounselingPaymentContent
              bookingData={bookingData}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </PaymentStripeProvider>
        </div>
      </div>
    </div>
  );
}
