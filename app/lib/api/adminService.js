import apiClient from "./client";

/**
 * Admin Service
 * Handles all admin-related API calls
 */
export const adminService = {
  // Activities
  getActivities: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    
    return apiClient.get(`/admin/activities?${queryParams.toString()}`);
  },

  getActivityById: (id) => apiClient.get(`/admin/activities/${id}`),

  // Approvals
  getApprovals: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    return apiClient.get(`/admin/approvals?${queryParams.toString()}`);
  },

  getApprovalById: (id) => apiClient.get(`/admin/approvals/${id}`),

  approveItem: (id, data = {}) => apiClient.post(`/admin/approvals/${id}/approve`, data),

  rejectItem: (id, data = {}) => apiClient.post(`/admin/approvals/${id}/reject`, data),

  // Users
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    return apiClient.get(`/admin/users?${queryParams.toString()}`);
  },

  getUserById: (id) => apiClient.get(`/admin/users/${id}`),

  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),

  // Tutors
  getTutors: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    return apiClient.get(`/admin/tutors?${queryParams.toString()}`);
  },

  approveTutor: (id, data = {}) => apiClient.post(`/admin/tutors/${id}/approve`, data),

  rejectTutor: (id, data = {}) => apiClient.post(`/admin/tutors/${id}/reject`, data),

  // Payments
  getPayments: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    
    return apiClient.get(`/admin/payments?${queryParams.toString()}`);
  },

  processRefund: (id, data) => apiClient.post(`/admin/payments/${id}/refund`, data),

  // Analytics
  getAnalytics: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.append('period', params.period);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    return apiClient.get(`/admin/analytics?${queryParams.toString()}`);
  },

  // Reports
  generateReport: (type, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    return apiClient.get(`/admin/reports/${type}?${queryParams.toString()}`);
  },

  // Settings
  getSettings: () => apiClient.get('/admin/settings'),

  updateSettings: (settings) => apiClient.put('/admin/settings', settings),
};

// Mock data for development/fallback
export const mockAdminData = {
  activities: [
    {
      id: 1,
      type: "tutor_registration",
      event: "New Tutor Registration",
      user: "David Wilson",
      userEmail: "david.wilson@example.com",
      time: "10 minutes ago",
      details: "Registered as Math and Science tutor. Pending verification of credentials.",
      metadata: {
        subject: "Mathematics, Physics",
        experience: "5 years",
        education: "M.S. Mathematics"
      },
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "subscription_renewal",
      event: "Student Subscription Renewed",
      user: "Emma Davis",
      userEmail: "emma.davis@example.com",
      time: "1 hour ago",
      details: "Premium plan renewed for 6 months. Payment processed successfully.",
      metadata: {
        plan: "Premium (6 months)",
        amount: "$299.00",
        paymentMethod: "Credit Card"
      },
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "payout_processed",
      event: "Tutor Payout Processed",
      user: "John Smith",
      userEmail: "john.smith@example.com",
      time: "2 hours ago",
      details: "Monthly payout for 45 hours of tutoring sessions.",
      metadata: {
        hours: "45",
        amount: "$1,350.00",
        method: "Bank Transfer"
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: "support_ticket",
      event: "Support Ticket Resolved",
      user: "Sarah Johnson",
      userEmail: "sarah.johnson@example.com",
      time: "4 hours ago",
      details: "Technical issue with video conferencing resolved.",
      metadata: {
        ticketId: "#45678",
        category: "Technical Support",
        priority: "Medium"
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      type: "course_published",
      event: "New Course Published",
      user: "Michael Brown",
      userEmail: "michael.brown@example.com",
      time: "6 hours ago",
      details: "Advanced Calculus course published and added to the catalog.",
      metadata: {
        course: "Advanced Calculus",
        modules: "12",
        category: "Mathematics"
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],

  approvals: [
    {
      id: 1,
      type: "tutor_registration",
      title: "Tutor Registration",
      user: "Robert Johnson",
      userEmail: "robert.johnson@example.com",
      time: "2 days ago",
      status: "pending",
      details: "Applied to teach Mathematics and Physics. Has 5 years of experience.",
      metadata: {
        education: "Ph.D. in Mathematics, Stanford University",
        experience: "5 years of teaching experience at high school level",
        subjects: "Mathematics, Physics",
        documents: ["CV", "Degree Certificate", "Teaching License"]
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: "refund_request",
      title: "Refund Request",
      user: "Lisa Martin",
      userEmail: "lisa.martin@example.com",
      time: "1 day ago",
      status: "pending",
      details: "Requesting refund for cancelled tutoring session.",
      metadata: {
        amount: "$45.00",
        reason: "Tutor cancelled last minute",
        sessionId: "#5678",
        originalPaymentDate: "2024-01-15"
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: "course_submission",
      title: "Course Submission",
      user: "Michael Chen",
      userEmail: "michael.chen@example.com",
      time: "3 days ago",
      status: "pending",
      details: "Submitted new course on Advanced Python Programming",
      metadata: {
        course: "Advanced Python Programming",
        modules: "8",
        category: "Programming",
        estimatedDuration: "40 hours"
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: "payout_request",
      title: "Payout Request",
      user: "Sophia Rodriguez",
      userEmail: "sophia.rodriguez@example.com",
      time: "1 day ago",
      status: "pending",
      details: "Monthly payout request for tutoring services",
      metadata: {
        amount: "$850.00",
        hours: "28",
        method: "Bank transfer",
        bankAccount: "****1234"
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export default adminService;
