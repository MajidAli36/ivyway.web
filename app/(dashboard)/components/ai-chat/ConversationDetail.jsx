"use client";

import { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { aiChatService } from "../../../lib/api/aiChatService";
import { useSocket } from "../../../providers/SocketProvider";

export default function ConversationDetail({
  conversation,
  onEscalate,
  onSendMessage,
  userRole = "student",
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationLoading, setEscalationLoading] = useState(false);
  const [escalationError, setEscalationError] = useState("");
  const [escalationSuccess, setEscalationSuccess] = useState("");

  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  // Load conversation messages
  useEffect(() => {
    if (conversation?.id) {
      loadMessages();
    }
  }, [conversation?.id]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !conversation?.id) return;

    socket.on("ai:message", (data) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            timestamp: aiChatService.formatTimestamp(data.message.createdAt),
          },
        ]);
      }
    });

    socket.on("admin:message", (data) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            timestamp: aiChatService.formatTimestamp(data.message.createdAt),
          },
        ]);
      }
    });

    return () => {
      socket.off("ai:message");
      socket.off("admin:message");
    };
  }, [socket, conversation?.id]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate conversation and conversation ID
      if (!conversation) {
        throw new Error("No conversation selected");
      }

      if (!conversation.id) {
        throw new Error("Conversation ID is missing");
      }

      console.log("Loading messages for conversation:", conversation.id);

      const response = await aiChatService.getConversationMessages(
        conversation.id
      );

      console.log("LoadMessages response:", response);

      if (response?.success) {
        // Handle different response structures
        const messages = response.messages || response.data?.messages || [];

        if (!Array.isArray(messages)) {
          console.warn("Messages is not an array:", messages);
          setMessages([]);
          return;
        }

        const formattedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: aiChatService.formatTimestamp(msg.createdAt),
        }));
        setMessages(formattedMessages);
        console.log("Formatted messages:", formattedMessages);
      } else {
        console.error("API returned success: false", response);
        setError(response?.message || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error in loadMessages:", err);
      setError(err.message || "Failed to load conversation messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      senderType: "user",
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setSending(true);

    try {
      const response = await aiChatService.sendMessage(
        newMessage,
        conversation.id
      );

      if (response.success) {
        // Replace temp message with real messages
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== tempMessage.id);
          const newMessages = [];

          // Add user message if it exists
          if (response.userMessage && response.userMessage.createdAt) {
            newMessages.push({
              ...response.userMessage,
              timestamp: aiChatService.formatTimestamp(
                response.userMessage.createdAt
              ),
            });
          }

          // Add AI message if it exists
          if (response.aiMessage && response.aiMessage.createdAt) {
            newMessages.push({
              ...response.aiMessage,
              timestamp: aiChatService.formatTimestamp(
                response.aiMessage.createdAt
              ),
            });
          }

          return [...filtered, ...newMessages];
        });

        // Notify parent component
        if (onSendMessage) {
          onSendMessage(response);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, error: true, timestamp: "Failed to send" }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleEscalation = async () => {
    if (!escalationReason.trim()) return;

    setEscalationLoading(true);
    setEscalationError("");
    setEscalationSuccess("");

    try {
      const response = await aiChatService.escalateConversation(
        conversation.id,
        escalationReason
      );

      if (response.success) {
        setEscalationSuccess(response.message);
        setShowEscalation(false);
        setEscalationReason("");

        // Add system message
        setMessages((prev) => [
          ...prev,
          {
            id: `escalation-${Date.now()}`,
            content: response.message,
            senderType: "system",
            timestamp: "Just now",
          },
        ]);

        // Notify parent component
        if (onEscalate) {
          onEscalate(response);
        }
      } else {
        setEscalationError(
          response.message || "Failed to escalate conversation"
        );
      }
    } catch (error) {
      console.error("Error escalating conversation:", error);
      setEscalationError("Failed to escalate conversation due to an error.");
    } finally {
      setEscalationLoading(false);
    }
  };

  const handleSuggestedAction = (action) => {
    const actionRoutes = {
      search_tutors: `/${userRole}/find-tutor`,
      view_bookings: `/${userRole}/my-sessions`,
      view_billing: `/${userRole}/billing`,
      payment_methods: `/${userRole}/billing`,
      browse_tutors: `/${userRole}/find-tutor`,
      book_session: `/${userRole}/book-session`,
      contact_support: () => setShowEscalation(true),
    };

    const route = actionRoutes[action];
    if (typeof route === "string") {
      window.location.href = route;
    } else if (typeof route === "function") {
      route();
    }
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(
        (msg) =>
          `[${msg.timestamp}] ${msg.senderType.toUpperCase()}: ${msg.content}`
      )
      .join("\n");

    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${conversation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!conversation) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Select a conversation to view details</p>
        </div>
      </div>
    );
  }

  const statusDisplay = {
    active: {
      color: "text-green-600 bg-green-50 border-green-200",
      icon: CheckCircleIcon,
    },
    escalated: {
      color: "text-red-600 bg-red-50 border-red-200",
      icon: ExclamationTriangleIcon,
    },
    resolved: {
      color: "text-blue-600 bg-blue-50 border-blue-200",
      icon: CheckCircleIcon,
    },
    archived: {
      color: "text-gray-600 bg-gray-50 border-gray-200",
      icon: ClockIcon,
    },
  };

  const status = statusDisplay[conversation.status] || statusDisplay.active;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
            <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                Conversation Details
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 truncate">
                ID: {conversation.id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
            <button
              onClick={exportConversation}
              className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Conversation metadata */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </label>
            <div
              className={`inline-flex items-center px-1.5 lg:px-2 py-1 rounded-full text-xs font-medium border ${status.color} mt-1`}
            >
              <status.icon className="h-3 w-3 mr-1" />
              <span className="capitalize truncate">{conversation.status}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Category
            </label>
            <p className="text-sm font-medium text-gray-900 mt-1 capitalize truncate">
              {conversation.category}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Priority
            </label>
            <span
              className={`inline-flex items-center px-1.5 lg:px-2 py-1 rounded-full text-xs font-medium border mt-1 ${aiChatService.getPriorityColor(
                conversation.priority
              )}`}
            >
              <span className="truncate">{conversation.priority}</span>
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
              Messages
            </label>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {messages.length}
            </p>
          </div>
        </div>

        {conversation.tags && conversation.tags.length > 0 && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {conversation.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <SparklesIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No messages in this conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isUser = message.senderType === "user";
              const isSystem = message.senderType === "system";
              const isAdmin = message.senderType === "admin";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[80%] ${
                      isUser ? "order-2" : "order-1"
                    }`}
                  >
                    {/* Sender info for non-user messages */}
                    {!isUser && (
                      <div className="flex items-center space-x-2 mb-1">
                        {isAdmin ? (
                          <UserIcon className="h-4 w-4 text-purple-600" />
                        ) : isSystem ? (
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <SparklesIcon className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="text-xs font-medium text-gray-600">
                          {isAdmin
                            ? "Support Agent"
                            : isSystem
                            ? "System"
                            : "AI Assistant"}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`p-3 rounded-lg ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : isSystem
                          ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          : isAdmin
                          ? "bg-purple-50 text-purple-800 border border-purple-200"
                          : "bg-white border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {/* AI confidence and metadata */}
                      {message.senderType === "ai" && message.confidence && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>
                              Confidence: {Math.round(message.confidence * 100)}
                              %
                            </span>
                            {message.responseTime && (
                              <span>• Response: {message.responseTime}ms</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggested actions */}
                    {message.metadata?.suggestedActions &&
                      message.metadata.suggestedActions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-2">
                            Suggested actions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.suggestedActions.map(
                              (action, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleSuggestedAction(action.action)
                                  }
                                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                                >
                                  {action.text}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Timestamp */}
                    <p
                      className={`text-xs mt-1 ${
                        isUser ? "text-right" : "text-left"
                      } ${isUser ? "text-blue-100" : "text-gray-500"}`}
                    >
                      {message.timestamp}
                      {message.error && " • Failed to send"}
                    </p>
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Escalation form */}
      {showEscalation && (
        <div
          className="p-4 border-t border-gray-200 bg-yellow-50"
          role="region"
          aria-labelledby="escalation-heading-detail"
        >
          <div className="flex items-start space-x-2 mb-3">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-600 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h4
                id="escalation-heading-detail"
                className="text-sm font-medium text-yellow-800"
              >
                Escalate to Human Support
              </h4>
              <p className="text-xs text-yellow-700">
                Describe your issue and we'll connect you with a human agent
                within 1-2 hours.
              </p>
            </div>
          </div>

          <div className="mb-2">
            <label htmlFor="escalation-reason-detail" className="sr-only">
              Escalation reason
            </label>
            <textarea
              id="escalation-reason-detail"
              value={escalationReason}
              onChange={(e) => {
                setEscalationReason(e.target.value);
                // Clear errors when user starts typing
                if (escalationError) setEscalationError("");
              }}
              placeholder="Please describe your issue in detail (minimum 10 characters)..."
              className={`w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 transition-colors ${
                escalationError
                  ? "border-red-300 focus:ring-red-500 bg-red-50"
                  : "border-yellow-300 focus:ring-yellow-500"
              }`}
              rows={3}
              maxLength={500}
              disabled={escalationLoading}
              aria-describedby="escalation-help-detail escalation-error-detail character-count-detail"
            />

            <div className="flex justify-between items-center mt-1">
              <div
                id="escalation-help-detail"
                className="text-xs text-yellow-600"
              >
                {escalationReason.length < 10 &&
                  escalationReason.length > 0 && (
                    <span className="text-red-600">
                      Minimum 10 characters required
                    </span>
                  )}
              </div>
              <div
                id="character-count-detail"
                className={`text-xs ${
                  escalationReason.length > 480
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {escalationReason.length}/500
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                setShowEscalation(false);
                setEscalationReason("");
                setEscalationError("");
                setEscalationSuccess("");
              }}
              disabled={escalationLoading}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleEscalation}
              disabled={
                !escalationReason.trim() ||
                escalationReason.length < 10 ||
                escalationLoading
              }
              className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
              type="button"
              aria-describedby="escalation-error-detail"
            >
              {escalationLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Escalating...
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1 inline" />
                  Escalate
                </>
              )}
            </button>
          </div>

          {/* Success/Error Messages with ARIA live regions */}
          <div aria-live="polite" aria-atomic="true">
            {escalationSuccess && (
              <div
                className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center text-green-700 text-sm"
                role="alert"
              >
                <div className="flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {escalationSuccess}
                </div>
              </div>
            )}
          </div>

          <div aria-live="assertive" aria-atomic="true">
            {escalationError && (
              <div
                id="escalation-error-detail"
                className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center text-red-700 text-sm"
                role="alert"
              >
                <div className="flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {escalationError}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input area */}
      {conversation.status === "active" && (
        <div className="p-3 lg:p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={sending}
            />

            <button
              onClick={() => setShowEscalation(true)}
              className="p-2 text-gray-400 hover:text-yellow-600 transition-colors flex-shrink-0"
              title="Escalate to human support"
            >
              <ExclamationTriangleIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
