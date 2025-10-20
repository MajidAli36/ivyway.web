"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import tutorUpgradeService from "@/app/lib/api/tutorUpgradeService";

export default function UpgradeStatusCard({ tutorType, onStatusChange }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTutorStats();
  }, []);

  const loadTutorStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tutorUpgradeService.getTutorStats();
      
      if (response.success) {
        // Map API response properties to expected component properties
        const mappedData = {
          completedSessions: response.data.sessionsCompleted || 0,
          totalEarnings: response.data.totalEarnings || 0,
          averageRating: response.data.averageRating || 0,
          profileCompletion: response.data.profileCompletion || 0,
          upgradeApplicationStatus: response.data.upgradeApplicationStatus || "none",
          tutorType: response.data.tutorType || "regular",
          currentHourlyRate: response.data.currentHourlyRate || 25.00,
          potentialAdvancedRate: response.data.potentialAdvancedRate || 35.00,
          totalReviews: response.data.totalReviews || 0,
          recentSessions: response.data.recentSessions || 0
        };
        
        setStats(mappedData);
        onStatusChange?.(mappedData);
      } else {
        setError(response.message || "Failed to load tutor statistics");
      }
    } catch (err) {
      console.error("Error loading tutor stats:", err);
      setError(err.message || "An error occurred while loading statistics");
    } finally {
      setLoading(false);
    }
  };

  const getTutorTypeColor = (tutorType) => {
    return tutorType === "advanced" ? "text-green-600" : "text-blue-600";
  };

  const getTutorTypeBg = (tutorType) => {
    return tutorType === "advanced" ? "bg-green-100" : "bg-blue-100";
  };

  const getTutorTypeText = (tutorType) => {
    return tutorType === "advanced" ? "Advanced Tutor" : "Regular Tutor";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "No Application";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Tutor Status
              </h3>
              <p className="text-sm text-gray-500">
                Current status and upgrade information
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTutorTypeBg(
              stats.tutorType
            )} ${getTutorTypeColor(stats.tutorType)}`}
          >
            {getTutorTypeText(stats.tutorType)}
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Rate */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Current Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.currentHourlyRate.toFixed(2)}/hour
                </p>
              </div>
            </div>
          </div>

          {/* Potential Rate */}
          {stats.tutorType === "regular" && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <ArrowRightIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Potential Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${stats.potentialAdvancedRate.toFixed(2)}/hour
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Application Status */}
          {stats.upgradeApplicationStatus !== "none" && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                {getStatusIcon(stats.upgradeApplicationStatus)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Application Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      stats.upgradeApplicationStatus
                    )}`}
                  >
                    {getStatusText(stats.upgradeApplicationStatus)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicators */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Sessions Completed</span>
                  <span>{stats.completedSessions}/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((stats.completedSessions / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Profile Completion</span>
                  <span>{stats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {stats.tutorType === "regular" && stats.upgradeApplicationStatus === "none" && (
            <Link
              href="/tutor/upgrade"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply for Advanced Status
            </Link>
          )}
          
          {stats.upgradeApplicationStatus === "pending" && (
            <Link
              href="/tutor/upgrade"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Application Status
            </Link>
          )}
          
          {stats.upgradeApplicationStatus === "rejected" && (
            <Link
              href="/tutor/upgrade"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Again
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
