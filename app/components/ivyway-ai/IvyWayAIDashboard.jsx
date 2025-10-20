"use client";

import React, { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  DocumentArrowUpIcon,
  ClockIcon,
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import ivywayAIService from "../../lib/api/ivywayAIService";

const IvyWayAIDashboard = ({ userId, className = "", onBack, onStartChat }) => {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // For demo purposes, skip backend calls and show mock data
    if (process.env.NODE_ENV === "development") {
      setConnectionStatus("connected");
      setLoading(false);
      // Set mock data
      setDocuments([
        {
          id: 1,
          filename: "sample-document.pdf",
          size: 1024000,
          status: "processed",
          uploadedAt: new Date().toISOString(),
        },
      ]);
      setConversations([
        {
          id: 1,
          message: "Hello, can you help me with math?",
          timestamp: new Date().toISOString(),
        },
      ]);
      setStats({
        users_count: 150,
        tutors_count: 25,
        subjects_count: 12,
        recent_bookings: 8,
      });
    } else {
      checkConnection(false); // Silent connection check
      loadInitialData();
    }
  }, [userId]);

  const checkConnection = async (showToast = false) => {
    try {
      const response = await ivywayAIService.testConnection();

      if (response.status === "connected" || response.success) {
        setConnectionStatus("connected");
        if (showToast) {
          toast.success("Connected to IvyWay AI!");
        }
      } else {
        setConnectionStatus("partial");
        if (showToast) {
          toast.warning("Partial connection to IvyWay AI");
        }
      }
    } catch (error) {
      setConnectionStatus("disconnected");
      if (showToast) {
        toast.error("Failed to connect to IvyWay AI");
      }
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load documents
      try {
        const docsResponse = await ivywayAIService.getDocuments();
        if (docsResponse.success) {
          setDocuments(docsResponse.documents || []);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      }

      // Load conversations
      try {
        const convResponse = await ivywayAIService.getConversationHistory(
          userId,
          5
        );
        if (convResponse.success) {
          setConversations(convResponse.conversations || []);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }

      // Load analytics
      try {
        const analyticsResponse = await ivywayAIService.getAnalytics("7d");
        if (analyticsResponse.success) {
          setStats(analyticsResponse.analytics || {});
        }
      } catch (error) {
        console.error("Failed to load analytics:", error);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "partial":
        return "text-yellow-600 bg-yellow-100";
      case "disconnected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircleIcon className="w-5 h-5" />;
      case "partial":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case "disconnected":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "partial":
        return "Partial Connection";
      case "disconnected":
        return "Disconnected";
      default:
        return "Checking...";
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        )}
        <div className="flex-1"></div>
      </div>

      {/* Main Header */}
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
          <AcademicCapIcon className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          IvyWay AI Tutor
        </h1>
        <p className="text-lg text-gray-600">
          Your intelligent learning companion powered by AI
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            🚀 Demo Mode - Backend Integration Ready
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="ml-2">{getStatusText()}</span>
          </span>
        </div>

        {connectionStatus === "disconnected" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <span className="font-medium">
                IvyWay AI service is currently unavailable
              </span>
            </div>
            <p className="mt-2 text-sm text-red-700">
              Please check your connection and try again later.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={onStartChat}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start Chat
          </h3>
          <p className="text-sm text-gray-600">
            Ask questions and get AI-powered tutoring
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-4">
            <DocumentArrowUpIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Documents
          </h3>
          <p className="text-sm text-gray-600">Share PDFs for AI analysis</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg mb-4">
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chat History
          </h3>
          <p className="text-sm text-gray-600">Review past conversations</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mb-4">
            <ChartBarIcon className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics
          </h3>
          <p className="text-sm text-gray-600">Track your learning progress</p>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.users_count || 0}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.tutors_count || 0}
              </div>
              <div className="text-sm text-gray-600">Available Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stats.subjects_count || 0}
              </div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {stats.recent_bookings || 0}
              </div>
              <div className="text-sm text-gray-600">Recent Sessions</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Documents
          </h2>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentArrowUpIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      doc.status === "processed"
                        ? "text-green-600 bg-green-100"
                        : doc.status === "processing"
                        ? "text-yellow-600 bg-yellow-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No documents uploaded yet
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Conversations
          </h2>
          {conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conv.message?.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conv.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <LightBulbIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Getting Started with IvyWay AI
            </h3>
            <p className="text-gray-700 mb-4">
              Ready to enhance your learning experience? Here's how to get
              started:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Start a conversation with the AI tutor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Upload your study materials as PDFs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Ask questions about any subject</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Track your learning progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IvyWayAIDashboard;
