import apiClient from "./client";

class SessionService {
  constructor() {
    this.baseURL = "/api";
  }

  /**
   * Cancel tutor session
   * @param {string} bookingId - Booking ID
   * @param {string} cancellationReason - Optional cancellation reason
   * @returns {Promise} API response
   */
  async cancelTutorSession(bookingId, cancellationReason = "") {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}/cancel`, {
        cancellationReason,
      });
      return response;
    } catch (error) {
      console.error("Error cancelling tutor session:", error);
      throw error;
    }
  }

  /**
   * Update tutor session status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status (confirmed, completed, cancelled)
   * @returns {Promise} API response
   */
  async updateTutorSessionStatus(bookingId, status) {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      console.error("Error updating tutor session status:", error);
      throw error;
    }
  }

  /**
   * Update counselor session status
   * @param {string} sessionId - Session ID
   * @param {string} status - New status (confirmed, completed, cancelled)
   * @param {string} notes - Optional notes
   * @returns {Promise} API response
   */
  async updateCounselorSessionStatus(sessionId, status, notes = "") {
    try {
      const response = await apiClient.put(
        `/counselor-bookings/sessions/${sessionId}/status`,
        {
          status,
          notes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating counselor session status:", error);
      throw error;
    }
  }

  /**
   * Get session details by ID
   * @param {string} sessionId - Session ID
   * @param {string} sessionType - Type of session (tutor/counselor)
   * @returns {Promise} API response
   */
  async getSessionDetails(sessionId, sessionType = "tutor") {
    try {
      if (sessionType === "counselor") {
        const response = await apiClient.get(
          `/counselor-bookings/sessions/${sessionId}`
        );
        return response;
      } else {
        const response = await apiClient.get(`/bookings/${sessionId}`);
        return response;
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      throw error;
    }
  }

  /**
   * Validate session action (24-hour rule for tutors)
   * @param {Object} session - Session object
   * @param {string} action - Action to validate (cancel, update)
   * @returns {Object} Validation result
   */
  validateSessionAction(session, action) {
    const status = (session.status || "").toLowerCase();
    if (status === "cancelled" || status === "canceled") {
      return { valid: false, message: "Session is already cancelled" };
    }

    if (status === "completed") {
      return { valid: false, message: "Cannot modify completed session" };
    }

    if (action === "cancel" && session.serviceType === "tutoring") {
      const now = new Date();
      const sessionStart = new Date(session.date + " " + session.startTime);
      const hoursDifference = (sessionStart - now) / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        return {
          valid: false,
          message: "Tutor sessions can only be cancelled 24 hours in advance",
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check if session can be cancelled
   * @param {Object} session - Session object
   * @returns {boolean} Whether session can be cancelled
   */
  canCancelSession(session) {
    const status = (session.status || "").toLowerCase();
    if (
      status === "cancelled" ||
      status === "canceled" ||
      status === "completed"
    ) {
      return false;
    }

    if (session.serviceType === "tutoring") {
      const now = new Date();
      const sessionStart = new Date(session.date + " " + session.startTime);
      const hoursDifference = (sessionStart - now) / (1000 * 60 * 60);
      return hoursDifference >= 24;
    }

    // Counselor sessions can be cancelled anytime (no 24-hour rule)
    return true;
  }

  /**
   * Get available actions for session
   * @param {Object} session - Session object
   * @returns {Array} Available actions
   */
  getSessionActions(session) {
    const actions = [];

    if (this.canCancelSession(session)) {
      actions.push({
        label: "Cancel",
        action: "cancel",
        className: "btn-danger",
        icon: "XCircleIcon",
      });
    }

    if (session.status === "pending" && session.serviceType === "tutoring") {
      actions.push({
        label: "Confirm",
        action: "confirm",
        className: "btn-success",
        icon: "CheckCircleIcon",
      });
    }

    if (session.status === "confirmed") {
      actions.push({
        label: "Mark Complete",
        action: "complete",
        className: "btn-primary",
        icon: "CheckCircleIcon",
      });
    }

    return actions;
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - API error
   * @param {string} action - Action being performed
   * @returns {string} User-friendly error message
   */
  handleApiError(error, action) {
    if (error.status === 400) {
      return "Invalid request. Please check your input.";
    } else if (error.status === 401) {
      return "Session expired. Please login again.";
    } else if (error.status === 403) {
      return "You are not authorized to perform this action.";
    } else if (error.status === 404) {
      return "Session not found.";
    } else if (error.status === 500) {
      return "Server error. Please try again later.";
    } else {
      return `Error ${action}: ${error.message || "Unknown error occurred"}`;
    }
  }
}

// Create and export a singleton instance
const sessionService = new SessionService();
export default sessionService;
