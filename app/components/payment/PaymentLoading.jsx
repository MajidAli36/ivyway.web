"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const PaymentLoading = ({
  status = "processing",
  message = "Processing your payment...",
  onComplete,
  timeout = 30000,
}) => {
  const [dots, setDots] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Set timeout for processing
    const timeoutId = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timeoutId);
    };
  }, [timeout]);

  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          ),
          title: "Processing Payment",
          message: `Please wait while we process your payment${dots}`,
          color: "blue",
        };
      case "success":
        return {
          icon: (
            <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          ),
          title: "Payment Successful!",
          message: "Your payment has been processed successfully.",
          color: "green",
        };
      case "failed":
        return {
          icon: <XCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />,
          title: "Payment Failed",
          message: "There was an error processing your payment.",
          color: "red",
        };
      case "timeout":
        return {
          icon: (
            <XCircleIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          ),
          title: "Processing Timeout",
          message:
            "Payment is taking longer than expected. Please check your email for confirmation.",
          color: "yellow",
        };
      default:
        return {
          icon: (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          ),
          title: "Processing",
          message: message + dots,
          color: "blue",
        };
    }
  };

  const config = getStatusConfig();

  // Auto-complete on success
  useEffect(() => {
    if (status === "success" && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  // Handle timeout
  useEffect(() => {
    if (isTimeout && status === "processing") {
      // You could trigger a webhook check here
      console.log("Payment processing timeout");
    }
  }, [isTimeout, status]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
        {config.icon}

        <h2 className={`text-xl font-semibold text-${config.color}-900 mb-2`}>
          {config.title}
        </h2>

        <p className="text-gray-600 mb-6">{config.message}</p>

        {/* Progress bar for processing */}
        {status === "processing" && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        )}

        {/* Security notice */}
        {status === "processing" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Secure Processing:</strong> Your payment information is
              encrypted and secure.
            </p>
          </div>
        )}

        {/* Timeout warning */}
        {isTimeout && status === "processing" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Payment is taking longer than usual. This
              is normal for some payment methods.
            </p>
          </div>
        )}

        {/* Action buttons for failed/timeout states */}
        {(status === "failed" || status === "timeout") && (
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mr-3"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLoading;
