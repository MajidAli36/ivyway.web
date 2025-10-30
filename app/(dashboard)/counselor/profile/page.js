"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  UserIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  DocumentCheckIcon,
  LanguageIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTwoFAModal } from "@/app/providers/TwoFAModalProvider";
import { apiClient } from "@/app/lib/api/client";
import counselorProfileService from "@/app/lib/api/counselorProfile";
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

// Validation schema for counselor profile
const counselorProfileSchema = Yup.object().shape({
  // Personal Information
  bio: Yup.string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio must be less than 1000 characters")
    .required("Bio is required"),

  // Professional Information
  specialization: Yup.string()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must be less than 100 characters")
    .required("Specialization is required"),
  experience: Yup.number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years")
    .required("Experience is required"),
  hourlyRate: Yup.number()
    .min(0, "Hourly rate cannot be negative")
    .max(1000, "Hourly rate cannot exceed $1000")
    .required("Hourly rate is required"),

  // Education (array of objects)
  education: Yup.array()
    .of(
      Yup.object().shape({
        institution: Yup.string()
          .min(2, "Institution name must be at least 2 characters")
          .max(200, "Institution name must be less than 200 characters")
          .required("Institution is required"),
        degree: Yup.string()
          .min(2, "Degree must be at least 2 characters")
          .max(100, "Degree must be less than 100 characters")
          .required("Degree is required"),
        fieldOfStudy: Yup.string()
          .min(2, "Field of study must be at least 2 characters")
          .max(100, "Field of study must be less than 100 characters")
          .required("Field of study is required"),
        graduationYear: Yup.string()
          .matches(/^(19|20)\d{2}$/, "Please enter a valid graduation year (1900-2099)")
          .required("Graduation year is required"),
      })
    )
    .min(1, "Please add at least one education entry")
    .required("Education is required"),

  // Certifications (array of strings)
  certifications: Yup.array()
    .of(Yup.string().min(2, "Certification must be at least 2 characters"))
    .nullable(),

  // Languages (array of strings)
  languages: Yup.array()
    .of(Yup.string().min(2, "Language must be at least 2 characters"))
    .min(1, "Please add at least one language")
    .required("Languages are required"),

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

const CounselorProfile = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    bio: "",
    profileImage: null,
    profileImageUrl: "",

    // Professional Information
    specialization: "",
    education: [],
    experience: 0,
    certifications: [],
    languages: [],
    hourlyRate: 0,

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

  const parseMaybeJSON = (value, fallback) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await counselorProfileService.getMyProfile();

      console.log("Full API Response:", response);

      if (response.success && response.data) {
        const profileData = response.data;
        const userData = profileData.user || {};

        console.log("User data:", userData);
        console.log("Profile data:", profileData);

        // Parse education, certifications, languages
        const education = parseMaybeJSON(profileData.education, []);
        const certifications = parseMaybeJSON(profileData.certifications, []);
        const languages = parseMaybeJSON(profileData.languages, []);

        const formDataToSet = {
          fullName: userData.fullName || "",
          email: userData.email || "",
          bio: profileData.bio || "",
          profileImage: null,
          profileImageUrl: profileData.profileImage || "",
          specialization: profileData.specialization || "",
          education: education,
          experience: profileData.experience || 0,
          certifications: certifications,
          languages: languages,
          hourlyRate: profileData.hourlyRate || 0,
          introVideoUrl: profileData.introVideoUrl || "",
          profileCompletion: profileData.profileCompletion || 0,
        };

        console.log("Form data to set:", formDataToSet);
        setFormData(formDataToSet);

        // Set 2FA status - Handle both camelCase and underscore formats
        setIs2FAEnabled(
          userData.is_2fa_enabled ||
            userData.is2FAEnabled ||
            profileData.is_2fa_enabled ||
            profileData.is2FAEnabled ||
            false
        );
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate profile completion percentage using weighted calculation (same as backend)
  const calculateProfileCompletion = () => {
    const fields = [
      { key: "bio", weight: 15 },
      { key: "specialization", weight: 15 },
      { key: "education", weight: 20 },
      { key: "experience", weight: 10 },
      { key: "certifications", weight: 15 },
      { key: "languages", weight: 10 },
      { key: "profileImageUrl", weight: 10 }, // Use profileImageUrl instead of profileImage
      { key: "introVideoUrl", weight: 5 },
    ];

    let completion = 0;

    fields.forEach(({ key, weight }) => {
      const value = formData[key];

      if (key === "education") {
        if (value && Array.isArray(value) && value.length > 0) {
          completion += weight;
        }
      } else if (key === "certifications" || key === "languages") {
        if (value && Array.isArray(value) && value.length > 0) {
          completion += weight;
        }
      } else if (key === "profileImageUrl" || key === "introVideoUrl") {
        // Safe string check with proper type handling
        if (value && typeof value === "string" && value.trim() !== "") {
          completion += weight;
        }
      } else {
        // Safe string conversion for other fields
        if (value && value.toString().trim() !== "") {
          completion += weight;
        }
      }
    });

    return Math.min(100, Math.round(completion));
  };

  // Get missing fields for completion indicator (using weighted system fields)
  const getMissingFields = () => {
    const missing = [];
    const fieldLabels = {
      bio: "Bio",
      specialization: "Specialization",
      education: "Education",
      experience: "Experience",
      certifications: "Certifications",
      languages: "Languages",
      profileImageUrl: "Profile Image", // Use profileImageUrl instead of profileImage
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

      const response = await counselorProfileService.uploadIntroVideo(
        videoFile
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data?.introVideoUrl) {
        // ✅ Backend returns Cloudinary URL directly
        console.log(
          "Video uploaded successfully:",
          response.data.introVideoUrl
        );
        setFormData((prev) => ({
          ...prev,
          introVideoUrl: response.data.introVideoUrl,
        }));
        setSuccessMessage("Intro video uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error("No video URL received from server");
      }
    } catch (err) {
      console.error("Error uploading video:", err);

      // Handle specific error cases
      if (err.message?.includes("File too large")) {
        setError("File size must be less than 50MB");
      } else if (err.message?.includes("Video upload service")) {
        setError("Upload service temporarily unavailable");
      } else {
        setError(err.message || "Failed to upload video. Please try again.");
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
      // Validate file type
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file");
        return;
      }

      // Validate file size (50MB limit for videos)
      if (file.size > 50 * 1024 * 1024) {
        setError("Video file size must be less than 50MB");
        return;
      }

      // Upload the video immediately
      handleVideoUpload(file);
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
      const profileData = {
        bio: values.bio,
        specialization: values.specialization,
        education: values.education,
        experience: values.experience,
        certifications: values.certifications,
        languages: values.languages,
        hourlyRate: values.hourlyRate,
        profileImage: values.profileImage,
      };

      const response = await counselorProfileService.createOrUpdateProfile(
        profileData
      );

      if (response.success) {
        console.log("Counselor profile update successful, showing success modal");
        setIsEditing(false);
        setShowSuccessModal(true);

        // Reload profile to get updated data
        await loadProfile();
      } else {
        console.log("Counselor profile update response:", response);
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

  const profileCompletion =
    typeof formData.profileCompletion === "number" &&
    !Number.isNaN(formData.profileCompletion)
      ? Math.min(100, Math.max(0, Math.round(formData.profileCompletion)))
      : calculateProfileCompletion();
  const missingFields = getMissingFields();

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
                Counselor Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your profile information and counseling expertise
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
              {formData.profileCompletion || 0}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${formData.profileCompletion || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Main Form */}
        <Formik
          initialValues={formData}
          validationSchema={counselorProfileSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
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
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <Field
                  as="textarea"
                  name="bio"
                  rows={3}
                  disabled={!isEditing}
                  placeholder="Tell students about your background and counseling approach. Describe your experience, methodology, and what makes you unique as a counselor..."
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

            {/* Professional Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Professional Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <Field
                    type="text"
                    name="specialization"
                    placeholder="e.g., College Admissions, Career Guidance, Academic Counseling"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.specialization && touched.specialization
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.specialization && touched.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years) *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($) *
                  </label>
                  <Field
                    type="number"
                    name="hourlyRate"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.hourlyRate && touched.hourlyRate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.hourlyRate && touched.hourlyRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Education
                </h2>
              </div>

              {isEditing ? (
                <FieldArray name="education">
                  {({ push, remove }) => (
                <div className="space-y-4">
                      {values.education?.map((edu, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution *
                          </label>
                              <Field
                            type="text"
                                name={`education.${index}.institution`}
                                placeholder="e.g., Harvard University, Stanford University"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.education?.[index]?.institution ? "border-red-300" : "border-gray-300"
                                }`}
                              />
                              {errors.education?.[index]?.institution && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index].institution}</p>
                              )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                Degree *
                          </label>
                              <Field
                            type="text"
                                name={`education.${index}.degree`}
                                placeholder="e.g., Bachelor of Science, Master of Arts"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.education?.[index]?.degree ? "border-red-300" : "border-gray-300"
                                }`}
                              />
                              {errors.education?.[index]?.degree && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index].degree}</p>
                              )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                Field of Study *
                          </label>
                              <Field
                            type="text"
                                name={`education.${index}.fieldOfStudy`}
                                placeholder="e.g., Psychology, Counseling, Education"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.education?.[index]?.fieldOfStudy ? "border-red-300" : "border-gray-300"
                                }`}
                              />
                              {errors.education?.[index]?.fieldOfStudy && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index].fieldOfStudy}</p>
                              )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                Graduation Year *
                          </label>
                              <Field
                            type="text"
                                name={`education.${index}.graduationYear`}
                                placeholder="e.g., 2020, 2021, 2022"
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.education?.[index]?.graduationYear ? "border-red-300" : "border-gray-300"
                                }`}
                              />
                              {errors.education?.[index]?.graduationYear && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index].graduationYear}</p>
                              )}
                        </div>
                      </div>
                      <button
                        type="button"
                            onClick={() => remove(index)}
                        className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Education
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                        onClick={() => push({
                            institution: "",
                            degree: "",
                            fieldOfStudy: "",
                            graduationYear: "",
                        })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Education
                  </button>
                      {errors.education && typeof errors.education === 'string' && (
                        <p className="text-sm text-red-600">{errors.education}</p>
                      )}
                </div>
                  )}
                </FieldArray>
              ) : (
                <div className="space-y-4">
                  {values.education && values.education.length > 0 ? (
                    values.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900">
                          {edu.degree} in {edu.fieldOfStudy}
                        </h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          Graduated: {edu.graduationYear}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No education information added
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Certifications & Languages Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Certifications */}
                <div>
                  <div className="flex items-center mb-4">
                    <DocumentCheckIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Certifications
                    </h3>
                  </div>
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
                                placeholder="e.g., Licensed Professional Counselor, Certified Career Counselor"
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

                {/* Languages */}
                <div>
                  <div className="flex items-center mb-4">
                    <LanguageIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Languages
                    </h3>
                  </div>
                  {isEditing ? (
                    <FieldArray name="languages">
                      {({ push, remove }) => (
                        <div className="space-y-2">
                          {values.languages?.map((lang, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Field
                                type="text"
                                name={`languages.${index}`}
                                className={`flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                  errors.languages?.[index] ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="e.g., English, Spanish, French"
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
                            Add Language
                          </button>
                          {errors.languages && typeof errors.languages === 'string' && (
                            <p className="text-sm text-red-600">{errors.languages}</p>
                          )}
                        </div>
                      )}
                    </FieldArray>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {values.languages && values.languages.length > 0 ? (
                        values.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">
                          No languages added
                        </p>
                      )}
                    </div>
                  )}
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
                        console.error("Video loading error:", e);
                        setError(
                          "Failed to load video. Please try uploading again."
                        );
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
                      Upload a short video introducing yourself (max 50MB)
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
          title="Counselor Profile Updated Successfully!"
          message="Your counselor profile has been updated successfully. All changes have been saved and your profile is now up to date."
        />
      </div>
    </div>
  );
};

export default CounselorProfile;
