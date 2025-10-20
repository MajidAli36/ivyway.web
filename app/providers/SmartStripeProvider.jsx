"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  STRIPE_CONFIG,
  validateStripeConfig,
  getStripeConfig,
} from "../lib/stripe/config";
import { usePaymentPage } from "../hooks/usePaymentPage";

// Create Stripe context
const SmartStripeContext = createContext();

// Custom hook to use Smart Stripe context
export const useSmartStripeContext = () => {
  const context = useContext(SmartStripeContext);
  if (!context) {
    throw new Error(
      "useSmartStripeContext must be used within a SmartStripeProvider"
    );
  }
  return context;
};

export const SmartStripeProvider = ({ children }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isPaymentPage } = usePaymentPage();

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get publishable key from API
        const publishableKey = await getStripeConfig();

        if (!publishableKey) {
          throw new Error("No Stripe publishable key available");
        }

        // Load Stripe
        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize Stripe:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);

  // Only show loading state on payment pages
  if (isLoading && isPaymentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing payment system...</p>
        </div>
      </div>
    );
  }

  // Show error state only on payment pages
  if (error && isPaymentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 text-2xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Payment System Error
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // On non-payment pages, render children even if Stripe is still loading
  if (isLoading && !isPaymentPage) {
    return <>{children}</>;
  }

  // On non-payment pages, render children even if there's an error
  if (error && !isPaymentPage) {
    return <>{children}</>;
  }

  // Provide Stripe context
  const contextValue = {
    stripe: stripePromise,
    isReady: !isLoading && !error,
  };

  return (
    <SmartStripeContext.Provider value={contextValue}>
      <Elements stripe={stripePromise}>{children}</Elements>
    </SmartStripeContext.Provider>
  );
};

export default SmartStripeProvider;
