"use client";

/**
 * Tutor Profile Page - Intro Video Upload Implementation
 *
 * API Endpoint: POST /api/tutors/profile/intro-video
 * File Size Limit: 100MB
 * Supported Formats: MP4, MOV, AVI, WebM, MKV
 *
 * Key Features:
 * - Immediate video upload upon file selection
 * - Cloudinary URL returned directly from backend
 * - Comprehensive file validation
 * - Progress tracking and error handling
 * - Direct video display (no URL construction needed)
 */

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  LanguageIcon,
  PlusIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { ENHANCED_SUBJECTS, getAllSubjects } from "@/app/constants/enhancedSubjects";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTwoFAModal } from "@/app/providers/TwoFAModalProvider";
import { apiClient } from "@/app/lib/api/client";
import apiClientClass from "@/app/lib/api/client";
import TwoFAModal from "@/app/components/profile/TwoFAModal";
import SuccessModal from "@/app/components/shared/SuccessModal";
import { API_CONFIG } from "@/app/lib/api/config";

// Utility to get full file URL
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  // Handle uploads path - use API route instead of direct file access
  if (path.startsWith("/uploads/")) {
    return `${API_CONFIG.baseURL}${path}`;
  }

  if (path.startsWith("/")) {
    return `${API_CONFIG.baseURL}${path}`;
  }

  return `${API_CONFIG.baseURL}/${path}`;
};

// Validation schema for tutor profile
const tutorProfileSchema = Yup.object().shape({
  // Personal Information
  phoneNumber: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .nullable(),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .nullable(),
  bio: Yup.string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must be less than 1000 characters")
    .nullable(),

  // Academic Information
  education: Yup.string()
    .min(2, "Education level must be at least 2 characters")
    .max(100, "Education level must be less than 100 characters")
    .nullable(),
  degree: Yup.string()
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must be less than 100 characters")
    .nullable(),
  graduationYear: Yup.string()
    .matches(/^(19|20)\d{2}$/, "Please enter a valid graduation year (1900-2099)")
    .nullable(),
  experience: Yup.number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .nullable(),

  // Tutoring Information
  subjects: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one subject")
    .max(10, "You can select up to 10 subjects"),
  certifications: Yup.array()
    .of(Yup.string().min(2, "Certification must be at least 2 characters"))
    .nullable(),

  // IWGSP Fields
  isIWGSPTutor: Yup.boolean(),
  iwgspSubjectExpertise: Yup.array()
    .of(Yup.string().min(2, "Subject must be at least 2 characters"))
    .nullable(),
  iwgspLanguageFluency: Yup.array()
    .of(Yup.string())
    .nullable(),
  iwgspInternationalExperience: Yup.string()
    .max(1000, "International experience must be less than 1000 characters")
    .nullable(),

  // Profile Image
  profileImage: Yup.mixed()
    .nullable()
    .test("fileSize", "File size must be less than 10MB", (value) => {
      if (!value) return true;
      return value.size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      return value.type.startsWith("image/");
    }),
});

const TutorProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    profileImage: null,
    profileImageUrl: "",

    // Academic Information
    education: "",
    degree: "",
    graduationYear: "",
    experience: 0,

    // Tutor-specific Information
    subjects: [],
    certifications: [],

    // IWGSP fields
    isIWGSPTutor: false,
    iwgspSubjectExpertise: [],
    iwgspLanguageFluency: [],
    iwgspInternationalExperience: "",

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

  // 2FA States - Matching student profile
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

  // Debug: Log formData changes
  useEffect(() => {
    console.log("FormData updated:", formData);
  }, [formData]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await apiClientClass.get("/tutors/profile/me");

      console.log("Full API Response:", response);

      if (response && response.success) {
        const userData = response.data;
        const profile = userData.tutorProfile;

        console.log("User data:", userData);
        console.log("Profile data:", profile);

        const formDataToSet = {
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: profile?.phoneNumber || "",
          location: profile?.location || "",
          bio: profile?.bio || "",
          profileImage: null,
          profileImageUrl: profile?.profileImageUrl || "",
          education: profile?.education || "",
          degree: profile?.degree || "",
          graduationYear: profile?.graduationYear || "",
          experience: profile?.experience || 0,
          subjects: profile?.subjects || [],
          certifications: profile?.certifications || [],
          isIWGSPTutor: profile?.isIWGSPTutor || false,
          iwgspSubjectExpertise: profile?.iwgspSubjectExpertise || [],
          iwgspLanguageFluency: profile?.iwgspLanguageFluency || [],
          iwgspInternationalExperience:
            profile?.iwgspInternationalExperience || "",
          introVideoUrl: profile?.introVideoUrl || "",
          profileCompletion: profile?.profileCompletion || 0,
        };

        console.log("Form data to set:", formDataToSet);
        setFormData(formDataToSet);

        // Set 2FA status - Handle both camelCase and underscore formats
        setIs2FAEnabled(
          userData.is_2fa_enabled || userData.is2FAEnabled || false
        );
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Use backend profile completion instead of frontend calculation
  const profileCompletion = formData.profileCompletion || 0;

  // Handle field click for navigation
  const handleFieldClick = (field) => {
    // Scroll to the relevant section
    const element = document.getElementById(field.key);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image file size must be less than 10MB");
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

      const formData = new FormData();
      formData.append("introVideo", videoFile);
      const response = await fetch(`${API_CONFIG.baseURL}/tutors/profile/intro-video`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiClientClass.getAuthToken()}`,
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok && data.success && data.data?.introVideoUrl) {
        // ✅ Backend returns Cloudinary URL directly
        console.log("Video uploaded successfully:", data.data.introVideoUrl);
        setFormData((prev) => ({
          ...prev,
          introVideoUrl: data.data.introVideoUrl,
        }));
        setSuccessMessage("Intro video uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading video:", err);

      // Handle specific error cases
      if (err.message?.includes("File too large")) {
        setError("File size must be less than 100MB");
      } else if (err.message?.includes("Video upload service")) {
        setError("Upload service temporarily unavailable");
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
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file");
        return;
      }

      // Validate file size (100MB limit for videos)
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB");
        return;
      }

      // Validate supported formats
      const supportedFormats = ["mp4", "mov", "avi", "webm", "mkv"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!supportedFormats.includes(fileExtension)) {
        setError(
          "Unsupported video format. Please use MP4, MOV, AVI, WebM, or MKV"
        );
        return;
      }

      // Upload the video immediately
      handleVideoUpload(file);
    } catch (error) {
      setError(error.message || "Invalid video file");
    }
  };

  // 2FA Functions - Matching student profile
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

  const handleFormSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsSaving(true);
    setError("");

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append("phoneNumber", values.phoneNumber || "");
      formDataToSend.append("location", values.location || "");
      formDataToSend.append("bio", values.bio || "");
      formDataToSend.append("education", values.education || "");
      formDataToSend.append("degree", values.degree || "");
      formDataToSend.append("graduationYear", values.graduationYear || "");
      formDataToSend.append("experience", values.experience || 0);

      // Handle arrays properly - append each item individually
      if (values.subjects && values.subjects.length > 0) {
        values.subjects.forEach((subject, index) => {
          formDataToSend.append(`subjects[${index}]`, subject);
        });
      }

      if (values.certifications && values.certifications.length > 0) {
        values.certifications.forEach((cert, index) => {
          formDataToSend.append(`certifications[${index}]`, cert);
        });
      }

      formDataToSend.append("isIWGSPTutor", values.isIWGSPTutor || false);

      // Handle IWGSP arrays properly
      if (values.iwgspSubjectExpertise && values.iwgspSubjectExpertise.length > 0) {
        values.iwgspSubjectExpertise.forEach((subject, index) => {
          formDataToSend.append(`iwgspSubjectExpertise[${index}]`, subject);
        });
      }

      if (values.iwgspLanguageFluency && values.iwgspLanguageFluency.length > 0) {
        values.iwgspLanguageFluency.forEach((language, index) => {
          formDataToSend.append(`iwgspLanguageFluency[${index}]`, language);
        });
      }

      formDataToSend.append("iwgspInternationalExperience", values.iwgspInternationalExperience || "");

      // Add the profile image if it exists and is a File object
      if (values.profileImage && values.profileImage instanceof File) {
        formDataToSend.append("profileImage", values.profileImage);
      }

      // Get auth token
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Make the request with FormData
      const response = await fetch(`${API_CONFIG.baseURL}/tutors/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await response.json();

      if (result && result.success) {
        console.log("Profile update successful, showing success modal");
        setIsEditing(false);
        setShowSuccessModal(true);

        // Reload profile to get updated data
        await loadProfile();
      } else {
        console.log("Profile update response:", result);
        throw new Error("Profile update failed - no success response");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
      setSubmitting(false);
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
                Tutor Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your profile information and tutoring expertise
              </p>
            </div>
            <div className="flex items-center space-x-3">
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

          {profileCompletion < 100 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Complete your profile to get more students and better visibility.
              </p>
              <p className="text-xs text-gray-500">
                Add missing information to increase your profile completion percentage.
              </p>
            </div>
          )}
        </div>

        {/* Main Form */}
        <Formik
          initialValues={formData}
          validationSchema={tutorProfileSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="bg-white shadow rounded-lg">
          <div className="p-8">
            {/* Profile Photo Section */}
            <div id="profileImageUrl" className="mb-8">
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
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />{" "}
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
                  Add an extra layer of security. You'll scan a QR code and use
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
                  <Field
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.phoneNumber && touched.phoneNumber
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Enter your city, state, or country"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.location && touched.location
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.location && touched.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>

              <div id="bio" className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Field
                  as="textarea"
                  name="bio"
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Tell students about yourself and your teaching approach. Describe your experience, teaching style, and what makes you unique as a tutor..."
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.bio && touched.bio
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {errors.bio && touched.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                )}
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
                <div id="education">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highest Education Level
                  </label>
                  <Field
                    type="text"
                    name="education"
                    placeholder="e.g., Bachelor's Degree, Master's Degree, PhD"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.education && touched.education
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.education && touched.education && (
                    <p className="mt-1 text-sm text-red-600">{errors.education}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree
                  </label>
                  <Field
                    type="text"
                    name="degree"
                    placeholder="e.g., Computer Science, Mathematics, Physics"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.degree && touched.degree
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.degree && touched.degree && (
                    <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <Field
                    type="text"
                    name="graduationYear"
                    placeholder="e.g., 2020, 2021, 2022"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.graduationYear && touched.graduationYear
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.graduationYear && touched.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
                  )}
                </div>

                <div id="experience">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years)
                  </label>
                  <Field
                    type="number"
                    name="experience"
                    min="0"
                    max="50"
                    placeholder="0"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.experience && touched.experience
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.experience && touched.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tutoring Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Tutoring Information
                </h2>
              </div>

              <div id="subjects">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects You Teach *
                </label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {getAllSubjects().map((subject) => (
                        <label key={subject} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                          values.subjects?.includes(subject) 
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}>
                          <input
                            type="checkbox"
                            checked={values.subjects?.includes(subject) || false}
                            onChange={(e) => {
                              const currentSubjects = values.subjects || [];
                              if (e.target.checked) {
                                if (currentSubjects.length < 10) {
                                  setFieldValue("subjects", [...currentSubjects, subject]);
                                }
                              } else {
                                setFieldValue("subjects", currentSubjects.filter(s => s !== subject));
                              }
                            }}
                            disabled={!values.subjects?.includes(subject) && values.subjects?.length >= 10}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 accent-blue-600 checked:bg-blue-600 checked:border-blue-600"
                            style={{ accentColor: '#2563eb' }}
                          />
                          <span className={`text-sm font-medium truncate transition-colors duration-200 ${
                            values.subjects?.includes(subject) 
                              ? 'text-blue-700' 
                              : 'text-gray-700'
                          }`} title={subject}>
                            {subject}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">
                        {values.subjects?.length || 0}/10 subjects selected
                      </span>
                      {values.subjects?.length >= 10 && (
                        <span className="text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                          Maximum subjects reached
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {values.subjects && values.subjects.length > 0 ? (
                      values.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No subjects selected</p>
                    )}
                  </div>
                )}
                {errors.subjects && touched.subjects && (
                  <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
                )}
              </div>

              <div id="certifications" className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                {isEditing ? (
                  <FieldArray name="certifications">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.certifications?.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Field
                              type="text"
                              name={`certifications.${index}`}
                              className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                errors.certifications?.[index] ? "border-red-300" : "border-gray-300"
                              }`}
                              placeholder="e.g., Teaching Certificate, Professional License"
                            />
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={() => remove(index)}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                          onClick={() => push("")}
                        >
                          <PlusIcon className="h-5 w-5" />
                          Add Certification
                        </button>
                        {errors.certifications && typeof errors.certifications === 'string' && (
                          <p className="text-sm text-red-600">{errors.certifications}</p>
                        )}
                      </div>
                    )}
                  </FieldArray>
                ) : (
                  <div className="space-y-2">
                    {values.certifications && values.certifications.length > 0 ? (
                      values.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          {cert}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No certifications added
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* IWGSP Tutor Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <LanguageIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  IWGSP Tutor Support
                </h2>
              </div>

              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Field
                  id="isIWGSPTutor"
                  name="isIWGSPTutor"
                  type="checkbox"
                  disabled={!isEditing}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 accent-blue-600 checked:bg-blue-600 checked:border-blue-600"
                  style={{ accentColor: '#2563eb' }}
                />
                <label
                  htmlFor="isIWGSPTutor"
                  className="ml-3 block text-sm text-gray-700 font-medium cursor-pointer"
                >
                  I want to be an IWGSP Tutor
                </label>
              </div>

              {values.isIWGSPTutor && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IWGSP Subject Expertise
                    </label>
                    {isEditing ? (
                      <FieldArray name="iwgspSubjectExpertise">
                        {({ push, remove }) => (
                          <div className="space-y-2">
                            {values.iwgspSubjectExpertise?.map((subject, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Field
                                  type="text"
                                  name={`iwgspSubjectExpertise.${index}`}
                                  className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.iwgspSubjectExpertise?.[index] ? "border-red-300" : "border-gray-300"
                                  }`}
                                  placeholder="e.g., Mathematics, Computer Science, Physics"
                                />
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-700 p-1"
                                  onClick={() => remove(index)}
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                              onClick={() => push("")}
                            >
                              <PlusIcon className="h-5 w-5" />
                              Add Subject
                            </button>
                            {errors.iwgspSubjectExpertise && typeof errors.iwgspSubjectExpertise === 'string' && (
                              <p className="text-sm text-red-600">{errors.iwgspSubjectExpertise}</p>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {values.iwgspSubjectExpertise && values.iwgspSubjectExpertise.length > 0 ? (
                          values.iwgspSubjectExpertise.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No subjects specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IWGSP Language Fluency
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {[
                        "English",
                        "Spanish",
                        "French",
                        "Mandarin",
                        "Arabic",
                        "Hindi",
                        "German",
                        "Other",
                      ].map((language) => (
                        <label key={language} className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                          values.iwgspLanguageFluency?.includes(language) 
                            ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100' 
                            : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}>
                          <Field
                            type="checkbox"
                            name="iwgspLanguageFluency"
                            value={language}
                            disabled={!isEditing}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 accent-blue-600 checked:bg-blue-600 checked:border-blue-600"
                            style={{ accentColor: '#2563eb' }}
                          />
                          <span className={`text-sm font-medium transition-colors duration-200 ${
                            values.iwgspLanguageFluency?.includes(language) 
                              ? 'text-blue-700' 
                              : 'text-gray-700'
                          }`}>
                            {language}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IWGSP International Student Experience
                    </label>
                    <Field
                      as="textarea"
                      name="iwgspInternationalExperience"
                      rows={3}
                      disabled={!isEditing}
                      placeholder="Describe your experience working with international students. Include any specific challenges you've helped them overcome, cultural sensitivity, and success stories..."
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                        errors.iwgspInternationalExperience && touched.iwgspInternationalExperience
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.iwgspInternationalExperience && touched.iwgspInternationalExperience && (
                      <p className="mt-1 text-sm text-red-600">{errors.iwgspInternationalExperience}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Intro Video Section */}
            <div id="introVideoUrl" className="mb-8">
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
                      src={formData.introVideoUrl}
                      controls
                      className="mx-auto max-w-md mb-4 rounded-lg shadow-md"
                      preload="metadata"
                      onError={(e) => {
                        console.error("Video loading error:", e);
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
                              // Add delete video logic here
                              setFormData((prev) => ({
                                ...prev,
                                introVideoUrl: "",
                              }));
                              setSuccessMessage("Video removed successfully!");
                              setTimeout(() => setSuccessMessage(""), 3000);
                            } catch (err) {
                              console.error("Error removing video:", err);
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

                {isSaving && uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {uploadProgress}%
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
                      disabled={isSubmitting || isSaving}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>

        <TwoFAModal />
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type="profile"
          title="Tutor Profile Updated Successfully!"
          message="Your tutor profile has been updated successfully. All changes have been saved and your profile is now up to date."
        />
      </div>
    </div>
  );
};

export default TutorProfile;
