"use client";

import React, { useState } from "react";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";

/**
 * Enhanced ProfileCompletionCard Component
 * Shows comprehensive profile completion status with all missing fields
 * 
 * @param {Object} props
 * @param {number} props.percentage - Current completion percentage
 * @param {Array} props.missingFields - Array of missing field objects
 * @param {Array} props.completedFields - Array of completed field objects
 * @param {Function} props.onFieldClick - Callback when a field is clicked
 * @param {boolean} props.showDetails - Whether to show detailed breakdown
 * @param {string} props.userType - Type of user (tutor, student, counselor)
 */
export default function ProfileCompletionCard({
  percentage = 0,
  missingFields = [],
  completedFields = [],
  onFieldClick,
  showDetails = true,
  userType = "tutor"
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);

  const isComplete = percentage === 100;
  const hasMissingFields = missingFields.length > 0;

  const getCompletionColor = (percentage) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 90) return "bg-green-400";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return "bg-gradient-to-r from-green-400 to-green-600";
    if (percentage >= 90) return "bg-gradient-to-r from-green-400 to-green-500";
    if (percentage >= 70) return "bg-gradient-to-r from-blue-400 to-blue-600";
    if (percentage >= 50) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  const getCompletionMessage = () => {
    if (isComplete) {
      return "🎉 Profile Complete! You're all set.";
    }
    if (percentage >= 80) {
      return "Almost there! Just a few more details needed.";
    }
    if (percentage >= 60) {
      return "Good progress! Complete more fields to improve your profile.";
    }
    if (percentage >= 40) {
      return "Getting started! Add more information to build a complete profile.";
    }
    return "Let's complete your profile to unlock all features!";
  };

  const getFieldIcon = (field) => {
    if (field.isRequired) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
    return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
  };

  const getFieldWeight = (field) => {
    return field.weight || 0;
  };

  const totalWeight = [...missingFields, ...completedFields].reduce(
    (sum, field) => sum + getFieldWeight(field), 
    0
  );

  const completedWeight = completedFields.reduce(
    (sum, field) => sum + getFieldWeight(field), 
    0
  );

  const calculatedPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isComplete ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-600">
              {getCompletionMessage()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {calculatedPercentage}%
            </div>
            <div className="text-xs text-gray-500">
              Complete
            </div>
          </div>
          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{completedWeight}/{totalWeight} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(calculatedPercentage)}`}
            style={{ width: `${calculatedPercentage}%` }}
          />
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">
              Field Breakdown
            </h4>
            <button
              onClick={() => setShowAllFields(!showAllFields)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showAllFields ? "Hide Completed" : "Show All Fields"}
            </button>
          </div>

          <div className="space-y-2">
            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  Missing Fields ({missingFields.length})
                </h5>
                <div className="space-y-1">
                  {missingFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-md cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => onFieldClick && onFieldClick(field)}
                    >
                      <div className="flex items-center space-x-2">
                        {getFieldIcon(field)}
                        <span className="text-sm text-red-700">
                          {field.label}
                        </span>
                        {field.isRequired && (
                          <span className="text-xs text-red-500 font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        +{getFieldWeight(field)}pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Fields */}
            {showAllFields && completedFields.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Completed Fields ({completedFields.length})
                </h5>
                <div className="space-y-1">
                  {completedFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">
                          {field.label}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {getFieldWeight(field)}pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium text-green-600">
                  {completedFields.length} fields
                </span>
              </div>
              <div>
                <span className="text-gray-600">Missing:</span>
                <span className="ml-2 font-medium text-red-600">
                  {missingFields.length} fields
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isComplete && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Complete your profile to improve visibility and unlock features
          </div>
          {onFieldClick && missingFields.length > 0 && (
            <button
              onClick={() => onFieldClick(missingFields[0])}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}
