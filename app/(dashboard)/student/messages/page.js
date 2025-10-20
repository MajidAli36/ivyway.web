"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../../../providers/SocketProvider";
import { messaging } from "../../../lib/api/messaging";
import MessageList from "../../components/shared/MessageList";
import ChatArea from "../../components/shared/ChatArea";
import EmptyState from "../../components/shared/EmptyState";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "../../../lib/auth/authService";
import { useMessageCount } from "../../../hooks/useMessageCount";

export default function StudentMessagesPage() {
  // State management
  const [conversations, setConversations] = useState([]);
  const [convPage, setConvPage] = useState(1);
  const [convHasMore, setConvHasMore] = useState(true);
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
  const router = useRouter();
  const { handleConversationRead } = useMessageCount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Get conversation ID from URL if present
  const conversationIdFromUrl = searchParams?.get("conversation");

  // Effect to handle screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        setUser(authService.getUser());
      } else {
        // Redirect to login if not authenticated
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Format timestamps
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

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

    return date.toLocaleDateString();
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (conversationId) => {
      try {
        if (!isAuthenticated) {
          console.log("No authenticated user");
          return;
        }

        const response = await messaging.getMessages(conversationId, 1, 50);

        if (
          response &&
          response.success &&
          response.data &&
          Array.isArray(response.data.messages)
        ) {
          const formattedMessages = response.data.messages.map((message) => ({
            id: message.id,
            sender: message.senderId === user?.id ? "student" : "tutor",
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
                    name: message.metadata?.fileName || "Attachment",
                    url: message.metadata?.fileUrl,
                  }
                : null,
          }));

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
    [formatTimestamp, selectedConversation?.userId, isAuthenticated]
  );

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

  // Fetch conversations
  const fetchConversations = useCallback(
    async (page = 1) => {
      try {
        if (!isAuthenticated) {
          console.log("No authenticated user");
          return;
        }

        setLoading(true);

        const response = await messaging.getConversations(page, 20);

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

          // Process conversations and fetch last messages if needed
          const formattedConversations = await Promise.all(
            response.data.map(async (conversation) => {
              const other =
                (conversation.participants || []).find(
                  (p) => p.id !== user?.id
                ) || conversation.participants?.[0];

              // Try to get last message from conversation data first
              let lastMessage =
                conversation.lastMessage?.content ||
                conversation.lastMessageContent ||
                conversation.lastMessageText ||
                conversation.lastMessage?.text ||
                "";

              let lastMessageFromYou =
                conversation.lastMessage?.senderId === user?.id;
              let lastMessageFromOther =
                conversation.lastMessage?.senderId !== user?.id;

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
                  lastMessageFromYou = lastMsgData.senderId === user?.id;
                  lastMessageFromOther = lastMsgData.senderId !== user?.id;
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

          setConversations((prev) =>
            page === 1
              ? formattedConversations
              : [...prev, ...formattedConversations]
          );
          setConvHasMore(response.data.length === 20);
          setConvPage(page);

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

        // Check if this is an authentication error
        if (
          err.message &&
          (err.message.includes("Session expired") ||
            err.message.includes("Please sign in") ||
            err.status === 401)
        ) {
          authService.logout();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [
      formatTimestamp,
      conversationIdFromUrl,
      fetchMessages,
      isAuthenticated,
      router,
      user?.id,
    ]
  );

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations(1);
    }
  }, [isAuthenticated, fetchConversations]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !connected) return;

    const handleNewMessage = (message) => {
      if (!selectedConversation) return;
      if (message.conversationId !== selectedConversation.id) return;

      // Ignore socket echo of sender's own message (we already added optimistically)
      if (message.senderId === user?.id) return;

      const formatted = {
        id: message.id,
        sender: message.senderId === user?.id ? "student" : "tutor",
        text: message.content,
        timestamp: "Just now",
        createdAt: message.createdAt || new Date().toISOString(),
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

      setConversations((prev) => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(
          (c) => c.id === message.conversationId
        );

        if (conversationIndex >= 0) {
          const conversation = updatedConversations[conversationIndex];

          updatedConversations[conversationIndex] = {
            ...conversation,
            lastMessage: message.content,
            lastMessageFromYou: message.senderId === user?.id,
            lastMessageFromOther: message.senderId !== user?.id,
            timestamp: "Just now",
            unread:
              selectedConversation?.id === message.conversationId
                ? 0
                : (conversation.unread || 0) + 1,
          };

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

    // Handle conversation deletion by tutor
    const handleConversationDeleted = (data) => {
      if (data.conversationId) {
        setConversations((prev) =>
          prev.filter((conv) => conv.id !== data.conversationId)
        );

        if (selectedConversation?.id === data.conversationId) {
          setSelectedConversation(null);
          setMessages([]);
          if (isMobileView) {
            setShowMobileChat(false);
          }
        }
      }
    };

    const handleMessageDeleted = (data) => {
      if (!data?.messageId || !data?.conversationId) return;
      if (
        selectedConversation &&
        data.conversationId === selectedConversation.id
      ) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? {
                  ...m,
                  isDeletedLocally: true,
                  text: "This message has been deleted",
                }
              : m
          )
        );
      }
    };

    const handleTypingIndicator = (data) => {
      if (
        selectedConversation &&
        data.conversationId === selectedConversation.id
      ) {
        const typingElement = document.getElementById("typing-indicator");
        if (typingElement) {
          if (data.isTyping) typingElement.classList.remove("hidden");
          else typingElement.classList.add("hidden");
        }
      }
    };

    // Standardized event names per backend spec
    socket.on("message:new", handleNewMessage);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("typing:indicator", handleTypingIndicator);
    socket.on("conversation:deleted", handleConversationDeleted);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("typing:indicator", handleTypingIndicator);
      socket.off("conversation:deleted", handleConversationDeleted);
    };
  }, [socket, connected, selectedConversation, isMobileView, user?.id]);

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

  // Handle message deletion
  const handleMessageDeleted = (messageId, isLocalDeletion = true) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
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
  };

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
      const tempId = `temp-${Date.now()}`;
      const newMessage = {
        id: tempId,
        sender: "student",
        text: text,
        timestamp: "Just now",
        sending: true,
      };

      setMessages((prev) => [...prev, newMessage]);

      const response = await messaging.sendMessage(
        Number(selectedConversation.id),
        text,
        "text",
        {}
      );

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

        setConversations((prev) => {
          const updatedConversations = [...prev];
          const conversationIndex = updatedConversations.findIndex(
            (c) => c.id === selectedConversation.id
          );

          if (conversationIndex >= 0) {
            updatedConversations[conversationIndex] = {
              ...updatedConversations[conversationIndex],
              lastMessage: text,
              lastMessageFromYou: true,
              lastMessageFromOther: false,
              timestamp: "Just now",
            };

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

      setMessages((prev) =>
        prev.map((m) =>
          m.id === `temp-${Date.now().toString().slice(0, -3)}`
            ? {
                ...m,
                sending: false,
                error: true,
              }
            : m
        )
      );

      // Check for auth errors
      if (err.message && err.message.includes("Please sign in")) {
        authService.logout();
        router.push("/login");
      }
    }
  };

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    fetchConversations();
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [fetchConversations, fetchMessages, selectedConversation]);

  // Loading state while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            loading={loading}
            error={error}
            userRole="student"
          />
          {convHasMore && (
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => fetchConversations(convPage + 1)}
                className="w-full text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Load more
              </button>
            </div>
          )}
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
              loading={selectedConversation && messages.length === 0}
              userRole="student"
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
