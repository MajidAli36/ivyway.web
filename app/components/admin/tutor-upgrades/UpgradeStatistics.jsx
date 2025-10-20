"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import adminTutorUpgradeService from "@/app/lib/api/adminTutorUpgradeService";

export default function UpgradeStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminTutorUpgradeService.getStatistics();
      
      if (response.success) {
        setStatistics(response.data);
      } else {
        setError(response.message || "Failed to load statistics");
      }
    } catch (err) {
      console.error("Error loading statistics:", err);
      setError(err.message || "An error occurred while loading statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
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
        <button
          onClick={loadStatistics}
          className="mt-4 text-sm text-red-600 hover:text-red-500 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Data Available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Statistics are not available at the moment.
          </p>
          <button
            onClick={loadStatistics}
            className="mt-4 text-sm text-blue-600 hover:text-blue-500 underline"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Applications",
      value: statistics?.totalApplications || 0,
      icon: ChartBarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: statistics?.recentApplications ? `+${statistics.recentApplications} this month` : null,
    },
    {
      name: "Pending Applications",
      value: statistics?.pendingApplications || 0,
      icon: ClockIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: statistics?.pendingApplications > 0 ? "Needs review" : null,
    },
    {
      name: "Approved Applications",
      value: statistics?.approvedApplications || 0,
      icon: CheckCircleIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: statistics?.approvalRate ? `${statistics.approvalRate.toFixed(1)}% approval rate` : null,
    },
    {
      name: "Rejected Applications",
      value: statistics?.rejectedApplications || 0,
      icon: XCircleIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: statistics?.rejectedApplications > 0 ? "Requires feedback" : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Upgrade Statistics
              </h3>
              <p className="text-sm text-gray-500">
                Overview of tutor upgrade applications
              </p>
            </div>
            <button
              onClick={loadStatistics}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div
                key={card.name}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">{card.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                    {card.change && (
                      <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Rate */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Approval Rate</h4>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Approval Rate</span>
                  <span>{statistics?.approvalRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${statistics?.approvalRate || 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Average Review Time */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Average Review Time</h4>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900">{statistics?.averageReviewTime || "0 days"}</p>
                <p className="text-sm text-gray-500">Average time to review applications</p>
              </div>
              <div className="ml-4">
                <ClockIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutor Distribution */}
      {statistics?.tutorDistribution && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Tutor Distribution</h4>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {statistics?.tutorDistribution?.regular || 0}
                </div>
                <div className="text-sm text-gray-600">Regular Tutors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {statistics?.tutorDistribution?.advanced || 0}
                </div>
                <div className="text-sm text-gray-600">Advanced Tutors</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Eligible Tutors */}
      {statistics?.eligibleTutors && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900">Eligible Tutors</h4>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900">{statistics?.eligibleTutors}</p>
                <p className="text-sm text-gray-500">Tutors eligible for upgrade</p>
              </div>
              <div className="ml-4">
                <UserGroupIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Applications Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Monthly Applications</h4>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {statistics?.monthlyApplications?.map((month, index) => (
              <div key={month.month} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(month.month + "-01").toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (month.count / Math.max(...(statistics?.monthlyApplications?.map((m) => m.count) || [1]))) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-900 text-right">{month.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">View Eligible Tutors</p>
                <p className="text-xs text-gray-500">See tutors who can apply</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ClockIcon className="h-6 w-6 text-yellow-500 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Pending Reviews</p>
                <p className="text-xs text-gray-500">{statistics?.pendingApplications || 0} applications</p>
              </div>
            </button>
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-6 w-6 text-green-500 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Export Data</p>
                <p className="text-xs text-gray-500">Download reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
