"use client";

import { useState, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { aiChatService } from "../../../lib/api/aiChatService";

export default function ConversationList({
  onSelectConversation,
  selectedConversationId,
  conversations: propConversations,
  loading: propLoading,
  error: propError,
}) {
  // Use props if provided, otherwise use local state for backwards compatibility
  const [localConversations, setLocalConversations] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  const conversations =
    propConversations !== undefined ? propConversations : localConversations;
  const loading = propLoading !== undefined ? propLoading : localLoading;
  const error = propError !== undefined ? propError : localError;

  // Load conversations only if not provided via props
  useEffect(() => {
    if (propConversations === undefined) {
      loadConversations();
    }
  }, [propConversations]);

  const loadConversations = async () => {
    if (propConversations !== undefined) return; // Don't load if conversations are provided via props

    try {
      setLocalLoading(true);
      setLocalError(null);

      const response = await aiChatService.getConversations({ limit: 50 });

      console.log("ConversationList API Response:", response);

      if (response?.success) {
        // Safe property access with fallback
        let filteredConversations =
          response.conversations || response.data?.conversations || [];

        console.log("Filtered conversations:", filteredConversations);

        // Ensure it's an array
        if (!Array.isArray(filteredConversations)) {
          console.warn("Conversations is not an array:", filteredConversations);
          filteredConversations = [];
        }

        setLocalConversations(filteredConversations);
      } else {
        console.error("API returned error:", response);
        setLocalConversations([]);
        setLocalError(response?.message || "Failed to load conversations");
      }
    } catch (err) {
      console.error("Network error:", err);
      setLocalConversations([]);
      setLocalError(
        err.message || "Failed to load conversations. Please try again."
      );
    } finally {
      setLocalLoading(false);
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case "active":
        return {
          icon: <ChatBubbleLeftRightIcon className="h-4 w-4" />,
          color: "text-green-600 bg-green-50 border-green-200",
        };
      case "escalated":
        return {
          icon: <ExclamationTriangleIcon className="h-4 w-4" />,
          color: "text-red-600 bg-red-50 border-red-200",
        };
      case "resolved":
        return {
          icon: <CheckCircleIcon className="h-4 w-4" />,
          color: "text-blue-600 bg-blue-50 border-blue-200",
        };
      default:
        return {
          icon: <ClockIcon className="h-4 w-4" />,
          color: "text-gray-600 bg-gray-50 border-gray-200",
        };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    return aiChatService.getPriorityColor(priority);
  };

  // Get category display
  const getCategoryDisplay = (category) => {
    const categories = {
      booking: { label: "Booking", emoji: "📅" },
      payment: { label: "Payment", emoji: "💳" },
      technical: { label: "Technical", emoji: "🔧" },
      general: { label: "General", emoji: "💬" },
      account: { label: "Account", emoji: "👤" },
    };
    return categories[category] || { label: category, emoji: "💬" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadConversations}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {conversations.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <SparklesIcon className="h-8 w-8 lg:h-12 lg:w-12 mx-auto text-gray-400 mb-3 lg:mb-4" />
            <p className="text-gray-500 mb-2 text-sm lg:text-base">
              No conversations found
            </p>
            <p className="text-xs lg:text-sm text-gray-400">
              Start a new conversation with our AI assistant
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {(conversations || []).map((conversation) => {
              const statusDisplay = getStatusDisplay(conversation.status);
              const categoryDisplay = getCategoryDisplay(conversation.category);
              const isSelected = conversation.id === selectedConversationId;

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-3 lg:p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-r-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header with status and category */}
                      <div className="flex items-center flex-wrap gap-1 lg:gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-1.5 lg:px-2 py-1 rounded-full text-xs font-medium border ${statusDisplay.color} flex-shrink-0`}
                        >
                          {statusDisplay.icon}
                          <span className="ml-1 capitalize hidden sm:inline">
                            {conversation.status}
                          </span>
                        </span>

                        <span className="inline-flex items-center px-1.5 lg:px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex-shrink-0">
                          <span className="mr-1">{categoryDisplay.emoji}</span>
                          <span className="hidden sm:inline">
                            {categoryDisplay.label}
                          </span>
                        </span>

                        {conversation.priority !== "medium" && (
                          <span
                            className={`inline-flex items-center px-1.5 lg:px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              conversation.priority
                            )} flex-shrink-0`}
                          >
                            <span className="hidden sm:inline">
                              {conversation.priority}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Last message */}
                      <p className="text-sm text-gray-900 truncate mb-1">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center flex-wrap gap-1 lg:gap-3 text-xs text-gray-500">
                        <span className="flex-shrink-0">
                          {conversation.messageCount} messages
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex-shrink-0">
                          {aiChatService.formatTimestamp(
                            conversation.lastInteractionAt
                          )}
                        </span>
                        {conversation.tags?.length > 0 && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex flex-wrap gap-1">
                              {(conversation.tags || [])
                                .slice(0, 2)
                                .map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-1 py-0.5 bg-gray-200 rounded text-xs flex-shrink-0"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              {conversation.tags.length > 2 && (
                                <span className="px-1 py-0.5 bg-gray-200 rounded text-xs flex-shrink-0">
                                  +{conversation.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sentiment indicator */}
                    <div
                      className={`w-3 h-3 rounded-full ${
                        conversation.sentiment === "positive"
                          ? "bg-green-400"
                          : conversation.sentiment === "negative"
                          ? "bg-red-400"
                          : "bg-gray-400"
                      }`}
                      title={`Sentiment: ${conversation.sentiment}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
