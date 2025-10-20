"use client";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function StripeUnavailableMessage({ 
  title = "Payment System Unavailable", 
  message = "The payment system is currently not configured. Please contact support for assistance.",
  className = "" 
}) {
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">{title}</h3>
          <p className="text-sm text-yellow-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
