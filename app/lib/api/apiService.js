import apiClient from "./client";

const API = {
  // Tutor endpoints
  getTutors: (params = {}) => apiClient.get("/tutors", { params }),
  getTutorById: (id) => apiClient.get(`/tutors/${id}`),

  // Availability endpoints
  getAvailability: (tutorId) => apiClient.get(`/availability/tutor/${tutorId}`),
  getMyAvailability: () => apiClient.get("/availability/my"),
  createAvailability: (data) => apiClient.post("/availability", data),
  updateAvailability: (id, data) => apiClient.put(`/availability/${id}`, data),
  deleteAvailability: (id) => apiClient.delete(`/availability/${id}`),

  // Session booking
  bookSession: (data) => apiClient.post("/sessions", data),

  // Earnings & Payouts endpoints
  getEarningsBalance: () => apiClient.get("/earnings/balance"),
  getEarningsHistory: (params = {}) =>
    apiClient.get("/earnings/history", { params }),
  requestPayout: (data) => apiClient.post("/payouts/request", data),
  getPayoutHistory: (params = {}) =>
    apiClient.get("/payouts/history", { params }),

  // Admin payout management
  getAdminPayouts: (params = {}) => apiClient.get("/admin/payouts", { params }),
  approvePayout: (id) => apiClient.post(`/admin/payouts/${id}/approve`),
  rejectPayout: (id) => apiClient.post(`/admin/payouts/${id}/reject`),

  // Plans endpoints
  getPlans: () => apiClient.get("/plans"),
  getActivePlan: () => apiClient.get("/users/plan/active"),
  getPlanHistory: () => apiClient.get("/users/plan/history"),
  changePlan: (data) => apiClient.post("/users/plan/change", data),

  // Admin Plan Management endpoints
  getAdminPlans: () => apiClient.get("/admin/plans"),
  getAdminPlanById: (id) => apiClient.get(`/admin/plans/${id}`),
  createAdminPlan: (data) => apiClient.post("/admin/plans", data),
  updateAdminPlan: (id, data) => apiClient.put(`/admin/plans/${id}`, data),
  deleteAdminPlan: (id) => apiClient.delete(`/admin/plans/${id}`),
  getAdminPlanStats: () => apiClient.get("/admin/statistics/plans"),

  // Payment endpoints
  getPaymentHistory: (params = {}) =>
    apiClient.get("/payments/history", { params }),
  getInvoice: (paymentId) => apiClient.get(`/payments/${paymentId}/invoice`),

  // Earnings summary endpoint for dashboard
  getEarningsSummary: () => apiClient.get("/earnings/summary"),

  // Counselor-specific earnings endpoints
  getCounselorEarningsSummary: () => apiClient.get("/counselor/earnings/summary"),
  getCounselorEarningsHistory: (params = {}) =>
    apiClient.get("/counselor/earnings/history", { params }),
  getCounselorEarningsBalance: () => apiClient.get("/counselor/earnings/balance"),
  requestCounselorPayout: (data) => apiClient.post("/counselor/earnings/payout-request", data),
  getCounselorPayoutHistory: () => apiClient.get("/counselor/earnings/payouts"),

  // Counselor payment endpoints
  createCounselorPaymentIntent: (data) => apiClient.post("/counselor/bookings/payment-intent", data),
  confirmCounselorPayment: (data) => apiClient.post("/counselor/bookings/confirm-payment", data),
  getCounselorPaymentHistory: (params = {}) => apiClient.get("/counselor/payments/history", { params }),
  getCounselorPaymentById: (id) => apiClient.get(`/counselor/payments/${id}`),
  refundCounselorPayment: (id, data = {}) => apiClient.post(`/counselor/payments/${id}/refund`, data),

  // Dashboard Analytics Endpoints
  // Student Dashboard
  getStudentDashboard: () => apiClient.get("/dashboard/student"),

  // Admin Dashboard
  getAdminDashboard: () => apiClient.get("/dashboard/admin"),

  // Tutor Dashboard
  getTutorDashboard: () => apiClient.get("/dashboard/tutor"),

  // Counselor Dashboard
  getCounselorDashboard: () => apiClient.get("/dashboard/counselor"),

  // Auto-detect role dashboard
  getDashboardAnalytics: () => apiClient.get("/dashboard/analytics"),

  // Legacy tutor dashboard analytics endpoint (keeping for backward compatibility)
  getTutorDashboardAnalytics: () =>
    apiClient.get("/tutors/dashboard-analytics"),

  // Utility function for handling errors
  handleError: (error) => {
    console.error("API Error:", error);
    throw error.response?.data?.message || "An error occurred";
  },
};

export default API;
