"use client";

import { useState, useEffect, useCallback } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { paymentApi, handlePaymentError } from "./api";
import { validatePayment, sanitizePaymentData } from "./validation";
import toast from "react-hot-toast";

// Hook for payment processing
export const usePayment = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
  const [error, setError] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const processPayment = useCallback(
    async (paymentData) => {
      if (!stripe || !elements) {
        setError("Stripe is not initialized");
        return { success: false, error: "Stripe is not initialized" };
      }

      try {
        setIsProcessing(true);
        setPaymentStatus("processing");
        setError(null);

        // Validate payment data
        const validation = validatePayment(paymentData);
        if (!validation.isValid) {
          const errorMessage = validation.errors.join(", ");
          setError(errorMessage);
          setPaymentStatus("failed");
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }

        // Sanitize payment data
        const sanitizedData = sanitizePaymentData(paymentData);

        // Create payment intent
        const intent = await paymentApi.createPaymentIntent(
          sanitizedData.bookingId,
          sanitizedData.amount,
          sanitizedData.currency
        );

        // Confirm payment
        const { error: stripeError, paymentIntent: confirmedIntent } =
          await stripe.confirmCardPayment(intent.clientSecret, {
            payment_method: {
              card: elements.getElement("card"),
              billing_details: {
                name: paymentData.customerName || "Customer",
                email: paymentData.customerEmail || "",
              },
            },
          });

        if (stripeError) {
          const processedError = handlePaymentError(stripeError);
          setError(processedError.message);
          setPaymentStatus("failed");
          toast.error(processedError.message);
          return { success: false, error: processedError };
        }

        if (confirmedIntent.status === "succeeded") {
          setPaymentIntent(confirmedIntent);
          setPaymentStatus("success");
          toast.success("Payment successful!");
          return { success: true, paymentIntent: confirmedIntent };
        }

        setPaymentStatus("failed");
        setError("Payment was not successful");
        return { success: false, error: "Payment was not successful" };
      } catch (err) {
        console.error("Payment processing error:", err);
        const processedError = handlePaymentError(err);
        setError(processedError.message);
        setPaymentStatus("failed");
        toast.error(processedError.message);
        return { success: false, error: processedError };
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements]
  );

  const resetPayment = useCallback(() => {
    setPaymentStatus("idle");
    setError(null);
    setPaymentIntent(null);
  }, []);

  return {
    processPayment,
    resetPayment,
    isProcessing,
    paymentStatus,
    error,
    paymentIntent,
  };
};

// Hook for payment intent creation
export const usePaymentIntent = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentIntent = useCallback(
    async (bookingId, amount, currency = "usd") => {
      try {
        setIsLoading(true);
        setError(null);

        const intent = await paymentApi.createPaymentIntent(
          bookingId,
          amount,
          currency
        );
        setClientSecret(intent.clientSecret);
        return intent;
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError(err.message);
        toast.error("Failed to create payment intent");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetIntent = useCallback(() => {
    setClientSecret(null);
    setError(null);
  }, []);

  return {
    createPaymentIntent,
    resetIntent,
    clientSecret,
    isLoading,
    error,
  };
};

// Hook for booking management
export const useBooking = () => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooking = useCallback(async (bookingId) => {
    try {
      setIsLoading(true);
      setError(null);

      const details = await paymentApi.getBookingDetails(bookingId);
      setBooking(details);
      return details;
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError(err.message);
      toast.error("Failed to load booking details");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedBooking = await paymentApi.updateBookingStatus(
        bookingId,
        status
      );
      setBooking(updatedBooking);
      toast.success("Booking status updated successfully");
      return updatedBooking;
    } catch (err) {
      console.error("Error updating booking status:", err);
      setError(err.message);
      toast.error("Failed to update booking status");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(null);
    setError(null);
  }, []);

  return {
    fetchBooking,
    updateBookingStatus,
    resetBooking,
    booking,
    isLoading,
    error,
  };
};

// Hook for payment history
export const usePaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchPayments = useCallback(
    async (filters = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await paymentApi.getPaymentAnalytics({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        });

        setPayments(response.payments || []);
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
        }));

        return response;
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message);
        toast.error("Failed to load payment history");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit]
  );

  const loadMore = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  const resetPayments = useCallback(() => {
    setPayments([]);
    setError(null);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
    });
  }, []);

  return {
    fetchPayments,
    loadMore,
    resetPayments,
    payments,
    isLoading,
    error,
    pagination,
  };
};

// Hook for refund processing
export const useRefund = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processRefund = useCallback(async (paymentId, amount, reason) => {
    try {
      setIsProcessing(true);
      setError(null);

      const refund = await paymentApi.processRefund(paymentId, amount, reason);
      toast.success("Refund processed successfully");
      return refund;
    } catch (err) {
      console.error("Error processing refund:", err);
      setError(err.message);
      toast.error("Failed to process refund");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const resetRefund = useCallback(() => {
    setError(null);
  }, []);

  return {
    processRefund,
    resetRefund,
    isProcessing,
    error,
  };
};

// Hook for payment analytics
export const usePaymentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await paymentApi.getPaymentAnalytics(filters);
      setAnalytics(data);
      return data;
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message);
      toast.error("Failed to load payment analytics");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetAnalytics = useCallback(() => {
    setAnalytics(null);
    setError(null);
  }, []);

  return {
    fetchAnalytics,
    resetAnalytics,
    analytics,
    isLoading,
    error,
  };
};

export default {
  usePayment,
  usePaymentIntent,
  useBooking,
  usePaymentHistory,
  useRefund,
  usePaymentAnalytics,
};
