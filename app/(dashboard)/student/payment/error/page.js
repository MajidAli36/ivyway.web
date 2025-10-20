"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { paymentApi } from "../../../../lib/stripe/api";
import toast from "react-hot-toast";

const PaymentErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const error = searchParams.get("error");
  const errorType = searchParams.get("type");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (bookingId) {
          const details = await paymentApi.getBookingDetails(bookingId);
          setBookingDetails(details);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleRetryPayment = () => {
    if (bookingId) {
      router.push(`/student/payment/${bookingId}`);
    }
  };

  const handleCancelBooking = async () => {
    try {
      if (bookingId) {
        await paymentApi.updateBookingStatus(bookingId, "cancelled");
        toast.success("Booking cancelled successfully");
      }
      router.push("/student/my-sessions");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleBackToSessions = () => {
    router.push("/student/my-sessions");
  };

  const getErrorMessage = (type, message) => {
    switch (type) {
      case "card_declined":
        return "Your card was declined. Please try a different payment method.";
      case "insufficient_funds":
        return "Your card has insufficient funds. Please try a different card or contact your bank.";
      case "expired_card":
        return "Your card has expired. Please use a different card.";
      case "invalid_cvc":
        return "The security code on your card is incorrect. Please check and try again.";
      case "network_error":
        return "Network error occurred. Please check your connection and try again.";
      case "timeout":
        return "Payment request timed out. Please try again.";
      default:
        return (
          message || "An unexpected error occurred during payment processing."
        );
    }
  };

  const getErrorIcon = (type) => {
    switch (type) {
      case "card_declined":
      case "insufficient_funds":
      case "expired_card":
      case "invalid_cvc":
        return "💳";
      case "network_error":
      case "timeout":
        return "🌐";
      default:
        return "⚠️";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading error details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {getErrorMessage(errorType, error)}
          </p>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{getErrorIcon(errorType)}</span>
              <h3 className="text-lg font-semibold text-red-800">
                Error Details
              </h3>
            </div>
            <div className="text-left space-y-2">
              {bookingId && (
                <p className="text-red-700 text-sm">
                  <strong>Booking ID:</strong> {bookingId}
                </p>
              )}
              {errorType && (
                <p className="text-red-700 text-sm">
                  <strong>Error Type:</strong> {errorType.replace("_", " ")}
                </p>
              )}
              {error && (
                <p className="text-red-700 text-sm">
                  <strong>Message:</strong> {error}
                </p>
              )}
            </div>
          </div>

          {/* Booking Details (if available) */}
          {bookingDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tutor:</span>
                  <span className="font-medium">
                    {bookingDetails.tutorName || "Tutor"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">
                    {bookingDetails.subject || "Subject"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {bookingDetails.date || "Date"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {bookingDetails.time || "Time"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ${(bookingDetails.amount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-left">
                <h4 className="text-blue-800 text-sm font-medium mb-2">
                  Troubleshooting Tips
                </h4>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Check that your card details are correct</li>
                  <li>• Ensure your card has sufficient funds</li>
                  <li>• Verify your card hasn't expired</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryPayment}
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Try Payment Again
            </button>

            <button
              onClick={handleCancelBooking}
              className="px-6 py-3 border border-red-300 text-red-700 rounded-md font-medium hover:bg-red-50 transition-colors"
            >
              Cancel Booking
            </button>

            <button
              onClick={handleBackToSessions}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Sessions
            </button>
          </div>

          {/* Support Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help? Contact our support team
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a
                href="mailto:support@tutoringplatform.com"
                className="text-blue-600 hover:text-blue-800"
              >
                support@tutoringplatform.com
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="tel:+1-800-123-4567"
                className="text-blue-600 hover:text-blue-800"
              >
                1-800-123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
