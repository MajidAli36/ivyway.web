import { apiClient } from "./client";

class AIChatService {
  // Valid enum values for validation
  static CONVERSATION_STATUS = {
    ACTIVE: "active",
    ESCALATED: "escalated",
    RESOLVED: "resolved",
    ARCHIVED: "archived",
  };

  static TICKET_STATUS = {
    OPEN: "open",
    ASSIGNED: "assigned",
    IN_PROGRESS: "in_progress",
    WAITING_USER: "waiting_user",
    WAITING_ADMIN: "waiting_admin",
    RESOLVED: "resolved",
    CLOSED: "closed",
  };

  static PRIORITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "urgent",
  };

  // Helper method to build clean query parameters
  buildQueryParams(params) {
    const cleanParams = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];
      // Only include params that have actual values
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "undefined"
      ) {
        cleanParams[key] = value;
      }
    });

    return cleanParams;
  }

  // Validate enum values before sending to API
  validateEnumValue(value, enumObject) {
    if (!value) return true; // Empty values are allowed (no filter)
    return Object.values(enumObject).includes(value);
  }

  // Helper method to get valid enum values for UI components
  static getValidStatuses() {
    return Object.values(AIChatService.CONVERSATION_STATUS);
  }

  static getValidTicketStatuses() {
    return Object.values(AIChatService.TICKET_STATUS);
  }

  static getValidPriorities() {
    return Object.values(AIChatService.PRIORITY);
  }

  // Send message to AI agent
  async sendMessage(message, conversationId = null) {
    try {
      const response = await apiClient.post("/ai/message", {
        message,
        conversationId,
      });
      return response;
    } catch (error) {
      console.error("Error sending AI message:", error);
      throw new Error(error.message || "Failed to send message");
    }
  }

  // Get user's AI conversations
  async getConversations(params = {}) {
    try {
      // Clean parameters to avoid "undefined" strings
      const cleanParams = this.buildQueryParams(params);
      const response = await apiClient.get("/ai/conversations", cleanParams);
      return response;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw new Error(error.message || "Failed to fetch conversations");
    }
  }

  // Get messages for a specific conversation
  async getConversationMessages(conversationId, params = {}) {
    try {
      // Validate conversationId
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      // Clean parameters to avoid "undefined" strings
      const cleanParams = this.buildQueryParams(params);

      console.log(
        `Fetching messages for conversation ${conversationId} with params:`,
        cleanParams
      );

      const response = await apiClient.get(
        `/ai/conversations/${conversationId}/messages`,
        cleanParams
      );

      console.log("Conversation messages response:", response);

      return response;
    } catch (error) {
      console.error("Error fetching conversation messages:", error);

      // Handle different error types
      let errorMessage = "Failed to fetch messages";

      if (error && typeof error === "object") {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.status) {
          switch (error.status) {
            case 404:
              errorMessage = "Conversation not found";
              break;
            case 401:
              errorMessage = "Authentication required to view messages";
              break;
            case 403:
              errorMessage = "Access denied to this conversation";
              break;
            case 500:
              errorMessage = "Server error occurred while fetching messages";
              break;
            default:
              errorMessage = `HTTP ${error.status}: ${
                error.message || "Failed to fetch messages"
              }`;
          }
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      console.error("Processed error message:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Escalate conversation to human support
  async escalateConversation(conversationId, reason) {
    try {
      // Validate inputs
      if (!conversationId) {
        throw new Error("Conversation ID is required for escalation");
      }
      if (!reason || !reason.trim()) {
        throw new Error("Escalation reason is required");
      }
      if (reason.trim().length < 10) {
        throw new Error("Escalation reason must be at least 10 characters");
      }
      if (reason.trim().length > 500) {
        throw new Error("Escalation reason must be less than 500 characters");
      }

      const response = await apiClient.post(
        `/ai/conversations/${conversationId}/escalate`,
        {
          reason: reason.trim(),
          timestamp: new Date().toISOString(),
        }
      );

      // Validate response structure
      if (!response) {
        throw new Error("No response received from server");
      }

      // Handle different response structures
      const responseData = response.data || response;

      // Check if escalation was successful
      if (response.success === false || responseData.success === false) {
        const errorMessage =
          response.message ||
          responseData.message ||
          response.error ||
          responseData.error ||
          "Escalation failed";
        throw new Error(errorMessage);
      }

      // Ensure we have the required response data
      const escalationData = {
        success: true,
        message:
          responseData.message ||
          response.message ||
          "Your conversation has been escalated to our support team",
        ticketNumber: responseData.ticketNumber || responseData.ticket_number,
        ticketId: responseData.ticketId || responseData.ticket_id,
        estimatedResponse:
          responseData.estimatedResponse ||
          responseData.estimated_response ||
          "within 1-2 hours",
        conversationId: responseData.conversationId || conversationId,
        escalatedAt:
          responseData.escalatedAt ||
          responseData.escalated_at ||
          new Date().toISOString(),
      };

      return escalationData;
    } catch (error) {
      console.error("Error escalating conversation:", error);

      // Map technical errors to user-friendly messages
      let userMessage = "Failed to escalate conversation. Please try again.";

      if (error.response) {
        // HTTP error responses
        const status = error.response.status;
        const serverMessage =
          error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 400:
            userMessage =
              serverMessage ||
              "Invalid escalation request. Please check your input.";
            break;
          case 401:
            userMessage = "You need to be logged in to escalate conversations.";
            break;
          case 403:
            userMessage =
              "You don't have permission to escalate this conversation.";
            break;
          case 404:
            userMessage = "Conversation not found. It may have been deleted.";
            break;
          case 409:
            userMessage = "This conversation has already been escalated.";
            break;
          case 429:
            userMessage =
              "Too many escalation requests. Please wait a moment and try again.";
            break;
          case 500:
            userMessage = "Server error occurred. Our team has been notified.";
            break;
          default:
            userMessage =
              serverMessage || "Escalation failed. Please try again later.";
        }
      } else if (error.message) {
        // Client-side validation or network errors
        if (
          error.message.includes("required") ||
          error.message.includes("characters")
        ) {
          userMessage = error.message;
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          userMessage =
            "Network error. Please check your connection and try again.";
        }
      }

      // Return error response in consistent format
      return {
        success: false,
        error: userMessage,
        message: userMessage,
        originalError: error.message,
      };
    }
  }

  // Helper method to retry escalation with exponential backoff
  async retryEscalation(conversationId, reason, maxRetries = 3) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.escalateConversation(conversationId, reason);

        if (result.success) {
          return result;
        }

        // If not successful but not a network/server error, don't retry
        if (
          result.error &&
          !result.error.includes("network") &&
          !result.error.includes("server")
        ) {
          return result;
        }

        lastError = result;
      } catch (error) {
        lastError = error;

        // Don't retry on client-side validation errors
        if (
          error.message &&
          (error.message.includes("required") ||
            error.message.includes("characters"))
        ) {
          throw error;
        }
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // All retries failed
    return (
      lastError || {
        success: false,
        error:
          "Failed to escalate after multiple attempts. Please try again later.",
        message:
          "Failed to escalate after multiple attempts. Please try again later.",
      }
    );
  }

  // Helper method to check if escalation is allowed for a conversation
  canEscalateConversation(conversation) {
    if (!conversation) return false;

    // Check if conversation is in a state that allows escalation
    const allowedStatuses = ["active", "waiting_user"];
    return allowedStatuses.includes(conversation.status);
  }

  // Helper method to get escalation button text based on conversation state
  getEscalationButtonText(conversation, isLoading = false) {
    if (isLoading) return "Escalating...";
    if (!conversation) return "Escalate";

    switch (conversation.status) {
      case "escalated":
        return "Already Escalated";
      case "resolved":
        return "Cannot Escalate";
      case "archived":
        return "Cannot Escalate";
      default:
        return "Escalate";
    }
  }

  // Get AI conversation statistics
  async getStats(timeframe = "7d") {
    try {
      // Clean parameters to avoid "undefined" strings
      const cleanParams = this.buildQueryParams({ timeframe });
      const response = await apiClient.get("/ai/stats", cleanParams);
      return response;
    } catch (error) {
      console.error("Error fetching AI stats:", error);
      throw new Error(error.message || "Failed to fetch statistics");
    }
  }

  // Get user's support tickets
  async getTickets(params = {}) {
    try {
      // Clean parameters to avoid "undefined" strings
      const cleanParams = this.buildQueryParams(params);
      const response = await apiClient.get("/ai/tickets", cleanParams);
      return response;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw new Error(error.message || "Failed to fetch tickets");
    }
  }

  // Admin methods
  admin = {
    // Get all conversations for admin view
    getConversations: async (params = {}) => {
      try {
        // Clean parameters to avoid "undefined" strings
        const cleanParams = this.buildQueryParams(params);
        const response = await apiClient.get(
          "/ai/admin/conversations",
          cleanParams
        );
        return response;
      } catch (error) {
        console.error("Error fetching admin conversations:", error);
        throw new Error(error.message || "Failed to fetch conversations");
      }
    },

    // Assign conversation to admin
    assignConversation: async (conversationId, adminId) => {
      try {
        const response = await apiClient.patch(
          `/ai/admin/conversations/${conversationId}/assign`,
          { adminId }
        );
        return response;
      } catch (error) {
        console.error("Error assigning conversation:", error);
        throw new Error(error.message || "Failed to assign conversation");
      }
    },

    // Send admin message to conversation
    sendMessage: async (conversationId, content, internal = false) => {
      try {
        const response = await apiClient.post(
          `/ai/admin/conversations/${conversationId}/message`,
          { content, internal }
        );
        return response;
      } catch (error) {
        console.error("Error sending admin message:", error);
        throw new Error(error.message || "Failed to send message");
      }
    },

    // Resolve conversation
    resolveConversation: async (
      conversationId,
      resolutionNotes,
      customerSatisfaction = null
    ) => {
      try {
        const response = await apiClient.patch(
          `/ai/admin/conversations/${conversationId}/resolve`,
          { resolutionNotes, customerSatisfaction }
        );
        return response;
      } catch (error) {
        console.error("Error resolving conversation:", error);
        throw new Error(error.message || "Failed to resolve conversation");
      }
    },
  };

  // Helper methods for message formatting
  formatMessage(message) {
    return {
      id: message.id,
      content: message.content,
      senderType: message.senderType,
      timestamp: this.formatTimestamp(message.createdAt),
      metadata: message.metadata || {},
      sender: message.sender || null,
    };
  }

  formatTimestamp(dateString) {
    // Handle null, undefined, or empty dateString
    if (!dateString) return "Just now";

    const date = new Date(dateString);

    // Handle invalid dates
    if (isNaN(date.getTime())) return "Just now";

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }

  // Get suggested actions based on message content
  getSuggestedActions(metadata) {
    return metadata?.suggestedActions || [];
  }

  // Get follow-up questions
  getFollowUpQuestions(metadata) {
    return metadata?.followUpQuestions || [];
  }

  // Format conversation summary
  formatConversationSummary(conversation) {
    return {
      id: conversation.id,
      status: conversation.status,
      priority: conversation.priority,
      category: conversation.category,
      sentiment: conversation.sentiment,
      lastMessage: conversation.lastMessage?.content || "",
      lastInteractionAt: this.formatTimestamp(conversation.lastInteractionAt),
      messageCount: conversation.messageCount || 0,
      tags: conversation.tags || [],
    };
  }

  // Get status color for UI
  getStatusColor(status) {
    const colors = {
      active: "text-green-600 bg-green-50 border-green-200",
      escalated: "text-red-600 bg-red-50 border-red-200",
      resolved: "text-blue-600 bg-blue-50 border-blue-200",
      archived: "text-gray-600 bg-gray-50 border-gray-200",
    };
    return colors[status] || colors.active;
  }

  // Get priority color for UI
  getPriorityColor(priority) {
    const colors = {
      urgent: "text-red-600 bg-red-50 border-red-200",
      high: "text-orange-600 bg-orange-50 border-orange-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      low: "text-green-600 bg-green-50 border-green-200",
    };
    return colors[priority] || colors.medium;
  }

  // Get sentiment color for UI
  getSentimentColor(sentiment) {
    const colors = {
      positive: "text-green-600 bg-green-50 border-green-200",
      neutral: "text-gray-600 bg-gray-50 border-gray-200",
      negative: "text-red-600 bg-red-50 border-red-200",
    };
    return colors[sentiment] || colors.neutral;
  }
}

export const aiChatService = new AIChatService();
export default aiChatService;
