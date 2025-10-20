"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "@/app/providers/NotificationProvider";

export default function TutorNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_created":
        return <CalendarIcon className="h-6 w-6 text-blue-500" />;
      case "booking_confirmed":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "booking_cancelled":
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case "message_received":
        return <ChatBubbleLeftIcon className="h-6 w-6 text-green-500" />;
      case "system_notification":
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case "profile_reminder":
        return <InformationCircleIcon className="h-6 w-6 text-yellow-500" />;
      case "profile_complete":
        return <CheckCircleIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (filter === "all") return true;
        return notification.type === filter;
      })
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53] flex items-center">
            <BellIcon className="h-8 w-8 mr-2 text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-[#4b5563] mt-1">
            Stay updated with your tutoring journey
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex space-x-2">
          {[
            "all",
            "booking_created",
            "booking_confirmed",
            "booking_cancelled",
            "message_received",
            "system_notification",
            "profile_reminder",
          ].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === filterType
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterType
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {!notification.isRead && (
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
