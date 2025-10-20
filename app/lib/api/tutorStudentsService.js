import apiClient from "./client";

/**
 * Tutor Students Service - Handles all tutor-student related API calls
 */
class TutorStudentsService {
  constructor() {
    this.baseURL = "/tutor-students";
  }

  /**
   * Get all students who have booked sessions with the tutor
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Number of students per page
   * @param {string} params.search - Search by student name or email
   * @param {string} params.status - Filter by session status
   * @returns {Promise} API response with students data
   */
  async getMyStudents(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const endpoint = `${this.baseURL}${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching tutor students:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific student
   * @param {string} studentId - Student ID
   * @returns {Promise} API response with student details
   */
  async getStudentDetails(studentId) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${studentId}`);
      return response;
    } catch (error) {
      console.error("Error fetching student details:", error);
      throw error;
    }
  }

  /**
   * Get session history with a specific student
   * @param {string} studentId - Student ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response with session history
   */
  async getStudentSessions(studentId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);
      if (params.subject) queryParams.append("subject", params.subject);

      const queryString = queryParams.toString();
      const endpoint = `${this.baseURL}/${studentId}/sessions${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      throw error;
    }
  }

  /**
   * Get statistics about tutor's students
   * @returns {Promise} API response with statistics
   */
  async getStudentsStatistics() {
    try {
      const response = await apiClient.get(`${this.baseURL}/statistics`);
      return response;
    } catch (error) {
      console.error("Error fetching students statistics:", error);
      throw error;
    }
  }
}

// Create singleton instance
const tutorStudentsService = new TutorStudentsService();

export default tutorStudentsService;
