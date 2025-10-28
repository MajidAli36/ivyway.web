"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSocket } from "../../../providers/SocketProvider";
import { messaging } from "../../../lib/api/messaging";
import MessageList from "../../components/shared/MessageList";
import ChatArea from "../../components/shared/ChatArea";
import EmptyState from "../../components/shared/EmptyState";
import { authService } from "../../../lib/auth/authService";
import { useSearchParams } from "next/navigation";

export default function CounselorMessagesPage() {
  // State management
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const { socket, connected } = useSocket();
  const typingTimeout = useRef(null);
  const searchParams = useSearchParams();

  // Get conversation ID from URL if present
  const conversationIdFromUrl = searchParams?.get("conversation");

  // Format timestamp helper
  const formatTimestamp = useCallback((dateString) => {
    if (!dateString) return "Unknown time";

    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than a minute ago
    if (diff < 60 * 1000) {
      return "Just now";
    }

    // Less than an hour ago
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    // Today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // This week, show day
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][date.getDay()];
    }

    // Otherwise show date
    return date.toLocaleDateString();
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId) => {
      try {
        const response = await messaging.getMessages(conversationId, 1, 50);

        if (
          response &&
          response.success &&
          Array.isArray(response.data.messages)
        ) {
          // Format messages for UI
          const formattedMessages = response.data.messages.map((message) => ({
            id: message.id,
            sender:
              message.senderId === authService.getUser()?.id
                ? "counselor"
                : "student",
            text: message.isDeleted
              ? "This message has been deleted"
              : message.content,
            timestamp: formatTimestamp(message.createdAt),
            createdAt: message.createdAt,
            isDeletedLocally: message.isDeleted,
            attachment:
              !message.isDeleted && message.contentType !== "text"
                ? {
                    type: message.contentType,
                    name: message.metadata?.filename || "Attachment",
                    url: message.metadata?.url,
                  }
                : null,
          }));

          // Sort messages by creation time
          formattedMessages.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });

          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setMessages([]);
      }
    },
    [formatTimestamp, selectedConversation?.userId]
  );

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);

      const response = await messaging.getConversations();

      if (response && response.success && Array.isArray(response.data)) {
        // Debug: Log the first conversation to see the structure
        if (response.data.length > 0) {
          console.log("Sample conversation data:", response.data[0]);
        }

        // Helper: fetch last message when the conversation payload doesn't include it
        const fetchLastMessage = async (conversationId) => {
          try {
            const res = await messaging.getMessages(conversationId, 1, 10);
            const list = res?.data?.messages || [];
            if (!Array.isArray(list) || list.length === 0) return null;
            const sorted = [...list].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return sorted[0];
          } catch (e) {
            console.warn("Unable to fetch last message for", conversationId, e);
            return null;
          }
        };

        const formattedConversations = await Promise.all(
          response.data
            .filter((conversation) => !conversation.isDeleted)
            .map(async (conversation) => {
              const currentUserId = authService.getUser()?.id;
              const other =
                (conversation.participants || []).find(
                  (p) => p.id !== currentUserId
                ) ||
                conversation.otherUser ||
                {};

              let lastMessageObj = conversation.lastMessage || null;
              if (!lastMessageObj) {
                lastMessageObj = await fetchLastMessage(conversation.id);
              }

              const lastMessageTime =
                conversation.lastMessageAt ||
                lastMessageObj?.createdAt ||
                conversation.updatedAt ||
                conversation.createdAt;

              return {
                id: conversation.id,
                name:
                  other.fullName ||
                  other.displayName ||
                  conversation.studentName ||
                  other.email ||
                  "Student",
                subject: conversation.subject || "Counseling",
                timestamp: formatTimestamp(lastMessageTime),
                unread: conversation.unreadCount || 0,
                online: !!other.isOnline,
                userId: other.id || conversation.userId || "",
                bookingId: conversation.bookingId,
                upcoming: !!conversation.upcomingSession,
                upcomingSession: conversation.upcomingSession,
                role: conversation.otherUserRole || "student",
                lastMessage:
                  lastMessageObj?.content ||
                  conversation.lastMessageContent ||
                  conversation.lastMessageText ||
                  lastMessageObj?.text ||
                  "",
                lastMessageFromYou:
                  (lastMessageObj?.senderId || conversation.lastMessage?.senderId) ===
                  currentUserId,
                lastMessageFromOther:
                  (lastMessageObj?.senderId || conversation.lastMessage?.senderId) !==
                  currentUserId,
                lastMessageTime,
              };
            })
        );

        // Sort by most recent activity desc
        formattedConversations.sort((a, b) => {
          const ta = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
          const tb = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
          return tb - ta;
        });

        setConversations(formattedConversations);

        // If conversationId is in URL, select that conversation
        if (conversationIdFromUrl) {
          const selectedConv = formattedConversations.find(
            (conv) => conv.id === conversationIdFromUrl
          );

          if (selectedConv) {
            setSelectedConversation(selectedConv);
            fetchMessages(selectedConv.id);
          }
        }

        setError(null);
      } else {
        setError("Failed to load conversations");
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Unable to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [formatTimestamp, conversationIdFromUrl, fetchMessages]);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Listen for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Load initial data
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !connected) return;

    // Handle incoming message
    const handleNewMessage = (message) => {
      // Update messages if conversation is selected
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        // Ignore echo of counselor's own message (already optimistically added)
        if (message.senderId === authService.getUser()?.id) {
          return;
        }

        // De-duplicate by id if already present
        const alreadyExists = messages.some((m) => m.id === message.id);
        if (alreadyExists) {
          return;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: message.id,
            sender:
              message.senderId === authService.getUser()?.id
                ? "counselor"
                : "student",
            text: message.content,
            timestamp: "Just now",
            createdAt: message.createdAt || new Date().toISOString(),
            attachment:
              message.contentType !== "text"
                ? {
                    type: message.contentType,
                    name: message.metadata?.filename || "Attachment",
                    url: message.metadata?.url,
                  }
                : null,
          },
        ]);
      }

      // Update conversation list
      setConversations((prev) => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(
          (c) => c.id === message.conversationId
        );

        if (conversationIndex >= 0) {
          const conversation = updatedConversations[conversationIndex];

          // Update the conversation
          updatedConversations[conversationIndex] = {
            ...conversation,
            lastMessage: message.content,
            lastMessageFromYou: message.senderId === authService.getUser()?.id,
            lastMessageFromOther:
              message.senderId !== authService.getUser()?.id,
            timestamp: "Just now",
            unread:
              selectedConversation?.id === message.conversationId
                ? 0
                : (conversation.unread || 0) + 1,
          };

          // Move this conversation to the top
          if (conversationIndex > 0) {
            const [movedConversation] = updatedConversations.splice(
              conversationIndex,
              1
            );
            updatedConversations.unshift(movedConversation);
          }
        }

        return updatedConversations;
      });
    };

    // Handle typing indicator
    const handleTypingIndicator = (data) => {
      if (
        selectedConversation &&
        data.conversationId === selectedConversation.id
      ) {
        // Update UI to show typing indicator
        const typingElement = document.getElementById("typing-indicator");
        if (typingElement) {
          if (data.isTyping) {
            typingElement.classList.remove("hidden");
          } else {
            typingElement.classList.add("hidden");
          }
        }
      }
    };

    // Register event listeners (align with tutor)
    socket.on("message:new", handleNewMessage);
    socket.on("typing:indicator", handleTypingIndicator);

    // Cleanup function
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("typing:indicator", handleTypingIndicator);
    };
  }, [socket, connected, selectedConversation]);

  // Handle selecting a conversation
  const handleSelectConversation = useCallback(
    async (conversation) => {
      setSelectedConversation(conversation);
      fetchMessages(conversation.id);

      // Mark as read if there are unread messages
      if (conversation.unread > 0) {
        // Update UI immediately
        setConversations((prev) =>
          prev.map((c) => (c.id === conversation.id ? { ...c, unread: 0 } : c))
        );

        // Mark as read on server (optional - don't break UI if endpoint doesn't exist)
        try {
          await messaging.markAsRead(conversation.id);
        } catch (error) {
          console.warn(
            "Mark as read endpoint not available:",
            error.message || error
          );
          // Don't throw error - just log it and continue
        }
      }

      if (isMobileView) {
        setShowMobileChat(true);
      }

      // Join conversation room for real-time updates
      if (socket && connected && conversation?.id) {
        if (typeof socket.emit === "function") {
          socket.emit("conversation:join", Number(conversation.id));
        }
      }
    },
    [fetchMessages, isMobileView, socket, connected]
  );

  // Go back to conversation list on mobile
  const handleBackToList = () => {
    // Leave conversation room when navigating back
    if (socket && connected && selectedConversation?.id) {
      if (typeof socket.emit === "function") {
        socket.emit("conversation:leave", Number(selectedConversation.id));
      }
    }
    setShowMobileChat(false);
  };

  // Send a new message
  const handleSendMessage = async (text, attachment = null) => {
    if (!selectedConversation || (!text.trim() && !attachment)) return;

    try {
      // If there's an attachment, handle it differently
      if (attachment) {
        // For simplicity, we're not handling file uploads here
        // You'd typically upload to a storage service first, then send the URL
        console.log("Attachment sending not implemented", attachment);
        return;
      }

      // Optimistically add message to UI
      const tempId = `temp-${Date.now()}`;
      const newMessage = {
        id: tempId,
        sender: "counselor",
        text: text,
        timestamp: "Just now",
        sending: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Send message to server
      const response = await messaging.sendMessage(
        Number(selectedConversation.id),
        text,
        "text",
        {}
      );

      // Update with server response
      if (response && response.success && response.data) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...newMessage,
                  id: response.data.id,
                  sending: false,
                }
              : m
          )
        );

        // Update conversation list
        setConversations((prev) => {
          const updatedConversations = [...prev];
          const conversationIndex = updatedConversations.findIndex(
            (c) => c.id === selectedConversation.id
          );

          if (conversationIndex >= 0) {
            // Update the conversation
            updatedConversations[conversationIndex] = {
              ...updatedConversations[conversationIndex],
              timestamp: "Just now",
            };

            // Move this conversation to the top
            if (conversationIndex > 0) {
              const [movedConversation] = updatedConversations.splice(
                conversationIndex,
                1
              );
              updatedConversations.unshift(movedConversation);
            }
          }

          return updatedConversations;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);

      // Show error in the UI
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                sending: false,
                error: true,
              }
            : m
        )
      );
    }
  };

  // Handle typing indicator
  const handleTyping = useCallback(
    (isTyping) => {
      if (!selectedConversation) return;

      // Debounce the typing indicator to prevent too many requests
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        messaging.sendTypingIndicator(
          Number(selectedConversation.id),
          isTyping
        );
      }, 300);
    },
    [selectedConversation]
  );

  // Handle message deletion
  const handleMessageDeleted = useCallback((messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isDeletedLocally: true,
              text: "This message has been deleted",
              originalContent: msg.text || msg.content,
            }
          : msg
      )
    );
  }, []);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-lg">
      {/* Header - match Availability positioning */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">Chat with students and manage conversations</p>
          </div>
        </div>
      </div>
      <div className="flex-grow flex overflow-hidden">
        {/* Conversations List Sidebar */}
        <div
          className={`${
            isMobileView && showMobileChat ? "hidden" : "flex"
          } w-full md:w-80 bg-white border-r border-gray-200 flex-col overflow-hidden`}
        >
          <MessageList
            conversations={conversations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            loading={loading}
            error={error}
            userRole="counselor"
            filterTabs={[
              { key: "all", label: "All" },
              { key: "student", label: "Students" },
              { key: "parent", label: "Parents" },
              { key: "admin", label: "Admin" },
            ]}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-hidden">
          {isMobileView && !showMobileChat ? (
            <EmptyState />
          ) : (
            <ChatArea
              selectedConversation={selectedConversation}
              messages={messages}
              isMobileView={isMobileView}
              showMobileChat={showMobileChat}
              onBackToList={handleBackToList}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              loading={selectedConversation && messages.length === 0}
              userRole="counselor"
              onMessageDeleted={handleMessageDeleted}
            />
          )}
        </div>
      </div>
      {/* Debug refresh button */}
      <button
        onClick={handleRefresh}
        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded cursor-pointer"
      >
        Refresh Conversations
      </button>
    </div>
  );
}
