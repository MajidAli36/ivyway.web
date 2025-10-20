import { useState, useEffect, useCallback, useRef } from "react";
import studentProfileService from "../lib/api/studentProfileService";

/**
 * Custom hook for student profile state management
 * Provides loading states, error handling, and data fetching logic
 */
const useStudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef(null);

  // Function to fetch student profile
  const fetchProfile = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setError(null);
      setLoading(true);

      const response = await studentProfileService.getMyProfile();
      setProfile(response.data || response);

      return response.data || response;
    } catch (err) {
      if (err.name === "AbortError") {
        return; // Request was cancelled
      }

      console.error("Student profile fetch error:", err);
      setError(err.message || "Failed to load student profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update student profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      setIsSaving(true);

      const response = await studentProfileService.createOrUpdateProfile(
        profileData
      );
      setProfile(response.data || response);

      return true;
    } catch (err) {
      console.error("Student profile update error:", err);
      setError(err.message || "Failed to update student profile");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Function to upload intro video
  const uploadIntroVideo = useCallback(async (videoFile) => {
    try {
      setError(null);
      setIsSaving(true);
      setUploadProgress(0);

      // Simulate upload progress (in real implementation, you'd use XMLHttpRequest or fetch with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await studentProfileService.uploadIntroVideo(videoFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update profile with new video URL
      setProfile((prev) => ({
        ...prev,
        introVideoUrl: response.data?.introVideoUrl || response.introVideoUrl,
      }));

      return true;
    } catch (err) {
      console.error("Intro video upload error:", err);
      setError(err.message || "Failed to upload intro video");
      return false;
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  }, []);

  // Function to delete student profile
  const deleteProfile = useCallback(async () => {
    try {
      setError(null);
      setIsSaving(true);

      await studentProfileService.deleteProfile();
      setProfile(null);

      return true;
    } catch (err) {
      console.error("Student profile delete error:", err);
      setError(err.message || "Failed to delete student profile");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Function to set editing mode
  const setEditingMode = useCallback((editing) => {
    setIsEditing(editing);
    if (!editing) {
      setError(null);
    }
  }, []);

  // Function to clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Function to refresh profile
  const refreshProfile = useCallback(async () => {
    try {
      await fetchProfile();
    } catch (err) {
      console.error("Profile refresh error:", err);
    }
  }, [fetchProfile]);

  // Initial load - only fetch once when component mounts
  useEffect(() => {
    fetchProfile();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array to prevent re-fetching

  return {
    // State
    profile,
    loading,
    error,
    isEditing,
    isSaving,
    uploadProgress,

    // Actions
    fetchProfile,
    updateProfile,
    uploadIntroVideo,
    deleteProfile,
    setEditingMode,
    clearError,
    refreshProfile,
  };
};

export default useStudentProfile;
