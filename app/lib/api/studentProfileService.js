import apiClient from "./client";
import { API_CONFIG } from "./config";

class StudentProfileService {
  // Get current student's profile
  async getMyProfile() {
    return apiClient.get("/student-profiles/profile/me");
  }

  // Create or update student profile
  async createOrUpdateProfile(profileData) {
    const formData = new FormData();

    // Add text fields
    formData.append("fullName", profileData.fullName || "");
    formData.append("email", profileData.email || "");
    formData.append("phoneNumber", profileData.phoneNumber || "");
    formData.append("dateOfBirth", profileData.dateOfBirth || "");
    formData.append("bio", profileData.bio || "");
    formData.append("program", profileData.program || "");
    formData.append("major", profileData.major || "");
    formData.append("gpa", profileData.gpa || "");
    formData.append("expectedGraduation", profileData.expectedGraduation || "");
    formData.append("academicStanding", profileData.academicStanding || "");
    formData.append("enrollmentDate", profileData.enrollmentDate || "");
    formData.append("preferredFormat", profileData.preferredFormat || "");
    formData.append("additionalNotes", profileData.additionalNotes || "");

    // Add JSON fields
    if (profileData.subjects) {
      formData.append("subjects", JSON.stringify(profileData.subjects));
    }
    if (profileData.availability) {
      formData.append("availability", JSON.stringify(profileData.availability));
    }

    // Add profile image if provided
    if (profileData.profileImage && profileData.profileImage instanceof File) {
      formData.append("profileImage", profileData.profileImage);
    }

    // Make request with FormData
    const token = localStorage.getItem("jwt_token");
    const response = await fetch(
      `${API_CONFIG.baseURL}/student-profiles/profile`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message: errorData.message || response.statusText,
        errors: errorData.errors || null,
      };
    }

    return response.json();
  }

  // Upload intro video
  async uploadIntroVideo(videoFile) {
    const formData = new FormData();
    formData.append("introVideo", videoFile);

    // Get JWT token for authentication
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw {
        status: 401,
        message: "Authentication token required",
        errors: null,
      };
    }

    

    // Call backend API endpoint
    const response = await fetch(`${API_CONFIG.baseURL}/student-profiles/profile/intro-video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it for FormData
      },
      body: formData,
    });

         if (!response.ok) {
       const errorData = await response.json();
       throw {
         status: response.status,
         message: errorData.message || response.statusText,
         errors: errorData.errors || null,
       };
     }

     const result = await response.json();

    return result;
  }

  // Delete intro video
  async deleteIntroVideo() {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      throw {
        status: 401,
        message: "Authentication token required",
        errors: null,
      };
    }

    const response = await fetch(`${API_CONFIG.baseURL}/student-profiles/profile/intro-video`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message: errorData.message || response.statusText,
        errors: errorData.errors || null,
      };
    }

    return response.json();
  }

  // Delete student profile
  async deleteProfile() {
    return apiClient.delete("/student-profiles/profile");
  }

  // Get all students (public)
  async getAllStudents(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.program) queryParams.append("program", params.program);
    if (params.major) queryParams.append("major", params.major);

    const queryString = queryParams.toString();
    const endpoint = `/student-profiles${queryString ? `?${queryString}` : ""}`;

    return apiClient.get(endpoint);
  }

  // Get student profile by ID (public)
  async getStudentById(id) {
    return apiClient.get(`/student-profiles/${id}`);
  }
}

export default new StudentProfileService();
