import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import SessionButton from "@/app/components/SessionButton";
import sessionService from "@/app/lib/api/sessionService";

const statusStyles = {
  pending: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: ClockIcon,
    label: "Pending",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    icon: CheckCircleIcon,
    label: "Completed",
  },
  canceled: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    icon: XCircleIcon,
    label: "Canceled",
  },
  scheduled: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    icon: CalendarIcon,
    label: "Scheduled",
  },
  confirmed: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: CheckCircleIcon,
    label: "Confirmed",
  },
};

export default function SessionCard({ session, onCancelRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [formattedDate, setFormattedDate] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCancelModal) {
        cancelCancel();
      }
    };

    if (showCancelModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showCancelModal]);

  useEffect(() => {
    if (!isClient) return;
    
    const sessionDate = new Date(session.date);
    const now = new Date();
    const timeUntilSession = sessionDate - now;
    
    setIsUpcoming(timeUntilSession > 0 && timeUntilSession < 1000 * 60 * 60 * 24);
    
    setFormattedDate(sessionDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }));
  }, [session.date, isClient]);

  const statusConfig = statusStyles[session.status] || statusStyles.pending;

  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    setShowCancelModal(false);
    try {
      await onCancelRequest(session.id);
    } catch (error) {
      console.error("Failed to cancel session:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const cancelCancel = () => {
    setShowCancelModal(false);
  };


  return (
    <div
      className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${
        session.status === "canceled" 
          ? "border-red-200 ring-1 ring-red-100 bg-red-50/30" 
          : isUpcoming 
            ? "border-blue-200 ring-1 ring-blue-100" 
            : "border-gray-100"
      } ${isExpanded ? "shadow-md" : ""}`}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Service Type Avatar */}
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white overflow-hidden ${
              session.serviceType === "counseling" 
                ? "bg-gradient-to-br from-purple-500 to-purple-600" 
                : "bg-gradient-to-br from-blue-500 to-blue-600"
            }`}>
              <span className="text-xl font-semibold">
                {session.serviceType === "counseling" ? "C" : "T"}
              </span>
            </div>

            {/* Session Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`text-lg font-semibold ${
                  session.status === "canceled" 
                    ? "text-gray-500 line-through" 
                    : "text-gray-900"
                }`}>
                  {session.subject?.name || (session.serviceType === "counseling" ? "Academic Counseling" : "Tutoring Session")}
                </h3>
                {/* Status Badge in Header */}
                {session.status === "canceled" && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    <statusConfig.icon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                session.status === "canceled" 
                  ? "text-gray-400 line-through" 
                  : "text-gray-600"
              }`}>
                with {session.provider?.name || "Provider"} • {session.serviceType === "counseling" ? "Counselor" : "Tutor"}
              </p>
              
              {/* Plan Information */}
              {session.planName && (
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    session.planName.includes("Advanced") 
                      ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200"
                  }`}>
                    {session.planName.includes("Advanced") ? "⭐ " : "📚 "}
                    {session.planName}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-1">
                {session.notes || "No notes provided"}
              </p>
            </div>
          </div>
          
          {/* Cancel button positioned in top-right corner */}
          {sessionService.canCancelSession(session) && (
            <div className="flex-shrink-0 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelRequest();
                }}
                disabled={isCancelling}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50 shadow-sm"
              >
                <XCircleIcon className="h-4 w-4 mr-1.5 text-red-500" />
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
          >
            <statusConfig.icon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </span>
        </div>
        <div className="text-sm text-gray-500 flex space-x-2">
          <span>{formattedDate || "Loading..."}</span>
          <span>
            {session.startTime} - {session.endTime}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t px-4 py-3 space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4" />
            <span>
              {session.startTime} – {session.endTime} ({session.duration} min)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {session.sessionType === "virtual" ? (
              <VideoCameraIcon className="h-4 w-4" />
            ) : (
              <MapPinIcon className="h-4 w-4" />
            )}
            <span>
              {session.sessionType === "virtual"
                ? "Virtual Session"
                : "In-person Session"}
            </span>
          </div>
          
          {/* Provider Details */}
          <div className="flex items-center space-x-2">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              session.serviceType === "counseling" 
                ? "bg-purple-100 text-purple-600" 
                : "bg-blue-100 text-blue-600"
            }`}>
              {session.serviceType === "counseling" ? "C" : "T"}
            </div>
            <span>
              {session.provider?.name} • {session.provider?.specialization}
            </span>
          </div>

          {/* Plan Details */}
          {session.planName && (
            <div className="flex items-center space-x-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                session.planName.includes("Advanced") 
                  ? "bg-purple-100 text-purple-600" 
                  : "bg-blue-100 text-blue-600"
              }`}>
                {session.planName.includes("Advanced") ? "⭐" : "📚"}
              </div>
              <span>
                Plan: {session.planName}
                {session.amount && (
                  <span className="text-gray-500 ml-2">
                    • ${(session.amount / 100).toFixed(2)}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <div className="bg-gray-50 p-2 rounded text-xs">
              <strong>Notes:</strong> {session.notes}
            </div>
          )}

          {/* Zoom button for virtual sessions */}
          {session.sessionType === "virtual" &&
            (session.status === "confirmed" ||
              session.status === "scheduled") && (
              <div className="mt-2 flex justify-end">
                <SessionButton session={session} userRole="student" />
              </div>
            )}
        </div>
      )}

      {/* Toggle Expand Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="w-full bg-gray-50 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 flex items-center justify-center"
      >
        <span>{isExpanded ? "Show Less" : "Show More"}</span>
        <ArrowRightIcon
          className={`ml-1.5 h-3 w-3 transition-transform ${
            isExpanded ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelCancel();
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cancel Session
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to cancel this session?
                </p>
                
                {/* Session Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                      session.serviceType === "counseling" 
                        ? "bg-gradient-to-br from-purple-500 to-purple-600" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}>
                      {session.serviceType === "counseling" ? "C" : "T"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.subject?.name || (session.serviceType === "counseling" ? "Academic Counseling" : "Tutoring Session")}
                      </p>
                      <p className="text-xs text-gray-500">
                        with {session.provider?.name || "Provider"} • {formattedDate} at {session.startTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning for tutor sessions */}
                {session.serviceType === 'tutoring' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Tutor sessions can only be cancelled 24 hours in advance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelCancel();
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Keep Session
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCancelling ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </div>
                  ) : (
                    'Yes, Cancel Session'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
