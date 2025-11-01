import apiClient from "./client";
import { API_CONFIG } from "./config";

class CounselorProfileService {
  // Get counselor profile by ID (public)
  async getCounselorById(id) {
    return apiClient.get(`/counselor-profiles/${id}`);
  }

  // Get current counselor's profile
  async getMyProfile() {
    return apiClient.get("/counselor-profiles/me");
  }

  // Create or update counselor profile
  async createOrUpdateProfile(profileData) {
    const formData = new FormData();

    // Add text fields
    formData.append("bio", profileData.bio || "");
    formData.append("experience", profileData.experience || 0);

    // Add JSON fields
    if (profileData.education) {
      formData.append("education", JSON.stringify(profileData.education));
    }
    if (profileData.certifications) {
      formData.append(
        "certifications",
        JSON.stringify(profileData.certifications)
      );
    }
    if (profileData.languages) {
      formData.append("languages", JSON.stringify(profileData.languages));
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
    const response = await fetch(`${API_CONFIG.baseURL}/counselor-profiles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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

    return response.json();
  }

  // Upload intro video
  async uploadIntroVideo(videoFile) {
    const formData = new FormData();
    formData.append("introVideo", videoFile);

    const token = localStorage.getItem("jwt_token");
    const response = await fetch(
      `${API_CONFIG.baseURL}/counselor-profiles/intro-video`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser set it for FormData
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

    const result = await response.json();

    // ✅ Backend returns Cloudinary URL directly
    console.log("Video uploaded successfully:", result.data?.introVideoUrl);

    return result;
  }

  // Delete intro video
  async deleteIntroVideo() {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch(
        `${API_CONFIG.baseURL}/counselor-profiles/intro-video`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Try to parse response as JSON
      let data;
      const responseText = await response.text();
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        console.error("Response text:", responseText);
        // If JSON parsing fails, try to extract error message from text
        data = {
          message: responseText || "Unknown error occurred",
          error: responseText || "Unknown error occurred"
        };
      }

      if (!response.ok) {
        // Handle different error status codes
        // Backend error format: { status: 'error', message: '...' }
        let errorMessage;
        
        // Extract message from various possible formats
        // Backend returns: { status: 'error', message: '...' }
        errorMessage = 
          data.message || 
          data.error || 
          response.statusText || 
          `Request failed with status ${response.status}`;
        
        // Provide more specific messages for common status codes
        if (response.status === 401) {
          errorMessage = errorMessage || "Authentication failed. Please log in again.";
        } else if (response.status === 403) {
          errorMessage = errorMessage || "You don't have permission to perform this action.";
        } else if (response.status === 404) {
          errorMessage = errorMessage || "Resource not found.";
        }
        
        throw {
          status: response.status,
          message: errorMessage,
          errors: data.errors || null,
          response: data,
        };
      }

      return data;
    } catch (err) {
      // If it's already our custom error object, re-throw it
      if (err.status && err.message) {
        throw err;
      }
      
      // Otherwise, wrap network errors and other exceptions
      throw {
        status: err.status || 500,
        message: err.message || "Network error: Failed to delete video. Please check your connection.",
        errors: null,
      };
    }
  }

  // Update profile image
  async updateProfileImage(imageFile) {
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    const token = localStorage.getItem("jwt_token");
    const response = await fetch(
      `${API_CONFIG.baseURL}/counselor-profiles/profile-image`,
      {
        method: "POST",
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
}

export const counselorProfileService = new CounselorProfileService();
export default counselorProfileService;
