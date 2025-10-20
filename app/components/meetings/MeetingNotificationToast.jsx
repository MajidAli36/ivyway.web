"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  VideoCameraIcon,
  BellIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { zoomService } from "../../lib/api/zoomService";

export default function MeetingNotificationToast({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    // Show notification with a slight delay for smooth animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = async () => {
    if (!notification.actions || notification.actions.length === 0) return;

    setIsActionLoading(true);
    try {
      const action = notification.actions[0];
      if (action.action) {
        await action.action();
      }
    } catch (error) {
      console.error("Error executing notification action:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "meeting_reminder":
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case "meeting_status":
        if (notification.data?.status === "started") {
          return <PlayIcon className="h-5 w-5 text-green-500" />;
        } else if (notification.data?.status === "ended") {
          return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
        } else if (notification.data?.status === "cancelled") {
          return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
        }
        return <VideoCameraIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case "meeting_reminder":
        return "border-l-blue-500 bg-blue-50";
      case "meeting_status":
        if (notification.data?.status === "started") {
          return "border-l-green-500 bg-green-50";
        } else if (notification.data?.status === "ended") {
          return "border-l-gray-500 bg-gray-50";
        } else if (notification.data?.status === "cancelled") {
          return "border-l-red-500 bg-red-50";
        }
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${getNotificationColor()} transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getNotificationIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            
            {/* Action Button */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={handleAction}
                  disabled={isActionLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  ) : (
                    <VideoCameraIcon className="h-3 w-3 mr-1" />
                  )}
                  {notification.actions[0].label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
