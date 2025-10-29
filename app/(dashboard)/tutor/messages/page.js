"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../../../providers/SocketProvider";
import { messaging } from "../../../lib/api/messaging";
import MessageList from "../../components/shared/MessageList";
import ChatArea from "../../components/shared/ChatArea";
import EmptyState from "../../components/shared/EmptyState";
import { useSearchParams } from "next/navigation";
import { authService } from "../../../lib/auth/authService";
import { useMessageCount } from "../../../hooks/useMessageCount";

export default function TutorMessagesPage() {
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
  const { handleConversationRead } = useMessageCount();

  // Get conversation ID from URL if present
  const conversationIdFromUrl = searchParams?.get("conversation");

  // Add this at the top of your component, after other state declarations
  const [deletedConversationIds, setDeletedConversationIds] = useState(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("tutorDeletedConversations");
    try {
      // Ensure we're getting a valid array of conversation IDs
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(
        "Error parsing deleted conversations from localStorage:",
        e
      );
      return [];
    }
  });

  // Effect to handle screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Format timestamps to match your UI
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Today, show time
    if (diff < 24 * 60 * 60 * 1000) {
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

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  // Get token with retry logic if needed
  const getTokenWithRetry = useCallback(async () => {
    if (!isAuthenticated()) {
      console.warn("User not authenticated");
      return null;
    }

    return authService.getToken();
  }, [isAuthenticated]);

  // Helper function to get last message for a conversation
  const getLastMessageForConversation = async (conversationId) => {
    try {
      // Get the most recent messages (limit to 10 to find the latest)
      const response = await messaging.getMessages(conversationId, 1, 10);
      if (
        response &&
        response.success &&
        response.data.messages &&
        response.data.messages.length > 0
      ) {
        // Sort messages by creation date to get the most recent
        const messages = response.data.messages.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const lastMsg = messages[0];
        return {
          content: lastMsg.content,
          senderId: lastMsg.senderId,
          createdAt: lastMsg.createdAt,
        };
      }
    } catch (error) {
      console.warn(
        "Could not fetch last message for conversation:",
        conversationId,
        error
      );
    }
    return null;
  };

  // Fetch messages for a conversation - MOVED BEFORE fetchConversations
  const fetchMessages = useCallback(
    async (conversationId) => {
      try {
        if (!isAuthenticated()) {
          setError("Please sign in to view messages");
          return;
        }

        const response = await messaging.getMessages(conversationId, 1, 50);

        if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data.messages)
        ) {
          // Format messages for UI but don't filter out deleted messages
          const formattedMessages = response.data.messages.map((message) => ({
            id: message.id,
            sender:
              message.senderId === authService.getUser()?.id
                ? "tutor"
                : "student",
            senderId: message.senderId,
            // Show "This message has been deleted" for deleted messages
            text: message.isDeleted
              ? "This message has been deleted"
              : message.content,
            timestamp: formatTimestamp(message.createdAt),
            createdAt: message.createdAt,
            isDeletedLocally: message.isDeleted, // Keep track of deletion status
            profileImageUrl: message.sender?.profileImageUrl || null, // Add profile image from sender
            attachment:
              !message.isDeleted && message.contentType !== "text"
                ? {
                    type: message.contentType,
                    name: message.metadata?.fileName || "Attachment",
                    url: message.metadata?.fileUrl,
                  }
                : null,
          }));

          // Sort messages by creation time
          formattedMessages.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(a.createdAt) - new Date(b.createdAt);
            }
            return 0;
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
    [formatTimestamp, selectedConversation?.userId, isAuthenticated]
  );

  // Fetch conversations - NOW COMES AFTER fetchMessages
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);

      if (!isAuthenticated()) {
        setError("Please sign in to view your messages");
        setLoading(false);
        return;
      }

      const response = await messaging.getConversations();

      if (response && response.success && Array.isArray(response.data)) {
        // Debug: Log the first conversation to see the structure
        if (response.data.length > 0) {
          console.log("Sample conversation data:", response.data[0]);
          console.log(
            "All conversation fields:",
            Object.keys(response.data[0])
          );
          if (response.data[0].lastMessage) {
            console.log("Last message object:", response.data[0].lastMessage);
          }
        }

        console.log(
          "Deleted conversation IDs from localStorage:",
          deletedConversationIds
        );

        // Process conversations and fetch last messages if needed
        const formattedConversations = await Promise.all(
          response.data
            .filter(
              (conversation) =>
                !deletedConversationIds.includes(conversation.id)
            )
            .map(async (conversation) => {
              const currentUserId = authService.getUser()?.id;
              const other =
                (conversation.participants || []).find(
                  (p) => p.id !== currentUserId
                ) || conversation.participants?.[0];

              // Try to get last message from conversation data first
              let lastMessage =
                conversation.lastMessage?.content ||
                conversation.lastMessageContent ||
                conversation.lastMessageText ||
                conversation.lastMessage?.text ||
                "";

              let lastMessageFromYou =
                conversation.lastMessage?.senderId === currentUserId;
              let lastMessageFromOther =
                conversation.lastMessage?.senderId !== currentUserId;

              // If no last message found, try to fetch it from messages API
              if (!lastMessage) {
                console.log(
                  "No last message in conversation data, fetching from messages API for:",
                  conversation.id
                );
                const lastMsgData = await getLastMessageForConversation(
                  conversation.id
                );
                if (lastMsgData) {
                  lastMessage = lastMsgData.content;
                  lastMessageFromYou = lastMsgData.senderId === currentUserId;
                  lastMessageFromOther = lastMsgData.senderId !== currentUserId;
                  console.log("Found last message via API:", lastMessage);
                } else {
                  console.log(
                    "No messages found for conversation:",
                    conversation.id
                  );
                  lastMessage = "No messages yet";
                }
              } else {
                console.log(
                  "Found last message in conversation data:",
                  lastMessage
                );
              }

              return {
                id: conversation.id,
                name: other?.fullName || other?.email || "Conversation",
                subject:
                  conversation.type === "group"
                    ? conversation.title || "Group"
                    : "Direct",
                timestamp: conversation.lastMessageAt
                  ? formatTimestamp(conversation.lastMessageAt)
                  : "",
                profileImageUrl: other?.profileImageUrl || null, // Add profile image URL
                unread: conversation.unreadCount || 0,
                online: !!other?.isOnline,
                userId: other?.id || "",
                bookingId: conversation.metadata?.bookings?.[0]?.bookingId,
                upcoming: false,
                upcomingSession: null,
                lastMessage: lastMessage,
                lastMessageFromYou: lastMessageFromYou,
                lastMessageFromOther: lastMessageFromOther,
              };
            })
        );

        setConversations(formattedConversations);

        // If we have a conversationId in the URL, select that conversation
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
  }, [
    formatTimestamp,
    conversationIdFromUrl,
    fetchMessages,
    deletedConversationIds,
    isAuthenticated,
  ]);

  // Load initial data - only once on mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !connected) return;

    // Handle incoming message
    const handleNewMessage = (message) => {
      if (!selectedConversation) return;
      if (message.conversationId !== selectedConversation.id) return;

      // Ignore echo of tutor's own message (already optimistically added)
      if (message.senderId === authService.getUser()?.id) return;

      const formatted = {
        id: message.id,
        sender:
          message.senderId === authService.getUser()?.id ? "tutor" : "student",
        senderId: message.senderId,
        text: message.content,
        timestamp: "Just now",
        createdAt: message.createdAt || new Date().toISOString(),
        profileImageUrl: message.sender?.profileImageUrl || null, // Add profile image from sender
        attachment:
          message.contentType !== "text"
            ? {
                type: message.contentType,
                name: message.metadata?.fileName || "Attachment",
                url: message.metadata?.fileUrl,
              }
            : null,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === formatted.id)) return prev; // de-duplicate by id
        return [...prev, formatted];
      });

      // Update conversation list without showing the message content
      setConversations((prev) => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(
          (c) => c.id === message.conversationId
        );

        if (conversationIndex >= 0) {
          const conversation = updatedConversations[conversationIndex];

          // Update the conversation with actual message content
          updatedConversations[conversationIndex] = {
            ...conversation,
            lastMessage: message.content,
            lastMessageFromYou: message.senderId === authService.getUser()?.id,
            lastMessageFromOther:
              message.senderId !== authService.getUser()?.id,
            timestamp: "Just now",
            unread:
              selectedConversation?.id === message.conversationId
                ? 0 // If we're looking at this conversation, no unread
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

    // Handle message deletion
    const handleMessageDeleted = (data) => {
      if (!data?.messageId || !data?.conversationId) return;
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, isDeletedLocally: true, text: "This message has been deleted" }
              : m
          )
        );
      }
      // Update conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, lastMessage: "This message has been deleted" }
            : c
        )
      );
    };

    // Handle message count update
    const handleMessageCountUpdate = (data) => {
      console.log("Message count update received:", data);
      // This is handled globally by useMessageCount hook
      // But we can update local conversation unread counts if needed
    };

    // Handle new conversation
    const handleNewConversation = (data) => {
      console.log("New conversation received:", data);
      if (data && data.id) {
        // Check if conversation already exists
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === data.id);
          if (!exists) {
            // Fetch conversations to get full details
            fetchConversations();
          }
          return prev;
        });
      }
    };

    // Handle conversation update
    const handleConversationUpdated = (data) => {
      console.log("Conversation updated:", data);
      if (data && data.conversationId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversationId
              ? { ...c, ...data, lastUpdated: new Date().toISOString() }
              : c
          )
        );
      }
    };

    // Handle conversation deletion
    const handleConversationDeleted = (data) => {
      console.log("Conversation deleted:", data);
      if (data && data.conversationId) {
        // Remove from conversations list
        setConversations((prev) =>
          prev.filter((c) => c.id !== data.conversationId)
        );
        // If it was selected, clear selection
        if (selectedConversation?.id === data.conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
      }
    };

    // Handle message reactions
    const handleMessageReaction = (data) => {
      console.log("Message reaction received:", data);
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? { ...m, reactions: data.reactions || m.reactions }
              : m
          )
        );
      }
    };

    // Register event listeners
    socket.on("message:new", handleNewMessage);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("message:count_update", handleMessageCountUpdate);
    socket.on("message:reaction", handleMessageReaction);
    socket.on("typing:indicator", handleTypingIndicator);
    socket.on("conversation:new", handleNewConversation);
    socket.on("conversation:updated", handleConversationUpdated);
    socket.on("conversation:deleted", handleConversationDeleted);

    // Cleanup function
    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("message:count_update", handleMessageCountUpdate);
      socket.off("message:reaction", handleMessageReaction);
      socket.off("typing:indicator", handleTypingIndicator);
      socket.off("conversation:new", handleNewConversation);
      socket.off("conversation:updated", handleConversationUpdated);
      socket.off("conversation:deleted", handleConversationDeleted);
    };
  }, [socket, connected, selectedConversation, fetchConversations]);

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

        // Update global message count
        handleConversationRead(conversation.id, conversation.unread);

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
        sender: "tutor",
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
            // Update the conversation with actual message content
            updatedConversations[conversationIndex] = {
              ...updatedConversations[conversationIndex],
              lastMessage: text,
              lastMessageFromYou: true,
              lastMessageFromOther: false,
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
        messaging.sendTypingIndicator(selectedConversation.id, isTyping);
      }, 300);
    },
    [selectedConversation]
  );

  // Add message deletion functionality
  const handleMessageDeleted = (messageId, isLocalDeletion = true) => {
    // Update the messages list to show the message as deleted
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isDeletedLocally: true,
              text: "This message has been deleted",
              // Store original content if needed
              originalContent: msg.text || msg.content,
            }
          : msg
      )
    );
  };

  // Add this handleDeleteConversation function to your component
  const handleDeleteConversation = async (conversationId) => {
    try {
      // First, call the API to delete on the server
      await messaging.deleteConversation(conversationId);

      // Ensure the ID is valid before adding to our tracking
      if (conversationId && typeof conversationId === "string") {
        // Add the conversation ID to our locally tracked deleted conversations
        // Ensure we don't add duplicates and that we're working with the latest state
        setDeletedConversationIds((prevIds) => {
          if (!prevIds.includes(conversationId)) {
            const updatedDeletedIds = [...prevIds, conversationId];

            // Save to localStorage for persistence across reloads
            try {
              localStorage.setItem(
                "tutorDeletedConversations",
                JSON.stringify(updatedDeletedIds)
              );
            } catch (e) {
              console.error("Error saving to localStorage:", e);
            }

            console.log("Updated deleted conversation IDs:", updatedDeletedIds);
            return updatedDeletedIds;
          }
          return prevIds;
        });
      }

      // Remove conversation from state immediately
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );

      // If the deleted conversation was selected, clear selection
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
        if (isMobileView) {
          setShowMobileChat(false);
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      // You can add an error toast here if you're using toast notifications
      // toast.error("Failed to delete conversation", { id: "delete-conv" });
    }
  };

  // Add a function to clear the localStorage if needed (useful for testing)
  // You can expose this through a hidden admin feature or remove in production
  const clearDeletedConversationsHistory = () => {
    localStorage.removeItem("tutorDeletedConversations");
    setDeletedConversationIds([]);
    // Refetch conversations to show all available ones
    fetchConversations();
  };

  // Add a function to check localStorage and reload conversations
  const forceRefreshConversations = () => {
    // Force reload our deleted IDs from localStorage
    try {
      const saved = localStorage.getItem("tutorDeletedConversations");
      const refreshedIds = saved ? JSON.parse(saved) : [];
      setDeletedConversationIds(
        Array.isArray(refreshedIds) ? refreshedIds : []
      );
    } catch (e) {
      console.error("Error refreshing deleted conversations:", e);
    }

    // Refetch all conversations
    fetchConversations();
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-lg">
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
            onDeleteConversation={handleDeleteConversation}
            loading={loading}
            error={error}
            userRole="tutor"
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
              userRole="tutor"
              onMessageDeleted={handleMessageDeleted}
            />
          )}
        </div>
      </div>
      {/* Add a debug button in your UI for testing (you can remove in production) */}
      <button
        onClick={forceRefreshConversations}
        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded cursor-pointer"
      >
        Refresh Conversations
      </button>
    </div>
  );
}
