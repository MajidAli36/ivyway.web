import axios from "axios";
import { STRIPE_CONFIG, PAYMENT_ERROR_TYPES } from "./config";

// Create axios instance with base configuration
const stripeApi = axios.create({
  baseURL: STRIPE_CONFIG.apiUrl,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
stripeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No authentication token found");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
stripeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Clear invalid token
          localStorage.removeItem("jwt_token");
          throw new Error("Authentication required. Please log in again.");
        case 403:
          throw new Error("You do not have permission to perform this action.");
        case 404:
          throw new Error("Resource not found.");
        case 422:
          throw new Error(data.message || "Validation error occurred.");
        case 429:
          throw new Error("Too many requests. Please try again later.");
        case 500:
          throw new Error("Server error. Please try again later.");
        default:
          throw new Error(data.message || "An unexpected error occurred.");
      }
    } else if (error.request) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
);

// Payment API functions
export const paymentApi = {
  // Create payment intent
  createPaymentIntent: async (bookingId, amount, currency = "USD") => {
    try {
      console.log("Creating payment intent:", { bookingId, amount, currency });
      const response = await stripeApi.post("/payments/create-intent", {
        bookingId,
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await stripeApi.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  },

  // Process refund
  processRefund: async (paymentId, amount, reason) => {
    try {
      const response = await stripeApi.post(`/payments/refund/${paymentId}`, {
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  },

  // Cancel payment
  cancelPayment: async (paymentId) => {
    try {
      const response = await stripeApi.post(`/payments/cancel/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling payment:", error);
      throw error;
    }
  },

  // Get payment analytics
  getPaymentAnalytics: async (filters = {}) => {
    try {
      const response = await stripeApi.get("/payments/analytics", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching payment analytics:", error);
      throw error;
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      const response = await stripeApi.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      console.log("Updating booking status:", { bookingId, status });
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await stripeApi.patch(`/bookings/${bookingId}/status`, {
        status,
      });
      console.log("Booking status update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating booking status:", error);
      if (error.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem("jwt_token");
      }
      throw error;
    }
  },
};

export const connectApi = {
  createConnectAccount: async () => {
    try {
      const response = await stripeApi.post("/stripe/connect-account");
      return response.data;
    } catch (error) {
      console.error("Error creating Stripe Connect account:", error);
      throw error;
    }
  },

  handleOnboardingReturn: async () => {
    try {
      const response = await stripeApi.get("/stripe/onboard-return");
      return response.data;
    } catch (error) {
      console.error("Error handling Stripe onboarding return:", error);
      throw error;
    }
  },
};

// Error handling utilities
export const handlePaymentError = (error) => {
  if (error.type === "card_error" || error.type === "validation_error") {
    switch (error.code) {
      case "card_declined":
        return {
          type: PAYMENT_ERROR_TYPES.CARD_DECLINED,
          message: "Your card was declined. Please try a different card.",
        };
      case "insufficient_funds":
        return {
          type: PAYMENT_ERROR_TYPES.INSUFFICIENT_FUNDS,
          message: "Your card has insufficient funds.",
        };
      case "expired_card":
        return {
          type: PAYMENT_ERROR_TYPES.EXPIRED_CARD,
          message: "Your card has expired.",
        };
      case "incorrect_cvc":
        return {
          type: PAYMENT_ERROR_TYPES.INVALID_CVC,
          message: "Your card's security code is incorrect.",
        };
      case "incorrect_number":
        return {
          type: PAYMENT_ERROR_TYPES.UNKNOWN,
          message: "Your card number is incorrect.",
        };
      default:
        return {
          type: PAYMENT_ERROR_TYPES.UNKNOWN,
          message:
            error.message || "An error occurred while processing your payment.",
        };
    }
  }

  // Network or other errors
  if (error.message.includes("Network")) {
    return {
      type: PAYMENT_ERROR_TYPES.NETWORK_ERROR,
      message: "Network error. Please check your connection and try again.",
    };
  }

  return {
    type: PAYMENT_ERROR_TYPES.UNKNOWN,
    message: error.message || "An unexpected error occurred.",
  };
};

export default stripeApi;
