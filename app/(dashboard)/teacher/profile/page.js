"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  AcademicCapIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { teacherProfile } from "@/app/lib/api/teacherService";
import { useAuth } from "@/app/providers/AuthProvider";
import { toast } from "react-hot-toast";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Social Studies",
  "Economics",
  "Psychology",
  "Philosophy",
  "Literature",
  "Writing",
  "Reading",
];

const GRADE_LEVELS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "Middle School (7th & 8th)",
  "High School (9-12)",
  "College/University",
  "Adult Education",
];

const CERTIFICATIONS = [
  "Teaching License",
  "Special Education",
  "ESL/TESOL",
  "Gifted Education",
  "Reading Specialist",
  "Math Specialist",
  "Science Specialist",
  "Administrative License",
  "National Board Certification",
  "Master's Degree in Education",
  "Doctorate in Education",
  "Subject Matter Certification",
];

export default function TeacherProfile() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    subjects: [],
    gradeLevels: [],
    degree: "",
    institution: "",
    certifications: [],
    bio: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await teacherProfile.getMyProfile();
      // Handle different possible response structures
      let profileData, userData;

      if (response.data && response.user) {
        // Structure: { data: {...}, user: {...} }
        profileData = response.data;
        userData = response.user;
      } else if (response.data && response.data.user) {
        // Structure: { data: { profile: {...}, user: {...} } }
        profileData = response.data;
        userData = response.data.user;
      } else if (response.user) {
        // Structure: { user: {...}, ...profile fields }
        userData = response.user;
        profileData = response;
      } else if (response.data) {
        // Structure: { data: {...} } - user might be in data or separate
        profileData = response.data;
        userData = response.data.user || null;
      } else {
        // Fallback: assume response is the profile data
        profileData = response;
        userData = null;
      }

      // If we still don't have user data, try to extract it from profile data
      if (!userData && profileData) {
        // Check if user data is embedded in profile data
        if (profileData.user) {
          userData = profileData.user;
        } else if (profileData.userId || profileData.user_id) {
          // Create a minimal user object from available data
          userData = {
            id: profileData.userId || profileData.user_id,
            fullName: profileData.fullName || profileData.name,
            email: profileData.email,
            isActive: profileData.isActive || true,
            role: "teacher",
          };
        }
      }

      setProfile(profileData);
      setUser(userData);
      setFormData({
        schoolName: profileData.schoolName || "",
        schoolAddress: profileData.schoolAddress || "",
        subjects: profileData.subjects || [],
        gradeLevels: profileData.gradeLevels || [],
        degree: profileData.degree || "",
        institution: profileData.institution || "",
        certifications: profileData.certifications || [],
        bio: profileData.bio || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      // If profile doesn't exist (404), initialize with empty data and use current user
      if (err.status === 404 || err.response?.status === 404) {
        console.log("No profile found, initializing with empty data");
        setProfile(null);
        // Use current user data from auth context
        setUser(currentUser);
        setFormData({
          schoolName: "",
          schoolAddress: "",
          subjects: [],
          gradeLevels: [],
          degree: "",
          institution: "",
          certifications: [],
          bio: "",
        });
        setError(null); // Clear any previous errors
      } else {
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Check if profile exists, if not create it, otherwise update it
      if (profile === null) {
        // Profile doesn't exist, create it
        console.log("Creating new teacher profile");
        await teacherProfile.create(formData);
        toast.success("Profile created successfully");
      } else {
        // Profile exists, update it
        console.log("Updating existing teacher profile");
        await teacherProfile.update(formData);
        toast.success("Profile updated successfully");
      }

      await loadProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      if (err.status === 404 && profile !== null) {
        // If update fails with 404, try creating instead
        try {
          console.log("Update failed, trying to create profile");
          await teacherProfile.create(formData);
          await loadProfile();
          setIsEditing(false);
          toast.success("Profile created successfully");
        } catch (createErr) {
          console.error("Error creating profile:", createErr);
          toast.error("Failed to save profile");
        }
      } else {
        toast.error("Failed to save profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      schoolName: profile?.schoolName || "",
      schoolAddress: profile?.schoolAddress || "",
      subjects: profile?.subjects || [],
      gradeLevels: profile?.gradeLevels || [],
      degree: profile?.degree || "",
      institution: profile?.institution || "",
      certifications: profile?.certifications || [],
      bio: profile?.bio || "",
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <XCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Info Header - Non-editable */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.fullName || currentUser?.fullName || "Teacher Profile"}
                </h1>
                <p className="text-gray-600">Teacher</p>
                {user?.email && (
                  <div className="flex items-center mt-1">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                )}
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Profile Setup Required
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Create Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Creation Form */}
        {isEditing && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Complete Your Teacher Profile
            </h2>
            <div className="space-y-6">
              {/* School Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange("schoolName", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your school name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    School Address
                  </label>
                  <input
                    type="text"
                    value={formData.schoolAddress}
                    onChange={(e) => handleInputChange("schoolAddress", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter school address"
                  />
                </div>
              </div>

              {/* Education */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => handleInputChange("degree", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Bachelor of Education"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange("institution", e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., University of Education"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell us about your teaching experience and philosophy..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {saving ? "Creating..." : "Create Profile"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.fullName || currentUser?.fullName || "Teacher Profile"}
              </h1>
              <p className="text-gray-600">
                {profile?.schoolName || "No school name"}
              </p>
              {(user?.email || currentUser?.email) && (
                <div className="flex items-center mt-1">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm text-gray-500">{user?.email || currentUser?.email}</p>
                </div>
              )}
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    profile?.verificationStatus || "pending"
                  )}`}
                >
                  {getStatusIcon(profile?.verificationStatus || "pending")}
                  <span className="ml-1 capitalize">
                    {profile?.verificationStatus || "pending"}
                  </span>
                </span>
                {profile?.referralCode && (
                  <span className="ml-3 text-sm text-gray-500">
                    Referral Code:{" "}
                    <span className="font-mono font-medium">
                      {profile?.referralCode}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information - Non-editable */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Personal Information
          <span className="ml-2 text-xs text-gray-500 font-normal">(Cannot be changed)</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 flex items-center">
              <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-900">
                {user?.fullName || currentUser?.fullName || "Not provided"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 flex items-center">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-sm text-gray-900">
                {user?.email || currentUser?.email || "Not provided"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Teacher
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Status
            </label>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              School Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.schoolName || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                School Address
              </label>
              {isEditing ? (
                <textarea
                  value={formData.schoolAddress}
                  onChange={(e) =>
                    handleInputChange("schoolAddress", e.target.value)
                  }
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.schoolAddress || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Education & Certifications
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.degree || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) =>
                    handleInputChange("institution", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {profile?.institution || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Subjects *
          </label>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => handleArrayChange("subjects", subject)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile?.subjects?.length > 0 ? (
                profile?.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No subjects selected</p>
              )}
            </div>
          )}
        </div>

        {/* Grade Levels */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Grade Levels *
          </label>
          {isEditing ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {GRADE_LEVELS.map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.gradeLevels.includes(level)}
                    onChange={() => handleArrayChange("gradeLevels", level)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile?.gradeLevels?.length > 0 ? (
                profile?.gradeLevels.map((level) => (
                  <span
                    key={level}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {level}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No grade levels selected
                </p>
              )}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Certifications
          </label>
          {isEditing ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CERTIFICATIONS.map((cert) => (
                <label key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleArrayChange("certifications", cert)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{cert}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile?.certifications?.length > 0 ? (
                profile?.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {cert}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No certifications added</p>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tell us about your teaching experience and philosophy..."
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {profile?.bio || "No bio provided"}
            </p>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Statistics
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Referrals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.totalReferrals || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.activeStudents || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPinIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.completedReports || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
