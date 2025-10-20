"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PayoutNotification({
  type,
  message,
  isVisible,
  onClose,
  autoHide = true,
  duration = 5000,
}) {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);

    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onClose]);

  if (!isShowing) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "error":
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full`}>
      <div className={`rounded-lg border p-4 ${getStyles()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsShowing(false);
                onClose?.();
              }}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification types for payout events
export const PayoutNotificationTypes = {
  REQUEST_SUBMITTED: {
    type: "success",
    message:
      "Payout request submitted successfully! It will be reviewed within 24 hours.",
  },
  REQUEST_APPROVED: {
    type: "success",
    message:
      "Your payout request has been approved and will be processed within 1-3 business days.",
  },
  REQUEST_REJECTED: {
    type: "error",
    message:
      "Your payout request has been rejected. Please check the reason and try again.",
  },
  INSUFFICIENT_BALANCE: {
    type: "error",
    message: "Insufficient balance. You need at least $10 to request a payout.",
  },
  PROCESSING_ERROR: {
    type: "error",
    message:
      "An error occurred while processing your payout request. Please try again.",
  },
  PAYOUT_COMPLETED: {
    type: "success",
    message: "Your payout has been processed and sent to your account.",
  },
};
