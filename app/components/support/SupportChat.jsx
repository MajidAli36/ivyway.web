"use client";

import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  PlusIcon,
  ClockIcon,
  ChatBubbleOvalLeftIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

// Dummy data for support chats
const DUMMY_CHATS = [
  {
    id: 1,
    title: "Payment Issue",
    lastMessage: "Thank you for your help!",
    timestamp: "2024-01-15T10:30:00Z",
    status: "resolved",
    messages: [
      {
        id: 1,
        text: "Hi, I'm having trouble with my payment. It keeps getting declined.",
        isUser: true,
        timestamp: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        text: "Hello! I'm sorry to hear about the payment issue. Let me help you with that. Can you please check if your card details are correct?",
        isUser: false,
        timestamp: "2024-01-15T10:01:00Z",
        isSupport: true,
      },
      {
        id: 3,
        text: "I've checked and they seem correct. The error says 'insufficient funds' but I know I have money in my account.",
        isUser: true,
        timestamp: "2024-01-15T10:15:00Z",
      },
      {
        id: 4,
        text: "That's a common issue. Sometimes banks put holds on certain transactions. Try using a different payment method or contact your bank to ensure the card is active for online purchases.",
        isUser: false,
        timestamp: "2024-01-15T10:16:00Z",
        isSupport: true,
      },
      {
        id: 5,
        text: "Thank you for your help!",
        isUser: true,
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: 2,
    title: "Session Booking",
    lastMessage: "Great, I'll book that session now.",
    timestamp: "2024-01-14T15:45:00Z",
    status: "resolved",
    messages: [
      {
        id: 1,
        text: "How do I book a session with a tutor?",
        isUser: true,
        timestamp: "2024-01-14T15:30:00Z",
      },
      {
        id: 2,
        text: "To book a session, go to the 'Find Tutor' section, select your subject, choose a tutor, and pick an available time slot. The system will guide you through the booking process.",
        isUser: false,
        timestamp: "2024-01-14T15:31:00Z",
        isSupport: true,
      },
      {
        id: 3,
        text: "Great, I'll book that session now.",
        isUser: true,
        timestamp: "2024-01-14T15:45:00Z",
      },
    ],
  },
  {
    id: 3,
    title: "Technical Support",
    lastMessage: "The issue is resolved now, thanks!",
    timestamp: "2024-01-13T09:20:00Z",
    status: "resolved",
    messages: [
      {
        id: 1,
        text: "I can't access my dashboard. It keeps showing an error.",
        isUser: true,
        timestamp: "2024-01-13T09:00:00Z",
      },
      {
        id: 2,
        text: "I'm sorry to hear about the access issue. Let's troubleshoot this step by step. First, try clearing your browser cache and cookies, then refresh the page.",
        isUser: false,
        timestamp: "2024-01-13T09:01:00Z",
        isSupport: true,
      },
      {
        id: 3,
        text: "I tried that but it's still not working.",
        isUser: true,
        timestamp: "2024-01-13T09:10:00Z",
      },
      {
        id: 4,
        text: "Let me check your account status. It looks like there might be a temporary server issue. I've reset your session. Please try logging in again now.",
        isUser: false,
        timestamp: "2024-01-13T09:11:00Z",
        isSupport: true,
      },
      {
        id: 5,
        text: "The issue is resolved now, thanks!",
        isUser: true,
        timestamp: "2024-01-13T09:20:00Z",
      },
    ],
  },
  {
    id: 4,
    title: "Account Questions",
    lastMessage: "Perfect, that answers my question.",
    timestamp: "2024-01-12T14:15:00Z",
    status: "resolved",
    messages: [
      {
        id: 1,
        text: "How do I update my profile information?",
        isUser: true,
        timestamp: "2024-01-12T14:00:00Z",
      },
      {
        id: 2,
        text: "You can update your profile by going to the Profile section in your dashboard. Click on 'Edit Profile' and make the necessary changes. Don't forget to save your changes!",
        isUser: false,
        timestamp: "2024-01-12T14:01:00Z",
        isSupport: true,
      },
      {
        id: 3,
        text: "Perfect, that answers my question.",
        isUser: true,
        timestamp: "2024-01-12T14:15:00Z",
      },
    ],
  },
];

const DUMMY_FAQS = [
  {
    id: 1,
    question: "How do I book a tutoring session?",
    answer:
      "Go to the 'Find Tutor' section, select your subject, choose a tutor, and pick an available time slot.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers.",
  },
  {
    id: 3,
    question: "Can I reschedule a session?",
    answer:
      "Yes, you can reschedule sessions up to 24 hours before the scheduled time.",
  },
  {
    id: 4,
    question: "How do I contact my tutor?",
    answer:
      "You can message your tutor through the Messages section in your dashboard.",
  },
  {
    id: 5,
    question: "What if I need to cancel a session?",
    answer:
      "You can cancel sessions up to 24 hours before for a full refund, or 2 hours before for a 50% refund.",
  },
];

export default function SupportChat({
  userRole = "student",
  className = "",
  onNewMessage,
}) {
  const [activeView, setActiveView] = useState("chat"); // 'chat', 'history', 'faq'
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    if (selectedChat) {
      // Add to existing chat
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        lastMessage: inputMessage,
        timestamp: new Date().toISOString(),
      };
      setSelectedChat(updatedChat);
    } else {
      // Create new chat
      const newChat = {
        id: Date.now(),
        title:
          inputMessage.length > 30
            ? inputMessage.substring(0, 30) + "..."
            : inputMessage,
        lastMessage: inputMessage,
        timestamp: new Date().toISOString(),
        status: "active",
        messages: [newMessage],
      };
      setSelectedChat(newChat);
    }

    setInputMessage("");
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message! Our support team will get back to you shortly. In the meantime, feel free to check our FAQ section for quick answers to common questions.",
        isUser: false,
        timestamp: new Date().toISOString(),
        isSupport: true,
      };

      if (selectedChat) {
        const updatedChat = {
          ...selectedChat,
          messages: [...selectedChat.messages, supportResponse],
          lastMessage: supportResponse.text,
          timestamp: new Date().toISOString(),
        };
        setSelectedChat(updatedChat);
      } else {
        const newChat = {
          id: Date.now(),
          title: "New Support Request",
          lastMessage: supportResponse.text,
          timestamp: new Date().toISOString(),
          status: "active",
          messages: [newMessage, supportResponse],
        };
        setSelectedChat(newChat);
      }

      setIsTyping(false);
      if (onNewMessage) onNewMessage();
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveView("chat")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeView === "chat"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ChatBubbleOvalLeftIcon className="h-4 w-4 inline mr-1" />
          Chat
        </button>
        <button
          onClick={() => setActiveView("history")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeView === "history"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <ClockIcon className="h-4 w-4 inline mr-1" />
          History
        </button>
        <button
          onClick={() => setActiveView("faq")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeView === "faq"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <UserGroupIcon className="h-4 w-4 inline mr-1" />
          FAQ
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "chat" && (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat ? (
                selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser
                          ? "bg-blue-600 text-white"
                          : message.isSupport
                          ? "bg-green-100 text-gray-800 border border-green-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <QuestionMarkCircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start a new conversation with our support team!</p>
                  <p className="text-sm mt-2">
                    We're here to help you with any questions or issues.
                  </p>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
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

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === "history" && (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Previous Chats
                </h3>
                <button
                  onClick={() => {
                    setActiveView("chat");
                    setSelectedChat(null);
                  }}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New Chat
                </button>
              </div>

              <div className="space-y-3">
                {DUMMY_CHATS.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setActiveView("chat");
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">
                        {chat.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          chat.status
                        )}`}
                      >
                        {chat.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(chat.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === "faq" && (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {DUMMY_FAQS.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-800 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
