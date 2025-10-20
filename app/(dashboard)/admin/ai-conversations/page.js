"use client";

import { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { aiChatService } from "../../../lib/api/aiChatService";
import ConversationDetail from "../../components/ai-chat/ConversationDetail";
import ReactAnalytics from "../../../components/ai-chat/ReactAnalytics";

export default function AdminAIConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("conversations"); // conversations, react-analytics
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    sentiment: "",
    search: "",
  });

  const [assigningConversation, setAssigningConversation] = useState(null);
  const [resolvingConversation, setResolvingConversation] = useState(null);
  const [resolutionData, setResolutionData] = useState({
    notes: "",
    satisfaction: 5,
  });

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, [filters]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build clean filter object - only include non-empty values
      const apiFilters = {};
      if (filters.status && filters.status !== "") {
        apiFilters.status = filters.status;
      }
      if (filters.priority && filters.priority !== "") {
        apiFilters.priority = filters.priority;
      }
      if (filters.category && filters.category !== "") {
        apiFilters.category = filters.category;
      }
      if (filters.sentiment && filters.sentiment !== "") {
        apiFilters.sentiment = filters.sentiment;
      }
      apiFilters.limit = 100;

      console.log("Admin conversations API filters:", apiFilters);

      const response = await aiChatService.admin.getConversations(apiFilters);

      console.log("Admin conversations API response:", response);

      if (response?.success) {
        // Handle different response structures - check both response.data.conversations and response.conversations
        let filteredConversations =
          response.data?.conversations || response.conversations || [];

        console.log(
          "Filtered conversations before search:",
          filteredConversations
        );

        // Ensure it's an array
        if (!Array.isArray(filteredConversations)) {
          console.warn("Conversations is not an array:", filteredConversations);
          filteredConversations = [];
        }

        // Apply search filter
        if (filters.search) {
          filteredConversations = filteredConversations.filter(
            (conv) =>
              conv.user?.fullName
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              conv.user?.email
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              conv.category
                ?.toLowerCase()
                .includes(filters.search.toLowerCase()) ||
              conv.escalationReason
                ?.toLowerCase()
                .includes(filters.search.toLowerCase())
          );
        }

        console.log("Final filtered conversations:", filteredConversations);

        setConversations(filteredConversations);
        setStats(response.data?.stats || response.stats || null);
      } else {
        console.error("API returned error:", response);
        setConversations([]);
        setError(response?.message || "Failed to load conversations");
      }
    } catch (err) {
      console.error("Network error:", err);
      setConversations([]);
      setError(
        err.message || "Failed to load conversations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle conversation assignment
  const handleAssignConversation = async (conversationId, adminId) => {
    try {
      const response = await aiChatService.admin.assignConversation(
        conversationId,
        adminId
      );

      if (response.success) {
        setAssigningConversation(null);
        await loadConversations();

        // Update selected conversation if it's the one being assigned
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation((prev) => ({
            ...prev,
            status: "assigned",
            assignedAt: response.conversation.assignedAt,
          }));
        }
      }
    } catch (error) {
      console.error("Error assigning conversation:", error);
    }
  };

  // Handle conversation resolutions
  const handleResolveConversation = async () => {
    if (!resolvingConversation || !resolutionData.notes.trim()) return;

    try {
      const response = await aiChatService.admin.resolveConversation(
        resolvingConversation.id,
        resolutionData.notes,
        resolutionData.satisfaction
      );

      if (response.success) {
        setResolvingConversation(null);
        setResolutionData({ notes: "", satisfaction: 5 });
        await loadConversations();

        // Update selected conversation if it's the one being resolved
        if (selectedConversation?.id === resolvingConversation.id) {
          setSelectedConversation((prev) => ({
            ...prev,
            status: "resolved",
            resolvedAt: response.conversation.resolvedAt,
          }));
        }
      }
    } catch (error) {
      console.error("Error resolving conversation:", error);
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const displays = {
      active: {
        icon: ChatBubbleLeftRightIcon,
        color: "text-green-600 bg-green-50 border-green-200",
        label: "Active",
      },
      escalated: {
        icon: ExclamationTriangleIcon,
        color: "text-red-600 bg-red-50 border-red-200",
        label: "Escalated",
      },
      assigned: {
        icon: UserPlusIcon,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        label: "Assigned",
      },
      resolved: {
        icon: CheckCircleIcon,
        color: "text-purple-600 bg-purple-50 border-purple-200",
        label: "Resolved",
      },
    };
    return displays[status] || displays.active;
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      category: "",
      sentiment: "",
      search: "",
    });
  };

  // Stats cards data
  const statsCards = stats
    ? [
        {
          title: "Total Conversations",
          value: stats.total,
          icon: ChatBubbleLeftRightIcon,
          color: "bg-blue-500",
        },
        {
          title: "Escalated",
          value: stats.escalated,
          icon: ExclamationTriangleIcon,
          color: "bg-red-500",
        },
        {
          title: "Active",
          value: stats.active,
          icon: ClockIcon,
          color: "bg-green-500",
        },
        {
          title: "Resolved",
          value: stats.resolved,
          icon: CheckCircleIcon,
          color: "bg-purple-500",
        },
      ]
    : [];

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 flex items-center">
              <SparklesIcon className="h-6 w-6 lg:h-8 lg:w-8 mr-2 lg:mr-3 text-blue-600" />
              AI Conversations
            </h1>
            <p className="mt-1 text-sm lg:text-base text-slate-500">
              Manage AI conversations, escalations, and support requests
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("conversations")}
              className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${
                activeTab === "conversations"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1" />
              <span className="hidden sm:inline">Conversations</span>
              <span className="sm:hidden">Chat</span>
              {conversations.length > 0 && (
                <span className="ml-1 lg:ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {conversations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("react-analytics")}
              className={`px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors ${
                activeTab === "react-analytics"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LightBulbIcon className="h-3 w-3 lg:h-4 lg:w-4 inline mr-1" />
              <span className="hidden sm:inline">ReAct Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Row - Always visible for conversations tab */}
        {activeTab === "conversations" && (
          <div className="mt-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filters:
                </span>
              </div>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="escalated">Escalated</option>
                <option value="assigned">Assigned</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              >
                <option value="">All Categories</option>
                <option value="booking">Booking</option>
                <option value="payment">Payment</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
                <option value="account">Account</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.sentiment}
                onChange={(e) =>
                  handleFilterChange("sentiment", e.target.value)
                }
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>

              {(filters.status ||
                filters.category ||
                filters.priority ||
                filters.sentiment ||
                filters.search) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "conversations" && (
          <div className="h-full flex flex-col">
            {/* Stats Cards */}
            {stats && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  {statsCards.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow p-3 lg:p-4 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className={`${stat.color} p-2 rounded-lg`}>
                          <stat.icon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                        </div>
                        <div className="ml-2 lg:ml-3">
                          <p className="text-xs font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-lg lg:text-xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden px-6 py-4">
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 gap-6 h-full">
                {/* Conversations List */}
                <div className="xl:col-span-1 lg:col-span-1 h-full flex flex-col">
                  <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
                    <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
                      <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                        Conversations ({conversations.length})
                      </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0">
                      {error ? (
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
                      ) : conversations.length === 0 ? (
                        <div className="text-center py-12">
                          <SparklesIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-500">
                            No conversations found
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {(conversations || []).map((conversation) => {
                            const statusDisplay = getStatusDisplay(
                              conversation.status
                            );
                            const isSelected =
                              conversation.id === selectedConversation?.id;

                            return (
                              <div
                                key={conversation.id}
                                onClick={() =>
                                  setSelectedConversation(conversation)
                                }
                                className={`p-4 cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-blue-50 border-r-4 border-blue-500"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                {/* User Info */}
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-sm">
                                    {conversation.user?.fullName
                                      ? conversation.user.fullName
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                      : "?"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {conversation.user?.fullName ||
                                        "Unknown User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {conversation.user?.email || "No email"}
                                    </p>
                                  </div>
                                </div>

                                {/* Status and Priority */}
                                <div className="flex items-center space-x-2 mb-2">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}
                                  >
                                    <statusDisplay.icon className="h-3 w-3 mr-1" />
                                    {statusDisplay.label}
                                  </span>

                                  {conversation.priority !== "medium" && (
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${aiChatService.getPriorityColor(
                                        conversation.priority
                                      )}`}
                                    >
                                      {conversation.priority || "medium"}
                                    </span>
                                  )}

                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {conversation.category || "general"}
                                  </span>
                                </div>

                                {/* Escalation reason */}
                                {conversation.escalationReason && (
                                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                    <span className="font-medium">Reason:</span>{" "}
                                    {conversation.escalationReason}
                                  </p>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>
                                    {conversation.messageCount || 0} messages
                                  </span>
                                  <span>
                                    {conversation.lastInteractionAt
                                      ? aiChatService.formatTimestamp(
                                          conversation.lastInteractionAt
                                        )
                                      : "Just now"}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 mt-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedConversation(conversation);
                                    }}
                                    className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded hover:bg-blue-50"
                                  >
                                    <EyeIcon className="h-3 w-3" />
                                    <span>View</span>
                                  </button>

                                  {conversation.status === "escalated" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAssigningConversation(conversation);
                                      }}
                                      className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:text-green-800 border border-green-200 rounded hover:bg-green-50"
                                    >
                                      <UserPlusIcon className="h-3 w-3" />
                                      <span>Assign</span>
                                    </button>
                                  )}

                                  {(conversation.status === "assigned" ||
                                    conversation.status === "escalated") && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setResolvingConversation(conversation);
                                      }}
                                      className="flex items-center space-x-1 px-2 py-1 text-xs text-purple-600 hover:text-purple-800 border border-purple-200 rounded hover:bg-purple-50"
                                    >
                                      <DocumentCheckIcon className="h-3 w-3" />
                                      <span>Resolve</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conversation Detail */}
                <div className="xl:col-span-3 lg:col-span-2 h-full flex flex-col">
                  <ConversationDetail
                    conversation={selectedConversation}
                    userRole="admin"
                    onSendMessage={() => {
                      // Refresh conversations after sending message
                      loadConversations();
                    }}
                    onEscalate={() => {
                      // Refresh conversations after escalation
                      loadConversations();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "react-analytics" && (
          <div className="h-full overflow-auto px-6 py-4">
            <ReactAnalytics />
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assigningConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Conversation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Assign this conversation to yourself or another admin.
            </p>

            <div className="space-y-4">
              <button
                onClick={() =>
                  handleAssignConversation(
                    assigningConversation.id,
                    "current-admin-id"
                  )
                }
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Assign to Me
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => setAssigningConversation(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolvingConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resolve Conversation
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes
                </label>
                <textarea
                  value={resolutionData.notes}
                  onChange={(e) =>
                    setResolutionData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Describe how this issue was resolved..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Satisfaction (1-5)
                </label>
                <select
                  value={resolutionData.satisfaction}
                  onChange={(e) =>
                    setResolutionData((prev) => ({
                      ...prev,
                      satisfaction: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Very Poor</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setResolvingConversation(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveConversation}
                  disabled={!resolutionData.notes.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
