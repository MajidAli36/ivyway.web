import apiClient from "./client";

class MessagesService {
  // Get all messages/conversations
  async getMessages(filters = {}) {
    try {
      const { page = 1, limit = 10, search = "", type = "" } = filters;
      const params = { page, limit };

      if (search) params.search = search;
      if (type) params.type = type;

      const response = await apiClient.get("/teacher/messages", params);
      return response;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversation(conversationId) {
    try {
      const response = await apiClient.get(
        `/teacher/messages/${conversationId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  }

  // Send message
  async sendMessage(conversationId, messageData) {
    try {
      const response = await apiClient.post(
        `/teacher/messages/${conversationId}`,
        messageData
      );
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const response = await apiClient.patch(
        `/teacher/messages/${messageId}/read`
      );
      return response;
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  // Mark all messages as read
  async markAllAsRead() {
    try {
      const response = await apiClient.patch("/teacher/messages/read-all");
      return response;
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await apiClient.get("/teacher/messages/unread-count");
      return response;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }
}

export const messagesService = new MessagesService();
export default messagesService;

