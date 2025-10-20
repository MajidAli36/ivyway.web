import apiClient from "./client";

class AIConversationsService {
  // Get all AI conversations
  async getConversations(filters = {}) {
    try {
      const { page = 1, limit = 10, search = "" } = filters;
      const params = { page, limit };

      if (search) params.search = search;

      const response = await apiClient.get("/teacher/ai-conversations", params);
      return response;
    } catch (error) {
      console.error("Error fetching AI conversations:", error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversation(conversationId) {
    try {
      const response = await apiClient.get(
        `/teacher/ai-conversations/${conversationId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching AI conversation:", error);
      throw error;
    }
  }

  // Create new conversation
  async createConversation(title) {
    try {
      const response = await apiClient.post("/teacher/ai-conversations", {
        title,
      });
      return response;
    } catch (error) {
      console.error("Error creating AI conversation:", error);
      throw error;
    }
  }

  // Send message to AI
  async sendMessage(conversationId, message) {
    try {
      const response = await apiClient.post(
        `/teacher/ai-conversations/${conversationId}/messages`,
        {
          content: message,
          type: "user",
        }
      );
      return response;
    } catch (error) {
      console.error("Error sending AI message:", error);
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(conversationId) {
    try {
      const response = await apiClient.delete(
        `/teacher/ai-conversations/${conversationId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting AI conversation:", error);
      throw error;
    }
  }

  // Get conversation statistics
  async getStatistics() {
    try {
      const response = await apiClient.get(
        "/teacher/ai-conversations/statistics"
      );
      return response;
    } catch (error) {
      console.error("Error fetching AI conversation statistics:", error);
      throw error;
    }
  }
}

export const aiConversationsService = new AIConversationsService();
export default aiConversationsService;



