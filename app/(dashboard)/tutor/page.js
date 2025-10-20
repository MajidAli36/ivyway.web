"use client";

import Link from "next/link";
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useTutorDashboard } from "../../hooks/useDashboard";
import OverviewCards from "../../components/dashboard/OverviewCards";
import UpcomingSessions, {
  TutorSessions,
} from "../../components/dashboard/UpcomingSessions";
import EarningsCharts from "../../components/dashboard/EarningsCharts";
import TutorBonusStats from "../../components/rating/TutorBonusStats";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";

export default function TutorDashboard() {
  const { dashboardData, loading, error, refreshing, refreshDashboard, retry } =
    useTutorDashboard();

  // Prepare stats data for overview cards
  const stats = dashboardData?.overview
    ? [
        {
          name: "Sessions Today",
          value: dashboardData.overview.upcomingSessions.toString(),
          icon: CalendarIcon,
          description: "Sessions scheduled for today",
        },
        {
          name: "Total Students",
          value: "0", // This would come from a different endpoint
          icon: UserGroupIcon,
          description: "Active students",
        },
        {
          name: "Hours Completed",
          value: "0", // This would come from earnings breakdown
          icon: ClockIcon,
          description: "Total teaching hours",
        },
        {
          name: "Monthly Earnings",
          value: dashboardData.overview.monthlyEarnings,
          icon: CurrencyDollarIcon,
          description: "Current month earnings",
        },
      ]
    : [];

  // Function to handle joining a session
  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank");
    } else {
      window.location.href = `/tutor/session/${session.id}`;
    }
  };

  // Calculate earnings progress and change
  let earningsProgress = 0;
  let earningsChange = 0;
  if (dashboardData?.earnings?.breakdown) {
    const monthlyEarnings = parseFloat(
      dashboardData.overview.monthlyEarnings.replace(/[^0-9.-]+/g, "")
    );
    const monthlyTarget = 5000; // This would come from user settings
    earningsProgress =
      monthlyTarget > 0 ? (monthlyEarnings / monthlyTarget) * 100 : 0;
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center h-96">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={retry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Retry
            </button>
            <button
              onClick={refreshDashboard}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back, Tutor!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your tutoring activities
          </p>
          {dashboardData?.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated:{" "}
              {new Date(dashboardData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshDashboard}
            disabled={refreshing}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all ${
              refreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link href="/tutor/schedule/availability">
            <button className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all">
              Update Availability
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <OverviewCards stats={stats} loading={loading} error={error} />

      {/* Upcoming Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
            Upcoming Sessions
          </h2>
          <Link
            href="/tutor/sessions"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
          >
            View all sessions
            <svg
              className="ml-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <TutorSessions
          sessions={dashboardData?.upcomingSessions || []}
          loading={loading}
          error={error}
          onJoinSession={handleJoinSession}
        />
      </div>

      {/* Earnings Overview */}
      {dashboardData?.earnings && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Earnings Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {dashboardData.overview.monthlyEarnings}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Current month earnings
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium flex items-center justify-end ${
                    earningsChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {earningsChange >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-180" />
                  )}
                  {earningsChange >= 0 ? "+" : ""}
                  {earningsChange.toFixed(1)}% from last month
                </p>
                <p className="text-sm text-gray-600 mt-1">$0 last month</p>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${earningsProgress.toFixed(0)}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {earningsProgress.toFixed(0)}% of your monthly target
            </p>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <Link
              href="/tutor/earnings"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              View detailed earnings
              <svg
                className="ml-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Earnings Charts */}
      <EarningsCharts />

      {/* Bonus Performance Stats */}
      <TutorBonusStats />

      {/* Recent Activities */}
      {dashboardData?.recentActivities &&
        dashboardData.recentActivities.length > 0 && (
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                Recent Activities
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {dashboardData.recentActivities
                .slice(0, 5)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                            {activity.studentName
                              ? activity.studentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "S"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-700">
                            {activity.subject} session
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.studentName} •{" "}
                            {activity.relativeTime || "Recently"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.amount || "$0"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.duration || "60"} min
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* ReAct AI Widget */}
      <ReactAIWidget userRole="tutor" />
    </div>
  );
}
