"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  PlusIcon,
  ChatBubbleOvalLeftIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import SupportChat from "./SupportChat";

export default function SupportBot({
  userRole = "student",
  className = "",
  position = "bottom-right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  const chatRef = useRef(null);

  // Debug log to verify component is rendering
  console.log("SupportBot rendered for userRole:", userRole);

  // Position classes for initial placement
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (isOpen) return; // Don't drag when chat is open

    setIsDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - 60; // 60px for button width
    const maxY = window.innerHeight - 60; // 60px for button height

    setDragPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Toggle chat window
  const toggleChat = () => {
    console.log("Toggle chat clicked, current state:", isOpen);
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  // Handle new message notification
  const handleNewMessage = () => {
    if (!isOpen) {
      setHasNewMessage(true);
    }
  };

  // Get dynamic position styles
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

  const getChatStyles = () => {
    if (isDragging || dragPosition.x !== 0 || dragPosition.y !== 0) {
      return {
        position: "fixed",
        left: `${dragPosition.x - 300}px`, // Position chat to the left of button
        top: `${dragPosition.y - 500}px`, // Position chat above button
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
          onClick={toggleChat}
          className={`relative bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          aria-label="Open Support Chat"
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-800">?</span>
          </div>

          {hasNewMessage && (
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className={`fixed z-50 ${
        !isDragging && dragPosition.x === 0 && dragPosition.y === 0
          ? positionClasses[position]
          : ""
      } ${className}`}
      style={getChatStyles()}
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-300" />
            <h3 className="font-semibold">Support Center</h3>
            <span className="px-2 py-1 bg-green-500 text-xs rounded-full">
              Online
            </span>
          </div>

          <button
            onClick={toggleChat}
            className="p-1 hover:bg-green-800 rounded transition-colors"
            aria-label="Close support chat"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <SupportChat
            userRole={userRole}
            className="h-full"
            onNewMessage={handleNewMessage}
          />
        </div>
      </div>
    </div>
  );
}
