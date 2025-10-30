"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { counselorBookings } from "@/app/lib/api/endpoints";
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import authService from "@/app/lib/auth/authService";


function RequestCard({ request, onAccept, onDecline }) {
  const safeFormat = (value, fmt) => {
    try {
      if (!value) return "-";
      const dt = new Date(value);
      if (isNaN(dt)) return "-";
      return format(dt, fmt);
    } catch (e) {
      return "-";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "accepted":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "declined":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {request.studentName}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                request.status
              )}`}
            >
              {getStatusIcon(request.status)}
              <span className="ml-1 capitalize">{request.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {safeFormat(request.sessionDate, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{request.sessionTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-900">Session:</span>{" "}
                <span className="text-gray-600">{request.sessionType}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-900">Subject:</span>{" "}
                <span className="text-gray-600">{request.subject || request.topic || "—"}</span>
              </div>
            </div>
          </div>

          {request.notes && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Notes:</span> {request.notes}
              </p>
            </div>
          )}

          {/* Decline reason hidden per request */}

          <div className="text-xs text-gray-500">
            Requested: {safeFormat(request.requestedAt, "MMM dd, yyyy 'at' h:mm a")}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          {request.status === "pending" && (
            <>
              <button
                onClick={() => onAccept(request)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Accept
              </button>
              <button
                onClick={() => onDecline(request)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RequestModal({ isOpen, closeModal, request, onAccept, onDecline, startDecline = false }) {
  const [declineReason, setDeclineReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);

  useEffect(() => {
    if (isOpen && startDecline) {
      setShowDeclineForm(true);
    } else if (!isOpen) {
      setShowDeclineForm(false);
      setDeclineReason("");
    }
  }, [isOpen, startDecline]);

  if (!request) return null;

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept(request);
      closeModal();
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineClick = () => {
    setShowDeclineForm(true);
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }

    setIsProcessing(true);
    try {
      await onDecline(request, declineReason);
      closeModal();
    } catch (error) {
      console.error("Error declining request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelDecline = () => {
    setShowDeclineForm(false);
    setDeclineReason("");
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Session Request Details
                </h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Student: {request.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.studentEmail} • {request.studentGrade}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          try {
                            const dt = new Date(request.sessionDate);
                            return isNaN(dt) ? "-" : format(dt, "MMM dd, yyyy");
                          } catch {
                            return "-";
                          }
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Time</p>
                      <p className="text-sm text-gray-600">{request.sessionTime}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{request.sessionType}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">Subject</p>
                    <p className="text-sm text-gray-600">{request.subject}</p>
                  </div>

                  {request.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Notes</p>
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  )}

                  {request.status === "pending" && showDeclineForm && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Please provide a reason for declining this request
                      </p>
                      <textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Please provide a reason for declining this request..."
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This reason will be shared with the student
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {request.status === "pending" && !showDeclineForm && (
              <>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Accept Request"}
                </button>
                <button
                  type="button"
                  onClick={handleDeclineClick}
                  disabled={isProcessing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Decline Request
                </button>
              </>
            )}
            
            {request.status === "pending" && showDeclineForm && (
              <>
                <button
                  type="button"
                  onClick={handleDecline}
                  disabled={isProcessing || !declineReason.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Confirm Decline"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelDecline}
                  disabled={isProcessing}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {request.status === "pending" && !showDeclineForm ? "Cancel" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CounselorRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'accept' | 'decline'
  const [targetRequest, setTargetRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, accepted, declined
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

  

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!authService.isAuthenticated()) {
        console.warn("User not authenticated, can't fetch requests");
        return;
      }

      setLoading(true);
      
      const result = await safeApiCall(
        () => counselorBookings.getCounselorRequests({
          page: 1,
          limit: 50
        }),
        {
          extractArray: true,
          dataKey: 'data',
          defaultData: [],
          errorMessage: "Failed to load requests. Please try again."
        }
      );
      
      if (result.success) {
        // Normalize API result fields to card-friendly structure
        const normalized = ensureArray(result.data).map((r) => ({
          id: r.id || r.bookingId,
          studentId: r.student?.id || r.studentId,
          studentName: r.student?.name || r.studentName,
          studentEmail: r.student?.email || r.studentEmail,
          studentGrade: r.student?.grade || r.studentGrade,
          sessionType: r.sessionType,
          sessionDate: r.sessionDate,
          sessionTime: r.sessionTime,
          status: r.status,
          notes: r.notes,
          subject: r.subject,
          topic: r.topic,
          price: r.price,
          counselorEarnings: r.counselorEarnings,
          requestedAt: r.requestedAt,
        }));
        // Deduplicate by id
        const uniqueRequests = normalized.filter((req, index, self) => index === self.findIndex(r => r.id === req.id));
        setRequests(uniqueRequests);
        setError(null);
      } else {
        console.error("Failed to load requests:", result.error);
        setError("Failed to load requests. Please try again.");
      }
      
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request) => {
    // Open confirmation modal first
    setTargetRequest(request);
    setConfirmType('accept');
    setConfirmOpen(true);
  };

  const doAcceptRequest = async (request) => {
    try {
      // Accept request via API with proper error handling
      const result = await safeApiCall(
        () => counselorBookings.acceptRequest(request.id, {
          message: "Looking forward to our session!"
        }),
        {
          extractArray: false,
          dataKey: 'data',
          defaultData: null,
          errorMessage: "Failed to accept request. Please try again."
        }
      );
      
      if (result.success) {
        console.log("Request accepted:", result.data);
        
        // Update local state
        setRequests(prev =>
          prev.map(req =>
            req.id === request.id ? { ...req, status: "accepted" } : req
          )
        );
        
        console.log("Request accepted successfully:", request.id);
        toast.success('Request accepted');
      } else {
        console.error("Error accepting request:", result.error);
        toast.error(`Failed to accept request: ${result.error}`);
      }
    } catch (error) {
      console.error("Unexpected error accepting request:", error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleDeclineRequest = async (request) => {
    // Open confirmation modal with reason input
    setTargetRequest(request);
    setConfirmType('decline');
    setDeclineReason("");
    setConfirmOpen(true);
  };

  const doDeclineRequest = async (request, reason) => {
    const finalReason = (reason && String(reason).trim()) || "Not available at the requested time";
    try {
      // Decline request via API with proper error handling
      const result = await safeApiCall(
        () => counselorBookings.declineRequest(request.id, {
          reason: finalReason,
          message: `I'm not available at that time. ${finalReason}`
        }),
        {
          extractArray: false,
          dataKey: 'data',
          defaultData: null,
          errorMessage: "Failed to decline request. Please try again."
        }
      );
      
      if (result.success) {
        console.log("Request declined:", result.data);
        
        // Update local state
        setRequests(prev => prev.map(req => (
          req.id === request.id ? { ...req, status: "declined" } : req
        )));
        
        console.log("Request declined successfully:", request.id, "Reason:", finalReason);
        toast.success('Request declined');
      } else {
        console.error("Error declining request:", result.error);
        toast.error(`Failed to decline request: ${result.error}`);
      }
    } catch (error) {
      console.error("Unexpected error declining request:", error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const filteredRequests = (Array.isArray(requests) ? requests : []).filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const requestsArray = Array.isArray(requests) ? requests : [];
  const stats = {
    total: requestsArray.length,
    pending: requestsArray.filter(r => r.status === "pending").length,
    accepted: requestsArray.filter(r => r.status === "accepted").length,
    declined: requestsArray.filter(r => r.status === "declined").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Authentication Required
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to view your requests.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Session Requests
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your counseling session requests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Requests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total}
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
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pending}
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
                        Accepted
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.accepted}
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
                    <XCircleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Declined
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.declined}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="px-4 py-6 sm:px-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Requests</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No requests found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "all"
                  ? "You don't have any session requests yet."
                  : `No ${filter} requests found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && targetRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {confirmType === 'accept' ? 'Confirm Accept' : 'Confirm Decline'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirmType === 'accept'
                ? 'Are you sure you want to accept this request? A notification will be sent to the student.'
                : 'Are you sure you want to decline this request? A notification will be sent to the student.'}
            </p>
            {confirmType === 'decline' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief reason to help the student"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmType(null);
                  setTargetRequest(null);
                  setDeclineReason("");
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${confirmType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={async () => {
                  const req = targetRequest;
                  setConfirmOpen(false);
                  setConfirmType(null);
                  setTargetRequest(null);
                  if (confirmType === 'accept') {
                    await doAcceptRequest(req);
                  } else {
                    await doDeclineRequest(req, declineReason);
                  }
                  setDeclineReason("");
                }}
              >
                {confirmType === 'accept' ? 'Confirm Accept' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
