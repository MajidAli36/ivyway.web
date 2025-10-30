"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { authService } from "../../../lib/auth/authService";
import apiClient from "../../../lib/api/client";
import { API_CONFIG } from "../../../lib/api/config";
import { format } from "date-fns";
import SessionButton from "@/app/components/SessionButton";

// Session status types with updated styling
const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-blue-50 text-blue-500 border border-blue-200",
  accepted: "bg-blue-50 text-blue-500 border border-blue-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  rejected: "bg-gray-50 text-gray-700 border border-gray-200",
  declined: "bg-red-50 text-red-700 border border-red-200",
};

// Mapping API status to display status
const statusMapping = {
  pending: "Pending",
  confirmed: "Upcoming",
  accepted: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  declined: "Declined",
};

// Filter tabs component
const FilterTabs = ({ filter, setFilter, counts }) => {
  const tabs = [
    { key: "all", label: "All Sessions" },
    { key: "confirmed", label: "Upcoming" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex px-4 space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`
              whitespace-nowrap py-4 px-4 font-medium text-sm rounded-t-lg transition-colors
              ${
                filter === tab.key
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-[#6b7280] hover:text-blue-500 hover:bg-blue-50/20"
              }
            `}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-[#6b7280]">
              {counts[tab.key] || 0}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Empty state component
const EmptyState = ({ filter }) => (
  <div className="py-20 text-center">
    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <CalendarIcon className="h-10 w-10 text-[#9ca3af]" />
    </div>
    <h3 className="text-lg font-medium text-[#243b53]">No sessions found</h3>
    <p className="mt-1 text-[#6b7280]">
      There are no {filter !== "all" ? statusMapping[filter] || filter : ""}{" "}
      sessions to display.
    </p>
  </div>
);

// Session row component
const SessionRow = ({
  session,
  onJoin,
  onViewNotes,
  onConfirm,
  onViewDetails,
  onMessage,
}) => {
  // Format the date for display
  const formattedDate = session.startTime
    ? new Date(session.startTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Format the time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const timeRange =
    session.startTime && session.endTime
      ? `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`
      : "";

  // Determine if session is paid
  const isPaid =
    session.status === "completed" ||
    session.status === "confirmed" ||
    session.status === "accepted";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
            {session.student?.profileImageUrl || session.studentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.student?.profileImageUrl || session.studentAvatar}
                alt={(session.studentName || "Student") + " avatar"}
                className="h-10 w-10 object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`${
                session.student?.profileImageUrl || session.studentAvatar
                  ? "hidden"
                  : "flex"
              } h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 items-center justify-center text-white font-semibold`}
            >
              {(session.studentName || "S")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-[#334e68]">
              {session.studentName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
        {session.notes
          ? session.notes.split(" ").slice(0, 3).join(" ") + "..."
          : session.subject || "Counseling Session"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {formattedDate && (
          <div className="text-sm text-[#6b7280] flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
            {formattedDate}
          </div>
        )}
        {timeRange && (
          <div className="text-sm text-[#6b7280] flex items-center mt-1">
            <ClockIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
            {timeRange}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
            statusStyles[session.status] || statusStyles.pending
          }`}
        >
          {statusMapping[session.status] || "Pending"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
            isPaid
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {isPaid ? (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Paid
            </>
          ) : (
            <>
              <XCircleIcon className="h-4 w-4 mr-1" />
              Unpaid
            </>
          )}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2 justify-end">
          {(session.status === "confirmed" || session.status === "accepted") && (
            <>
              <button
                onClick={() => onMessage(session.id, session.studentName)}
                className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-sm font-medium rounded-full text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                title="Message student"
              >
                <ChatBubbleLeftIcon className="h-4 w-4" />
              </button>
              <SessionButton
                session={{
                  id: session.id,
                  date: session.startTime
                    ? new Date(session.startTime).toISOString().split("T")[0]
                    : "",
                  startTime: session.startTime
                    ? format(new Date(session.startTime), "h:mm a")
                    : "",
                  endTime: session.endTime
                    ? format(new Date(session.endTime), "h:mm a")
                    : "",
                  sessionType: "virtual",
                  status: session.status || "confirmed",
                }}
                userRole="counselor"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Sessions Table component
const SessionsTable = ({
  sessions,
  onJoin,
  onViewNotes,
  onConfirm,
  onViewDetails,
  onMessage,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Student
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Subject
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Payment
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-medium text-[#4b5563] uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              onJoin={onJoin}
              onViewNotes={onViewNotes}
              onConfirm={onConfirm}
              onViewDetails={onViewDetails}
              onMessage={onMessage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  currentItems,
  onPageChange,
}) => {
  return (
    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full ${
            currentPage === 1
              ? "text-gray-400 bg-gray-50 cursor-not-allowed"
              : "text-blue-500 bg-white hover:bg-blue-50 transition-colors"
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full ${
            currentPage === totalPages
              ? "text-gray-400 bg-gray-50 cursor-not-allowed"
              : "text-blue-500 bg-white hover:bg-blue-50 transition-colors"
          }`}
        >
          Next
          <ChevronRightIcon className="h-5 w-5 ml-1" />
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#6b7280]">
            Showing{" "}
            <span className="font-medium text-[#243b53]">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#243b53]">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium text-[#243b53]">{totalItems}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-full shadow-sm -space-x-px overflow-hidden"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#6b7280] hover:bg-blue-50 transition-colors"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onPageChange(idx + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${
                  currentPage === idx + 1
                    ? "bg-blue-500 text-sm font-medium text-white"
                    : "bg-white text-sm font-medium text-[#6b7280] hover:bg-blue-50 transition-colors"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#6b7280] hover:bg-blue-50 transition-colors"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Main component - Using JWT tokens
export default function CounselorSessions() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Fetch sessions from API with JWT token
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!authService.isAuthenticated()) {
          setError("Please sign in to view sessions");
          setLoading(false);
          return;
        }

        const token = authService.getToken();

        const response = await fetch(
          `${API_CONFIG.baseURL}/counselor/bookings/sessions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          setError("Unauthorized — please log in again");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          // Backend returns: { success: true, data: { data: [...], pagination: {...}, stats: {...} } }
          // So we need to access data.data.data to get the actual array
          const sessionsData = data.data?.data || data.data || [];
          setSessions(Array.isArray(sessionsData) ? sessionsData : []);
          console.log("Fetched sessions:", sessionsData.length, "sessions");
        } else {
          throw new Error(data.message || "Failed to load sessions");
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Ensure sessions is always an array
  const sessionsArray = Array.isArray(sessions) ? sessions : [];

  // Filter sessions based on selected filter
  const filteredSessions =
    filter === "all"
      ? sessionsArray
      : sessionsArray.filter((session) => session.status === filter);

  // Calculate session counts for filters
  const counts = {
    all: sessionsArray.length,
    confirmed: sessionsArray.filter(
      (s) => s.status === "confirmed" || s.status === "accepted"
    ).length,
    pending: sessionsArray.filter((s) => s.status === "pending").length,
    completed: sessionsArray.filter((s) => s.status === "completed").length,
    cancelled: sessionsArray.filter((s) => s.status === "cancelled").length,
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSessions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / itemsPerPage)
  );

  // Handle session actions
  const handleJoinSession = (sessionId) => {
    toast.success(`Joining session ${sessionId}`);
  };

  const handleViewNotes = (sessionId) => {
    toast.success(`Viewing notes for session ${sessionId}`);
  };

  const handleConfirmSession = async (sessionId) => {
    try {
      if (!authService.isAuthenticated()) {
        toast.error("Please sign in");
        return;
      }

      const token = authService.getToken();

      toast.loading("Confirming session...", { id: "confirm" });

      const response = await fetch(
        `${API_CONFIG.baseURL}/counselor/bookings/sessions/${sessionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "confirmed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success || data.status === "success") {
        const updatedSessions = sessions.map((session) =>
          session.id === sessionId ? { ...session, status: "confirmed" } : session
        );
        setSessions(updatedSessions);
        toast.success("Session confirmed successfully", { id: "confirm" });
      } else {
        toast.error("Failed to confirm session", { id: "confirm" });
      }
    } catch (err) {
      console.error("Error confirming session:", err);
      toast.error("Failed to confirm session: " + err.message, {
        id: "confirm",
      });
    }
  };

  const handleViewDetails = (sessionId) => {
    toast.success(`Viewing details for session ${sessionId}`);
  };

  const handleMessageStudent = async (sessionId, studentName) => {
    try {
      if (!authService.isAuthenticated()) {
        toast.error("Please sign in to message students");
        return;
      }

      toast.loading("Accessing conversation...", { id: "message" });

      const response = await apiClient.post(
        "/messaging/conversations/booking",
        { bookingId: sessionId }
      );

      if (response.success) {
        const conversation = response.data;
        toast.success(`Opening conversation with ${studentName}`, {
          id: "message",
        });
        router.push(`/counselor/messages?conversation=${conversation.id}`);
      } else {
        toast.success("Redirecting to messages", { id: "message" });
        router.push("/counselor/messages");
      }
    } catch (err) {
      console.error("Error accessing conversation:", err);
      toast.error("Failed to access conversation: " + err.message, {
        id: "message",
      });
      router.push("/counselor/messages");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">My Sessions</h1>
          <p className="mt-1 text-[#6b7280]">
            View and manage all your counseling sessions
          </p>
        </div>
        <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">My Sessions</h1>
          <p className="mt-1 text-[#6b7280]">
            View and manage all your counseling sessions
          </p>
        </div>
        <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-700 mb-2">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold text-[#243b53]">My Sessions</h1>
        <p className="mt-1 text-[#6b7280]">
          View and manage all your counseling sessions
        </p>
      </div>

      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        {/* Filter tabs */}
        <FilterTabs filter={filter} setFilter={setFilter} counts={counts} />

        {/* Sessions content */}
        {currentItems.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <SessionsTable
            sessions={currentItems}
            onJoin={handleJoinSession}
            onViewNotes={handleViewNotes}
            onConfirm={handleConfirmSession}
            onViewDetails={handleViewDetails}
            onMessage={handleMessageStudent}
          />
        )}

        {/* Pagination */}
        {filteredSessions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSessions.length}
            currentItems={currentItems.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}