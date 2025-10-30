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
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { authService } from "@/app/lib/auth/authService";
import apiClient from "@/app/lib/api/client";

// Request Status Badge Component with updated styling
function StatusBadge({ status }) {
  let bgColor = "bg-gray-50";
  let textColor = "text-gray-700";
  let borderColor = "border-gray-200";
  let icon = <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />;

  switch (status?.toLowerCase()) {
    case "pending":
      bgColor = "bg-amber-50";
      textColor = "text-amber-700";
      borderColor = "border-amber-200";
      icon = <ClockIcon className="h-4 w-4 mr-1" />;
      break;
    case "confirmed":
    case "accepted":
    case "completed":
      bgColor = "bg-blue-50";
      textColor = "text-blue-500";
      borderColor = "border-blue-200";
      icon = <CheckCircleIcon className="h-4 w-4 mr-1" />;
      break;
    case "declined":
    case "cancelled":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-200";
      icon = <XCircleIcon className="h-4 w-4 mr-1" />;
      break;
  }

  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${bgColor} ${textColor} ${borderColor} border`}
    >
      {icon}
      {(status || "pending").charAt(0).toUpperCase() +
        (status || "pending").slice(1).toLowerCase()}
    </span>
  );
}

// Filter tabs component matching sessions screen style
const FilterTabs = ({ filter, setFilter, counts }) => {
  const tabs = [
    { key: "all", label: "All Requests" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "declined", label: "Declined" },
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

// Request Card Component
function RequestCard({ request, onAccept, onReject }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "";
    }
  };

  const handleAccept = async (e) => {
    e.stopPropagation();
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      return;
    }

    if (isAccepting) return;
    setIsAccepting(true);
    toast.loading("Accepting…", { id: `accept-${request.id}` });

    try {
      const response = await apiClient.post(
        `/counselor/bookings/requests/${request.id}/accept`,
        {
          message: "Looking forward to our session!",
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to accept request");
      }

      onAccept(
        request.id,
        response.data?.status || "accepted",
        response.data?.cancellationReason
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
    if (isRejecting) return;
    setIsRejecting(true);
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in");
      setIsRejecting(false);
      return;
    }

    toast.loading("Rejecting…", { id: `reject-${request.id}` });

    try {
      const response = await apiClient.post(
        `/counselor/bookings/requests/${request.id}/decline`,
        {
          reason: "Request rejected by counselor",
          message: "I'm not available at that time.",
        }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to reject request");
      }

      onReject(
        request.id,
        response.data?.status || "declined",
        response.data?.cancellationReason
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

  const startTime = request.startTime || request.sessionDate;
  const endTime = request.endTime || request.sessionTime;
  const createdAt = request.createdAt || request.requestedAt;

  return (
    <div className="bg-white rounded-xl shadow-[0_2px Ribbon-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
              {request.student?.profileImageUrl || request.studentAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={request.student?.profileImageUrl || request.studentAvatar}
                  alt={(request.studentName || "Student") + " avatar"}
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
                  request.student?.profileImageUrl || request.studentAvatar
                    ? "hidden"
                    : "flex"
                } h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 items-center justify-center text-white font-semibold`}
              >
                {(request.studentName || "S")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-[#334e68]">
                {request.studentName}
              </div>
              <div className="text-sm text-[#6b7280]">
                {formatDate(createdAt)}
              </div>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-[#334e68]">
            {request.sessionType
              ? request.sessionType.charAt(0).toUpperCase() +
                request.sessionType.slice(1)
              : "Counseling"}{" "}
            Session Request
          </h4>
          <p className="mt-1 text-sm text-[#6b7280] line-clamp-2">
            {request.notes || "No additional notes provided"}
          </p>
        </div>

        {(startTime && endTime) || (request.sessionDate && request.sessionTime) ? (
          <div className="mt-4 text-sm text-[#6b7280]">
            <div className="flex items-center whitespace-nowrap">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af] flex-shrink-0" />
              <span className="truncate">
                {startTime && endTime
                  ? `${formatTime(startTime)} - ${formatTime(endTime)}`
                  : `${formatDate(request.sessionDate)} - ${request.sessionTime}`}
              </span>
            </div>
          </div>
        ) : null}

        {request.status === "pending" && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleReject}
              disabled={isRejecting || isAccepting}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              {isRejecting  ? "Rejecting…" : "Reject"}
            </button>
            <button
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

// Empty state component matching sessions screen style
const EmptyState = ({ filter }) => (
  <div className="py-20 text-center">
    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <InboxIcon className="h-10 w-10 text-[#9ca3af]" />
    </div>
    <h3 className="text-lg font-medium text-[#243b53]">No requests found</h3>
    <p className="mt-1 text-[#6b7280]">
      There are no {filter !== "all" ? filter : ""} requests to display.
    </p>
  </div>
);

// Main component
export default function CounselorRequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [requestsData, setRequestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

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
        const response = await apiClient.get("/counselor/bookings/requests", {
          params: { page: 1, limit: 50 },
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch bookings");
        }

        console.log("Fetched booking data:", response.data);
        const normalized = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
        setRequestsData(normalized);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.status === 401) {
          setError("Session expired. Please sign in again.");
          authService.logout();
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

  const filtered = requestsData.filter((r) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return r.status === "pending";
    if (activeTab === "confirmed")
      return r.status === "confirmed" || r.status === "accepted";
    if (activeTab === "declined")
      return r.status === "declined" || r.status === "cancelled";
    return true;
  });

  const counts = {
    all: requestsData.length,
    pending: requestsData.filter((r) => r.status === "pending").length,
    confirmed: requestsData.filter(
      (r) => r.status === "confirmed" || r.status === "accepted"
    ).length,
    declined: requestsData.filter(
      (r) => r.status === "declined" || r.status === "cancelled"
    ).length,
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Student Requests
          </h1>
          <p className="mt-1 text-[#6b7280]">
            View and respond to session requests
          </p>
        </div>
        <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Student Requests
          </h1>
          <p className="mt-1 text-[#6b7280]">
            View and respond to session requests
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
        <h1 className="text-3xl font-bold text-[#243b53]">Student Requests</h1>
        <p className="mt-1 text-[#6b7280]">
          View and respond to session requests
        </p>
      </div>

      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <FilterTabs
          filter={activeTab}
          setFilter={setActiveTab}
          counts={counts}
        />

        {filtered.length === 0 ? (
          <EmptyState filter={activeTab} />
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}