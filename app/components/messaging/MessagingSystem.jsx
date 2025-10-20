"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  VideoCameraIcon,
  PaperClipIcon,
  EmojiHappyIcon,
} from "@heroicons/react/24/outline";

const MessagingSystem = ({ 
  conversationId, 
  currentUserId, 
  onSendMessage, 
  onTyping,
  onStopTyping 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mock data for messages
  const mockMessages = [
    {
      id: "msg_001",
      senderId: "tutor_001",
      senderName: "Dr. Sarah Johnson",
      content: "Hi Emma! I'm looking forward to working with you on calculus. How are you feeling about the material so far?",
      timestamp: "2024-01-15T10:30:00Z",
      type: "text",
      status: "delivered"
    },
    {
      id: "msg_002",
      senderId: "student_001",
      senderName: "Emma Davis",
      content: "Hi Dr. Johnson! I'm excited to work with you too. I'm feeling a bit overwhelmed with derivatives, but I'm ready to learn!",
      timestamp: "2024-01-15T10:32:00Z",
      type: "text",
      status: "delivered"
    },
    {
      id: "msg_003",
      senderId: "tutor_001",
      senderName: "Dr. Sarah Johnson",
      content: "That's completely normal! Derivatives can be tricky at first. We'll start with the basics and build up your confidence. I've prepared some practice problems for our first session.",
      timestamp: "2024-01-15T10:35:00Z",
      type: "text",
      status: "delivered"
    },
    {
      id: "msg_004",
      senderId: "student_001",
      senderName: "Emma Davis",
      content: "Thank you! That sounds great. I have a few questions about the homework from last week. Should I bring them to our session?",
      timestamp: "2024-01-15T10:37:00Z",
      type: "text",
      status: "delivered"
    },
    {
      id: "msg_005",
      senderId: "tutor_001",
      senderName: "Dr. Sarah Johnson",
      content: "Absolutely! Please bring all your questions. It's better to address them early rather than let confusion build up. I'll make sure we cover everything thoroughly.",
      timestamp: "2024-01-15T10:40:00Z",
      type: "text",
      status: "delivered"
    }
  ];

  useEffect(() => {
    // Simulate loading messages
    setIsLoading(true);
    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sending"
    };

    // Add message optimistically
    setMessages(prev => [...prev, messageData]);
    setNewMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: "delivered" }
            : msg
        )
      );

      // Call parent callback
      if (onSendMessage) {
        onSendMessage(messageData);
      }
    } catch (error) {
      // Update message status to failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: "failed" }
            : msg
        )
      );
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      if (onTyping) onTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (onStopTyping) onStopTyping();
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sending":
        return <ClockIcon className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCircleIcon className="h-3 w-3 text-gray-400" />;
      case "failed":
        return <ExclamationTriangleIcon className="h-3 w-3 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Dr. Sarah Johnson</h3>
            <p className="text-sm text-gray-500">
              {otherUserTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${
                    message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.senderId === currentUserId && (
                    <div className="ml-2">
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {otherUserTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex space-x-1 mr-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            Dr. Sarah Johnson is typing...
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <EmojiHappyIcon className="h-5 w-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagingSystem;
