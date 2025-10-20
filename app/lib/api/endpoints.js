import apiClient from "./client";

export const auth = {
  register: (userData) => apiClient.post("/auth/register", userData),
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  getProfile: () => apiClient.get("/auth/profile"),
};

export const availability = {
  create: (availabilityData) =>
    apiClient.post("/availability", availabilityData),
  getTutorAvailability: (tutorId) =>
    apiClient.get(`/availability/tutor/${tutorId}`),
  getMyAvailability: () => apiClient.get("/availability/my"),
  update: (id, availabilityData) =>
    apiClient.put(`/availability/${id}`, availabilityData),
  delete: (id) => apiClient.delete(`/availability/${id}`),
};

export const waitlist = {
  add: (userData) => apiClient.post("/waitlist", userData),
  getAll: () => apiClient.get("/waitlist"),
};

export const notifications = {
  getAll: (params = {}) => apiClient.get("/notifications", params),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
};

// Counselor Availability Endpoints
export const counselorAvailability = {
  create: (availabilityData) => apiClient.post("/counselor/availability", availabilityData),
  getMyAvailability: () => apiClient.get("/counselor/availability"),
  getById: (id) => apiClient.get(`/counselor/availability/${id}`),
  update: (id, availabilityData) => apiClient.put(`/counselor/availability/${id}`, availabilityData),
  delete: (id) => apiClient.delete(`/counselor/availability/${id}`),
  bulkCreate: (availabilityData) => apiClient.post("/counselor/availability/bulk", availabilityData),
  getByDateRange: (startDate, endDate) => apiClient.get(`/counselor/availability/range?start=${startDate}&end=${endDate}`),
};

export const counselorProfiles = {
  getById: (id) => apiClient.get(`/counselor-profiles/${id}`),
  getMyProfile: () => apiClient.get("/counselor-profiles/me"),
  createOrUpdate: (profileData) =>
    apiClient.post("/counselor-profiles", profileData),
  uploadIntroVideo: (videoFile) =>
    apiClient.post("/counselor-profiles/intro-video", videoFile),
  updateProfileImage: (imageFile) =>
    apiClient.post("/counselor-profiles/profile-image", imageFile),
};

// Counselors Endpoints
export const counselors = {
  getAll: (params = {}) => apiClient.get("/counselors", params),
  getById: (id) => apiClient.get(`/counselors/${id}`),
  getAvailability: (id) => apiClient.get(`/counselors/${id}/availability`),
  getRatings: (id) => apiClient.get(`/counselors/${id}/ratings`),
};

// Counselor Bookings Endpoints
export const counselorBookings = {
  create: (bookingData) => apiClient.post("/counselor/bookings", bookingData),
  getCounselorRequests: (params = {}) => apiClient.get("/counselor/bookings/requests", params),
  acceptRequest: (id, data = {}) => apiClient.post(`/counselor/bookings/requests/${id}/accept`, data),
  declineRequest: (id, data) => apiClient.post(`/counselor/bookings/requests/${id}/decline`, data),
  getStudentSessions: (params = {}) => apiClient.get("/counselor/bookings/student/sessions", params),
  getCounselorSessions: (params = {}) => apiClient.get("/counselor/bookings/sessions", params),
  updateSessionStatus: (id, data) => apiClient.put(`/counselor/bookings/sessions/${id}/status`, data),
};

// Counselor Payments Endpoints
export const counselorPayments = {
  processPayment: (paymentData) => apiClient.post("/counselor/payments/process", paymentData),
  getHistory: (params = {}) => apiClient.get("/earnings/history", params),
  getBalance: () => apiClient.get("/earnings/balance"),
  getById: (id) => apiClient.get(`/counselor/payments/${id}`),
  refund: (id, data) => apiClient.post(`/counselor/payments/${id}/refund`, data),
};

// Earnings Endpoints (for all roles)
export const earnings = {
  getBalance: () => apiClient.get("/earnings/balance"),
  getHistory: (params = {}) => apiClient.get("/earnings/history", params),
  getStatistics: (params = {}) => apiClient.get("/earnings/statistics", params),
  requestPayout: (data) => apiClient.post("/earnings/payout-request", data),
  getPayoutHistory: (params = {}) => apiClient.get("/earnings/payout-history", params),
};

// Counselor Ratings Endpoints
export const counselorRatings = {
  create: (ratingData) => apiClient.post("/counselor/ratings", ratingData),
  getCounselorRatings: (counselorId) => apiClient.get(`/counselor/ratings/counselor/${counselorId}`),
  getStudentRatings: (studentId) => apiClient.get(`/counselor/ratings/student/${studentId}`),
  update: (id, ratingData) => apiClient.put(`/counselor/ratings/${id}`, ratingData),
  delete: (id) => apiClient.delete(`/counselor/ratings/${id}`),
  getUnreviewedSessions: (params = {}) => apiClient.get("/counselor/ratings/unreviewed-sessions", params),
};

// Zoom Meeting Endpoints
export const zoomMeetings = {
  // Create Zoom meeting for a booking (tutor/counselor based on user role)
  create: (bookingId, userRole = "tutor") => {
    if (userRole === "counselor") {
      return apiClient.post("/counselor/zoom/meetings", { bookingId });
    } else {
      return apiClient.post("/zoom/meetings", { bookingId });
    }
  },
  
  // Get meeting details by meeting ID
  getById: (meetingId, userRole = "tutor") => {
    if (userRole === "counselor") {
      return apiClient.get(`/counselor/zoom/meetings/${meetingId}`);
    } else {
      return apiClient.get(`/zoom/meetings/${meetingId}`);
    }
  },
  
  // Update meeting (counselor only)
  update: (meetingId, updates) => apiClient.patch(`/counselor/zoom/meetings/${meetingId}`, updates),
  
  // Delete meeting (counselor only)
  delete: (meetingId) => apiClient.delete(`/counselor/zoom/meetings/${meetingId}`),
  
  // Get counselor's meetings
  getCounselorMeetings: (counselorId, params = {}) => 
    apiClient.get(`/counselor/zoom/counselor/${counselorId}/meetings`, params),
  
  // Get student's meetings
  getStudentMeetings: (studentId, params = {}) => 
    apiClient.get(`/counselor/zoom/student/${studentId}/meetings`, params),
  
  // Send meeting reminder
  sendReminder: (bookingId, userRole = "tutor") => {
    if (userRole === "counselor") {
      return apiClient.post(`/counselor/zoom/meetings/${bookingId}/remind`);
    } else {
      return apiClient.post(`/zoom/meetings/${bookingId}/remind`);
    }
  },
};