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

    // Add text fields - only append if value exists (skip empty strings for optional fields)
    if (profileData.fullName) formData.append("fullName", profileData.fullName);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.phoneNumber) formData.append("phoneNumber", profileData.phoneNumber);
    if (profileData.dateOfBirth) formData.append("dateOfBirth", profileData.dateOfBirth);
    if (profileData.bio) formData.append("bio", profileData.bio);
    if (profileData.program) formData.append("program", profileData.program);
    if (profileData.major) formData.append("major", profileData.major);
    if (profileData.gpa !== null && profileData.gpa !== undefined && profileData.gpa !== "") {
      formData.append("gpa", profileData.gpa);
    }
    if (profileData.expectedGraduation !== null && profileData.expectedGraduation !== undefined && profileData.expectedGraduation !== "") {
      formData.append("expectedGraduation", profileData.expectedGraduation);
    }
    // Only append enum/optional fields if they have a value (not null, undefined, or empty string)
    if (profileData.academicStanding && profileData.academicStanding.trim() !== "") {
      formData.append("academicStanding", profileData.academicStanding);
    }
    if (profileData.enrollmentDate) formData.append("enrollmentDate", profileData.enrollmentDate);
    if (profileData.preferredFormat && profileData.preferredFormat.trim() !== "") {
      formData.append("preferredFormat", profileData.preferredFormat);
    }
    if (profileData.additionalNotes) formData.append("additionalNotes", profileData.additionalNotes);

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
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, create a user-friendly error
        errorData = {
          message: response.status === 400 
            ? "Please check all fields and ensure they contain valid information."
            : response.status === 401
            ? "Please log in again to continue."
            : response.status === 403
            ? "You don't have permission to perform this action."
            : response.status === 500
            ? "Server error. Please try again later."
            : "Unable to save your profile. Please try again.",
          errors: null
        };
      }
      
      // Convert technical error messages to user-friendly ones
      let errorMessage = errorData.message || response.statusText || "Failed to update profile";
      
      if (errorMessage.includes("enum") && errorMessage.includes("preferredFormat")) {
        errorMessage = "Please select a valid tutoring format (Online, In-Person, or Hybrid), or leave it blank.";
      } else if (errorMessage.includes("enum") && errorMessage.includes("academicStanding")) {
        errorMessage = "Please select a valid academic standing, or leave it blank.";
      } else if (errorMessage.includes("enum")) {
        errorMessage = "Please select a valid option from the dropdown menu.";
      } else if (errorMessage.includes("invalid input") || errorMessage.includes("invalid value")) {
        errorMessage = "Please ensure all fields contain valid information.";
      } else if (errorMessage.includes("ValidationError") || errorMessage.includes("Sequelize")) {
        errorMessage = "Please check your input and try again.";
      }
      
      throw {
        status: response.status,
        message: errorMessage,
        response: { data: errorData },
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
