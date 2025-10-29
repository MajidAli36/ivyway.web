"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import SessionCard from "./components/SessionCard";
import SessionFilter from "./components/SessionFilter";
import {
  PlusIcon,
  ArrowPathIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { authService } from "@/app/lib/auth/authService";
import { apiGet, apiPost } from "../utils/api";
import { counselorBookings } from "@/app/lib/api/endpoints";
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import sessionService from "@/app/lib/api/sessionService";
import toast, { Toaster } from "react-hot-toast";
// Removed unused SessionButton import

function StudentSessions() {
  const [sessions, setSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all"); // kept for now but tabs removed
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed SessionDetails modal state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const [sessionStats, setSessionStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    canceled: 0,
    tutoring: 0,
    counseling: 0,
  });

  // Normalize backend status variants to UI status keys
  const normalizeStatus = (status) => {
    if (!status) return "pending";
    const s = String(status).toLowerCase();
    if (s === "cancelled") return "canceled"; // unify spelling
    return s;
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

  // Fetch sessions using proper API endpoints
  const fetchSessions = useCallback(
    async (status = "", serviceType = "all") => {
      setIsLoading(true);
      setError(null);

      if (!authService.isAuthenticated()) {
        setError("Please sign in to view your sessions");
        setIsLoading(false);
        return;
      }

      try {
        let allSessions = [];
        let hasCounselorError = false;
        let hasTutorError = false;
        let apiErrors = [];

        // Try to fetch counselor sessions using the proper endpoint
        try {
          const counselorResult = await safeApiCall(
            () =>
              counselorBookings.getStudentSessions({
                page: 1,
                limit: 50,
              }),
            {
              extractArray: true,
              dataKey: "data",
              defaultData: [],
              errorMessage: "Failed to load counseling sessions",
            }
          );

          if (counselorResult.success && counselorResult.data) {
            const counselorSessions = counselorResult.data.map((s) => ({
              id: `counselor-${s.id}`,
              date: s.startTime
                ? s.startTime.split("T")[0]
                : new Date().toISOString().split("T")[0],
              startTime: s.startTime
                ? new Date(s.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "10:00",
              endTime: s.endTime
                ? new Date(s.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "11:00",
              duration: s.duration || 60,
              status: normalizeStatus(s.status || "pending"),
              sessionType: s.sessionType || "virtual",
              notes: s.notes || s.description || "",
              subject: { name: s.subject || "Academic Counseling" },
              provider: {
                name: s.counselorName || s.counselor?.name || "Counselor",
                specialization: "Academic Counselor",
                type: "counselor",
              },
              serviceType: "counseling",
              meetingLink:
                s.sessionType === "virtual" ? s.meetingLink || "#" : null,
            }));
            allSessions = [...allSessions, ...counselorSessions];
          } else if (!counselorResult.success) {
            hasCounselorError = true;
            apiErrors.push("Failed to load counseling sessions");
          }
        } catch (counselorError) {
          console.error("Failed to fetch counselor sessions:", counselorError);
          hasCounselorError = true;
          apiErrors.push("Failed to load counseling sessions");
        }

        // Try to fetch tutor sessions using the existing endpoint (exclude counselor bookings)
        try {
          const tutorResult = await apiGet(`bookings/my`);

          if (tutorResult && tutorResult.data) {
            // Filter out counselor bookings to prevent duplicates
            const tutorBookings = tutorResult.data.filter(s => 
              s.providerRole !== "counselor" && s.serviceType !== "counseling"
            );
            
            const tutorSessions = tutorBookings.map((s) => ({
              id: `tutor-${s.id}`,
              date: s.startTime
                ? s.startTime.split("T")[0]
                : new Date().toISOString().split("T")[0],
              startTime: s.startTime
                ? new Date(s.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "14:00",
              endTime: s.endTime
                ? new Date(s.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "15:00",
              duration:
                s.duration ||
                Math.round(
                  s.startTime && s.endTime
                    ? (new Date(s.endTime) - new Date(s.startTime)) / 60000
                    : 60
                ),
              status: normalizeStatus(s.status || "pending"),
              sessionType: s.sessionType || "virtual",
              notes: s.notes || "",
              subject: { name: s.subject || s.providerRole || "Mathematics" },
              provider: {
                name: s.providerName || "Tutor",
                specialization: s.providerRole || "Math Tutor",
                type: "tutor",
              },
              serviceType: "tutoring",
              meetingLink:
                s.sessionType === "virtual" ? s.meetingLink || "#" : null,
            }));
            allSessions = [...allSessions, ...tutorSessions];
          } else {
            hasTutorError = true;
            apiErrors.push("Failed to load tutoring sessions");
          }
        } catch (tutorError) {
          console.error("Failed to fetch tutor sessions:", tutorError);
          hasTutorError = true;
          apiErrors.push("Failed to load tutoring sessions");
        }

        // If both API calls failed, throw an error instead of showing mock data
        if (hasCounselorError && hasTutorError) {
          throw new Error(apiErrors.join("; ") || "Failed to fetch sessions");
        }

        // If at least one API call failed but we have some data, show a warning but still display the data
        if ((hasCounselorError || hasTutorError) && allSessions.length > 0) {
          console.warn("Partial data loaded:", {
            counselorFailed: hasCounselorError,
            tutorFailed: hasTutorError,
            sessionsLoaded: allSessions.length
          });
        }

        // Deduplicate sessions across sources (counselor + tutor) using booking ID
        const seenIds = new Set();
        const dedupedSessions = [];
        
        for (const s of allSessions) {
          // Extract the actual booking ID from the prefixed ID
          const actualId = s.id.replace(/^(counselor-|tutor-)/, '');
          
          if (seenIds.has(actualId)) {
            console.log(`Skipping duplicate session with ID: ${actualId}`);
            continue;
          }
          seenIds.add(actualId);
          dedupedSessions.push(s);
        }

        // Sort sessions by date (newest first)
        dedupedSessions.sort(
          (a, b) =>
            new Date(b.date + " " + b.startTime) -
            new Date(a.date + " " + a.startTime)
        );

        setSessions(dedupedSessions);

        // Calculate stats from the fetched sessions
        const stats = {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          canceled: 0,
          tutoring: 0,
          counseling: 0,
        };

        dedupedSessions.forEach((s) => {
          stats.total++;
          if (s.status in stats) stats[s.status]++;
          if (s.serviceType === "tutoring") stats.tutoring++;
          if (s.serviceType === "counseling") stats.counseling++;
        });

        setSessionStats(stats);
      } catch (error) {
        console.error("Error fetching sessions:", error);

        // Handle authentication errors
        if (error.message && error.message.includes("Please sign in")) {
          setError("Session expired. Please sign in again.");
          // Clear invalid tokens
          authService.logout();
        } else {
          setError(error.message || "Failed to fetch sessions");
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load & polling
  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions(statusFilter, serviceTypeFilter);
      const iv = setInterval(
        () => fetchSessions(statusFilter, serviceTypeFilter),
        30000
      );
      return () => clearInterval(iv);
    }
  }, [fetchSessions, statusFilter, serviceTypeFilter, isAuthenticated]);

  // Enhanced cancel session handler with validation and proper error handling
  const handleCancelSession = async (sessionId) => {
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      return;
    }

    // Find the session to validate
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      toast.error("Session not found");
      return;
    }

    // Validate session action
    const validation = sessionService.validateSessionAction(session, "cancel");
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    toast.loading("Cancelling session...", { id: "cancel" });

    try {
      let response;

      if (session.serviceType === "counseling") {
        // Cancel counselor session
        response = await sessionService.updateCounselorSessionStatus(
          sessionId.replace("counselor-", ""),
          "cancelled",
          "Cancelled by student"
        );
      } else {
        // Cancel tutor session
        response = await sessionService.cancelTutorSession(
          sessionId.replace("tutor-", ""),
          "Cancelled by student"
        );
      }

      if (response && response.success) {
        toast.success("Session cancelled successfully", { id: "cancel" });
        // Update local state immediately
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: "canceled" } : s
          )
        );
        // Refresh sessions to get latest data
        await fetchSessions(statusFilter, serviceTypeFilter);
      } else {
        throw new Error(response?.message || "Failed to cancel session");
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      const errorMessage = sessionService.handleApiError(
        error,
        "cancelling session"
      );
      toast.error(errorMessage, { id: "cancel" });

      // If unauthorized message
      if (error.message && error.message.includes("Please sign in")) {
        authService.logout();
        window.location.href = "/login";
      }
    }
  };

  // New function to handle session status updates
  const handleUpdateSessionStatus = async (sessionId, newStatus) => {
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      return;
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) {
      toast.error("Session not found");
      return;
    }

    const validation = sessionService.validateSessionAction(session, "update");
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    toast.loading(`Updating session status...`, { id: "update" });

    try {
      let response;

      if (session.serviceType === "counseling") {
        response = await sessionService.updateCounselorSessionStatus(
          sessionId.replace("counselor-", ""),
          newStatus
        );
      } else {
        response = await sessionService.updateTutorSessionStatus(
          sessionId.replace("tutor-", ""),
          newStatus
        );
      }

      if (response && response.success) {
        toast.success(`Session status updated to ${newStatus}`, {
          id: "update",
        });
        // Update local state immediately
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: newStatus } : s
          )
        );
        // Refresh sessions to get latest data
        await fetchSessions(statusFilter, serviceTypeFilter);
      } else {
        throw new Error(response?.message || "Failed to update session status");
      }
    } catch (error) {
      console.error("Error updating session status:", error);
      const errorMessage = sessionService.handleApiError(
        error,
        "updating session"
      );
      toast.error(errorMessage, { id: "update" });
    }
  };

  const onFilterChange = ({ status, search }) => {
    setStatusFilter(status || "");
    setSearchQuery(search || "");
    setCurrentPage(1);
  };

  // Removed openDetails handler and SessionDetails usage

  // Filter sessions based on service type
  const filteredSessions = sessions.filter((session) => {
    // status filter (client-side)
    const matchesStatus = statusFilter ? session.status === statusFilter : true;
    // search by tutor name or subject
    const matchesSearch = searchQuery
      ? (session.provider?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (session.subject?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalItems = filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedSessions = filteredSessions.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Ensure current page is valid when session list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, sessions.length]);

  // Removed selectedSession lookup since details modal is removed

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Sessions</h1>
          <p className="text-sm text-gray-500">
            Manage your tutoring and counseling sessions
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => fetchSessions(statusFilter, serviceTypeFilter)}
            className="px-3 py-2 bg-white border rounded hover:bg-gray-100"
          >
            <ArrowPathIcon className="h-5 w-5 text-gray-600" />
          </button>
          <Link
            href="/student/book-session"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-1 inline" />
            Book New
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {[
            ["Total", sessionStats.total, CalendarIcon],
            ["Pending", sessionStats.pending, ClockIcon],
            ["Confirmed", sessionStats.confirmed, CheckCircleIcon],
            ["Canceled", sessionStats.canceled, XCircleIcon],
            ["Tutoring", sessionStats.tutoring, BookOpenIcon],
            ["Counseling", sessionStats.counseling, BookOpenIcon],
          ].map(([label, cnt, Icon]) => (
            <div key={label} className="bg-white p-5 rounded-lg shadow">
              <div className="flex items-center space-x-3">
                <Icon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-2xl font-semibold">{cnt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <SessionFilter
          onFilterChange={onFilterChange}
          totalSessions={sessionStats.total}
          pendingCount={sessionStats.pending}
          confirmedCount={sessionStats.confirmed}
          completedCount={sessionStats.completed}
          canceledCount={sessionStats.canceled}
        />

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-t-2 border-indigo-500 rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <p className="text-red-700">{error}</p>
            {error.includes("sign in") && (
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </button>
            )}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded shadow">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">
              {sessions.length === 0
                ? "No sessions found."
                : `No ${
                    serviceTypeFilter === "all" ? "" : serviceTypeFilter
                  } sessions found.`}
            </p>
            <Link
              href="/student/book-session"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Book Your First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedSessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onCancelRequest={handleCancelSession}
              />
            ))}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded shadow">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + PAGE_SIZE, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage === 1}
                  >
                    Previous
                  </button>
                  {/* Page numbers (up to 5 visible) */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, safeCurrentPage - 3),
                      Math.max(0, safeCurrentPage - 3) + 5
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 border rounded text-sm ${
                          page === safeCurrentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  <button
                    className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SessionDetails modal removed */}
    </div>
  );
}

// Export with dynamic import to prevent hydration issues
export default dynamic(() => Promise.resolve(StudentSessions), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-t-2 border-indigo-500 rounded-full"></div>
    </div>
  ),
});
