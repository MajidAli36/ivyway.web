"use client";

import { useState, useEffect } from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { reactAIService } from "../../lib/api/reactAIService";

export default function ReactSessionHistory({
  onSelectSession,
  selectedSessionId,
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 20,
  });

  // Load sessions
  useEffect(() => {
    loadSessions();
  }, [filters]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reactAIService.getSessions(filters);

      if (response?.success && response?.data) {
        setSessions(response.data.sessions || []);
      } else {
        throw new Error(response?.message || "Failed to load sessions");
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      setError(error.message || "Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const displays = {
      completed: {
        icon: CheckCircleIcon,
        color: "text-green-600 bg-green-50 border-green-200",
        label: "Completed",
      },
      failed: {
        icon: ExclamationTriangleIcon,
        color: "text-red-600 bg-red-50 border-red-200",
        label: "Failed",
      },
      active: {
        icon: ClockIcon,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        label: "Active",
      },
    };
    return displays[status] || displays.completed;
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Format message preview
  const formatMessagePreview = (message) => {
    if (!message) return "No message";
    if (message.length <= 60) return message;
    return message.substring(0, 60) + "...";
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center space-x-2 min-w-0">
            <SparklesIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 flex-shrink-0" />
            <span className="truncate">ReAct Sessions</span>
          </h2>
          <button
            onClick={loadSessions}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title="Refresh sessions"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-3">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-2 lg:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {error ? (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="h-8 w-8 lg:h-12 lg:w-12 mx-auto text-red-500 mb-3 lg:mb-4" />
            <p className="text-red-600 mb-3 lg:mb-4 text-sm lg:text-base">
              {error}
            </p>
            <button
              onClick={loadSessions}
              className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <SparklesIcon className="h-8 w-8 lg:h-12 lg:w-12 mx-auto text-gray-400 mb-3 lg:mb-4" />
            <p className="text-gray-500 text-sm lg:text-base">
              No ReAct sessions found
            </p>
            <p className="text-xs lg:text-sm text-gray-400 mt-1">
              Start a conversation to see your reasoning history
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => {
              const statusDisplay = getStatusDisplay(session.status);
              const isSelected = session.id === selectedSessionId;

              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`p-3 lg:p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-r-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Session Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}
                      >
                        <statusDisplay.icon className="h-3 w-3 mr-1" />
                        {statusDisplay.label}
                      </span>

                      <span className="text-xs text-gray-500">
                        {session.totalSteps || 0} steps
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {reactAIService.formatTimestamp(session.createdAt)}
                    </span>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {formatMessagePreview(session.userMessage)}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {formatMessagePreview(session.finalResponse)}
                    </p>
                  </div>

                  {/* Session Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {session.executionTime && (
                        <span className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>
                            {reactAIService.formatExecutionTime(
                              session.executionTime
                            )}
                          </span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSession(session);
                      }}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="h-3 w-3" />
                      <span>View</span>
                    </button>
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
