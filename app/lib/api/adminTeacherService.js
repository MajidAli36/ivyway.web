import apiClient from "./client";

class AdminTeacherService {
  // Get Admin Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await apiClient.get("/admin/teachers/dashboard");
      return response;
    } catch (error) {
      console.error("Error fetching admin dashboard stats:", error);
      throw error;
    }
  }

  // Get All Teacher Profiles
  async getTeachers(filters = {}) {
    try {
      const { verificationStatus, search, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (verificationStatus) params.verificationStatus = verificationStatus;
      if (search) params.search = search;

      const response = await apiClient.get("/admin/teachers/teachers", params);
      return response;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  }

  // Approve Teacher Profile
  async approveTeacher(id, verificationNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/teachers/${id}/approve`,
        {
          verificationNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error approving teacher:", error);
      throw error;
    }
  }

  // Reject Teacher Profile
  async rejectTeacher(id, verificationNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/teachers/${id}/reject`,
        {
          verificationNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      throw error;
    }
  }

  // Get All Student Referrals (Admin)
  async getReferrals(filters = {}) {
    try {
      const { status, search, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (status) params.status = status;
      if (search) params.search = search;

      const response = await apiClient.get("/admin/teachers/referrals", params);
      return response;
    } catch (error) {
      console.error("Error fetching admin referrals:", error);
      throw error;
    }
  }

  // Approve Student Referral
  async approveReferral(id, adminNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/referrals/${id}/approve`,
        {
          adminNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error approving referral:", error);
      throw error;
    }
  }

  // Reject Student Referral
  async rejectReferral(id, adminNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/referrals/${id}/reject`,
        {
          adminNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting referral:", error);
      throw error;
    }
  }

  // Get All Teacher Assignments (Admin)
  async getAssignments(filters = {}) {
    try {
      const { status, assignmentType, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (status) params.status = status;
      if (assignmentType) params.assignmentType = assignmentType;

      const response = await apiClient.get(
        "/admin/teachers/assignments",
        params
      );
      return response;
    } catch (error) {
      console.error("Error fetching admin assignments:", error);
      throw error;
    }
  }

  // Approve Teacher Assignment
  async approveAssignment(id, adminNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/assignments/${id}/approve`,
        {
          adminNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error approving assignment:", error);
      throw error;
    }
  }

  // Reject Teacher Assignment
  async rejectAssignment(id, adminNotes = "") {
    try {
      const response = await apiClient.patch(
        `/admin/teachers/assignments/${id}/reject`,
        {
          adminNotes,
        }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting assignment:", error);
      throw error;
    }
  }
}

export const adminTeacherService = new AdminTeacherService();
export default adminTeacherService;
