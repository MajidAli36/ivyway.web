"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import studentProfileService from "../../../lib/api/studentProfileService";
import { analyzeProfileFields } from "@/app/utils/profileFieldAnalysis";
import { useTwoFAModal } from "@/app/providers/TwoFAModalProvider";
import { apiClient } from "@/app/lib/api/client";
import TwoFAModal from "@/app/components/profile/TwoFAModal";
import SuccessModal from "@/app/components/shared/SuccessModal";

// Utility to get full file URL
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ivyway-backend-iu4z.onrender.com/api";
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Handle uploads path - use API route instead of direct file access
  if (path.startsWith("/uploads/")) {
    return `${API_BASE}${path}`;
  }

  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }

  return `${API_BASE}/${path}`;
};

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    bio: "",
    profileImage: null,
    profileImageUrl: "",

    // Academic Information
    program: "",
    major: "",
    gpa: "",
    expectedGraduation: "",
    academicStanding: "",
    enrollmentDate: "",

    // Tutoring Preferences
    subjects: [],
    availability: [],
    preferredFormat: "",
    additionalNotes: "",

    // Additional Information
    introVideoUrl: "",
    profileCompletion: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 2FA States - Updated to match tutor/counselor profiles
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASuccess, setShow2FASuccess] = useState(false);
  const [twoFAStatusMsg, setTwoFAStatusMsg] = useState("");
  const [disable2FALoading, setDisable2FALoading] = useState(false);
  const { open2FAModal } = useTwoFAModal();

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Load profile data from API
  useEffect(() => {
    loadProfile();
  }, []);

  // Debug formData changes
  useEffect(() => {
    console.log("FormData updated:", formData);
  }, [formData]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await studentProfileService.getMyProfile();

      if (response.data) {
        // The actual data is in response.data
        const userData = response.data;
        const profile = userData.studentProfile;

        console.log("API Response:", response);
        console.log("User Data:", userData);
        console.log("Profile Data:", profile);

        const formDataToSet = {
          // Personal Information - from userData (always available)
          fullName: userData.fullName || "",
          email: userData.email || "",
          // Profile-specific fields - from profile (may be null)
          phoneNumber: profile?.phoneNumber || "",
          dateOfBirth: profile?.dateOfBirth || "",
          bio: profile?.bio || "",
          profileImage: null,
          profileImageUrl: profile?.profileImage || "",
          // Academic Information
          program: profile?.program || "",
          major: profile?.major || "",
          gpa: profile?.gpa || "",
          expectedGraduation: profile?.expectedGraduation || "",
          academicStanding: profile?.academicStanding || "",
          enrollmentDate: profile?.enrollmentDate || "",
          // Tutoring Preferences
          subjects: profile?.subjects || [],
          availability: profile?.availability || [],
          preferredFormat: profile?.preferredFormat || "",
          additionalNotes: profile?.additionalNotes || "",
          // Additional Information
          introVideoUrl: profile?.introVideoUrl || "",
          profileCompletion: profile?.profileCompletion || 0,
        };

        console.log("Form Data to Set:", formDataToSet);
        setFormData(formDataToSet);

        // Set 2FA status - Handle both camelCase and underscore formats
        setIs2FAEnabled(
          userData.is_2fa_enabled || userData.is2FAEnabled || false
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate profile completion using comprehensive field analysis
  const getProfileCompletionData = () => {
    return analyzeProfileFields(formData, "student");
  };

  const profileCompletionData = getProfileCompletionData();

  // Get missing fields for completion indicator (using weighted system fields)
  const getMissingFields = () => {
    const missing = [];
    const fieldLabels = {
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      bio: "Bio",
      profileImageUrl: "Profile Image", // Use profileImageUrl instead of profileImage
      program: "Program",
      major: "Major",
      gpa: "GPA",
      expectedGraduation: "Expected Graduation",
      academicStanding: "Academic Standing",
      enrollmentDate: "Enrollment Date",
      subjects: "Subjects",
      availability: "Availability",
      preferredFormat: "Preferred Format",
      introVideoUrl: "Intro Video",
    };

    Object.keys(fieldLabels).forEach((field) => {
      const value = formData[field];
      if (Array.isArray(value)) {
        if (value.length === 0) missing.push(fieldLabels[field]);
      } else if (field === "profileImageUrl" || field === "introVideoUrl") {
        // Safe string check for URL fields
        if (!value || typeof value !== "string" || value.trim() === "") {
          missing.push(fieldLabels[field]);
        }
      } else if (!value || value.toString().trim() === "") {
        missing.push(fieldLabels[field]);
      }
    });

    return missing;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    const currentArray = formData[field] || [];
    if (currentArray.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: currentArray.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: [...currentArray, value],
      }));
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file),
      }));
      setError("");
    }
  };

  const handleVideoUpload = async (videoFile) => {
    try {
      setIsSaving(true);
      setError("");
      setUploadProgress(0);

      // Simulate upload progress (in real implementation, you'd track actual progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await studentProfileService.uploadIntroVideo(videoFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Handle different backend response formats
      if (response.success && response.data) {
        // Check if data contains the video URL directly
        if (
          typeof response.data === "string" &&
          response.data.includes("successfully")
        ) {
          // Backend returned success message string
          setSuccessMessage("Intro video uploaded successfully!");
          setTimeout(() => setSuccessMessage(""), 5000);

          // Reload profile to get updated video URL
          await loadProfile();
          return;
        }

        // Check if data contains introVideoUrl object
        if (response.data.introVideoUrl) {
          setFormData((prev) => ({
            ...prev,
            introVideoUrl: response.data.introVideoUrl,
          }));

          // Update profile completion if provided
          if (response.data.profileCompletion !== undefined) {
            setFormData((prev) => ({
              ...prev,
              profileCompletion: response.data.profileCompletion,
            }));
          }

          setSuccessMessage("Intro video uploaded successfully!");
          setTimeout(() => setSuccessMessage(""), 5000);
          return;
        }
      }

      // If we reach here, the response format is unexpected
      throw new Error("Unexpected response format from server");
    } catch (err) {
      // Handle specific error cases based on backend response
      if (
        err.message?.includes("File too large") ||
        err.message?.includes("Maximum size is 100MB")
      ) {
        setError("File size must be less than 100MB");
      } else if (err.message?.includes("Only video files are allowed")) {
        setError("Please select a valid video file");
      } else if (err.message?.includes("Student profile not found")) {
        setError("Please create your profile first before uploading videos");
      } else if (err.message?.includes("Authentication token required")) {
        setError("Please log in again to continue");
      } else if (
        err.message?.includes("Video upload service") ||
        err.message?.includes("Cloudinary")
      ) {
        setError(
          "Upload service temporarily unavailable. Please try again later."
        );
      } else {
        setError(err.message || "Upload failed. Please try again.");
      }
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type - match backend supported formats with MIME type variations
      const allowedTypes = [
        "video/mp4",
        "video/mpeg",
        "video/mp4v-es", // MP4 variations
        "video/quicktime",
        "video/mov", // MOV variations
        "video/avi",
        "video/x-msvideo", // AVI variations
        "video/webm", // WebM
        "video/mkv",
        "video/x-matroska", // MKV variations
      ];

      // Also check file extension as fallback
      const fileExtension = file.name.toLowerCase().split(".").pop();
      const allowedExtensions = ["mp4", "mov", "avi", "webm", "mkv"];

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {
        setError(
          `File type "${file.type}" not supported. Please select a valid video file (MP4, MOV, AVI, WebM, or MKV)`
        );
        return;
      }

      // Validate file size (100MB limit for videos - matches backend)
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB");
        return;
      }

      // Clear any previous errors
      setError("");

      // Upload the video immediately
      handleVideoUpload(file);
    }
  };

  // 2FA Functions - Updated to match tutor/counselor profiles
  const handleEnable2FA = async () => {
    if (disable2FALoading) {
      return;
    }
    setTwoFAStatusMsg("");
    try {
      const response = await apiClient.post("/2fa/setup");
      if (response.qrCode && response.secret) {
        open2FAModal({
          qrCode: response.qrCode,
          secret: response.secret,
          onVerify: () => {
            setIs2FAEnabled(true);
            setShow2FASuccess(true);
            setTwoFAStatusMsg("Two-factor authentication enabled!");
            setTimeout(() => setShow2FASuccess(false), 3000);
          },
        });
      } else {
        setTwoFAStatusMsg("Failed to initiate 2FA setup. Please try again.");
      }
    } catch (err) {
      setTwoFAStatusMsg(err.message || "Failed to initiate 2FA setup.");
    }
  };

  const handleDisable2FA = async () => {
    setDisable2FALoading(true);
    setTwoFAStatusMsg("");
    try {
      const response = await apiClient.post("/2fa/disable");
      if (
        response.success ||
        response.message?.toLowerCase().includes("disabled")
      ) {
        setIs2FAEnabled(false);
        setTwoFAStatusMsg("Two-factor authentication disabled successfully.");
      } else {
        setTwoFAStatusMsg(response.message || "Failed to disable 2FA.");
      }
    } catch (err) {
      setTwoFAStatusMsg(err.message || "Failed to disable 2FA.");
    } finally {
      setDisable2FALoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const profileData = {
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        program: formData.program,
        major: formData.major,
        gpa: formData.gpa,
        expectedGraduation: formData.expectedGraduation,
        academicStanding: formData.academicStanding,
        enrollmentDate: formData.enrollmentDate,
        preferredFormat: formData.preferredFormat,
        additionalNotes: formData.additionalNotes,
        subjects: formData.subjects,
        availability: formData.availability,
        profileImage: formData.profileImage,
      };

      const response = await studentProfileService.createOrUpdateProfile(
        profileData
      );

      if (response.data) {
        console.log("Student profile update successful, showing success modal");
        setIsEditing(false);
        setShowSuccessModal(true);

        // Reload profile to get updated data
        await loadProfile();
      } else {
        console.log("Student profile update response:", response);
        throw new Error("Profile update failed - no data response");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
    setShowSuccessModal(false);
    // Reset profile image if not saved
    if (formData.profileImage) {
      setFormData((prev) => ({
        ...prev,
        profileImage: null,
        profileImageUrl: prev.profileImageUrl,
      }));
    }
  };

  const profileCompletion = profileCompletionData.percentage;
  const missingFields = profileCompletionData.missingFields.map(field => field.label);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white shadow rounded-lg p-8">
              <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your profile information and tutoring preferences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadProfile}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Completion Indicator */}
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Profile Completion
            </h3>
            <span className="text-sm font-medium text-gray-500">
              {profileCompletion}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>

          {missingFields.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Missing information:</p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="p-8">
            {/* Profile Photo Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Photo
                </h2>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {formData.profileImageUrl ? (
                      <img
                        src={formData.profileImageUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <CameraIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {formData.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Change photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
                Two-Factor Authentication (2FA)
                {is2FAEnabled && (
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-500"
                    title="2FA Enabled"
                  />
                )}
              </h3>
              <div className="flex items-center gap-4">
                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    is2FAEnabled
                      ? "bg-green-100 text-green-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {is2FAEnabled ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Enabled
                    </>
                  ) : (
                    <>
                      <ShieldExclamationIcon className="h-4 w-4 mr-1" />{" "}
                      Disabled
                    </>
                  )}
                </span>

                {/* Action button */}
                {is2FAEnabled ? (
                  <button
                    className={`px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all ${
                      disable2FALoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    onClick={handleDisable2FA}
                    type="button"
                    disabled={disable2FALoading}
                  >
                    {disable2FALoading ? "Disabling..." : "Disable 2FA"}
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleEnable2FA}
                    type="button"
                  >
                    Enable 2FA
                  </button>
                )}
              </div>
              {!is2FAEnabled && (
                <p className="mt-2 text-xs text-gray-500">
                  Add an extra layer of security. You’ll scan a QR code and use
                  a one-time code from your authenticator app.
                </p>
              )}
              {show2FASuccess && (
                <div className="mt-2 text-green-600 text-sm font-semibold">
                  2FA enabled successfully!
                </div>
              )}
              {twoFAStatusMsg && !show2FASuccess && (
                <div className="mt-2 text-blue-600 text-sm">
                  {twoFAStatusMsg}
                </div>
              )}
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <UserIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Full name cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Academic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) =>
                      handleInputChange("program", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Program</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major/Field of Study
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Standing
                  </label>
                  <select
                    value={formData.academicStanding}
                    onChange={(e) =>
                      handleInputChange("academicStanding", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Standing</option>
                    <option value="Good Standing">Good Standing</option>
                    <option value="Academic Probation">
                      Academic Probation
                    </option>
                    <option value="Academic Warning">Academic Warning</option>
                    <option value="Dean's List">Dean's List</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={(e) =>
                      handleInputChange("enrollmentDate", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Graduation Year
                  </label>
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    value={formData.expectedGraduation}
                    onChange={(e) =>
                      handleInputChange("expectedGraduation", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="e.g., 2027"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Tutoring Preferences Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Tutoring Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Format
                  </label>
                  <select
                    value={formData.preferredFormat}
                    onChange={(e) =>
                      handleInputChange("preferredFormat", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Format</option>
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects You Need Help With
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Mathematics",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "English",
                    "History",
                    "Programming",
                    "Economics",
                  ].map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(subject)}
                        onChange={() => handleArrayChange("subjects", subject)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Availability
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(day)}
                        onChange={() => handleArrayChange("availability", day)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    handleInputChange("additionalNotes", e.target.value)
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Any additional information about your tutoring preferences..."
                />
              </div>
            </div>

            {/* Intro Video Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <VideoCameraIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Intro Video
                </h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                {formData.introVideoUrl ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Intro video uploaded
                    </p>
                    <video
                      src={getFullUrl(formData.introVideoUrl)}
                      controls
                      className="mx-auto max-w-md mb-4 rounded-lg shadow-md"
                      preload="metadata"
                      onError={(e) => {
                        setError("Video loading error - please try again");
                      }}
                    />
                    {isEditing && (
                      <div className="flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Replace Video
                        </button>
                        {/* <button
                          type="button"
                          onClick={async () => {
                            try {
                              await studentProfileService.deleteIntroVideo();
                              setFormData((prev) => ({
                                ...prev,
                                introVideoUrl: "",
                              }));
                              setSuccessMessage("Video removed successfully!");
                              setTimeout(() => setSuccessMessage(""), 3000);
                                                         } catch (err) {
                               setError(
                                 "Failed to remove video. Please try again."
                               );
                             }
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Video
                        </button> */}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      No intro video uploaded
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Upload a short video introducing yourself (max 100MB)
                    </p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <VideoCameraIcon className="h-4 w-4 mr-2" />
                        Upload Video
                      </button>
                    )}
                  </div>
                )}

                {isSaving && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadProgress > 0
                        ? `Uploading... ${uploadProgress}%`
                        : "Starting upload..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </form>

        <TwoFAModal />
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="profile"
          title="Student Profile Updated Successfully!"
          message="Your student profile has been updated successfully. All changes have been saved and your profile is now up to date."
        />
      </div>
    </div>
  );
};

export default StudentProfile;
