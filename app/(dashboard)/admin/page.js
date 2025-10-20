"use client";

import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import {
  UserGroupIcon,
  UserIcon,
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useAdminDashboard } from "../../hooks/useDashboard";
import OverviewCards from "../../components/dashboard/OverviewCards";
import ReactAIWidget from "@/app/components/ai-chat/ReactAIWidget";

export default function AdminDashboard() {
  const { dashboardData, loading, error, refreshing, refreshDashboard, retry } =
    useAdminDashboard();

  // Debug: Log the dashboard data
  console.log("Admin Dashboard Data:", dashboardData);

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Prepare platform stats for overview cards
  const platformStats = dashboardData?.overview
    ? [
        {
          name: "Total Users",
          value: dashboardData.overview.totalUsers?.toString() || "0",
          change: dashboardData.overview.revenueGrowth > 0 ? "+12%" : "-5%",
          trend: dashboardData.overview.revenueGrowth > 0 ? 12 : -5,
          icon: UserGroupIcon,
          description: "All registered users",
        },
        {
          name: "Active Students",
          value: dashboardData.overview.activeStudents?.toString() || "0",
          change: "+8%",
          trend: 8,
          icon: UserIcon,
          description: "Students with active sessions",
        },
        {
          name: "Revenue (Monthly)",
          value: formatCurrency(dashboardData.overview.monthlyRevenue),
          change: `${dashboardData.overview.revenueGrowth >= 0 ? '+' : ''}${dashboardData.overview.revenueGrowth || 0}%`,
          trend: dashboardData.overview.revenueGrowth || 0,
          icon: BanknotesIcon,
          description: "Current month revenue",
        },
        {
          name: "Pending Approvals",
          value: (
            (dashboardData.overview.pendingTutors || 0) +
            (dashboardData.overview.pendingPayouts || 0)
          ).toString(),
          change: "5 new",
          trend: 5,
          icon: ClipboardDocumentCheckIcon,
          description: "Tutors and payouts pending",
        },
      ]
    : [];


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
    <div className="space-y-6 lg:space-y-8">
      {/* AI Widget */}
      <ReactAIWidget userRole="admin" position="bottom-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Monitor platform performance and manage operations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/admin/plans"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Manage Plans
          </Link>
          <button
            onClick={refreshDashboard}
            disabled={refreshing}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Platform Statistics */}
      <OverviewCards stats={platformStats} loading={loading} error={error} />


      {/* Platform Stats Overview */}
      {dashboardData?.platformStats && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Platform Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                  {dashboardData.platformStats.monthlyBookings || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Monthly Bookings</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                  {dashboardData.platformStats.completedSessions || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">Completed Sessions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                  {formatDuration(dashboardData.platformStats.averageSessionDuration)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Avg Session Duration
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1">
                  {dashboardData.growthMetrics?.newUsersThisMonth || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  New Users This Month
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Growth Metrics */}
      {dashboardData?.growthMetrics && (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <ArrowUpIcon className="h-6 w-6 mr-2 text-green-600" />
              Growth Metrics
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                  +{dashboardData.growthMetrics.newUsersThisMonth || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  New Users This Month
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                  +{dashboardData.growthMetrics.newBookingsThisMonth || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  New Bookings This Month
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                  {formatCurrency(dashboardData.growthMetrics.revenueThisMonth)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Revenue This Month</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
