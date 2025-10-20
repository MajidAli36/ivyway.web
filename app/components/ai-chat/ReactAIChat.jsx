"use client";

import { useState, useRef, useCallback } from "react";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  XMarkIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function ReactAIChat({ userRole = "student", className = "" }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  
  const inputRef = useRef(null);

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: currentMessage,
      senderType: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: "I understand your request. How can I help you further with your " + userRole + " needs?",
        senderType: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }, [currentMessage, isLoading, userRole]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Get user role specific welcome message
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "tutor":
        return {
          title: "Welcome to your AI Teaching Assistant",
          subtitle: "I can help you with student management, session planning, and teaching strategies.",
        };
      case "counselor":
        return {
          title: "Welcome to your AI Counseling Assistant",
          subtitle: "I can help you with student guidance, session scheduling, and counseling strategies.",
        };
      default:
        return {
          title: "Welcome to your AI Study Assistant",
          subtitle: "I can help you with studying, session booking, and academic support.",
        };
    }
  };

  const welcomeData = getWelcomeMessage();

  return (
    <div className={`h-full flex flex-col bg-white ${className}`}>
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">IvyWay AI Chat</h3>
              <p className="text-xs text-gray-500">Ready to assist</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                showReasoning
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <LightBulbIcon className="h-3 w-3 inline mr-1" />
              {showReasoning ? "Hide" : "Steps"}
            </button>

            <button
              onClick={clearChat}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {welcomeData.title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {welcomeData.subtitle}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="space-y-4">
            {message.senderType === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[80%] flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl rounded-br-md">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            )}

            {message.senderType === "ai" && (
              <div className="flex justify-start">
                <div className="max-w-[80%] flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <CpuChipIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <p className="text-sm leading-relaxed text-gray-800">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 pr-14 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 shadow-sm"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
                height: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-2.5 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                currentMessage.trim() && !isLoading
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-400"
              }`}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
