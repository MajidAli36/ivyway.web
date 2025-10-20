"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  InboxIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  AcademicCapIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { authService } from "@/app/lib/auth/authService";
import apiClient from "@/app/lib/api/client";

// Request Status Badge Component
function StatusBadge({ status }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let icon = <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />;

  switch (status.toLowerCase()) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = <ClockIcon className="h-4 w-4 mr-1" />;
      break;
    case "confirmed":
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
      break;
    case "declined":
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircleIcon className="h-4 w-4 mr-1" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}

// Request Card Component
function RequestCard({ request, onAccept, onReject }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      return;
    }

    if (isAccepting) return; // guard against rapid multi-clicks
    setIsAccepting(true);
    toast.loading("Accepting…", { id: `accept-${request.id}` });

    try {
      const response = await apiClient.patch(`/bookings/${request.id}/status`, {
        status: "confirmed",
        cancellationReason: null,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to accept request");
      }

      onAccept(
        request.id,
        response.data.status,
        response.data.cancellationReason
      );
      toast.success("Session request accepted!", {
        id: `accept-${request.id}`,
      });
    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error(err.message || "Failed to accept request", {
        id: `accept-${request.id}`,
      });

      if (err.status === 401) {
        authService.logout();
        window.location.href = "/login";
      }
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async (e) => {
    e.stopPropagation();
    if (isRejecting) return; // guard double click
    setIsRejecting(true);
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      setIsRejecting(false);
      return;
    }

    toast.loading("Rejecting…", { id: `reject-${request.id}` });

    try {
      const response = await apiClient.patch(`/bookings/${request.id}/status`, {
        status: "cancelled",
        cancellationReason: "Request rejected by tutor",
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to reject request");
      }

      onReject(
        request.id,
        response.data.status,
        response.data.cancellationReason
      );
      toast.success("Session request rejected!", {
        id: `reject-${request.id}`,
      });
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error(err.message || "Failed to reject request", {
        id: `reject-${request.id}`,
      });

      if (err.status === 401) {
        authService.logout();
        window.location.href = "/login";
      }
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {request.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {request.studentName}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">
            {request.sessionType.charAt(0).toUpperCase() +
              request.sessionType.slice(1)}{" "}
            Session Request
          </h4>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {request.notes || "No additional notes provided"}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
            {formatDate(request.startTime)} {formatTime(request.startTime)} -{" "}
            {formatTime(request.endTime)}
          </div>
          <div className="flex items-center">
            <AcademicCapIcon className="h-4 w-4 mr-1.5 text-gray-400" />
            {request.sessionType.charAt(0).toUpperCase() +
              request.sessionType.slice(1)}
          </div>
        </div>

        {/* Action buttons - only show for pending requests */}
        {request.status === "pending" && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleReject}
              disabled={isRejecting || isAccepting}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              {isRejecting ? "Rejecting…" : "Reject"}
            </button>
            <button
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              {isAccepting ? "Accepting…" : "Accept"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export default function StudentRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [requestsData, setRequestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);

      if (!authService.isAuthenticated()) {
        setError("Please sign in to view requests");
        setIsLoading(false);
        return;
      }

      try {
        // Using apiClient instead of fetch for consistent auth handling
        const response = await apiClient.get("/bookings/provider");

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch bookings");
        }

        console.log("Fetched booking data:", response.data);
        setRequestsData(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);

        // Handle authorization errors
        if (err.status === 401) {
          setError("Session expired. Please sign in again.");
          // Clear invalid tokens
          authService.logout();
          // Optionally redirect to login
          // window.location.href = '/login';
        } else {
          setError(err.message || "Failed to fetch booking requests");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Filtering & counts
  const filtered = requestsData.filter((r) => {
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "confirmed") return r.status === "confirmed";
    if (activeTab === "declined")
      return r.status === "declined" || r.status === "cancelled";
    return true;
  });

  const counts = {
    pending: requestsData.filter((r) => r.status === "pending").length,
    confirmed: requestsData.filter((r) => r.status === "confirmed").length,
    declined: requestsData.filter(
      (r) => r.status === "declined" || r.status === "cancelled"
    ).length,
    all: requestsData.length,
  };

  const handleAccept = (id, newStatus, cancellationReason) => {
    setRequestsData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, cancellationReason } : r
      )
    );
  };

  const handleReject = (id, newStatus, cancellationReason) => {
    setRequestsData((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, cancellationReason } : r
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <XCircleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
            <p className="mt-2 text-sm text-red-700">
              Please refresh or sign in again.
            </p>
            {error.includes("sign in") && (
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Requests</h1>
        <p className="text-gray-600 mt-1">
          View and respond to session requests
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: "pending", name: "Pending", count: counts.pending },
            { key: "confirmed", name: "Confirmed", count: counts.confirmed },
            { key: "declined", name: "Declined", count: counts.declined },
            { key: "all", name: "All", count: counts.all },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}{" "}
              {tab.count > 0 && (
                <span
                  className={`${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-900"
                  } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {activeTab !== "all" ? activeTab : ""} requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "pending"
              ? "No pending requests."
              : activeTab === "confirmed"
              ? "No confirmed requests."
              : activeTab === "declined"
              ? "No declined requests."
              : "No requests at all."}
          </p>
        </div>
      )}
    </div>
  );
}
