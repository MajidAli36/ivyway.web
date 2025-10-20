"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "@/app/providers/NotificationProvider";
import { teacherNotifications, mockTeacherNotifications } from "@/app/lib/api/teacherNotificationService";

export function useTeacherNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setError,
    clearError
  } = useNotifications();

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
    priority: "all"
  });

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // Filter notifications when filters change
  useEffect(() => {
    filterNotifications();
  }, [notifications, filters]);

  const loadNotifications = useCallback(async (params = {}) => {
    try {
      clearError();
      await fetchNotifications({
        ...params,
        role: "teacher"
      });
    } catch (error) {
      console.error("Error loading teacher notifications:", error);
      // Fallback to mock data for development
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock teacher notifications for development");
        // This would be handled by the NotificationProvider
      }
    }
  }, [fetchNotifications, clearError]);

  const filterNotifications = useCallback(() => {
    let filtered = [...notifications];

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(notification => 
        notification.type.startsWith(filters.type)
      );
    }

    // Status filter
    if (filters.status === "unread") {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (filters.status === "read") {
      filtered = filtered.filter(notification => notification.isRead);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.content.toLowerCase().includes(searchLower)
      );
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(notification => {
        const priority = getNotificationPriority(notification.type);
        return priority === filters.priority;
      });
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredNotifications(filtered);
  }, [notifications, filters]);

  const getNotificationPriority = (type) => {
    const highPriority = [
      'teacher_profile_approved',
      'teacher_profile_rejected',
      'student_referral_approved',
      'student_referral_rejected'
    ];
    
    const mediumPriority = [
      'teacher_assignment_approved',
      'teacher_assignment_rejected',
      'teacher_assignment_cancelled'
    ];
    
    if (highPriority.includes(type)) return 'high';
    if (mediumPriority.includes(type)) return 'medium';
    return 'low';
  };

  const getNotificationCategory = (type) => {
    if (type.startsWith('teacher_profile')) return 'profile';
    if (type.startsWith('student_referral')) return 'referral';
    if (type.startsWith('teacher_assignment')) return 'assignment';
    return 'general';
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      type: "all",
      status: "all",
      search: "",
      priority: "all"
    });
  }, []);

  const getNotificationsByCategory = useCallback((category) => {
    return filteredNotifications.filter(notification => 
      getNotificationCategory(notification.type) === category
    );
  }, [filteredNotifications]);

  const getNotificationsByPriority = useCallback((priority) => {
    return filteredNotifications.filter(notification => 
      getNotificationPriority(notification.type) === priority
    );
  }, [filteredNotifications]);

  const getUnreadCountByCategory = useCallback((category) => {
    return filteredNotifications.filter(notification => 
      getNotificationCategory(notification.type) === category && !notification.isRead
    ).length;
  }, [filteredNotifications]);

  const getUnreadCountByPriority = useCallback((priority) => {
    return filteredNotifications.filter(notification => 
      getNotificationPriority(notification.type) === priority && !notification.isRead
    ).length;
  }, [filteredNotifications]);

  // Statistics
  const stats = {
    total: filteredNotifications.length,
    unread: filteredNotifications.filter(n => !n.isRead).length,
    read: filteredNotifications.filter(n => n.isRead).length,
    byCategory: {
      profile: getUnreadCountByCategory('profile'),
      referral: getUnreadCountByCategory('referral'),
      assignment: getUnreadCountByCategory('assignment'),
      general: getUnreadCountByCategory('general')
    },
    byPriority: {
      high: getUnreadCountByPriority('high'),
      medium: getUnreadCountByPriority('medium'),
      low: getUnreadCountByPriority('low')
    }
  };

  return {
    // Data
    notifications: filteredNotifications,
    unreadCount,
    loading,
    error,
    filters,
    stats,

    // Actions
    loadNotifications,
    markAsRead,
    markAllAsRead,
    updateFilters,
    clearFilters,
    setError,
    clearError,

    // Filtered data
    getNotificationsByCategory,
    getNotificationsByPriority,

    // Helper functions
    getNotificationPriority,
    getNotificationCategory
  };
}
