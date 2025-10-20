"use client";

import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "@/app/components/shared/NotificationSystem";
import {
  teacherProfileApi,
  studentReferralApi,
  teacherAssignmentApi,
  progressReportApi,
  providerApi,
  adminTeacherApi,
} from "@/app/lib/api/teacherDashboardApi";
import { validateForm, sanitizeFormData } from "@/app/utils/validationUtils";

// Custom hook for teacher profile management
export const useTeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherProfileApi.getMyProfile();
      setProfile(response.data);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err);
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, [showApiError]);

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(profileData, "teacherProfile");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(profileData, "teacherProfile");

        const response = await teacherProfileApi.update(sanitizedData);
        setProfile(response.data);
        showSuccess(
          "Profile Updated",
          "Your profile has been updated successfully"
        );
        return response;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showApiError]
  );

  const createProfile = useCallback(
    async (profileData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(profileData, "teacherProfile");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(profileData, "teacherProfile");

        const response = await teacherProfileApi.create(sanitizedData);
        setProfile(response.data);
        showSuccess(
          "Profile Created",
          "Your profile has been created successfully"
        );
        return response;
      } catch (err) {
        console.error("Error creating profile:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showApiError]
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    createProfile,
  };
};

// Custom hook for student referrals
export const useStudentReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadReferrals = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        const response = await studentReferralApi.getAll(params);
        setReferrals(response.data.referrals || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      } catch (err) {
        console.error("Error loading referrals:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, showApiError]
  );

  const createReferral = useCallback(
    async (referralData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(referralData, "studentReferral");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(referralData, "studentReferral");

        const response = await studentReferralApi.create(sanitizedData);
        showSuccess(
          "Referral Created",
          "Student referral has been created successfully"
        );
        await loadReferrals();
        return response;
      } catch (err) {
        console.error("Error creating referral:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReferrals, showSuccess, showApiError]
  );

  const updateReferral = useCallback(
    async (id, referralData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(referralData, "studentReferral");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(referralData, "studentReferral");

        const response = await studentReferralApi.update(id, sanitizedData);
        showSuccess(
          "Referral Updated",
          "Student referral has been updated successfully"
        );
        await loadReferrals();
        return response;
      } catch (err) {
        console.error("Error updating referral:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReferrals, showSuccess, showApiError]
  );

  const deleteReferral = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await studentReferralApi.delete(id);
        showSuccess(
          "Referral Deleted",
          "Student referral has been deleted successfully"
        );
        await loadReferrals();
      } catch (err) {
        console.error("Error deleting referral:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReferrals, showSuccess, showApiError]
  );

  return {
    referrals,
    loading,
    error,
    pagination,
    setPagination,
    loadReferrals,
    createReferral,
    updateReferral,
    deleteReferral,
  };
};

// Custom hook for teacher assignments
export const useTeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadAssignments = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        const response = await teacherAssignmentApi.getAll(params);
        setAssignments(response.data.assignments || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      } catch (err) {
        console.error("Error loading assignments:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, showApiError]
  );

  const createAssignment = useCallback(
    async (assignmentData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(assignmentData, "teacherAssignment");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(
          assignmentData,
          "teacherAssignment"
        );

        const response = await teacherAssignmentApi.create(sanitizedData);
        showSuccess(
          "Assignment Created",
          "Assignment has been created successfully"
        );
        await loadAssignments();
        return response;
      } catch (err) {
        console.error("Error creating assignment:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadAssignments, showSuccess, showApiError]
  );

  const updateAssignment = useCallback(
    async (id, assignmentData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(assignmentData, "teacherAssignment");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(
          assignmentData,
          "teacherAssignment"
        );

        const response = await teacherAssignmentApi.update(id, sanitizedData);
        showSuccess(
          "Assignment Updated",
          "Assignment has been updated successfully"
        );
        await loadAssignments();
        return response;
      } catch (err) {
        console.error("Error updating assignment:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadAssignments, showSuccess, showApiError]
  );

  const deleteAssignment = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await teacherAssignmentApi.delete(id);
        showSuccess(
          "Assignment Deleted",
          "Assignment has been deleted successfully"
        );
        await loadAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadAssignments, showSuccess, showApiError]
  );

  return {
    assignments,
    loading,
    error,
    pagination,
    setPagination,
    loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};

// Custom hook for progress reports
export const useProgressReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadReports = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        const response = await progressReportApi.getAll(params);
        setReports(response.data.reports || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      } catch (err) {
        console.error("Error loading reports:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, showApiError]
  );

  const createReport = useCallback(
    async (reportData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(reportData, "progressReport");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(reportData, "progressReport");

        const response = await progressReportApi.create(sanitizedData);
        showSuccess(
          "Report Created",
          "Progress report has been created successfully"
        );
        await loadReports();
        return response;
      } catch (err) {
        console.error("Error creating report:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReports, showSuccess, showApiError]
  );

  const updateReport = useCallback(
    async (id, reportData) => {
      try {
        setLoading(true);
        setError(null);

        // Validate form data
        const validation = validateForm(reportData, "progressReport");
        if (!validation.isValid) {
          throw new Error("Validation failed");
        }

        // Sanitize form data
        const sanitizedData = sanitizeFormData(reportData, "progressReport");

        const response = await progressReportApi.update(id, sanitizedData);
        showSuccess(
          "Report Updated",
          "Progress report has been updated successfully"
        );
        await loadReports();
        return response;
      } catch (err) {
        console.error("Error updating report:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReports, showSuccess, showApiError]
  );

  const deleteReport = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await progressReportApi.delete(id);
        showSuccess(
          "Report Deleted",
          "Progress report has been deleted successfully"
        );
        await loadReports();
      } catch (err) {
        console.error("Error deleting report:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReports, showSuccess, showApiError]
  );

  const submitReport = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await progressReportApi.submit(id);
        showSuccess(
          "Report Submitted",
          "Progress report has been submitted successfully"
        );
        await loadReports();
      } catch (err) {
        console.error("Error submitting report:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadReports, showSuccess, showApiError]
  );

  return {
    reports,
    loading,
    error,
    pagination,
    setPagination,
    loadReports,
    createReport,
    updateReport,
    deleteReport,
    submitReport,
  };
};

// Custom hook for providers
export const useProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadProviders = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };
        const response = await providerApi.getAll(params);
        setProviders(response.data.providers || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      } catch (err) {
        console.error("Error loading providers:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, showApiError]
  );

  return {
    providers,
    loading,
    error,
    pagination,
    setPagination,
    loadProviders,
  };
};

// Custom hook for admin teacher management
export const useAdminTeachers = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showSuccess, showError, showApiError } = useNotifications();

  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminTeacherApi.getDashboardStats();
      setDashboardStats(response.data);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setError(err);
      showApiError(err);
    } finally {
      setLoading(false);
    }
  }, [showApiError]);

  const loadTeachers = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminTeacherApi.getTeachers(filters);
        setTeachers(response.data.teachers || []);
      } catch (err) {
        console.error("Error loading teachers:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [showApiError]
  );

  const loadReferrals = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminTeacherApi.getReferrals(filters);
        setReferrals(response.data.referrals || []);
      } catch (err) {
        console.error("Error loading referrals:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [showApiError]
  );

  const loadAssignments = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminTeacherApi.getAssignments(filters);
        setAssignments(response.data.assignments || []);
      } catch (err) {
        console.error("Error loading assignments:", err);
        setError(err);
        showApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [showApiError]
  );

  const approveTeacher = useCallback(
    async (id, notes) => {
      try {
        setLoading(true);
        setError(null);
        await adminTeacherApi.approve(id, notes);
        showSuccess(
          "Teacher Approved",
          "Teacher has been approved successfully"
        );
        await loadTeachers();
      } catch (err) {
        console.error("Error approving teacher:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadTeachers, showSuccess, showApiError]
  );

  const rejectTeacher = useCallback(
    async (id, notes) => {
      try {
        setLoading(true);
        setError(null);
        await adminTeacherApi.reject(id, notes);
        showSuccess("Teacher Rejected", "Teacher has been rejected");
        await loadTeachers();
      } catch (err) {
        console.error("Error rejecting teacher:", err);
        setError(err);
        showApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadTeachers, showSuccess, showApiError]
  );

  return {
    dashboardStats,
    teachers,
    referrals,
    assignments,
    loading,
    error,
    loadDashboardStats,
    loadTeachers,
    loadReferrals,
    loadAssignments,
    approveTeacher,
    rejectTeacher,
  };
};

export default {
  useTeacherProfile,
  useStudentReferrals,
  useTeacherAssignments,
  useProgressReports,
  useProviders,
  useAdminTeachers,
};
