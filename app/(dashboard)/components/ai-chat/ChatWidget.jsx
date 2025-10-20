"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useSocket } from "../../../providers/SocketProvider";
import { aiChatService } from "../../../lib/api/aiChatService";

export default function ChatWidget({
  userRole = "student",
  className = "",
  position = "bottom-right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationLoading, setEscalationLoading] = useState(false);
  const [escalationError, setEscalationError] = useState("");
  const [escalationSuccess, setEscalationSuccess] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("ai:message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            timestamp: aiChatService.formatTimestamp(data.message.createdAt),
          },
        ]);
        setIsLoading(false);

        if (!isOpen) {
          setHasNewMessage(true);
        }
      }
    });

    socket.on("ai:escalated", (data) => {
      if (data.conversationId === conversationId) {
        setShowEscalation(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `escalation-${Date.now()}`,
            content: `Your conversation has been escalated to our support team (Ticket: ${data.ticketNumber}). A human agent will respond shortly.`,
            senderType: "system",
            timestamp: "Just now",
          },
        ]);
      }
    });

    socket.on("admin:message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            timestamp: aiChatService.formatTimestamp(data.message.createdAt),
          },
        ]);

        if (!isOpen) {
          setHasNewMessage(true);
        }
      }
    });

    return () => {
      socket.off("ai:message");
      socket.off("ai:escalated");
      socket.off("admin:message");
    };
  }, [socket, conversationId, isOpen]);

  // Send message to AI
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: `temp-${Date.now()}`,
      content: currentMessage,
      senderType: "user",
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await aiChatService.sendMessage(
        currentMessage,
        conversationId
      );

      console.log("Full API Response:", response);

      // Handle multiple possible response structures from backend
      let responseData = null;

      if (response.success) {
        // Try different possible data locations
        responseData = response.data || response;

        // Update conversation ID if it's a new conversation
        const conversation = responseData.conversation;
        const newConversationId =
          conversation?.id || responseData.conversationId;

        if (!conversationId && newConversationId) {
          setConversationId(newConversationId);
        }

        // Replace temp user message with real one and add AI response
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== userMessage.id);
          const newMessages = [...filtered];

          // Add user message - try different possible locations
          const userMsg = responseData.userMessage || responseData.user_message;
          if (userMsg) {
            const userTimestamp =
              userMsg.createdAt ||
              userMsg.created_at ||
              new Date().toISOString();
            newMessages.push({
              ...userMsg,
              timestamp: userTimestamp
                ? aiChatService.formatTimestamp(userTimestamp)
                : "Just now",
            });
          }

          // Add AI message - try different possible locations
          const aiMsg =
            responseData.aiMessage ||
            responseData.ai_message ||
            responseData.message;
          if (aiMsg) {
            const aiTimestamp =
              aiMsg.createdAt || aiMsg.created_at || new Date().toISOString();
            newMessages.push({
              ...aiMsg,
              timestamp: aiTimestamp
                ? aiChatService.formatTimestamp(aiTimestamp)
                : "Just now",
            });
          }

          return newMessages;
        });
      } else {
        console.error("API returned success: false", response);
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id
            ? { ...msg, error: true, timestamp: "Failed to send" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle escalation
  const handleEscalation = async () => {
    if (!escalationReason.trim() || !conversationId) return;

    setEscalationLoading(true);
    setEscalationError("");
    setEscalationSuccess("");

    try {
      const response = await aiChatService.escalateConversation(
        conversationId,
        escalationReason
      );

      if (response.success) {
        setEscalationSuccess(response.message);
        setShowEscalation(false);
        setEscalationReason("");
        setMessages((prev) => [
          ...prev,
          {
            id: `escalation-${Date.now()}`,
            content: response.message,
            senderType: "system",
            timestamp: "Just now",
          },
        ]);
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

  // Handle suggested action click
  const handleSuggestedAction = (action) => {
    // Map actions to routes or functions
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

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (!isOpen && isMinimized) {
      setIsMinimized(false);
    }
  };

  // Minimize chat
  const minimizeChat = () => {
    setIsMinimized(true);
  };

  // Get the last AI message for suggested actions
  const lastAiMessage = messages.filter((msg) => msg.senderType === "ai").pop();
  const suggestedActions = lastAiMessage?.metadata?.suggestedActions || [];

  if (!isOpen) {
    return (
      <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
        <button
          onClick={toggleChat}
          className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open AI Chat Assistant"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <SparklesIcon className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />

          {hasNewMessage && (
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <div
        className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized
            ? "w-80 h-12"
            : showEscalation
            ? "w-96 h-[600px]"
            : "w-96 h-[500px]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-yellow-300" />
            <h3 className="font-semibold">AI Assistant</h3>
            <span className="px-2 py-1 bg-green-500 text-xs rounded-full">
              Online
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={minimizeChat}
              className="p-1 hover:bg-blue-800 rounded transition-colors"
              aria-label="Minimize chat"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-blue-800 rounded transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 h-[360px] bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <SparklesIcon className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                  <p className="text-sm">Hi! I'm your AI assistant.</p>
                  <p className="text-xs mt-1">How can I help you today?</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.senderType === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.senderType === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : message.senderType === "system"
                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        : "bg-white border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderType === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                      {message.error && " • Failed to send"}
                    </p>
                  </div>
                </div>
              ))}

              {/* Suggested Actions */}
              {suggestedActions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Suggested actions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedAction(action.action)}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start mb-4">
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

            {/* Escalation Form */}
            {showEscalation && (
              <div
                className="p-4 border-t border-gray-200 bg-yellow-50"
                role="region"
                aria-labelledby="escalation-heading"
              >
                <div className="flex items-start space-x-2 mb-3">
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-yellow-600 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h4
                      id="escalation-heading"
                      className="text-sm font-medium text-yellow-800"
                    >
                      Escalate to Human Support
                    </h4>
                    <p className="text-xs text-yellow-700">
                      Describe your issue and we'll connect you with a human
                      agent within 1-2 hours.
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="escalation-reason" className="sr-only">
                    Escalation reason
                  </label>
                  <textarea
                    id="escalation-reason"
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
                    aria-describedby="escalation-help escalation-error character-count"
                  />

                  <div className="flex justify-between items-center mt-1">
                    <div
                      id="escalation-help"
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
                      id="character-count"
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

                <div className="flex justify-end space-x-2 mt-3 pb-1">
                  <button
                    onClick={() => {
                      setShowEscalation(false);
                      setEscalationReason("");
                      setEscalationError("");
                      setEscalationSuccess("");
                    }}
                    disabled={escalationLoading}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    type="button"
                    aria-describedby="escalation-error"
                  >
                    {escalationLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                      "Escalate"
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
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {escalationSuccess}
                      </div>
                    </div>
                  )}
                </div>

                <div aria-live="assertive" aria-atomic="true">
                  {escalationError && (
                    <div
                      id="escalation-error"
                      className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center text-red-700 text-sm"
                      role="alert"
                    >
                      <div className="flex items-center justify-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {escalationError}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />

                {!showEscalation && (
                  <button
                    onClick={() => setShowEscalation(true)}
                    className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                    title="Escalate to human support"
                  >
                    <ExclamationTriangleIcon className="h-5 w-5" />
                  </button>
                )}

                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
