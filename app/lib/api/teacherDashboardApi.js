import apiClient from "./client";

// Teacher Profile API
export const teacherProfileApi = {
  // Create teacher profile
  create: async (profileData) => {
    try {
      const response = await apiClient.post("/teacher/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      throw error;
    }
  },

  // Get current teacher's profile
  getMyProfile: async () => {
    try {
      const response = await apiClient.get("/teacher/profile");
      return response;
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  },

  // Update teacher profile
  update: async (profileData) => {
    try {
      const response = await apiClient.put("/teacher/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error updating teacher profile:", error);
      throw error;
    }
  },

  // Get dashboard data
  getDashboard: async () => {
    try {
      const response = await apiClient.get("/teacher/dashboard");
      return response;
    } catch (error) {
      console.error("Error fetching teacher dashboard:", error);
      throw error;
    }
  },

  // Get teacher profile by ID (admin)
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/admin/teachers/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching teacher by ID:", error);
      throw error;
    }
  },

  // Verify teacher profile (admin)
  verify: async (id, data) => {
    try {
      const response = await apiClient.put(
        `/admin/teachers/${id}/verify`,
        data
      );
      return response;
    } catch (error) {
      console.error("Error verifying teacher:", error);
      throw error;
    }
  },

  // Update teacher profile (admin)
  updateAdmin: async (id, profileData) => {
    try {
      const response = await apiClient.put(
        `/admin/teachers/${id}`,
        profileData
      );
      return response;
    } catch (error) {
      console.error("Error updating teacher (admin):", error);
      throw error;
    }
  },

  // Delete teacher profile (admin)
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/teachers/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw error;
    }
  },

  // Get all teacher profiles (admin)
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/teachers", params);
      return response;
    } catch (error) {
      console.error("Error fetching all teachers:", error);
      throw error;
    }
  },
};

// Student Referral API
export const studentReferralApi = {
  // Create referral
  create: async (referralData) => {
    try {
      const response = await apiClient.post("/student-referrals", referralData);
      return response;
    } catch (error) {
      console.error("Error creating referral:", error);
      throw error;
    }
  },

  // Get all referrals
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get("/student-referrals", params);
      return response;
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw error;
    }
  },

  // Get single referral
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/student-referrals/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching referral by ID:", error);
      throw error;
    }
  },

  // Update referral
  update: async (id, referralData) => {
    try {
      const response = await apiClient.put(
        `/student-referrals/${id}`,
        referralData
      );
      return response;
    } catch (error) {
      console.error("Error updating referral:", error);
      throw error;
    }
  },

  // Delete referral
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/student-referrals/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting referral:", error);
      throw error;
    }
  },

  // Get referral statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get("/student-referrals/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching referral statistics:", error);
      throw error;
    }
  },

  // Approve referral (admin)
  approve: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/student-referrals/${id}/approve`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error approving referral:", error);
      throw error;
    }
  },

  // Reject referral (admin)
  reject: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/student-referrals/${id}/reject`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting referral:", error);
      throw error;
    }
  },
};

// Teacher Assignment API
export const teacherAssignmentApi = {
  // Create assignment
  create: async (assignmentData) => {
    try {
      const response = await apiClient.post(
        "/teacher-assignments",
        assignmentData
      );
      return response;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  // Get all assignments
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get("/teacher-assignments", params);
      return response;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  },

  // Get single assignment
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/teacher-assignments/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching assignment by ID:", error);
      throw error;
    }
  },

  // Update assignment
  update: async (id, assignmentData) => {
    try {
      const response = await apiClient.put(
        `/teacher-assignments/${id}`,
        assignmentData
      );
      return response;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },

  // Delete assignment
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/teacher-assignments/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  },

  // Get assignment statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get("/teacher-assignments/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching assignment statistics:", error);
      throw error;
    }
  },

  // Accept assignment (provider)
  accept: async (id) => {
    try {
      const response = await apiClient.post(`/assignments/${id}/accept`);
      return response;
    } catch (error) {
      console.error("Error accepting assignment:", error);
      throw error;
    }
  },

  // Decline assignment (provider)
  decline: async (id, data) => {
    try {
      const response = await apiClient.post(`/assignments/${id}/decline`, data);
      return response;
    } catch (error) {
      console.error("Error declining assignment:", error);
      throw error;
    }
  },

  // Update assignment status (provider)
  updateStatus: async (id, data) => {
    try {
      const response = await apiClient.put(`/assignments/${id}/status`, data);
      return response;
    } catch (error) {
      console.error("Error updating assignment status:", error);
      throw error;
    }
  },

  // Approve assignment (admin)
  approve: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/assignments/${id}/approve`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error approving assignment:", error);
      throw error;
    }
  },

  // Reject assignment (admin)
  reject: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/assignments/${id}/reject`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting assignment:", error);
      throw error;
    }
  },
};

