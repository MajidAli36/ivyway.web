"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  MapPinIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

/**
 * Upcoming Sessions Component
 * Displays upcoming sessions with proper formatting and actions
 */
export default function UpcomingSessions({
  sessions = [],
  loading = false,
  error = null,
  title = "Upcoming Sessions",
  showViewAll = true,
  maxSessions = 5,
  onSessionClick = null,
  onJoinSession = null,
  className = "",
  emptyMessage = "No upcoming sessions scheduled.",
  emptyAction = null,
}) {
  const [hoveredSession, setHoveredSession] = useState(null);

  if (loading) {
    return (
      <div
        className={`bg-white shadow-md rounded-xl overflow-hidden ${className}`}
      >
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-6 bg-gray-200 rounded mr-2 animate-pulse"></div>
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {showViewAll && (
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading sessions
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displaySessions = sessions.slice(0, maxSessions);
  const hasMoreSessions = sessions.length > maxSessions;

  const getSessionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType?.toLowerCase()) {
      case "virtual":
      case "online":
        return <VideoCameraIcon className="h-4 w-4" />;
      case "in-person":
      case "offline":
        return <MapPinIcon className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const formatSessionTime = (startTime, endTime) => {
    if (!startTime) return "TBD";

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    const timeString = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (end) {
      const endTimeString = end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${timeString} - ${endTimeString}`;
    }

    return timeString;
  };

  const formatSessionDate = (date) => {
    if (!date) return "TBD";

    const sessionDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (sessionDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return sessionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`bg-white shadow-md rounded-xl overflow-hidden ${className}`}
    >
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {sessions.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                {sessions.length}
              </span>
            )}
          </div>
          {showViewAll && sessions.length > 0 && (
            <Link
              href="/student/my-sessions"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center transition-colors"
            >
              View all
              <ChevronRightIcon className="h-5 w-5 ml-1" />
            </Link>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {displaySessions.length > 0 ? (
          displaySessions.map((session, index) => (
            <div
              key={session.id || index}
              className={`
                px-6 py-4 transition-colors cursor-pointer
                ${hoveredSession === index ? "bg-gray-50" : "hover:bg-gray-50"}
              `}
              onMouseEnter={() => setHoveredSession(index)}
              onMouseLeave={() => setHoveredSession(null)}
              onClick={() => onSessionClick && onSessionClick(session)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                      {getInitials(session.providerName || session.studentName)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-base font-medium text-gray-900">
                        {session.subject || session.sessionType}
                      </p>
                      {session.topic && (
                        <span className="ml-2 text-sm text-gray-500">
                          • {session.topic}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <UserIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>
                          {session.providerName ||
                            session.studentName ||
                            "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{formatSessionDate(session.startTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>
                          {formatSessionTime(
                            session.startTime,
                            session.endTime
                          )}
                        </span>
                      </div>
                      {session.sessionType && (
                        <div className="flex items-center">
                          {getSessionTypeIcon(session.sessionType)}
                          <span className="ml-1.5 text-xs text-gray-500">
                            {session.sessionType}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSessionStatusColor(
                      session.status
                    )}`}
                  >
                    {session.status || "Scheduled"}
                  </span>

                  {onJoinSession &&
                    session.status?.toLowerCase() === "confirmed" && (
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJoinSession(session);
                        }}
                      >
                        Join Session
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center">
            <CalendarIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-gray-600">{emptyMessage}</p>
            {emptyAction && <div className="mt-4">{emptyAction}</div>}
          </div>
        )}

        {hasMoreSessions && (
          <div className="px-6 py-4 bg-gray-50 flex justify-center">
            <Link
              href="/student/my-sessions"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              View {sessions.length - maxSessions} more sessions
              <ChevronRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Specialized session components
 */
export const StudentSessions = ({
  sessions,
  loading,
  error,
  onJoinSession,
}) => (
  <UpcomingSessions
    sessions={sessions}
    loading={loading}
    error={error}
    title="My Upcoming Sessions"
    onJoinSession={onJoinSession}
    emptyMessage="No upcoming sessions scheduled."
    emptyAction={
      <Link
        href="/student/book-session"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Book a Session
      </Link>
    }
  />
);

export const TutorSessions = ({ sessions, loading, error, onJoinSession }) => (
  <UpcomingSessions
    sessions={sessions}
    loading={loading}
    error={error}
    title="Today's Sessions"
    onJoinSession={onJoinSession}
    emptyMessage="No sessions scheduled for today."
    emptyAction={
      <Link
        href="/tutor/schedule/availability"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Update Availability
      </Link>
    }
  />
);

export const CounselorSessions = ({
  sessions,
  loading,
  error,
  onJoinSession,
}) => (
  <UpcomingSessions
    sessions={sessions}
    loading={loading}
    error={error}
    title="Today's Guidance Sessions"
    onJoinSession={onJoinSession}
    emptyMessage="No guidance sessions scheduled for today."
    emptyAction={
      <Link
        href="/counselor/schedule-session"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        Schedule Session
      </Link>
    }
  />
);
