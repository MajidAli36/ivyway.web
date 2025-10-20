import apiClient from "./client";

/**
 * Counselor Payment Service
 * Handles all payment-related operations for counseling sessions
 */
class CounselorPaymentService {
  /**
   * Create a payment intent for a counseling session
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.counselorId - Counselor ID
   * @param {string} paymentData.sessionType - Session type (30min or 60min)
   * @param {number} paymentData.amount - Amount in cents
   * @param {string} paymentData.currency - Currency code (default: usd)
   * @returns {Promise<Object>} Payment intent data
   */
  async createPaymentIntent(paymentData) {
    try {
      const response = await apiClient.post("/counselor/bookings/payment-intent", {
        counselorId: paymentData.counselorId,
        sessionType: paymentData.sessionType,
        amount: paymentData.amount,
        currency: paymentData.currency || "usd"
      });

      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Confirm payment and create booking
   * @param {Object} bookingData - Booking details
   * @param {string} bookingData.paymentIntentId - Stripe payment intent ID
   * @param {string} bookingData.counselorId - Counselor ID
   * @param {string} bookingData.startTime - Session start time (ISO string)
   * @param {string} bookingData.endTime - Session end time (ISO string)
   * @param {string} bookingData.sessionType - Session type
   * @param {string} bookingData.subject - Subject/topic
   * @param {string} bookingData.topic - Specific topic
   * @param {string} [bookingData.notes] - Optional notes
   * @returns {Promise<Object>} Created booking data
   */
  async confirmPayment(bookingData) {
    try {
      const response = await apiClient.post("/counselor/bookings/confirm-payment", {
        paymentIntentId: bookingData.paymentIntentId,
        counselorId: bookingData.counselorId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        sessionType: bookingData.sessionType,
        subject: bookingData.subject,
        topic: bookingData.topic,
        notes: bookingData.notes || ""
      });

      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get payment history for a student
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.status] - Payment status filter
   * @param {string} [params.counselorId] - Filter by counselor
   * @returns {Promise<Object>} Payment history data
   */
  async getPaymentHistory(params = {}) {
    try {
      const response = await apiClient.get("/counselor/payments/history", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get payment details by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentById(paymentId) {
    try {
      const response = await apiClient.get(`/counselor/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Refund a payment
   * @param {string} paymentId - Payment ID
   * @param {Object} refundData - Refund details
   * @param {number} [refundData.amount] - Refund amount (partial refund)
   * @param {string} [refundData.reason] - Refund reason
   * @returns {Promise<Object>} Refund data
   */
  async refundPayment(paymentId, refundData = {}) {
    try {
      const response = await apiClient.post(`/counselor/payments/${paymentId}/refund`, {
        amount: refundData.amount,
        reason: refundData.reason || "Requested by student"
      });

      return response.data;
    } catch (error) {
      console.error("Error processing refund:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Calculate session pricing
   * @param {string} sessionType - Session type (30min or 60min)
   * @returns {Object} Pricing breakdown
   */
  calculatePricing(sessionType) {
    const pricing = {
      "30min": {
        totalAmount: 3000, // $30.00 in cents
        counselorEarnings: 2000, // $20.00 in cents
        platformFee: 1000 // $10.00 in cents
      },
      "60min": {
        totalAmount: 4000, // $40.00 in cents
        counselorEarnings: 3000, // $30.00 in cents
        platformFee: 1000 // $10.00 in cents
      }
    };

    return pricing[sessionType] || pricing["30min"];
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount in cents
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    return (amount / 100).toFixed(2);
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";
      const status = error.response.status;
      
      switch (status) {
        case 400:
          return new Error(`Bad Request: ${message}`);
        case 401:
          return new Error("Unauthorized: Please log in to continue");
        case 403:
          return new Error("Forbidden: You do not have permission to perform this action");
        case 404:
          return new Error("Not Found: The requested resource was not found");
        case 422:
          return new Error(`Validation Error: ${message}`);
        case 500:
          return new Error("Server Error: Please try again later");
        default:
          return new Error(`Error ${status}: ${message}`);
      }
    } else if (error.request) {
      // Network error
      return new Error("Network Error: Please check your internet connection");
    } else {
      // Other error
      return new Error(error.message || "An unexpected error occurred");
    }
  }
}

export default new CounselorPaymentService();
