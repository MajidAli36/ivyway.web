import { apiClient } from "./client";

class ReactAIService {
  // Send message to ReAct AI system
  async sendMessage(message, conversationId = null) {
    try {
      const response = await apiClient.post("/ai/react/message", {
        message,
        conversationId,
      });
      return response;
    } catch (error) {
      console.error("Error sending ReAct AI message:", error);
      throw new Error(error.message || "Failed to send message");
    }
  }

  // Get user's ReAct session history
  async getSessions(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);

      const response = await apiClient.get(
        `/ai/react/sessions?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error("Error getting ReAct sessions:", error);
      throw new Error(error.message || "Failed to get sessions");
    }
  }

  // Get specific session details
  async getSession(sessionId) {
    try {
      const response = await apiClient.get(`/ai/react/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error("Error getting ReAct session:", error);
      throw new Error(error.message || "Failed to get session");
    }
  }

  // Admin analytics
  async getAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      if (params.groupBy) queryParams.append("groupBy", params.groupBy);

      const response = await apiClient.get(
        `/ai/admin/react/analytics?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error("Error getting ReAct analytics:", error);
      throw new Error(error.message || "Failed to get analytics");
    }
  }

  // Format timestamp for display
  formatTimestamp(timestamp) {
    if (!timestamp) return "Just now";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }

  // Format execution time
  formatExecutionTime(milliseconds) {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    return `${(milliseconds / 1000).toFixed(1)}s`;
  }

  // Get status color for reasoning steps
  getStepStatusColor(status) {
    const colors = {
      thinking: "text-blue-600 bg-blue-50 border-blue-200",
      executing: "text-yellow-600 bg-yellow-50 border-yellow-200",
      completed: "text-green-600 bg-green-50 border-green-200",
      failed: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[status] || colors.thinking;
  }

  // Get action icon based on action name
  getActionIcon(actionName) {
    const icons = {
      search_tutors: "MagnifyingGlassIcon",
      check_user_plan: "UserIcon",
      check_billing_status: "CreditCardIcon",
      get_payment_history: "ClockIcon",
      analyze_user_progress: "ChartBarIcon",
      get_learning_goals: "AcademicCapIcon",
      generate_booking_suggestions: "CalendarIcon",
      analyze_request: "CogIcon",
      generate_helpful_response: "ChatBubbleLeftRightIcon",
    };
    return icons[actionName] || "CogIcon";
  }

  // Validate session data
  validateSessionData(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid session data");
    }

    if (!data.sessionId && !data.id) {
      throw new Error("Session ID is required");
    }

    if (!data.finalResponse) {
      throw new Error("Final response is required");
    }

    if (!Array.isArray(data.reasoningChain)) {
      throw new Error("Reasoning chain must be an array");
    }

    return true;
  }

  // Retry failed requests
  async retryRequest(requestFn, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw lastError;
  }
}

// Create and export singleton instance
export const reactAIService = new ReactAIService();
