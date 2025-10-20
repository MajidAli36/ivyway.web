import apiClient from "./client";
import { authService } from "../auth/authService";

// Use JWT token from authService instead of Firebase
const getAuthToken = () => {
  const token = authService.getToken();
  if (!token) return null;
  return token;
};

export const messaging = {
  // Get all conversations for the current user (paginated)
  getConversations: async (page = 1, limit = 20) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");
    return apiClient.get("/messaging/conversations", { page, limit });
  },

  // Get or create a conversation with another user
  getOrCreateConversation: async (participantId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    // Backend expects { participantId }
    return apiClient.post("/messaging/conversations", { participantId });
  },

  // Create a conversation related to a booking
  createBookingConversation: async (bookingId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.post("/messaging/conversations/booking", { bookingId });
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId, page = 1, limit = 50) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.get(
      `/messaging/conversations/${conversationId}/messages`,
      {
        page,
        limit,
      }
    );
  },

  // Send a new message
  sendMessage: async (
    conversationId,
    content,
    contentType = "text",
    metadata = {}
  ) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.post("/messaging/messages", {
      conversationId,
      content,
      contentType,
      metadata,
    });
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.delete(`/messaging/messages/${messageId}`);
  },

  // Delete a conversation (soft delete for current user only)
  deleteConversation: async (conversationId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.delete(`/messaging/conversations/${conversationId}`);
  },

  // Create or retrieve conversation for a booking, handling previously deleted conversations
  getOrCreateBookingConversation: async (bookingId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    try {
      // First try to create or retrieve a conversation for this booking
      const response = await apiClient.post(
        "/messaging/conversations/booking",
        { bookingId }
      );

      if (response && response.success) {
        // If successful, check if this conversation was previously deleted locally
        const conversationId = response.data.id;

        // Get stored deleted conversations from localStorage
        let deletedConversations = [];
        try {
          const stored = localStorage.getItem("tutorDeletedConversations");
          if (stored) {
            deletedConversations = JSON.parse(stored);
          }
        } catch (e) {
          console.error("Error parsing deletedConversations:", e);
        }

        // If this conversation was previously deleted, remove it from our deleted list
        if (
          Array.isArray(deletedConversations) &&
          deletedConversations.includes(conversationId)
        ) {
          console.log(
            `Restoring previously deleted conversation: ${conversationId}`
          );
          const updatedDeleted = deletedConversations.filter(
            (id) => id !== conversationId
          );
          localStorage.setItem(
            "tutorDeletedConversations",
            JSON.stringify(updatedDeleted)
          );
        }
      }

      return response;
    } catch (error) {
      console.error("Error creating/getting booking conversation:", error);
      throw error;
    }
  },

  // Send typing indicator
  sendTypingIndicator: async (conversationId, isTyping) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.post("/messaging/typing-indicator", {
      conversationId,
      isTyping,
    });
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    const token = getAuthToken();
    if (!token) throw new Error("User not authenticated");

    return apiClient.post(`/messaging/conversations/${conversationId}/read`);
  },
};