// Progress Report API
export const progressReportApi = {
  // Create report
  create: async (reportData) => {
    try {
      const response = await apiClient.post("/progress-reports", reportData);
      return response;
    } catch (error) {
      console.error("Error creating progress report:", error);
      throw error;
    }
  },

  // Get all reports
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get("/progress-reports", params);
      return response;
    } catch (error) {
      console.error("Error fetching progress reports:", error);
      throw error;
    }
  },

  // Get single report
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/progress-reports/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching progress report by ID:", error);
      throw error;
    }
  },

  // Update report
  update: async (id, reportData) => {
    try {
      const response = await apiClient.put(
        `/progress-reports/${id}`,
        reportData
      );
      return response;
    } catch (error) {
      console.error("Error updating progress report:", error);
      throw error;
    }
  },

  // Submit report
  submit: async (id) => {
    try {
      const response = await apiClient.patch(`/progress-reports/${id}/submit`);
      return response;
    } catch (error) {
      console.error("Error submitting progress report:", error);
      throw error;
    }
  },

  // Delete report
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/progress-reports/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting progress report:", error);
      throw error;
    }
  },

  // Get report statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get("/progress-reports/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching progress report statistics:", error);
      throw error;
    }
  },
};

// Provider API
export const providerApi = {
  // Get all providers
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get("/providers", params);
      return response;
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }
  },

  // Get single provider
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/providers/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching provider by ID:", error);
      throw error;
    }
  },

  // Get available providers
  getAvailable: async (params = {}) => {
    try {
      const response = await apiClient.get("/providers/available", params);
      return response;
    } catch (error) {
      console.error("Error fetching available providers:", error);
      throw error;
    }
  },

  // Get providers by role
  getByRole: async (role, params = {}) => {
    try {
      const response = await apiClient.get(`/providers/role/${role}`, params);
      return response;
    } catch (error) {
      console.error("Error fetching providers by role:", error);
      throw error;
    }
  },
};

// Admin Teacher Management API
export const adminTeacherApi = {
  // Get admin dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/admin/teachers/dashboard");
      return response;
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw error;
    }
  },

  // Get all teachers
  getTeachers: async (filters = {}) => {
    try {
      const response = await apiClient.get("/admin/teachers/teachers", filters);
      return response;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  },

  // Approve teacher
  approve: async (id, notes) => {
    try {
      const response = await apiClient.patch(`/admin/teachers/${id}/approve`, {
        notes,
      });
      return response;
    } catch (error) {
      console.error("Error approving teacher:", error);
      throw error;
    }
  },

  // Reject teacher
  reject: async (id, notes) => {
    try {
      const response = await apiClient.patch(`/admin/teachers/${id}/reject`, {
        notes,
      });
      return response;
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      throw error;
    }
  },

  // Get all referrals (admin)
  getReferrals: async (filters = {}) => {
    try {
      const response = await apiClient.get(
        "/admin/teachers/referrals",
        filters
      );
      return response;
    } catch (error) {
      console.error("Error fetching referrals:", error);
      throw error;
    }
  },

  // Approve referral
  approveReferral: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/referrals/${id}/approve`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error approving referral:", error);
      throw error;
    }
  },

  // Reject referral
  rejectReferral: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/referrals/${id}/reject`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting referral:", error);
      throw error;
    }
  },

  // Get all assignments (admin)
  getAssignments: async (filters = {}) => {
    try {
      const response = await apiClient.get(
        "/admin/teachers/assignments",
        filters
      );
      return response;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  },

  // Approve assignment
  approveAssignment: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/assignments/${id}/approve`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error approving assignment:", error);
      throw error;
    }
  },

  // Reject assignment
  rejectAssignment: async (id, notes) => {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/assignments/${id}/reject`,
        { notes }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting assignment:", error);
      throw error;
    }
  },
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return {
          message: data.message || "Bad request. Please check your input.",
          validationErrors: data.errors || {},
          type: "validation",
        };
      case 401:
        return {
          message: "Unauthorized. Please log in again.",
          type: "authentication",
        };
      case 403:
        return {
          message:
            "Forbidden. You don't have permission to perform this action.",
          type: "authorization",
        };
      case 404:
        return {
          message: "Resource not found.",
          type: "not_found",
        };
      case 422:
        return {
          message: data.message || "Validation failed.",
          validationErrors: data.errors || {},
          type: "validation",
        };
      case 500:
        return {
          message: "Internal server error. Please try again later.",
          type: "server",
        };
      default:
        return {
          message: data.message || "An error occurred. Please try again.",
          type: "unknown",
        };
    }
  } else if (error.request) {
    // Network error
    return {
      message: "Network error. Please check your connection.",
      type: "network",
    };
  } else {
    // Other error
    return {
      message: error.message || "An unexpected error occurred.",
      type: "unknown",
    };
  }
};

// API response wrapper
export const apiWrapper = async (apiCall) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data,
      message: response.data.message,
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      success: false,
      error: errorInfo.message,
      type: errorInfo.type,
      validationErrors: errorInfo.validationErrors || {},
    };
  }
};

// Export all APIs
export default {
  teacherProfile: teacherProfileApi,
  studentReferral: studentReferralApi,
  teacherAssignment: teacherAssignmentApi,
  progressReport: progressReportApi,
  provider: providerApi,
  adminTeacher: adminTeacherApi,
  handleApiError,
  apiWrapper,
};
