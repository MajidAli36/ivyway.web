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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import studentProfileService from "../../../lib/api/studentProfileService";
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

  // Profile completion is calculated by the backend
  // We use formData.profileCompletion which comes from the backend response

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

  // Formik validation schema with Yup
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("phone-format", "Please enter a valid phone number", (value) => {
        if (!value) return false;
        const cleaned = value.replace(/[\s\-\(\)]/g, "");
        return /^[\+]?[1-9][\d]{0,15}$/.test(cleaned);
      }),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .nullable()
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 13)), "You must be at least 13 years old")
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), "Please enter a valid date of birth"),
    bio: Yup.string()
      .required("Bio is required")
      .min(10, "Bio must be at least 10 characters")
      .max(1000, "Bio must be less than 1000 characters"),
    program: Yup.string()
      .required("Program is required")
      .oneOf(["undergraduate", "graduate", "phd", "other"], "Please select a valid program"),
    major: Yup.string()
      .required("Major/Field of Study is required")
      .min(2, "Major must be at least 2 characters")
      .max(100, "Major must be less than 100 characters"),
    enrollmentDate: Yup.date()
      .required("Enrollment date is required")
      .nullable()
      .max(new Date(), "Enrollment date cannot be in the future"),
    gpa: Yup.number()
      .nullable()
      .min(0, "GPA must be between 0.0 and 4.0")
      .max(4.0, "GPA must be between 0.0 and 4.0"),
    expectedGraduation: Yup.number()
      .nullable()
      .integer("Graduation year must be a whole number")
      .min(new Date().getFullYear(), `Graduation year must be ${new Date().getFullYear()} or later`)
      .max(new Date().getFullYear() + 10, `Graduation year must be before ${new Date().getFullYear() + 11}`),
    academicStanding: Yup.string()
      .max(50, "Academic standing must be less than 50 characters"),
    preferredFormat: Yup.string()
      .oneOf(["online", "in-person", "hybrid"], "Please select a valid format"),
    additionalNotes: Yup.string()
      .max(500, "Additional notes must be less than 500 characters"),
    subjects: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one subject"),
    availability: Yup.array()
      .of(Yup.string()),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsSaving(true);
    setError("");

    try {
      const profileData = {
        phoneNumber: values.phoneNumber,
        dateOfBirth: values.dateOfBirth,
        bio: values.bio,
        program: values.program,
        major: values.major,
        gpa: values.gpa || null,
        expectedGraduation: values.expectedGraduation || null,
        academicStanding: values.academicStanding || null,
        enrollmentDate: values.enrollmentDate,
        preferredFormat: values.preferredFormat || null,
        additionalNotes: values.additionalNotes || null,
        subjects: values.subjects || [],
        availability: values.availability || [],
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
      // Set field-level errors if available
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error) => {
          setFieldError(error.field, error.message);
        });
      }
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

  // Use profile completion from backend (stored in formData.profileCompletion)
  const profileCompletion = formData.profileCompletion || 0;

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

          {profileCompletion < 100 && (
            <div>
              <p className="text-sm text-gray-600">
                Complete your profile to {100 - profileCompletion}% more to reach 100%
              </p>
            </div>
          )}
          
          {profileCompletion === 100 && (
            <div className="mt-2">
              <p className="text-sm text-green-600 font-medium">
                🎉 Congratulations! Your profile is complete!
              </p>
            </div>
          )}
        </div>

        {/* Main Form */}
        <Formik
          initialValues={{
            phoneNumber: formData.phoneNumber || "",
            dateOfBirth: formData.dateOfBirth || "",
            bio: formData.bio || "",
            program: formData.program || "",
            major: formData.major || "",
            gpa: formData.gpa || "",
            expectedGraduation: formData.expectedGraduation || "",
            academicStanding: formData.academicStanding || "",
            enrollmentDate: formData.enrollmentDate || "",
            preferredFormat: formData.preferredFormat || "",
            additionalNotes: formData.additionalNotes || "",
            subjects: formData.subjects || [],
            availability: formData.availability || [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting, handleChange, handleBlur }) => (
            <Form className="bg-white shadow rounded-lg">
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
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    disabled={!isEditing}
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.phoneNumber && touched.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="phoneNumber" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="dateOfBirth"
                    type="date"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.dateOfBirth && touched.dateOfBirth ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="dateOfBirth" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <Field
                  name="bio"
                  as="textarea"
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself, your academic goals, and what you're looking for in a tutor. Minimum 10 characters required."
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.bio && touched.bio ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  <ErrorMessage name="bio" component="p" className="text-sm text-red-600" />
                  <p className="text-sm text-gray-500">
                    {values.bio?.length || 0}/1000 characters
                  </p>
                </div>
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
                    Program <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="program"
                    as="select"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.program && touched.program ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Program</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="program" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major/Field of Study <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="major"
                    type="text"
                    disabled={!isEditing}
                    placeholder="e.g., Computer Science, Biology, Business Administration"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.major && touched.major ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="major" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA
                  </label>
                  <Field
                    name="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    disabled={!isEditing}
                    placeholder="e.g., 3.75"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.gpa && touched.gpa ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="gpa" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Standing
                  </label>
                  <Field
                    name="academicStanding"
                    as="select"
                    disabled={!isEditing}
                    placeholder="Select your academic standing"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.academicStanding && touched.academicStanding ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Standing</option>
                    <option value="Good Standing">Good Standing</option>
                    <option value="Academic Probation">Academic Probation</option>
                    <option value="Academic Warning">Academic Warning</option>
                    <option value="Dean's List">Dean's List</option>
                  </Field>
                  <ErrorMessage name="academicStanding" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="enrollmentDate"
                    type="date"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.enrollmentDate && touched.enrollmentDate ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="enrollmentDate" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Graduation Year
                  </label>
                  <Field
                    name="expectedGraduation"
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    disabled={!isEditing}
                    placeholder="e.g., 2027"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.expectedGraduation && touched.expectedGraduation ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage name="expectedGraduation" component="p" className="mt-1 text-sm text-red-600" />
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
                  <Field
                    name="preferredFormat"
                    as="select"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.preferredFormat && touched.preferredFormat ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Format</option>
                    <option value="online">Online</option>
                    <option value="in-person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </Field>
                  <ErrorMessage name="preferredFormat" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subjects You Need Help With <span className="text-red-500">*</span>
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
                        checked={values.subjects?.includes(subject) || false}
                        onChange={(e) => {
                          const currentSubjects = values.subjects || [];
                          if (e.target.checked) {
                            setFieldValue("subjects", [...currentSubjects, subject]);
                          } else {
                            setFieldValue("subjects", currentSubjects.filter(s => s !== subject));
                          }
                        }}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
                <ErrorMessage name="subjects" component="p" className="mt-1 text-sm text-red-600" />
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
                        checked={values.availability?.includes(day) || false}
                        onChange={(e) => {
                          const currentAvailability = values.availability || [];
                          if (e.target.checked) {
                            setFieldValue("availability", [...currentAvailability, day]);
                          } else {
                            setFieldValue("availability", currentAvailability.filter(a => a !== day));
                          }
                        }}
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
                <Field
                  name="additionalNotes"
                  as="textarea"
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Any additional information about your tutoring preferences, learning style, or special requirements..."
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                    errors.additionalNotes && touched.additionalNotes ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <div className="mt-1 flex justify-between">
                  <ErrorMessage name="additionalNotes" component="p" className="text-sm text-red-600" />
                  <p className="text-sm text-gray-500">
                    {values.additionalNotes?.length || 0}/500 characters
                  </p>
                </div>
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
                  disabled={isSubmitting || isSaving || Object.keys(errors).length > 0}
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
          title="Student Profile Updated Successfully!"
          message="Your student profile has been updated successfully. All changes have been saved and your profile is now up to date."
        />
      </div>
    </div>
  );
};

export default StudentProfile;
