import apiClient from "./client";

class NotificationsService {
  // Get all notifications
  async getNotifications(filters = {}) {
    try {
      const { page = 1, limit = 10, type = "", read = "" } = filters;
      const params = { page, limit };

      if (type) params.type = type;
      if (read !== "") params.read = read;

      const response = await apiClient.get("/teacher/notifications", params);
      return response;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get notification by ID
  async getNotification(notificationId) {
    try {
      const response = await apiClient.get(
        `/teacher/notifications/${notificationId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiClient.patch(
        `/teacher/notifications/${notificationId}/read`
      );
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await apiClient.patch("/teacher/notifications/read-all");
      return response;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(
        `/teacher/notifications/${notificationId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await apiClient.get(
        "/teacher/notifications/unread-count"
      );
      return response;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  // Get notification statistics
  async getStatistics() {
    try {
      const response = await apiClient.get("/teacher/notifications/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching notification statistics:", error);
      throw error;
    }
  }
}

export const notificationsService = new NotificationsService();
export default notificationsService;


