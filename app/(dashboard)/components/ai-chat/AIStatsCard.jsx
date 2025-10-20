"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  StarIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { aiChatService } from "../../../lib/api/aiChatService";

export default function AIStatsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("7d"); // 7d, 30d, 90d

  // Load stats
  useEffect(() => {
    loadStats();
  }, [timeframe]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await aiChatService.getStats(timeframe);

      if (response.success) {
        setStats(response);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format timeframe display
  const formatTimeframe = (tf) => {
    const displays = {
      "7d": "Last 7 Days",
      "30d": "Last 30 Days",
      "90d": "Last 90 Days",
    };
    return displays[tf] || tf;
  };

  // Get category display
  const getCategoryDisplay = (category) => {
    const categories = {
      booking: {
        label: "Booking",
        emoji: "📅",
        color: "bg-blue-100 text-blue-800",
      },
      payment: {
        label: "Payment",
        emoji: "💳",
        color: "bg-green-100 text-green-800",
      },
      technical: {
        label: "Technical",
        emoji: "🔧",
        color: "bg-yellow-100 text-yellow-800",
      },
      general: {
        label: "General",
        emoji: "💬",
        color: "bg-gray-100 text-gray-800",
      },
      account: {
        label: "Account",
        emoji: "👤",
        color: "bg-purple-100 text-purple-800",
      },
    };
    return (
      categories[category] || {
        label: category,
        emoji: "💬",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No statistics available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with timeframe selector */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                AI Assistant Statistics
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.conversations}
              </div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.messages}
              </div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.escalations}
              </div>
              <div className="text-sm text-gray-600">Escalations</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.averageResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolution & Satisfaction */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Resolution Rate
                </span>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {stats.resolutionRate}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Satisfaction Score
                </span>
              </div>
              <div className="text-lg font-semibold text-yellow-600">
                {stats.satisfactionScore}/5
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">
                  Escalation Rate
                </span>
              </div>
              <div className="text-lg font-semibold text-red-600">
                {stats.escalationRate}%
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  Avg Conversation Length
                </span>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {stats.averageConversationLength} msgs
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sentiment Analysis
          </h3>

          {stats.sentimentBreakdown && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaceSmileIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Positive
                  </span>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {stats.sentimentBreakdown.positive}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 rounded-full bg-gray-400"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Neutral
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  {stats.sentimentBreakdown.neutral}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaceFrownIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Negative
                  </span>
                </div>
                <div className="text-lg font-semibold text-red-600">
                  {stats.sentimentBreakdown.negative}
                </div>
              </div>

              {/* Sentiment visualization */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Sentiment Distribution</span>
                  <span>
                    {stats.sentimentBreakdown.positive +
                      stats.sentimentBreakdown.neutral +
                      stats.sentimentBreakdown.negative}{" "}
                    total
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  {(() => {
                    const total =
                      stats.sentimentBreakdown.positive +
                      stats.sentimentBreakdown.neutral +
                      stats.sentimentBreakdown.negative;
                    const positivePercent =
                      (stats.sentimentBreakdown.positive / total) * 100;
                    const neutralPercent =
                      (stats.sentimentBreakdown.neutral / total) * 100;
                    const negativePercent =
                      (stats.sentimentBreakdown.negative / total) * 100;

                    return (
                      <div className="flex h-full">
                        <div
                          className="bg-green-500"
                          style={{ width: `${positivePercent}%` }}
                        ></div>
                        <div
                          className="bg-gray-400"
                          style={{ width: `${neutralPercent}%` }}
                        ></div>
                        <div
                          className="bg-red-500"
                          style={{ width: `${negativePercent}%` }}
                        ></div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories Breakdown */}
      {stats.categoriesBreakdown && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Topics Discussed
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(stats.categoriesBreakdown).map(
              ([category, count]) => {
                const categoryDisplay = getCategoryDisplay(category);
                return (
                  <div key={category} className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${categoryDisplay.color} mb-2`}
                    >
                      <span className="mr-1">{categoryDisplay.emoji}</span>
                      {categoryDisplay.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {count}
                    </div>
                    <div className="text-xs text-gray-500">conversations</div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Peak Hours */}
      {stats.peakHours && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Peak Activity Hours
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.peakHours.map((peak, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {peak.hour}:00
                </div>
                <div className="text-sm text-gray-600">
                  {peak.count} conversations
                </div>
                <div className="text-xs text-gray-500">
                  {peak.hour < 12 ? "AM" : "PM"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Summary</h3>
            <p className="text-sm text-blue-700">
              Your AI assistant usage for{" "}
              {formatTimeframe(timeframe).toLowerCase()}
            </p>
          </div>
        </div>

        <div className="text-sm text-blue-800">
          You've had{" "}
          <span className="font-semibold">
            {stats.conversations} conversations
          </span>{" "}
          with our AI assistant, exchanging{" "}
          <span className="font-semibold">{stats.messages} messages</span>. The
          AI has been able to resolve issues {stats.resolutionRate}% of the
          time, with an average satisfaction score of {stats.satisfactionScore}
          /5. When needed, {stats.escalations} conversations were escalated to
          human support for additional help.
        </div>
      </div>
    </div>
  );
}
