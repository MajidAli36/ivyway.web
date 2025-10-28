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

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
        return <CalendarIcon className="h-6 w-6 text-blue-500" />;
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
          </h1>
          <p className="text-[#4b5563] mt-1">
            Stay updated with your learning journey
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex space-x-2">
          {[
            "all",
            "booking_confirmed",
            "message_received",
            "system_notification",
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
                className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
