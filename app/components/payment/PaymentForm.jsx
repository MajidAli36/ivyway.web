"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { paymentApi, handlePaymentError } from "../../lib/stripe/api";
import { formatCurrency } from "../../lib/stripe/config";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import PaymentStripeProvider from "@/app/providers/PaymentStripeProvider";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a", // slate-900
      fontSmoothing: "antialiased",
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      "::placeholder": {
        color: "#94a3b8", // slate-400
      },
      iconColor: "#64748b", // slate-500
    },
    invalid: {
      color: "#dc2626", // red-600
      iconColor: "#dc2626",
    },
  },
};

// Wrapper component that provides Stripe context
const PaymentFormContent = ({
  bookingId,
  amount,
  currency = "usd",
  onSuccess,
  onError,
  onCancel,
  booking,
  plan,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Log incoming values for debugging
        console.log("Incoming payment values:", {
          bookingId,
          rawAmountFromProp: amount,
          rawCurrency: currency,
        });
        console.log("Amount type:", typeof amount, "Amount value:", amount);

        // The 'amount' prop should already be in cents from the booking wizard
        // Convert to dollars for backend validation
        const amountInCents = Math.round(parseFloat(amount));
        const amountInDollars = amountInCents / 100; // Convert cents to dollars
        console.log("Final amountInCents:", amountInCents, "amountInDollars:", amountInDollars);

        // Ensure currency is uppercase
        const normalizedCurrency = (currency || "USD").toUpperCase();

        // Log what we're sending to backend
        console.log("Sending to backend to create payment intent:", {
          bookingId,
          amount: amountInDollars,
          currency: normalizedCurrency,
        });

        const response = await paymentApi.createPaymentIntent(
          bookingId,
          amountInDollars,
          normalizedCurrency
        );

        console.log("Payment intent response:", response);

        // Extract clientSecret from the nested data object
        if (response?.data?.clientSecret) {
          console.log("Setting clientSecret:", response.data.clientSecret);
          setClientSecret(response.data.clientSecret);
        } else {
          throw new Error("No clientSecret in response");
        }

        setPaymentIntent(response.data);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        let errorMsg = "Server error. Please try again later.";
        const backendMsg = err.response?.data?.message;
        if (backendMsg) {
          if (backendMsg.includes("Stripe onboarding")) {
            errorMsg =
              "This tutor is not yet set up to receive payments. Please choose another tutor or try again later.";
          } else {
            errorMsg = backendMsg;
          }
        }
        setError(errorMsg);
        onError?.(err);
      } finally {
        setIsProcessing(false);
      }
    };

    if (bookingId && (amount || booking?.amount || booking?.price)) {
      createIntent();
    }
  }, [bookingId, amount, booking, currency, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit clicked");

    if (!stripe || !elements || !clientSecret) {
      console.log("Stripe, elements, or clientSecret not ready", {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret,
        paymentIntent,
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log("Confirming payment with clientSecret:", clientSecret);

      const { error: stripeError, paymentIntent: confirmedIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: booking?.studentName || "Student",
              email: booking?.studentEmail || "",
            },
          },
        });

      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        setError(stripeError.message);
        onError?.(stripeError);
      } else if (confirmedIntent.status === "succeeded") {
        console.log("Payment succeeded:", confirmedIntent);
        setPaymentIntent(confirmedIntent);
        onSuccess?.(confirmedIntent);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onCancel?.();
    }
  };

  if (!booking) return <div>Booking details not found.</div>;

  return (
    <div className="max-w-xl mx-auto">
      {plan && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-1">
            {plan.name}
          </h3>
          <p className="text-gray-700 mb-1">{plan.description}</p>
          <p className="text-gray-500 text-sm mb-1">{plan.details}</p>
          {plan.id.startsWith("monthly") ? (
            <p className="text-blue-600 text-sm">
              This is a subscription. You will be billed monthly until you
              cancel.
            </p>
          ) : (
            <p className="text-blue-600 text-sm">This is a one-time payment.</p>
          )}
        </div>
      )}
      {/* Payment Summary */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">
              {booking.tutor?.name ||
                booking.counselor?.name ||
                booking.providerName ||
                "Provider"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subject:</span>
            <span className="font-medium">{booking.subject || "Subject"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">
              {booking.duration ? `${booking.duration} minutes` : "minutes"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {booking.date || booking.startTime
                ? new Date(booking.startTime).toLocaleDateString()
                : "Date"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">
              {booking.startTime
                ? new Date(booking.startTime).toLocaleTimeString()
                : "Time"}
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(amount || 0, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        {/* Security Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-medium">
                Secure Payment
              </p>
              <p className="text-blue-700 text-xs mt-1">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ${formatCurrency(amount || 0, currency)}`
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Wrapper component that provides Stripe context
const PaymentForm = ({
  bookingId,
  amount,
  currency = "usd",
  onSuccess,
  onError,
  onCancel,
  booking,
  plan,
}) => {
  return (
    <PaymentStripeProvider>
      <PaymentFormContent
        bookingId={bookingId}
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
        booking={booking}
        plan={plan}
      />
    </PaymentStripeProvider>
  );
};

export default PaymentForm;
