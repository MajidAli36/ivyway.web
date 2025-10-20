import apiClient from "./client";

class TeacherProfileService {
  // Create Teacher Profile
  async createProfile(profileData) {
    try {
      const response = await apiClient.post("/teacher/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      throw error;
    }
  }

  // Get Teacher Profile
  async getProfile() {
    try {
      const response = await apiClient.get("/teacher/profile");
      return response;
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      throw error;
    }
  }

  // Update Teacher Profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put("/teacher/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error updating teacher profile:", error);
      throw error;
    }
  }

  // Get Dashboard Data
  async getDashboard() {
    try {
      const response = await apiClient.get("/teacher/dashboard");
      return response;
    } catch (error) {
      console.error("Error fetching teacher dashboard:", error);
      throw error;
    }
  }
}

export const teacherProfileService = new TeacherProfileService();
export default teacherProfileService;
