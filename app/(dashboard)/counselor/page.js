"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  counselorBookings,
  counselorAvailability,
  notifications as notificationsAPI,
} from "../../lib/api/endpoints";
import { safeApiCall, ensureArray } from "../../utils/apiResponseHandler";
import authService from "../../lib/auth/authService";
import { zoomService } from "../../lib/api/zoomService";
import MeetingCard from "../../components/meetings/MeetingCard";
import ReactAIWidget from "@/app/components/ai-chat/ReactAIWidget";

export default function CounselorDashboard() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    pendingRequests: 0,
    completedSessions: 0,
    totalEarnings: 0,
  });
  const [notificationsData, setNotificationsData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authService.isAuthenticated()) {
        console.warn("User not authenticated, can't fetch dashboard data");
        return;
      }

      setLoading(true);

      try {
        // Get counselor ID
        const user = authService.getUser();
        const counselorId = user?.id || user?.counselorId;

        // Fetch sessions, requests, notifications, and upcoming meetings in parallel
        const [
          sessionsResult,
          requestsResult,
          notificationsResult,
          unreadCountResult,
          meetingsResult,
        ] = await Promise.all([
          safeApiCall(
            () =>
              counselorBookings.getCounselorSessions({ page: 1, limit: 100 }),
            {
              extractArray: true,
              dataKey: "data",
              defaultData: [],
              errorMessage: "Failed to load sessions",
            }
          ),
          safeApiCall(
            () =>
              counselorBookings.getCounselorRequests({ page: 1, limit: 100 }),
            {
              extractArray: true,
              dataKey: "data",
              defaultData: [],
              errorMessage: "Failed to load requests",
            }
          ),
          safeApiCall(() => notificationsAPI.getAll({ page: 1, limit: 5 }), {
            extractArray: true,
            dataKey: "data",
            defaultData: [],
            errorMessage: "Failed to load notifications",
          }),
          safeApiCall(() => notificationsAPI.getUnreadCount(), {
            extractArray: false,
            dataKey: "data",
            defaultData: { count: 0 },
            errorMessage: "Failed to load unread count",
          }),
          counselorId
            ? safeApiCall(
                () =>
                  zoomService.getCounselorMeetings(counselorId, {
                    page: 1,
                    limit: 5,
                    status: "scheduled",
                  }),
                {
                  extractArray: false,
                  dataKey: "meetings",
                  defaultData: [],
                  errorMessage: "Failed to load upcoming meetings",
                }
              )
            : Promise.resolve({ success: true, data: [] }),
        ]);

        // Calculate stats
        const sessions = ensureArray(
          sessionsResult.success ? sessionsResult.data : []
        );
        const requests = ensureArray(
          requestsResult.success ? requestsResult.data : []
        );
        const notificationsData = ensureArray(
          notificationsResult.success ? notificationsResult.data : []
        );
        const unreadCountData = unreadCountResult.success
          ? unreadCountResult.data
          : { count: 0 };
        const upcomingMeetingsData = ensureArray(
          meetingsResult.success ? meetingsResult.data : []
        );

        const newStats = {
          totalSessions: sessions.length,
          pendingRequests: requests.filter((r) => r.status === "pending")
            .length,
          completedSessions: sessions.filter((s) => s.status === "completed")
            .length,
          totalEarnings: sessions
            .filter((s) => s.status === "completed" && s.counselorEarnings)
            .reduce((sum, s) => sum + (s.counselorEarnings || 0), 0),
        };

        setStats(newStats);
        setNotificationsData(notificationsData);
        setUnreadCount(unreadCountData.count || 0);
        setUpcomingMeetings(upcomingMeetingsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");

        // Use mock data for demonstration
        setStats({
          totalSessions: 12,
          pendingRequests: 3,
          completedSessions: 8,
          totalEarnings: 240,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Authentication Required
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to access your counselor dashboard.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      name: "Manage Availability",
      description: "Set your available hours for counseling sessions",
      href: "/counselor/availability",
      icon: CalendarIcon,
      color: "bg-blue-500",
    },
    {
      name: "Session Requests",
      description: "Review and respond to student requests",
      href: "/counselor/requests",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-green-500",
    },
    {
      name: "My Sessions",
      description: "View and manage your counseling sessions",
      href: "/counselor/sessions",
      icon: ClockIcon,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Widget */}
      <ReactAIWidget userRole="counselor" position="bottom-right" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Counselor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your counseling sessions and student guidance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Sessions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.totalSessions}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.pendingRequests}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Sessions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.completedSessions}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Earnings
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : `$${stats.totalEarnings}`}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {notificationsData.length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Notifications
                  </h3>
                  <Link
                    href="/counselor/notifications"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {notificationsData.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-3 rounded-lg ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-blue-400"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <BellIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title || "Notification"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message || notification.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            notification.createdAt || notification.timestamp
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upcoming Meetings
                  </h3>
                  <Link
                    href="/counselor/meetings"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    View all meetings
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMeetings.slice(0, 3).map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      userRole="counselor"
                      showActions={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Overview */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Earnings Overview
                </h3>
                <Link
                  href="/counselor/earnings"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View detailed earnings
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${stats.totalEarnings}
                  </p>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.completedSessions}
                  </p>
                  <p className="text-sm text-gray-500">Completed Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    $
                    {stats.completedSessions > 0
                      ? Math.round(
                          stats.totalEarnings / stats.completedSessions
                        )
                      : 0}
                  </p>
                  <p className="text-sm text-gray-500">Avg per Session</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <span
                    className={`rounded-lg inline-flex p-3 ${action.color} text-white`}
                  >
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {action.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading activity...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-red-400" />
                  <p className="mt-2 text-sm text-gray-500">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      You have {stats.pendingRequests} pending session requests
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>
                      {stats.completedSessions} sessions completed this month
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>Total earnings: ${stats.totalEarnings}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
