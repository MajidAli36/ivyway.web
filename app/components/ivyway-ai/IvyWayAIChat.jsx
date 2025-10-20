"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import ivywayAIService from "../../lib/api/ivywayAIService";

const IvyWayAIChat = ({ userId, onClose, onBack, className = "" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // For demo purposes, skip backend calls and show mock data
    if (process.env.NODE_ENV === "development") {
      setConnectionStatus("connected");
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your IvyWay AI tutor. How can I help you today?",
          isAI: true,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
      ]);
    } else {
      checkConnection(false); // Silent connection check
      loadConversationHistory();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const loadConversationHistory = async () => {
    try {
      const response = await ivywayAIService.getConversationHistory(userId, 20);
      if (response.success && response.conversations?.length > 0) {
        setMessages(
          response.conversations.map((conv) => ({
            id: conv.id,
            text: conv.message,
            isAI: false,
            timestamp: conv.timestamp,
          }))
        );
        setConversationId(response.conversations[0]?.conversation_id);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isAI: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Demo mode - simulate AI response
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: `I understand you're asking about "${inputMessage}". This is a demo response. In production, I would connect to your Python IvyWay AI backend and provide a real AI-powered answer based on your question and any uploaded documents.`,
          isAI: true,
          timestamp: new Date().toISOString(),
          context: "demo",
          processingTime: 1500,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
        toast.success("Demo response received! (Python backend ready)");
      }, 1500);
      return;
    }

    // Production mode - real API call to Python backend
    try {
      const response = await ivywayAIService.sendChatMessage(
        inputMessage,
        userId,
        "general",
        conversationId
      );

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text:
            response.response ||
            response.message ||
            "I understand your question. Let me help you with that.",
          isAI: true,
          timestamp: new Date().toISOString(),
          context: response.context_used,
          processingTime: response.processing_time,
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (!conversationId) {
          setConversationId(response.conversation_id);
        }

        toast.success("AI response received from Python backend!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to get AI response");

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        isAI: true,
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setIsLoading(true);
      const response = await ivywayAIService.uploadDocument(file, userId);

      if (response.success) {
        toast.success("Document uploaded successfully!");

        const uploadMessage = {
          id: Date.now(),
          text: `📄 Document uploaded: ${response.filename || file.name}`,
          isAI: false,
          timestamp: new Date().toISOString(),
          isDocument: true,
          documentId: response.document_id,
        };

        setMessages((prev) => [...prev, uploadMessage]);
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    toast.success("Chat cleared");
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600";
      case "partial":
        return "text-yellow-600";
      case "disconnected":
        return "text-red-600";
      default:
        return "text-gray-600";
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

  return (
    <div
      className={`flex flex-col h-full bg-white rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors mr-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                IvyWay AI Tutor
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor().replace(
                    "text-",
                    "bg-"
                  )}`}
                ></div>
                <span className={`text-sm ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
                {process.env.NODE_ENV === "development" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Demo - Python Backend Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Upload PDF"
            >
              <DocumentArrowUpIcon className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to IvyWay AI!
            </h3>
            <p className="text-gray-600">
              Ask me anything about your studies, upload documents, or start a
              conversation.
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🐍 <strong>Python Backend Ready:</strong> This chat will
                  connect to your IvyWay AI Python backend when deployed.
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.isAI
                  ? "bg-gray-100 text-gray-900"
                  : "bg-blue-600 text-white"
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              {message.isDocument ? (
                <div className="flex items-center space-x-2">
                  <DocumentArrowUpIcon className="w-5 h-5" />
                  <span className="text-sm">{message.text}</span>
                </div>
              ) : (
                <div>
                  <p className="text-sm leading-relaxed">{message.text}</p>

                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      message.isAI ? "text-gray-500" : "text-blue-200"
                    }`}
                  >
                    <span>{formatTimestamp(message.timestamp)}</span>

                    {message.isAI && message.context && (
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        Context: {message.context}
                      </span>
                    )}

                    {message.isAI && message.processingTime && (
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                        {message.processingTime}ms
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your studies..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-4 h-4" />
                <span>Send</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default IvyWayAIChat;
