"use client";

import { createContext, useContext, useState, useCallback } from "react";
import MeetingNotificationToast from "./MeetingNotificationToast";

const MeetingNotificationContext = createContext();

export function useMeetingNotifications() {
  const context = useContext(MeetingNotificationContext);
  if (!context) {
    throw new Error("useMeetingNotifications must be used within a MeetingNotificationProvider");
  }
  return context;
}

export default function MeetingNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 10000);

    return newNotification;
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };

  return (
    <MeetingNotificationContext.Provider value={value}>
      {children}
      
      {/* Render notification toasts */}
      {notifications.map((notification) => (
        <MeetingNotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </MeetingNotificationContext.Provider>
  );
}
