import apiClient from "./client";

class IvyWayAIService {
  constructor() {
    this.api = apiClient;
    this.ivywayAIKey =
      process.env.NEXT_PUBLIC_IVYWAY_AI_KEY || "ivyway_ai_key_2024";
  }

  // Test connection to IvyWay AI
  async testConnection() {
    try {
      const response = await fetch(`${this.api.baseURL}/ivyway/health`, {
        method: "GET",
        headers: {
          "X-API-Key": this.ivywayAIKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Connection failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Send chat message to AI
  async sendChatMessage(
    message,
    userId,
    context = "general",
    conversationId = null
  ) {
    try {
      const response = await fetch(`${this.api.baseURL}/ivyway/chat`, {
        method: "POST",
        headers: {
          "X-API-Key": this.ivywayAIKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          user_id: userId,
          context,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload PDF document
  async uploadDocument(file, userId) {
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("user_id", userId);

      // Create a custom request for file upload since apiClient expects JSON
      const response = await fetch(`${this.api.baseURL}/ivyway/documents`, {
        method: "POST",
        headers: {
          "X-API-Key": this.ivywayAIKey,
          Authorization: `Bearer ${this.api.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get conversation history
  async getConversationHistory(userId, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams({ limit, offset });
      const response = await fetch(
        `${this.api.baseURL}/ivyway/conversations/${userId}?${params}`,
        {
          method: "GET",
          headers: {
            "X-API-Key": this.ivywayAIKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get conversations: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get uploaded documents
  async getDocuments() {
    try {
      const response = await fetch(`${this.api.baseURL}/ivyway/documents`, {
        method: "GET",
        headers: {
          "X-API-Key": this.ivywayAIKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get documents: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get analytics
  async getAnalytics(period = "7d") {
    try {
      const params = new URLSearchParams({ period });
      const response = await fetch(
        `${this.api.baseURL}/ivyway/analytics?${params}`,
        {
          method: "GET",
          headers: {
            "X-API-Key": this.ivywayAIKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    // If it's already a formatted error object, return it
    if (error.status && error.message) {
      return error;
    }

    // Handle fetch errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return {
        status: 503,
        message: "IvyWay AI service is currently unavailable",
        details: "Please check your connection and try again later",
      };
    }

    // Handle other errors
    return {
      status: 500,
      message: "An unexpected error occurred",
      details: error.message || "Unknown error",
    };
  }
}

export default new IvyWayAIService();
