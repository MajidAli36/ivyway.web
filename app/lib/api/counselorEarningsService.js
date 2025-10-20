import apiClient from "./client";
import mockCounselorEarningsAPI from "./mockCounselorEarnings";

/**
 * Counselor Earnings Service
 * Handles all earnings and payout operations for counselors
 */
class CounselorEarningsService {
  /**
   * Get counselor's current balance
   * @returns {Promise<Object>} Balance data
   */
  async getBalance() {
    try {
      const response = await apiClient.get("/counselor/earnings/balance");
      return response.data;
    } catch (error) {
      console.error("Error fetching counselor balance:", error);
      console.log("Using mock data for counselor balance");
      return await mockCounselorEarningsAPI.getBalance();
    }
  }

  /**
   * Get counselor's earning history
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.status] - Earning status filter (available, pending, paid)
   * @param {string} [params.startDate] - Start date filter (ISO string)
   * @param {string} [params.endDate] - End date filter (ISO string)
   * @param {string} [params.subject] - Subject filter
   * @returns {Promise<Object>} Earning history data
   */
  async getEarningHistory(params = {}) {
    try {
      const response = await apiClient.get("/counselor/earnings/history", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching earning history:", error);
      console.log("Using mock data for earning history");
      return await mockCounselorEarningsAPI.getEarningsHistory(params);
    }
  }

  /**
   * Get counselor's earning summary
   * @returns {Promise<Object>} Earning summary data
   */
  async getEarningSummary() {
    try {
      const response = await apiClient.get("/counselor/earnings/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching earning summary:", error);
      console.log("Using mock data for earning summary");
      return await mockCounselorEarningsAPI.getEarningsSummary();
    }
  }

  /**
   * Request a payout
   * @param {Object} payoutData - Payout details
   * @param {string} payoutData.type - Payout type (weekly or instant)
   * @param {number} [payoutData.amount] - Specific amount to payout (optional)
   * @returns {Promise<Object>} Payout request data
   */
  async requestPayout(payoutData) {
    try {
      const response = await apiClient.post("/counselor/earnings/payout-request", {
        type: payoutData.type,
        amount: payoutData.amount
      });

      return response.data;
    } catch (error) {
      console.error("Error requesting payout:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get payout history
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.status] - Payout status filter
   * @returns {Promise<Object>} Payout history data
   */
  async getPayoutHistory(params = {}) {
    try {
      const response = await apiClient.get("/counselor/earnings/payouts", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payout history:", error);
      console.log("Using mock data for payout history");
      return await mockCounselorEarningsAPI.getPayoutHistory(params);
    }
  }

  /**
   * Get payout details by ID
   * @param {string} payoutId - Payout ID
   * @returns {Promise<Object>} Payout details
   */
  async getPayoutById(payoutId) {
    try {
      const response = await apiClient.get(`/counselor/earnings/payouts/${payoutId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payout details:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get earnings by subject
   * @param {Object} params - Query parameters
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @returns {Promise<Object>} Earnings by subject data
   */
  async getEarningsBySubject(params = {}) {
    try {
      const response = await apiClient.get("/counselor/earnings/by-subject", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching earnings by subject:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get monthly earnings breakdown
   * @param {Object} params - Query parameters
   * @param {number} [params.months] - Number of months to fetch (default: 12)
   * @returns {Promise<Object>} Monthly earnings data
   */
  async getMonthlyEarnings(params = {}) {
    try {
      const response = await apiClient.get("/counselor/earnings/monthly", { 
        params: { months: 12, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly earnings:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Calculate payout fees
   * @param {string} payoutType - Payout type (weekly or instant)
   * @param {number} amount - Payout amount in cents
   * @returns {Object} Fee calculation
   */
  calculatePayoutFees(payoutType, amount) {
    const fees = {
      weekly: {
        fee: 0, // No fee for weekly payouts
        feePercentage: 0,
        netAmount: amount
      },
      instant: {
        fee: 199, // $1.99 fixed fee for instant payouts
        feePercentage: 0,
        netAmount: Math.max(0, amount - 199)
      }
    };

    return fees[payoutType] || fees.weekly;
  }

  /**
   * Format currency amount
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (default: USD)
   * @returns {string} Formatted amount
   */
  formatCurrency(amount, currency = "USD") {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2
    });

    return formatter.format(amount / 100);
  }

  /**
   * Get payout eligibility status
   * @param {number} balance - Current balance in cents
   * @returns {Object} Eligibility status
   */
  getPayoutEligibility(balance) {
    const minimumPayout = 1000; // $10.00 minimum
    const isEligible = balance >= minimumPayout;
    
    return {
      isEligible,
      minimumAmount: minimumPayout,
      currentBalance: balance,
      shortfall: isEligible ? 0 : minimumPayout - balance
    };
  }

  /**
   * Validate payout request
   * @param {Object} payoutData - Payout request data
   * @param {number} currentBalance - Current available balance
   * @returns {Object} Validation result
   */
  validatePayoutRequest(payoutData, currentBalance) {
    const errors = [];
    const warnings = [];

    // Check minimum balance
    const minimumPayout = 1000; // $10.00
    if (currentBalance < minimumPayout) {
      errors.push(`Minimum payout amount is $${minimumPayout / 100}. Current balance: $${currentBalance / 100}`);
    }

    // Check specific amount if provided
    if (payoutData.amount) {
      if (payoutData.amount > currentBalance) {
        errors.push(`Requested amount ($${payoutData.amount / 100}) exceeds available balance ($${currentBalance / 100})`);
      }
      
      if (payoutData.amount < minimumPayout) {
        errors.push(`Requested amount ($${payoutData.amount / 100}) is below minimum payout ($${minimumPayout / 100})`);
      }
    }

    // Check payout type
    if (!payoutData.type || !["weekly", "instant"].includes(payoutData.type)) {
      errors.push("Invalid payout type. Must be 'weekly' or 'instant'");
    }

    // Add warnings for instant payouts
    if (payoutData.type === "instant") {
      const fee = this.calculatePayoutFees("instant", payoutData.amount || currentBalance);
      if (fee.fee > 0) {
        warnings.push(`Instant payout fee: $${fee.fee / 100}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
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
        case 429:
          return new Error("Too Many Requests: Please wait before making another payout request");
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

export default new CounselorEarningsService();
