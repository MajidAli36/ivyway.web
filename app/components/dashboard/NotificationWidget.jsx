"use client";

import React from "react";
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNotificationCount } from "@/app/providers/NotificationProvider";
import Link from "next/link";

export default function NotificationWidget({ 
  className = "", 
  showDetails = true, 
  maxNotifications = 3,
  href = "/notifications"
}) {
  const { unreadCount, loading, error } = useNotificationCount();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-800 text-sm">Failed to load notifications</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        <div className="relative">
          <BellIcon className="h-8 w-8 text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {unreadCount === 0 ? (
        <div className="text-center py-4">
          <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">You're all caught up!</p>
          <p className="text-gray-400 text-xs">No unread notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-gray-400">
              {unreadCount > maxNotifications ? `+${unreadCount - maxNotifications} more` : ''}
            </span>
          </div>
          
          {showDetails && (
            <div className="space-y-2">
              {/* Placeholder notification items */}
              {Array.from({ length: Math.min(unreadCount, maxNotifications) }).map((_, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      New notification {index + 1}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Click to view details
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href={href}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
        >
          View all notifications
          <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}

// Compact version for sidebars
export function CompactNotificationWidget({ className = "", href = "/notifications" }) {
  const { unreadCount, loading } = useNotificationCount();

  if (loading) {
    return (
      <div className={`p-3 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Notifications</span>
        {unreadCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {unreadCount}
          </span>
        )}
      </div>
      
      <Link 
        href={href}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {unreadCount === 0 ? 'View all' : 'View unread'}
      </Link>
    </div>
  );
}

// Mini version for headers
export function MiniNotificationWidget({ className = "", href = "/notifications" }) {
  const { unreadCount } = useNotificationCount();

  return (
    <Link href={href} className={`inline-flex items-center space-x-2 ${className}`}>
      <BellIcon className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
      {unreadCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
