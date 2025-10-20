"use client";

import NotificationList from "@/app/components/notifications/NotificationList";

export default function TeacherNotifications() {
  return (
    <div className="space-y-6">
      {/* Notifications Content */}
      <NotificationList />
    </div>
  );
}
