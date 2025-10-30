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
  BellIcon,
} from "@heroicons/react/24/outline";
import { useCounselorDashboard } from "../../hooks/useDashboard";
import OverviewCards from "../../components/dashboard/OverviewCards";
import {
  CounselorSessions,
} from "../../components/dashboard/UpcomingSessions";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";

export default function CounselorDashboard() {
  const { dashboardData, loading, error, refreshing, refreshDashboard, retry } =
    useCounselorDashboard();

  // Prepare stats data for overview cards
  const stats = dashboardData?.overview
    ? [
        {
          name: "Sessions Today",
          value: dashboardData.overview.upcomingSessions?.toString() || "0",
          icon: CalendarIcon,
          description: "Sessions scheduled for today",
        },
        {
          name: "Total Students",
          value: dashboardData.overview.totalStudents?.toString() || "0",
          icon: UserGroupIcon,
          description: "Active students",
        },
        {
          name: "Hours Completed",
          value: "0", // This would come from earnings breakdown
          icon: ClockIcon,
          description: "Total counseling hours",
        },
        {
          name: "Monthly Earnings",
          value: dashboardData.overview.monthlyEarnings || "$0.00",
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
      window.location.href = `/counselor/sessions`;
    }
  };

  // Calculate earnings progress and change
  let earningsProgress = 0;
  let earningsChange = 0;
  if (dashboardData?.earnings?.breakdown) {
    const monthlyEarnings = parseFloat(
      dashboardData.overview.monthlyEarnings.replace(/[^0-9.-]+/g, "") || "0"
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
            Welcome Back, Counselor!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's an overview of your counseling activities
          </p>
          {dashboardData?.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated:{" "}
              {new Date(dashboardData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        
      </div>

      {/* Stats Grid */}
      <OverviewCards stats={stats} loading={loading} error={error} />

      {/* Upcoming Sessions */}
      <div>
        <CounselorSessions
          sessions={dashboardData?.upcomingSessions || []}
          loading={loading}
          error={error}
          onJoinSession={handleJoinSession}
        />
      </div>

      {/* Earnings Overview */}
      {dashboardData?.earnings && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Earnings Overview
            </h3>
            <Link
              href="/counselor/earnings"
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
          
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl transition-transform hover:translate-y-[-4px]">
          <div className="px-5 py-5">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Manage Schedule
              </h3>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              View sessions and update availability
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 flex justify-end">
            <Link
              href="/counselor/availability"
              className="font-medium text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              Go to schedule
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl transition-transform hover:translate-y-[-4px]">
          <div className="px-5 py-5">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Earnings
              </h3>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              View payouts and earnings history
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 flex justify-end">
            <Link
              href="/counselor/earnings"
              className="font-medium text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              View earnings
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl transition-transform hover:translate-y-[-4px]">
          <div className="px-5 py-5">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Notifications
              </h3>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Alerts and updates
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3 flex justify-end">
            <Link
              href="/counselor/notifications"
              className="font-medium text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              View notifications
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ReAct AI Widget */}
      <ReactAIWidget userRole="counselor" />
    </div>
  );
}