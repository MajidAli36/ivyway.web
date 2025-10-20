import React, { useState } from "react";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import useStudentProfile from "../../hooks/useStudentProfile";
import StudentProfileView from "./StudentProfileView";
import StudentProfileForm from "./StudentProfileForm";
import ProfileCompletionIndicator from "./ProfileCompletionIndicator";
import IntroVideoUpload from "./IntroVideoUpload";
import StudentProfileSkeleton from "./StudentProfileSkeleton";

const StudentProfilePage = () => {
  const {
    profile,
    loading,
    error,
    isSaving,
    uploadProgress,
    updateProfile,
    uploadIntroVideo,
    clearError,
    refreshProfile,
  } = useStudentProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    clearError();
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    clearError();
    setSuccessMessage("");
  };

  const handleSubmit = async (formData) => {
    try {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleVideoUpload = async (videoFile) => {
    try {
      const success = await uploadIntroVideo(videoFile);
      if (success) {
        setSuccessMessage("Intro video uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Video upload failed:", error);
    }
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <StudentProfileSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="text-lg font-medium text-red-800">
                Error Loading Profile
              </h3>
            </div>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={refreshProfile}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your profile information and tutoring preferences
                </p>
              </div>
            </div>
            {!isEditing && profile && (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Content */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <StudentProfileForm
                profile={profile}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSaving}
                error={error}
              />
            ) : (
              <StudentProfileView profile={profile} onEdit={handleEdit} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Indicator */}
            {profile && <ProfileCompletionIndicator profile={profile} />}

            {/* Intro Video Upload */}
            {profile && (
              <IntroVideoUpload
                currentVideoUrl={profile.introVideoUrl}
                onVideoUpload={handleVideoUpload}
                isUploading={isSaving}
                uploadProgress={uploadProgress}
                error={error}
              />
            )}

            {/* Profile Stats Card */}
            {profile && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Profile Completion
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile.profileCompletion || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subjects</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile.subjects?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Availability</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile.availability?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">GPA</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile.gpa || "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Complete your profile to increase your chances of finding the
                perfect tutor match.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Add your academic information</li>
                <li>• Specify subjects you need help with</li>
                <li>• Set your availability preferences</li>
                <li>• Upload an intro video</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
