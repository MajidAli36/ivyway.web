"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PaymentForm from "@/app/components/payment/PaymentForm";
import { paymentApi } from "../../../../lib/stripe/api";
import { formatCurrency } from "../../../../lib/stripe/config";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import PaymentStripeProvider from "@/app/providers/PaymentStripeProvider";

const PaymentPage = () => {
  const router = useRouter();
  const params = useParams();
  const { bookingId } = params;

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, failed

  // Check authentication and refresh token if needed
  useEffect(() => {
    const checkAndRefreshAuth = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Check if token is expired (you might want to decode and check exp)
        // For now, we'll just verify we have a token
        return true;
      } catch (e) {
        console.error("Authentication error:", e);
        toast.error("Please log in again to continue.");
        router.push("/login"); // Redirect to login
        return false;
      }
    };

    checkAndRefreshAuth();
  }, [router]);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching booking details for ID:", bookingId);
        console.log("Using paymentApi.getBookingDetails...");
        console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
        console.log(
          "Full API endpoint will be:",
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://ivyway-backend-iu4z.onrender.com/api"
          }/bookings/${bookingId}`
        );

        const details = await paymentApi.getBookingDetails(bookingId);
        console.log("Booking details received:", details);
        const booking = details.data || details; // Unwrap if nested in data
        // Debug: Log price and amount
        console.log(
          "Booking price:",
          booking.price,
          "Booking amount:",
          booking.amount
        );
        console.log("Full booking object:", booking);
        
        // If amount is null but we have duration and plan info, calculate the correct amount
        if (!booking.amount && booking.duration && booking.planName) {
          console.log("Amount is null, attempting to calculate from duration and plan");
          
          // Try to determine the hourly rate based on plan name
          let hourlyRate = 74.99; // Default rate
          if (booking.planName.includes("Advanced")) {
            hourlyRate = 99.99;
          } else if (booking.planName.includes("Single")) {
            hourlyRate = 74.99;
          }
          
          const durationInHours = booking.duration / 60;
          const calculatedAmount = Math.round(hourlyRate * durationInHours * 100); // Convert to cents
          
          console.log(`Calculated amount: ${hourlyRate}/hour × ${durationInHours} hours = $${(calculatedAmount/100).toFixed(2)}`);
          
          // Update the booking object with the calculated amount
          booking.amount = calculatedAmount;
        }
        
        setBookingDetails(booking);

        // Check if booking is already paid - only show success if status is confirmed
        if (booking.status === "confirmed") {
          console.log("Booking is already confirmed, showing success state");
          setPaymentStatus("success");
        } else if (booking.status === "pending") {
          console.log("Booking is pending, allowing payment");
          // Allow payment for pending bookings
          setPaymentStatus("pending");
        } else if (booking.status === "cancelled") {
          console.log("Booking is cancelled, showing error");
          setError("This booking has been cancelled and cannot be paid for.");
        } else {
          console.log("Unknown booking status:", booking.status);
          setError(
            `Booking status '${booking.status}' is not valid for payment.`
          );
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load booking details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setPaymentStatus("processing");
      console.log(
        "Payment successful. Booking request sent to tutor for confirmation.",
        {
          bookingId,
          paymentIntentId: paymentIntent.id,
        }
      );

      // NO LONGER UPDATING STATUS FROM FRONTEND.
      // The booking status will remain "pending" until the tutor approves it.

      setPaymentStatus("success");
      toast.success(
        "Payment successful! Your booking request has been sent for approval."
      );

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(
          `/student/payment/success?bookingId=${bookingId}&paymentId=${paymentIntent.id}&amount=${paymentIntent.amount}`
        );
      }, 2000);
    } catch (err) {
      console.error("Error in payment success handler:", err);
      setPaymentStatus("failed");
      toast.error(
        "There was an issue completing your payment. Please contact support."
      );
    }
  };

  const handlePaymentError = (error) => {
    setPaymentStatus("failed");
    setError(error.message);
    toast.error(error.message);
  };

  const handleCancel = () => {
    router.push(`/student/my-sessions`);
  };

  const handleRetry = () => {
    setPaymentStatus("pending");
    setError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/student/my-sessions")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your booking request has been sent to the tutor for approval. You
              will be notified once it's confirmed.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                <strong>Booking ID:</strong> {bookingId}
              </p>
              <p className="text-green-800 text-sm">
                <strong>Amount:</strong>{" "}
                {formatCurrency(
                  bookingDetails?.price || bookingDetails?.amount || 0
                )}
              </p>
            </div>
            <button
              onClick={() => router.push("/student/my-sessions")}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              View My Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed payment state
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main payment form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
              title="Back to booking"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2 text-gray-500" />
              Back to Booking
            </button>

            {/* Spacer to keep title centered on large screens */}
            <div className="hidden sm:block w-32" />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Payment
            </h1>
            <p className="text-gray-600">Secure payment powered by Stripe</p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <PaymentStripeProvider>
            <PaymentForm
              bookingId={bookingId}
              amount={
                bookingDetails?.amount
                  ? bookingDetails.amount // Use amount if available (should be in cents)
                  : bookingDetails?.price
                  ? Math.round(bookingDetails.price * 100) // Fallback to price * 100
                  : 0
              }
              currency={bookingDetails?.currency || "usd"}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handleCancel}
              booking={bookingDetails}
            />
          </PaymentStripeProvider>
        </div>

        {/* Security Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Secure Payment Processing
              </h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Your payment information is encrypted and secure</li>
                <li>• We never store your card details on our servers</li>
                <li>• All transactions are processed by Stripe</li>
                <li>• You will receive a receipt via email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
