"use client";

import { useState } from "react";
import { useTeacherNotifications } from "@/app/hooks/useTeacherNotifications";
import { mockTeacherNotifications } from "@/app/lib/api/teacherNotificationService";

export default function NotificationTest() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    loadNotifications 
  } = useTeacherNotifications();

  const [showMockData, setShowMockData] = useState(false);

  const handleLoadMockData = () => {
    // This would typically be handled by the NotificationProvider
    // For testing purposes, we'll simulate loading mock data
    setShowMockData(true);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      console.log(`Marked notification ${id} as read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      console.log("Marked all notifications as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const testNotifications = showMockData ? mockTeacherNotifications : notifications;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Notification System Test
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleLoadMockData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load Mock Data
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Mark All Read
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Total Notifications</h3>
              <p className="text-2xl font-bold text-blue-600">
                {testNotifications.length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-red-900">Unread</h3>
              <p className="text-2xl font-bold text-red-600">
                {testNotifications.filter(n => !n.isRead).length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Read</h3>
              <p className="text-2xl font-bold text-green-600">
                {testNotifications.filter(n => n.isRead).length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          {testNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No notifications available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    !notification.isRead 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.content}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Type: {notification.type}</p>
                        <p>Created: {new Date(notification.createdAt).toLocaleString()}</p>
                        {notification.metadata && (
                          <p>Metadata: {JSON.stringify(notification.metadata, null, 2)}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Test Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Click "Load Mock Data" to load sample notifications</li>
            <li>Click "Mark Read" on individual notifications to mark them as read</li>
            <li>Click "Mark All Read" to mark all notifications as read</li>
            <li>Observe the unread count updates in real-time</li>
            <li>Check the browser console for WebSocket connection logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
