// Stripe configuration and utilities
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  apiUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://ivyway-backend-iu4z.onrender.com/api" ||
    "http://localhost:5000/api",
};

// Development fallback for testing
const DEV_FALLBACK_KEY = "pk_test_51234567890abcdef"; // This is a placeholder - replace with your actual test key

// Function to get Stripe config from API
export const getStripeConfig = async () => {
  try {
    // First, try to get from environment variables directly
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    }

    // If not available, try to fetch from API
    const response = await fetch("/api/stripe/config");
    const config = await response.json();

    if (
      config.success &&
      config.data.isConfigured &&
      config.data.publishableKey
    ) {
      return config.data.publishableKey;
    }

    // If API doesn't have it, check if we have a fallback
    if (STRIPE_CONFIG.publishableKey) {
      console.warn("Using fallback Stripe key from config");
      return STRIPE_CONFIG.publishableKey;
    }

    // Development fallback (only in development mode)
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Using development fallback Stripe key - please configure your actual Stripe keys"
      );
      return DEV_FALLBACK_KEY;
    }

    throw new Error("Payment system is not available - no Stripe key found");
  } catch (error) {
    console.error("Failed to get Stripe config:", error);

    // Try fallback to environment variable
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.warn("Using environment variable as fallback");
      return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    }

    // Development fallback (only in development mode)
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Using development fallback Stripe key - please configure your actual Stripe keys"
      );
      return DEV_FALLBACK_KEY;
    }

    throw new Error(
      "Payment system is not available - please configure Stripe"
    );
  }
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

// Booking status constants
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

// Error types for better error handling
export const PAYMENT_ERROR_TYPES = {
  CARD_DECLINED: "card_declined",
  INSUFFICIENT_FUNDS: "insufficient_funds",
  EXPIRED_CARD: "expired_card",
  INVALID_CVC: "invalid_cvc",
  INVALID_EXPIRY: "invalid_expiry",
  NETWORK_ERROR: "network_error",
  TIMEOUT: "timeout",
  UNKNOWN: "unknown",
};

// Format currency for display
export const formatCurrency = (amount, currency = "usd") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents
};

// Validate Stripe configuration
export const validateStripeConfig = () => {
  if (!STRIPE_CONFIG.publishableKey) {
    throw new Error("Stripe publishable key is not configured");
  }
  if (!STRIPE_CONFIG.apiUrl) {
    throw new Error("API URL is not configured");
  }
  return true;
};
