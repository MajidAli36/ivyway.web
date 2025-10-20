import React from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
// Temporarily hardcoded functions to isolate import issues
const calculateStudentProfileCompletion = (profile) => {
  const fields = [
    { key: "phoneNumber", weight: 10 },
    { key: "dateOfBirth", weight: 10 },
    { key: "bio", weight: 15 },
    { key: "profileImage", weight: 10 },
    { key: "program", weight: 10 },
    { key: "major", weight: 10 },
    { key: "gpa", weight: 10 },
    { key: "expectedGraduation", weight: 10 },
    { key: "academicStanding", weight: 5 },
    { key: "enrollmentDate", weight: 5 },
    { key: "subjects", weight: 10 },
    { key: "availability", weight: 10 },
    { key: "preferredFormat", weight: 5 },
    { key: "introVideoUrl", weight: 5 },
  ];

  let completion = 0;

  fields.forEach(({ key, weight }) => {
    const value = profile[key];

    if (key === "subjects" || key === "availability") {
      if (value && Array.isArray(value) && value.length > 0) {
        completion += weight;
      }
    } else if (key === "profileImage" || key === "introVideoUrl") {
      if (value && value.trim() !== "") {
        completion += weight;
      }
    } else {
      if (value && value.toString().trim() !== "") {
        completion += weight;
      }
    }
  });

  return Math.min(100, Math.round(completion));
};

const getStudentMissingFields = (profile) => {
  const missingFields = [];

  if (!profile.phoneNumber || profile.phoneNumber.trim() === "") {
    missingFields.push("Phone Number");
  }

  if (!profile.dateOfBirth || profile.dateOfBirth.trim() === "") {
    missingFields.push("Date of Birth");
  }

  if (!profile.bio || profile.bio.trim() === "") {
    missingFields.push("Bio");
  }

  if (!profile.profileImage || profile.profileImage.trim() === "") {
    missingFields.push("Profile Image");
  }

  if (!profile.program || profile.program.trim() === "") {
    missingFields.push("Program");
  }

  if (!profile.major || profile.major.trim() === "") {
    missingFields.push("Major");
  }

  if (!profile.gpa || profile.gpa.toString().trim() === "") {
    missingFields.push("GPA");
  }

  if (
    !profile.expectedGraduation ||
    profile.expectedGraduation.toString().trim() === ""
  ) {
    missingFields.push("Expected Graduation");
  }

  if (!profile.academicStanding || profile.academicStanding.trim() === "") {
    missingFields.push("Academic Standing");
  }

  if (!profile.enrollmentDate || profile.enrollmentDate.trim() === "") {
    missingFields.push("Enrollment Date");
  }

  if (
    !profile.subjects ||
    !Array.isArray(profile.subjects) ||
    profile.subjects.length === 0
  ) {
    missingFields.push("Subjects");
  }

  if (
    !profile.availability ||
    !Array.isArray(profile.availability) ||
    profile.availability.length === 0
  ) {
    missingFields.push("Availability");
  }

  if (!profile.preferredFormat || profile.preferredFormat.trim() === "") {
    missingFields.push("Preferred Format");
  }

  if (!profile.introVideoUrl || profile.introVideoUrl.trim() === "") {
    missingFields.push("Intro Video");
  }

  return missingFields;
};

const COMPLETION_COLORS = {
  LOW: "#ef4444", // Red (0-25%)
  MEDIUM: "#f97316", // Orange (26-50%)
  HIGH: "#eab308", // Yellow (51-75%)
  COMPLETE: "#22c55e", // Green (76-100%)
};

const ProfileCompletionIndicator = ({ profile }) => {
  const completionPercentage = calculateStudentProfileCompletion(profile);
  const missingFields = getStudentMissingFields(profile);

  const getCompletionColor = (percentage) => {
    if (percentage <= 25) return COMPLETION_COLORS.LOW;
    if (percentage <= 50) return COMPLETION_COLORS.MEDIUM;
    if (percentage <= 75) return COMPLETION_COLORS.HIGH;
    return COMPLETION_COLORS.COMPLETE;
  };

  const getCompletionStatus = (percentage) => {
    if (percentage <= 25) return "Incomplete";
    if (percentage <= 50) return "Basic";
    if (percentage <= 75) return "Good";
    return "Complete";
  };

  const getCompletionIcon = (percentage) => {
    if (percentage === 100) {
      return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
    }
    if (percentage >= 75) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Profile Completion
        </h3>
        {getCompletionIcon(completionPercentage)}
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${
                2 * Math.PI * 36 * (1 - completionPercentage / 100)
              }`}
              className="transition-all duration-500 ease-in-out"
              style={{ color: getCompletionColor(completionPercentage) }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: getCompletionColor(completionPercentage) }}
              >
                {completionPercentage}%
              </div>
              <div className="text-xs text-gray-500">
                {getCompletionStatus(completionPercentage)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Profile Progress</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${completionPercentage}%`,
              backgroundColor: getCompletionColor(completionPercentage),
            }}
          />
        </div>
      </div>

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Missing Information ({missingFields.length})
          </h4>
          <div className="space-y-1">
            {missingFields.slice(0, 5).map((field, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                {field}
              </div>
            ))}
            {missingFields.length > 5 && (
              <div className="text-sm text-gray-500">
                +{missingFields.length - 5} more fields
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completion Tips */}
      {completionPercentage < 100 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Complete your profile to increase your chances of finding the
            perfect tutor match!
          </p>
        </div>
      )}

      {/* Completion Celebration */}
      {completionPercentage === 100 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-sm text-blue-700 font-medium">
              🎉 Profile Complete! You're all set to find your perfect tutor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionIndicator;
