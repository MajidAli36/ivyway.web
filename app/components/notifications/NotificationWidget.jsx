"use client";

import { useState, useEffect } from "react";
import { 
  BellIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { useTeacherNotifications } from "@/app/hooks/useTeacherNotifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function NotificationWidget({ limit = 5 }) {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead,
    getNotificationsByCategory 
  } = useTeacherNotifications();

  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    setRecentNotifications(notifications.slice(0, limit));
  }, [notifications, limit]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "teacher_profile_approved":
      case "student_referral_approved":
      case "teacher_assignment_approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      
      case "teacher_profile_rejected":
      case "student_referral_rejected":
      case "teacher_assignment_rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      
      case "teacher_profile_created":
      case "student_referral_created":
      case "teacher_assignment_created":
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      
      case "teacher_assignment_updated":
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      
      case "teacher_assignment_cancelled":
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "teacher_profile_approved":
      case "student_referral_approved":
      case "teacher_assignment_approved":
        return "bg-green-50 border-green-200";
      
      case "teacher_profile_rejected":
      case "student_referral_rejected":
      case "teacher_assignment_rejected":
        return "bg-red-50 border-red-200";
      
      case "teacher_profile_created":
      case "student_referral_created":
      case "teacher_assignment_created":
        return "bg-blue-50 border-blue-200";
      
      case "teacher_assignment_updated":
        return "bg-blue-50 border-blue-200";
      
      case "teacher_assignment_cancelled":
        return "bg-orange-50 border-orange-200";
      
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatNotificationContent = (notification) => {
    let content = notification.content;
    
    if (notification.metadata) {
      Object.keys(notification.metadata).forEach(key => {
        const placeholder = `{${key}}`;
        if (content.includes(placeholder)) {
          content = content.replace(
            new RegExp(placeholder, 'g'), 
            notification.metadata[key] || ''
          );
        }
      });
    }
    
    return content;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
            <Link
              href="/teacher/notifications"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {recentNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <BellIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No recent notifications</p>
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {notification.title}
                  </p>
                  <p className={`text-xs ${
                    !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                  } mt-1`}>
                    {formatNotificationContent(notification)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > limit && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link
            href="/teacher/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-800"
          >
            View all {notifications.length} notifications
          </Link>
        </div>
      )}
    </div>
  );
}
