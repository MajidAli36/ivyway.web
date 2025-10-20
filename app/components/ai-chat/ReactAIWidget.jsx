"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  LightBulbIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

export default function ReactAIWidget({
  userRole = "student",
  className = "",
  position = "bottom-right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const buttonRef = useRef(null);
  const widgetRef = useRef(null);
  const inputRef = useRef(null);
  const dragStartTime = useRef(0);

  // Sample data
  const [supportTickets, setSupportTickets] = useState([
    { id: 1, title: "Login Issues", status: "open", priority: "high", date: "2024-01-15" },
    { id: 2, title: "Feature Request", status: "in-progress", priority: "medium", date: "2024-01-14" },
    { id: 3, title: "Bug Report", status: "resolved", priority: "low", date: "2024-01-13" },
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project documentation", status: "pending", dueDate: "2024-01-20" },
    { id: 2, title: "Review code changes", status: "in-progress", dueDate: "2024-01-18" },
    { id: 3, title: "Update user guide", status: "completed", dueDate: "2024-01-16" },
  ]);

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  // Tab configuration
  const tabs = [
    { id: "chat", label: "Chat", icon: ChatBubbleLeftRightIcon, color: "blue" },
    { id: "support", label: "Support", icon: UserGroupIcon, color: "green" },
    { id: "task", label: "Tasks", icon: ClipboardDocumentListIcon, color: "purple" },
    { id: "help", label: "Help", icon: QuestionMarkCircleIcon, color: "orange" },
  ];

  // Optimized drag functionality
  const handleMouseDown = useCallback((e) => {
    dragStartTime.current = Date.now();
    setIsDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    setDragPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle click vs drag
  const handleButtonClick = useCallback((e) => {
    const dragDuration = Date.now() - dragStartTime.current;
    // Only toggle if it was a quick click (not a drag)
    if (dragDuration < 200 && !isDragging) {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    }
  }, [isOpen, isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
        content: "I understand your request. How can I help you further?",
        senderType: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }, [currentMessage, isLoading]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getButtonStyles = () => {
    if (isDragging || dragPosition.x !== 0 || dragPosition.y !== 0) {
      return {
        position: "fixed",
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        transform: "none",
      };
    }
    return {};
  };

  const getWidgetStyles = () => {
    if (isDragging || dragPosition.x !== 0 || dragPosition.y !== 0) {
      const isMobile = window.innerWidth < 640;
      const offsetX = isMobile ? Math.min(350, window.innerWidth - 50) : 350;
      const offsetY = isMobile ? Math.min(600, window.innerHeight - 100) : 600;
      
      return {
        position: "fixed",
        left: `${Math.max(10, dragPosition.x - offsetX)}px`,
        top: `${Math.max(10, dragPosition.y - offsetY)}px`,
        transform: "none",
      };
    }
    return {};
  };

  if (!isOpen) {
    return (
      <div
        ref={buttonRef}
        className={`fixed z-50 ${
          !isDragging && dragPosition.x === 0 && dragPosition.y === 0
            ? positionClasses[position]
            : ""
        } ${className}`}
        style={getButtonStyles()}
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={handleButtonClick}
          className={`relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          aria-label="Open IvyWay AI Agent"
        >
          <LightBulbIcon className="h-6 w-6" />
          <SparklesIcon className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
          {hasNewMessage && (
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed z-50 ${
        !isDragging && dragPosition.x === 0 && dragPosition.y === 0
          ? positionClasses[position]
          : ""
      } ${className}`}
      style={getWidgetStyles()}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[90vw] max-w-[420px] h-[80vh] max-h-[700px] min-h-[500px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm sm:text-base truncate">IvyWay AI Agent</h3>
              <p className="text-xs text-blue-100 truncate">Professional Support Agent</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* {activeTab === "chat" && (
              <button
                onClick={clearChat}
                className="px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 bg-white/20 text-white hover:bg-white/30 hidden sm:flex items-center"
                title="Clear chat"
              >
                <LightBulbIcon className="h-3 w-3 mr-1" />
                <span className="hidden md:inline">Steps</span>
              </button>
            )}  */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `bg-white text-${tab.color}-600 border-b-2 border-${tab.color}-600`
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col bg-white">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 sm:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 sm:py-12 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <SparklesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Welcome to IvyWay AI Agent
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                      I can help you with questions, tasks, and support. How can I assist you today?
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
              <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-3 flex-shrink-0">
                <div className="flex items-end space-x-2 sm:space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 sm:pr-14 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 shadow-sm"
                      rows={1}
                      style={{
                        minHeight: "44px",
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
                      className={`absolute right-2 bottom-2 p-2 sm:p-2.5 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        currentMessage.trim() && !isLoading
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          : "bg-gray-400"
                      }`}
                    >
                      <PaperAirplaneIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="h-full flex flex-col">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Support Tickets</h4>
                  <button className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">New Ticket</span>
                    <span className="sm:hidden">New</span>
                  </button>
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{ticket.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority} priority
                      </span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "task" && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">My Tasks</h4>
                  <button className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Task</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'pending').length}</div>
                    <div className="text-xs text-blue-600">Pending</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2">
                    <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
                    <div className="text-xs text-yellow-600">In Progress</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</div>
                    <div className="text-xs text-green-600">Completed</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{task.title}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Due: {task.dueDate}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        {task.status === 'completed' ? 'Reopen' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "help" && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Help Center</h4>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors cursor-pointer">
                    <BookOpenIcon className="h-8 w-8 text-orange-600 mb-2" />
                    <h5 className="font-medium text-gray-900">Documentation</h5>
                    <p className="text-xs text-gray-600">User guides and API docs</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors cursor-pointer">
                    <VideoCameraIcon className="h-8 w-8 text-blue-600 mb-2" />
                    <h5 className="font-medium text-gray-900">Tutorials</h5>
                    <p className="text-xs text-gray-600">Video tutorials and demos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors cursor-pointer">
                    <QuestionMarkCircleIcon className="h-8 w-8 text-green-600 mb-2" />
                    <h5 className="font-medium text-gray-900">FAQ</h5>
                    <p className="text-xs text-gray-600">Frequently asked questions</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors cursor-pointer">
                    <DocumentTextIcon className="h-8 w-8 text-purple-600 mb-2" />
                    <h5 className="font-medium text-gray-900">Resources</h5>
                    <p className="text-xs text-gray-600">Additional resources</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Quick Links</h5>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="block text-blue-600 hover:text-blue-800">Getting Started Guide</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800">API Reference</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800">Troubleshooting</a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800">Contact Support</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}