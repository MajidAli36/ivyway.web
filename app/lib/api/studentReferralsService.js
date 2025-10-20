import apiClient from "./client";

class StudentReferralsService {
  // Create Student Referral
  async createReferral(referralData) {
    try {
      const response = await apiClient.post("/student-referrals", referralData);
      return response;
    } catch (error) {
      console.error("Error creating student referral:", error);
      throw error;
    }
  }

  // Get Student Referrals with pagination and filters
  async getReferrals(filters = {}) {
    try {
      const { status, search, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (status) params.status = status;
      if (search) params.search = search;

      const response = await apiClient.get("/student-referrals", params);
      return response;
    } catch (error) {
      console.error("Error fetching student referrals:", error);
      throw error;
    }
  }

  // Get Single Student Referral
  async getReferral(id) {
    try {
      const response = await apiClient.get(`/student-referrals/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching student referral:", error);
      throw error;
    }
  }

  // Update Student Referral
  async updateReferral(id, referralData) {
    try {
      const response = await apiClient.put(
        `/student-referrals/${id}`,
        referralData
      );
      return response;
    } catch (error) {
      console.error("Error updating student referral:", error);
      throw error;
    }
  }

  // Delete Student Referral
  async deleteReferral(id) {
    try {
      const response = await apiClient.delete(`/student-referrals/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting student referral:", error);
      throw error;
    }
  }

  // Get Referral Statistics
  async getStatistics() {
    try {
      const response = await apiClient.get("/student-referrals/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching referral statistics:", error);
      throw error;
    }
  }
}

export const studentReferralsService = new StudentReferralsService();
export default studentReferralsService;
