import apiClient from "./client";

class TeacherAssignmentsService {
  // Create Teacher Assignment
  async createAssignment(assignmentData) {
    try {
      console.log("Creating assignment with data:", assignmentData);
      const response = await apiClient.post(
        "/teacher-assignments",
        assignmentData
      );
      console.log("Assignment created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating teacher assignment:", error);

      // Enhanced error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error(
          "Request was made but no response received:",
          error.request
        );
      } else {
        console.error("Error setting up request:", error.message);
      }

      throw error;
    }
  }

  // Get Teacher Assignments with pagination and filters
  async getAssignments(filters = {}) {
    try {
      const { status, assignmentType, search, page = 1, limit = 10 } = filters;

      const params = { page, limit };

      if (status) params.status = status;
      if (assignmentType) params.assignmentType = assignmentType;
      if (search) params.search = search;

      const response = await apiClient.get("/teacher-assignments", params);
      return response;
    } catch (error) {
      console.error("Error fetching teacher assignments:", error);
      throw error;
    }
  }

  // Get Single Teacher Assignment
  async getAssignment(id) {
    try {
      const response = await apiClient.get(`/teacher-assignments/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching teacher assignment:", error);
      throw error;
    }
  }

  // Update Teacher Assignment
  async updateAssignment(id, assignmentData) {
    try {
      const response = await apiClient.put(
        `/teacher-assignments/${id}`,
        assignmentData
      );
      return response;
    } catch (error) {
      console.error("Error updating teacher assignment:", error);
      throw error;
    }
  }

  // Delete Teacher Assignment
  async deleteAssignment(id) {
    try {
      const response = await apiClient.delete(`/teacher-assignments/${id}`);
      return response;
    } catch (error) {
      console.error("Error deleting teacher assignment:", error);
      throw error;
    }
  }

  // Get Assignment Statistics
  async getStatistics() {
    try {
      const response = await apiClient.get("/teacher-assignments/statistics");
      return response;
    } catch (error) {
      console.error("Error fetching assignment statistics:", error);
      throw error;
    }
  }
}

export const teacherAssignmentsService = new TeacherAssignmentsService();
export default teacherAssignmentsService;
