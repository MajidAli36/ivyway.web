"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { connectApi } from "@/app/lib/stripe/api";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const StripeConnectStatus = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await connectApi.createConnectAccount();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message || "Failed to connect to Stripe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 my-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Payout Account Status
      </h3>
      {user.stripeOnboardingComplete ? (
        <div className="flex items-center text-green-600">
          <CheckCircleIcon className="h-6 w-6 mr-2" />
          <p className="font-medium">
            Your account is connected and ready to receive payouts.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center text-amber-600 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            <p className="font-medium">
              To receive payments, you need to connect your bank account.
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This is a secure one-time process handled by Stripe.
          </p>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Connect Bank Account"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default StripeConnectStatus;
