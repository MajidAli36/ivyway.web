"use client";

import { useState, useEffect } from "react";
import {
  UserGroupIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import {
  teacherDashboard,
  mockTeacherData,
} from "@/app/lib/api/teacherService";
import Link from "next/link";
import ReactAIWidget from "@/app/components/ai-chat/ReactAIWidget";
import NotificationWidget from "@/app/components/notifications/NotificationWidget";

export default function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Try to fetch real data first
      const response = await teacherDashboard.getDashboard();

      // Transform the API response to match expected structure
      const apiData = response.data;
      const userData = response.user;
      console.log("API Response:", apiData);
      console.log("User Data:", userData);

      setUser(userData);

      const transformedData = {
        profile: {
          schoolName: apiData.profile?.schoolName || apiData.schoolName,
          referralCode: apiData.profile?.referralCode || apiData.referralCode,
          isVerified: apiData.profile?.isVerified || apiData.isVerified,
          verificationStatus:
            apiData.profile?.verificationStatus || apiData.verificationStatus,
          degree: apiData.profile?.degree || apiData.degree,
          institution: apiData.profile?.institution || apiData.institution,
          bio: apiData.profile?.bio || apiData.bio,
          subjects: apiData.profile?.subjects || apiData.subjects,
          gradeLevels: apiData.profile?.gradeLevels || apiData.gradeLevels,
          certifications:
            apiData.profile?.certifications || apiData.certifications,
          schoolAddress:
            apiData.profile?.schoolAddress || apiData.schoolAddress,
        },
        statistics: {
          totalReferrals:
            apiData.statistics?.totalReferrals || apiData.totalReferrals || 0,
          activeStudents:
            apiData.statistics?.activeStudents || apiData.activeStudents || 0,
          pendingAssignments: apiData.statistics?.pendingAssignments || 0,
          completedReports: apiData.statistics?.completedReports || 0,
        },
        recentActivity: {
          referrals: apiData.recentReferrals || [],
          assignments: apiData.recentAssignments || [],
        },
      };

      console.log("Transformed Data:", transformedData);

      setDashboardData(transformedData);
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback to mock data
      setDashboardData(mockTeacherData.dashboard);
    } finally {
      setLoading(false);
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
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading dashboard
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Safe destructuring with fallbacks
  const profile = dashboardData?.profile || {};
  const statistics = dashboardData?.statistics || {};
  const recentActivity = dashboardData?.recentActivity || {
    referrals: [],
    assignments: [],
  };

  const stats = [
    {
      name: "Total Referrals",
      value: statistics.totalReferrals || 0,
      icon: UserGroupIcon,
      color: "bg-blue-500",
      href: "/teacher/students",
    },
    {
      name: "Active Students",
      value: statistics.activeStudents || 0,
      icon: UserGroupIcon,
      color: "bg-green-500",
      href: "/teacher/students",
    },
    {
      name: "Pending Assignments",
      value: statistics.pendingAssignments || 0,
      icon: ClipboardDocumentListIcon,
      color: "bg-yellow-500",
      href: "/teacher/assignments",
    },
    {
      name: "Completed Reports",
      value: statistics.completedReports || 0,
      icon: ChartBarIcon,
      color: "bg-purple-500",
      href: "/teacher/progress-reports",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Widget */}
      <ReactAIWidget userRole="teacher" position="bottom-right" />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.fullName
                ? `Welcome, ${user.fullName}`
                : "Teacher Dashboard"}
            </h1>
            <p className="text-gray-600">
              {user?.email ? `${user.email} • ` : ""}Here's what's happening
              with your students.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">School</p>
            <p className="text-lg font-semibold text-gray-900">
              {profile.schoolName || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Referral Code: {profile.referralCode || "N/A"}
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-4">
          {profile.isVerified ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Profile Verified
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <ClockIcon className="h-4 w-4 mr-1" />
              Verification Pending
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/teacher/refer-student">
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <UserPlusIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Refer New Student</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add a new student to your referral list
                </p>
              </div>
            </div>
          </Link>

          <Link href="/teacher/assignments">
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Manage Assignments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Assign tutors and counselors to students
                </p>
              </div>
            </div>
          </Link>

          <Link href="/teacher/progress-reports">
            <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <ChartBarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">Create Progress Report</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track and report student progress
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Referrals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Referrals
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity.referrals?.length > 0 ? (
                  recentActivity.referrals.map((referral) => (
                    <li key={referral.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {referral.studentName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Referred{" "}
                            {new Date(referral.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              referral.status
                            )}`}
                          >
                            {getStatusIcon(referral.status)}
                            <span className="ml-1">{referral.status}</span>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4">
                    <div className="text-center text-gray-500">
                      <UserGroupIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No recent referrals</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-4">
              <Link
                href="/teacher/students"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all referrals →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Assignments
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivity.assignments?.map((assignment) => (
                  <li key={assignment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {assignment.studentName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Assigned to {assignment.providerName}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            assignment.status
                          )}`}
                        >
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1">{assignment.status}</span>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <Link
                href="/teacher/assignments"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all assignments →
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications Widget */}
        <div className="lg:col-span-1">
          <NotificationWidget limit={5} />
        </div>
      </div>
    </div>
  );
}
