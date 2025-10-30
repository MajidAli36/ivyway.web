import apiClient from "./client";
import { zoomMeetings } from "./endpoints";

export const zoomService = {
  /**
   * Create a new Zoom meeting for a booking
   * @param {string} bookingId - The booking ID to create a meeting for
   * @param {string} userRole - The user role (tutor/counselor)
   */
  async createMeeting(bookingId, userRole = "tutor") {
    try {
      // Clean the booking ID by removing any prefixes (like "tutor-", "student-", etc.)
      const cleanBookingId = bookingId.replace(/^(tutor-|student-|counselor-)/, "");
      console.log(`Creating meeting for booking ID: ${bookingId} -> ${cleanBookingId}`);
      
      const response = await zoomMeetings.create(cleanBookingId, userRole);

      // Handle different response formats
      if (response && response.success && response.data) {
        // Counselor API response format
        return response.data;
      } else if (response && response.id) {
        // Tutor API response format - direct meeting object
        return response;
      } else {
        console.error("Failed to create Zoom meeting:", response);
        throw new Error(response?.message || "Failed to create Zoom meeting");
      }
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      throw error;
    }
  },

  /**
   * Get meeting details by meeting ID
   * @param {string} meetingId - The Zoom meeting ID
   */
  async getMeeting(meetingId) {
    try {
      const response = await zoomMeetings.getById(meetingId);

      if (response && response.success && response.data) {
        return response.data;
      } else {
        console.error("Failed to get Zoom meeting:", response);
        return null;
      }
    } catch (error) {
      console.error("Error fetching Zoom meeting:", error);
      return null;
    }
  },

  /**
   * Update meeting settings (counselor only)
   * @param {string} meetingId - The Zoom meeting ID
   * @param {Object} updates - Meeting updates
   */
  async updateMeeting(meetingId, updates) {
    try {
      const response = await zoomMeetings.update(meetingId, updates);

      if (response && response.success && response.data) {
        return response.data;
      } else {
        console.error("Failed to update Zoom meeting:", response);
        throw new Error(response?.message || "Failed to update Zoom meeting");
      }
    } catch (error) {
      console.error("Error updating Zoom meeting:", error);
      throw error;
    }
  },

  /**
   * Delete a Zoom meeting (counselor only)
   * @param {string} meetingId - The Zoom meeting ID to delete
   */
  async deleteMeeting(meetingId) {
    try {
      const response = await zoomMeetings.delete(meetingId);

      if (response && response.success) {
        return true;
      } else {
        console.error("Failed to delete Zoom meeting:", response);
        throw new Error(response?.message || "Failed to delete Zoom meeting");
      }
    } catch (error) {
      console.error("Error deleting Zoom meeting:", error);
      throw error;
    }
  },

  /**
   * Get all meetings for a counselor
   * @param {string} counselorId - The counselor ID
   * @param {Object} params - Query parameters (page, limit, status)
   */
  async getCounselorMeetings(counselorId, params = {}) {
    try {
      const response = await zoomMeetings.getCounselorMeetings(
        counselorId,
        params
      );

      if (response && response.success && response.data) {
        return response.data;
      } else {
        console.error("Failed to get counselor meetings:", response);
        return { meetings: [], totalCount: 0, currentPage: 1, totalPages: 0 };
      }
    } catch (error) {
      console.error("Error fetching counselor meetings:", error);
      return { meetings: [], totalCount: 0, currentPage: 1, totalPages: 0 };
    }
  },

  /**
   * Get all meetings for a student
   * @param {string} studentId - The student ID
   * @param {Object} params - Query parameters (page, limit, status)
   */
  async getStudentMeetings(studentId, params = {}) {
    try {
      const response = await zoomMeetings.getStudentMeetings(studentId, params);

      if (response && response.success && response.data) {
        return response.data;
      } else {
        console.error("Failed to get student meetings:", response);
        return { meetings: [], totalCount: 0, currentPage: 1, totalPages: 0 };
      }
    } catch (error) {
      console.error("Error fetching student meetings:", error);
      return { meetings: [], totalCount: 0, currentPage: 1, totalPages: 0 };
    }
  },

  /**
   * Send meeting reminder
   * @param {string} bookingId - The booking ID
   */
  async sendReminder(bookingId) {
    try {
      const response = await zoomMeetings.sendReminder(bookingId);

      if (response && response.success) {
        return true;
      } else {
        console.error("Failed to send meeting reminder:", response);
        throw new Error(response?.message || "Failed to send meeting reminder");
      }
    } catch (error) {
      console.error("Error sending meeting reminder:", error);
      throw error;
    }
  },

  /**
   * Get meeting details by booking ID (helper method)
   * @param {string} bookingId - The booking ID associated with the meeting
   * @param {string} userRole - The user role (tutor/counselor)
   */
  async getMeetingByBookingId(bookingId, userRole = "tutor") {
    try {
      // Validate booking ID
      if (
        !bookingId ||
        typeof bookingId !== "string" ||
        bookingId.trim() === ""
      ) {
        console.warn("Invalid booking ID provided:", bookingId);
        return null;
      }

      // Clean the booking ID by removing any prefixes (like "tutor-", "student-", etc.)
      const cleanBookingId = bookingId.replace(/^(tutor-|student-|counselor-)/, "");
      console.log(`Original booking ID: ${bookingId}, Cleaned: ${cleanBookingId}`);

      // Use the regular booking endpoint for both tutors and counselors
      // The backend will handle authorization based on user role
      console.log(`Fetching booking ${cleanBookingId} for user role: ${userRole}`);
      const bookingResponse = await apiClient.get(
        `/bookings/${cleanBookingId}`
      );
      console.log("Booking response:", bookingResponse);

      if (bookingResponse && bookingResponse.success && bookingResponse.data) {
        const booking = bookingResponse.data;
        console.log("Booking data:", booking);

        // Check if booking has zoom meeting info
        if (booking.zoomMeeting) {
          return booking.zoomMeeting;
        }

        // Check if booking has meeting link
        if (booking.meetingLink && booking.meetingLink !== "#") {
          console.log("Found meeting link:", booking.meetingLink);
          return {
            joinUrl: booking.meetingLink,
            startUrl: booking.meetingLink,
            id: booking.zoomMeetingId || "unknown",
            status: "scheduled",
          };
        } else {
          console.log("No meeting link found in booking");
        }
      } else {
        console.log("No booking data found or unsuccessful response");
      }

      return null;
    } catch (error) {
      // Log error but don't throw - gracefully return null
      const message =
        error?.response?.data?.message || error?.message || "Unknown error";
      console.error("Error fetching meeting by booking ID:", {
        message,
        status: error?.response?.status,
        error: error.message || error,
      });
      
      // Return null instead of throwing to prevent breaking the UI
      return null;
    }
  },

  /**
   * Join meeting (for students)
   * @param {string} joinUrl - The meeting join URL
   */
  joinMeeting(joinUrl) {
    if (joinUrl && joinUrl !== "#") {
      window.open(joinUrl, "_blank");
      return true;
    }
    return false;
  },

  /**
   * Start meeting (for counselors)
   * @param {string} startUrl - The meeting start URL
   */
  startMeeting(startUrl) {
    if (startUrl && startUrl !== "#") {
      window.open(startUrl, "_blank");
      return true;
    }
    return false;
  },

  /**
   * Get meeting status badge info
   * @param {string} status - Meeting status
   */
  getStatusInfo(status) {
    const statusMap = {
      scheduled: {
        label: "Scheduled",
        color: "bg-blue-100 text-blue-800",
        icon: "CalendarIcon",
      },
      started: {
        label: "In Progress",
        color: "bg-green-100 text-green-800",
        icon: "PlayIcon",
      },
      ended: {
        label: "Ended",
        color: "bg-gray-100 text-gray-800",
        icon: "StopIcon",
      },
      cancelled: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800",
        icon: "XMarkIcon",
      },
    };

    return statusMap[status] || statusMap.scheduled;
  },

  /**
   * Format meeting time for display
   * @param {string} startTime - ISO string of start time
   * @param {number} duration - Duration in minutes
   */
  formatMeetingTime(startTime, duration = 60) {
    if (!startTime) return "Time TBD";

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    const startStr = start.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${startStr} - ${endStr}`;
  },

  /**
   * Check if meeting is upcoming
   * @param {string} startTime - ISO string of start time
   */
  isUpcoming(startTime) {
    if (!startTime) return false;
    return new Date(startTime) > new Date();
  },

  /**
   * Check if meeting is currently active
   * @param {string} startTime - ISO string of start time
   * @param {number} duration - Duration in minutes
   */
  isActive(startTime, duration = 60) {
    if (!startTime) return false;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    const now = new Date();

    return now >= start && now <= end;
  },
};

export default zoomService;
