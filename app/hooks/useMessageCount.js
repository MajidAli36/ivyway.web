import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useSocket } from "@/app/providers/SocketProvider";
import { messaging } from "@/app/lib/api/messaging";

export const useMessageCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { socket, connected } = useSocket();

  // Fetch total unread count from all conversations
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      // Get all conversations
      const response = await messaging.getConversations(1, 100); // Get up to 100 conversations

      if (response && response.success && Array.isArray(response.data)) {
        // Sum up all unread counts from conversations
        const totalUnread = response.data.reduce((sum, conversation) => {
          return sum + (conversation.unreadCount || 0);
        }, 0);

        setUnreadCount(totalUnread);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.warn("Could not fetch unread message count:", error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Update count when a new message is received
  const handleNewMessage = useCallback(
    (message) => {
      // Only increment if the message is not from the current user
      if (message.senderId !== user?.id) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [user?.id]
  );

  // Update count when a conversation is marked as read
  const handleConversationRead = useCallback((conversationId, unreadCount) => {
    // This will be called from the message pages when a conversation is selected
    // We need to update our total count by subtracting the unread count of that conversation
    setUnreadCount((prev) => Math.max(0, prev - unreadCount));
  }, []);

  // Update count when a message is sent (optimistic update)
  const handleMessageSent = useCallback(() => {
    // When user sends a message, it doesn't change the unread count
    // But we might want to refresh the count to be accurate
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Setup socket listeners for real-time updates
  useEffect(() => {
    if (!socket || !connected || !user?.id) return;

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, connected, user?.id, handleNewMessage]);

  // Fetch initial count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchUnreadCount]);

  // Refresh count periodically (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    refreshCount: fetchUnreadCount,
    handleConversationRead,
    handleMessageSent,
  };
};
