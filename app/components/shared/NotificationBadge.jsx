"use client";

import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotificationCount } from "@/app/providers/NotificationProvider";
import Link from "next/link";

export default function NotificationBadge({ 
  className = "", 
  showCount = true, 
  size = "default",
  href = "/notifications",
  onClick,
  showLoading = false 
}) {
  const { unreadCount, loading, error } = useNotificationCount();

  // Size variants
  const sizeClasses = {
    small: "h-8 w-8",
    default: "h-10 w-10",
    large: "h-12 w-12"
  };

  const iconSizes = {
    small: "h-5 w-5",
    default: "h-6 w-6",
    large: "h-7 w-7"
  };

  const badgeSizes = {
    small: "h-4 w-4 text-xs",
    default: "h-5 w-5 text-xs",
    large: "h-6 w-6 text-sm"
  };

  // Don't show badge if count is 0 and showCount is true
  const shouldShowBadge = showCount && unreadCount > 0;

  // Handle click
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Loading state
  if (showLoading && loading) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-gray-100 animate-pulse ${sizeClasses[size]} ${className}`}>
        <BellIcon className={`text-gray-400 ${iconSizes[size]}`} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full bg-red-100 ${sizeClasses[size]} ${className}`}>
        <BellIcon className={`text-red-400 ${iconSizes[size]}`} />
        <span className="sr-only">Error loading notifications</span>
      </div>
    );
  }

  const badgeContent = (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-white hover:bg-gray-50 transition-colors duration-200 ${sizeClasses[size]} ${className}`}>
      <BellIcon className={`text-gray-600 hover:text-blue-600 transition-colors duration-200 ${iconSizes[size]}`} />
      
      {/* Notification count badge */}
      {shouldShowBadge && (
        <span className={`
          absolute -top-1 -right-1 
          flex items-center justify-center 
          rounded-full bg-red-500 text-white font-medium
          ${badgeSizes[size]}
          animate-pulse
        `}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      
      {/* Unread indicator dot (when count is 0 but there might be unread) */}
      {!shouldShowBadge && unreadCount === 0 && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300" />
      )}
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} onClick={handleClick}>
        {badgeContent}
      </Link>
    );
  }

  // If onClick is provided, make it a button
  if (onClick) {
    return (
      <button 
        onClick={handleClick}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
        aria-label={`${unreadCount} unread notifications`}
      >
        {badgeContent}
      </button>
    );
  }

  // Otherwise, just return the badge
  return badgeContent;
}

// Variant components for different use cases
export function HeaderNotificationBadge() {
  return <NotificationBadge size="default" className="text-gray-600 hover:text-blue-600" />;
}

export function SidebarNotificationBadge() {
  return <NotificationBadge size="small" className="text-gray-500" />;
}

export function MobileNotificationBadge() {
  return <NotificationBadge size="large" className="text-gray-700" />;
}

export function DashboardNotificationBadge() {
  return <NotificationBadge size="default" className="text-gray-600" />;
}
