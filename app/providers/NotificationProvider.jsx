"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { notifications } from "../lib/api/endpoints";
import { useSocket } from "./SocketProvider";

// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_UNREAD_COUNT: "SET_UNREAD_COUNT",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  MARK_AS_READ: "MARK_AS_READ",
  MARK_ALL_AS_READ: "MARK_ALL_AS_READ",
  CLEAR_ERROR: "CLEAR_ERROR",
  INCREMENT_COUNT: "INCREMENT_COUNT",
  DECREMENT_COUNT: "DECREMENT_COUNT",
};

// Initial state
const initialState = {
  unreadCount: 0,
  notifications: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.SET_UNREAD_COUNT:
      return { 
        ...state, 
        unreadCount: action.payload,
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.SET_NOTIFICATIONS:
      return { 
        ...state, 
        notifications: action.payload.notifications || [],
        unreadCount: action.payload.unreadCount || 0,
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0,
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.INCREMENT_COUNT:
      return {
        ...state,
        unreadCount: state.unreadCount + 1,
        lastUpdated: new Date().toISOString()
      };
    
    case actionTypes.DECREMENT_COUNT:
      return {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1),
        lastUpdated: new Date().toISOString()
      };
    
    default:
      return state;
  }
}

// Create context
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { socket, connected } = useSocket();

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  }, []);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notifications.getUnreadCount();
      
      if (response.success) {
        dispatch({ type: actionTypes.SET_UNREAD_COUNT, payload: response.data.count });
      } else {
        throw new Error(response.message || "Failed to fetch unread count");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Fetch notifications with count
  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await notifications.getAll(params);
      
      if (response.success) {
        dispatch({ 
          type: actionTypes.SET_NOTIFICATIONS, 
          payload: {
            notifications: response.data.notifications || [],
            unreadCount: response.data.unreadCount || 0
          }
        });
      } else {
        throw new Error(response.message || "Failed to fetch notifications");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const response = await notifications.markAsRead(id);
      
      if (response.success) {
        dispatch({ type: actionTypes.MARK_AS_READ, payload: id });
      } else {
        throw new Error(response.message || "Failed to mark notification as read");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }, [setError]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notifications.markAllAsRead();
      
      if (response.success) {
        dispatch({ type: actionTypes.MARK_ALL_AS_READ });
      } else {
        throw new Error(response.message || "Failed to mark all notifications as read");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error marking all notifications as read:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Real-time notification handling
  useEffect(() => {
    if (!socket || !connected) return;

    // Listen for new notifications
    const handleNewNotification = (data) => {
      console.log("New notification received:", data);
      dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: data });
    };

    // Listen for notification updates
    const handleNotificationUpdate = (data) => {
      console.log("Notification updated:", data);
      if (data.isRead) {
        dispatch({ type: actionTypes.DECREMENT_COUNT });
      }
    };

    // Listen for notification deletion
    const handleNotificationDelete = (data) => {
      console.log("Notification deleted:", data);
      // Refresh notifications to get updated state
      fetchNotifications();
    };

    // Socket event listeners
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:updated", handleNotificationUpdate);
    socket.on("notification:deleted", handleNotificationDelete);

    // Cleanup
    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:updated", handleNotificationUpdate);
      socket.off("notification:deleted", handleNotificationDelete);
    };
  }, [socket, connected, fetchNotifications]);

  // Initial fetch of unread count
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Refresh count when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchUnreadCount]);

  // Refresh count every 30 seconds when tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const value = {
    ...state,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setError,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// Hook for just the unread count (lighter weight)
export function useNotificationCount() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationCount must be used within a NotificationProvider");
  }
  return {
    unreadCount: context.unreadCount,
    fetchUnreadCount: context.fetchUnreadCount,
    loading: context.loading,
    error: context.error,
  };
}
