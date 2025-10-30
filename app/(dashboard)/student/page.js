"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
  ClockIcon,
  BellIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { useStudentDashboard } from "../../hooks/useDashboard";
import useStudentProfile from "../../hooks/useStudentProfile";
import { useAuth } from "../../providers/AuthProvider";
import OverviewCards from "../../components/dashboard/OverviewCards";
import UpcomingSessions, {
  StudentSessions,
} from "../../components/dashboard/UpcomingSessions";
import UnreviewedSessions from "../../components/rating/UnreviewedSessions";
import ReactAIWidget from "../../components/ai-chat/ReactAIWidget";
import { zoomService } from "../../lib/api/zoomService";
import MeetingCard from "../../components/meetings/MeetingCard";

// (Removed SubjectProgressBar along with the 'My Subjects' card)

export default function StudentDashboard() {
  const { dashboardData, loading, error, refreshing, refreshDashboard, retry } =
    useStudentDashboard();

  const { profile: studentProfile, loading: profileLoading } =
    useStudentProfile();

  const [joiningSession, setJoiningSession] = useState(null);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // Get current user from auth context
  const { user: currentUser } = useAuth();

  // Memoized function to fetch upcoming meetings
  const fetchUpcomingMeetings = useCallback(async () => {
    const studentId = currentUser?.id || currentUser?.studentId;
    if (!studentId) return;

    setMeetingsLoading(true);
    try {
      const response = await zoomService.getStudentMeetings(studentId, {
        page: 1,
        limit: 3,
        status: "scheduled",
      });

      if (response && response.meetings) {
        setUpcomingMeetings(response.meetings);
      } else {
        setUpcomingMeetings([]);
      }
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      // Use mock data for demonstration
      setUpcomingMeetings([
        {
          id: "1",
          meetingId: "zoom-123",
          topic: "Academic Counseling Session",
          status: "scheduled",
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          duration: 60,
          serviceType: "counseling",
          joinUrl: "https://zoom.us/j/123456789",
          counselor: { name: "Dr. Jane Smith" },
          student: { name: "John Doe" },
        },
      ]);
    } finally {
      setMeetingsLoading(false);
    }
  }, [currentUser?.id, currentUser?.studentId]);

  // Fetch upcoming meetings only when user is available
  useEffect(() => {
    if (currentUser?.id || currentUser?.studentId) {
      fetchUpcomingMeetings();
    }
  }, [fetchUpcomingMeetings]);

  // Function to handle joining a session
  const handleJoinSession = (session) => {
    setJoiningSession(session.id);

    // In a real implementation, this would connect to your video conferencing API
    setTimeout(() => {
      if (session.meetingLink) {
        window.open(session.meetingLink, "_blank");
      } else {
        window.location.href = `/student/session/${session.id}`;
      }
      setJoiningSession(null);
    }, 1000);
  };

  // Helper function to get user initials from email
  const getUserInitials = (email) => {
    if (!email) return "U";
    const parts = email.split("@")[0]; // Get part before @
    const words = parts.split(/[._-]/); // Split by common separators
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return parts.charAt(0).toUpperCase();
  };

  // Helper function to get display name from email
  const getDisplayName = (email) => {
    if (!email) return "Student";
    const parts = email.split("@")[0]; // Get part before @
    const words = parts.split(/[._-]/); // Split by common separators
    if (words.length >= 2) {
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return parts.charAt(0).toUpperCase() + parts.slice(1);
  };

  // Helper function to get user's grade/level
  const getUserGrade = (profile) => {
    if (profile?.program) {
      return profile.program;
    } else if (profile?.grade) {
      return `Grade ${profile.grade}`;
    }
    return "Student";
  };

  // Calculate progress percentage based on completed sessions vs total
  const calculateProgress = () => {
    if (!dashboardData?.overview) return 0;
    const { totalSessions, upcomingSessions } = dashboardData.overview;
    if (totalSessions === 0) return 0;
    return Math.round(
      ((totalSessions - upcomingSessions) / totalSessions) * 100
    );
  };

  // Prepare stats data for overview cards
  const stats = dashboardData?.overview
    ? [
        {
          name: "Total Sessions",
          value: dashboardData.overview.totalSessions.toString(),
          icon: BookOpenIcon,
          description: "All time sessions completed",
        },
        {
          name: "Hours Completed",
          value: dashboardData.overview.totalHours.toString(),
          icon: ClockIcon,
          description: "Total learning hours",
        },
        {
          name: "Upcoming Sessions",
          value: dashboardData.overview.upcomingSessions.toString(),
          icon: CalendarIcon,
          description: "Sessions scheduled",
        },
        {
          name: "Unread Messages",
          value: dashboardData.overview.unreadMessages.toString(),
          icon: BellIcon,
          description: "New messages from tutors",
        },
      ]
    : [];

  // Prepare subjects data
  const subjects = dashboardData?.analytics?.subjectsBreakdown?.map(
    (subject) => ({
      name: subject.subject,
      progress: Math.round((subject.totalHours / 100) * 100), // Convert hours to percentage for demo
    })
  ) || [
    { name: "Mathematics", progress: 85 },
    { name: "Physics", progress: 72 },
    { name: "Chemistry", progress: 90 },
    { name: "Biology", progress: 65 },
  ];

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6 max-w-7xl mx-auto">
      {/* Header with greeting and refresh button */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Welcome back, {getDisplayName(currentUser?.email)}!
          </h1>
          <p className="text-[#4b5563] mt-1">
            Here's what's happening with your learning journey
          </p>
          {dashboardData?.lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Last updated:{" "}
              {new Date(dashboardData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <OverviewCards
        stats={stats}
        loading={loading}
        error={error}
        className="mb-8"
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Upcoming Sessions */}
        <div>
          <StudentSessions
            sessions={dashboardData?.upcomingSessions || []}
            loading={loading}
            error={error}
            onJoinSession={handleJoinSession}
          />

          {/* Unreviewed Sessions */}
          <div className="mt-8">
            <UnreviewedSessions />
          </div>

          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <div className="mt-8">
              <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                      <VideoCameraIcon className="h-6 w-6 mr-2 text-blue-500" />
                      Upcoming Meetings
                    </h2>
                    <Link
                      href="/student/meetings"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      View all meetings
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  {meetingsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-sm text-gray-500">
                        Loading meetings...
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {upcomingMeetings.map((meeting) => (
                        <MeetingCard
                          key={meeting.id}
                          meeting={meeting}
                          userRole="student"
                          showActions={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl transition-transform hover:translate-y-[-4px]">
              <div className="px-5 py-5">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                    <BookOpenIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-[#243b53]">
                    Book Session
                  </h3>
                </div>
                <div className="mt-3 text-sm text-[#4b5563]">
                  Schedule tutoring or counseling sessions
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end">
                <Link
                  href="/student/book-session"
                  className="font-medium text-blue-500 hover:text-blue-600 text-sm flex items-center"
                >
                  Book now
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl transition-transform hover:translate-y-[-4px]">
              <div className="px-5 py-5">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                    <CalendarIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-[#243b53]">
                    Manage Plans
                  </h3>
                </div>
                <div className="mt-3 text-sm text-[#4b5563]">
                  View pricing, manage subscriptions, and billing
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end">
                <Link
                  href="/student/billing"
                  className="font-medium text-blue-500 hover:text-blue-600 text-sm flex items-center"
                >
                  View billing
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl transition-transform hover:translate-y-[-4px]">
              <div className="px-5 py-5">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#dbeafe]">
                    <BellIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-[#243b53]">
                    Notifications
                  </h3>
                </div>
                <div className="mt-3 text-sm text-[#4b5563]">
                  View alerts and updates
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end">
                <Link
                  href="/student/notifications"
                  className="font-medium text-blue-500 hover:text-blue-600 text-sm flex items-center"
                >
                  View notifications
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      {/* ReAct AI Widget */}
      <ReactAIWidget userRole="student" />
    </div>
  );
}
