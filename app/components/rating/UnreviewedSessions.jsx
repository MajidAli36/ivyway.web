"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarIcon, StarIcon, ClockIcon } from "@heroicons/react/24/outline";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import ratingService from "../../lib/api/ratingService";

export default function UnreviewedSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Memoized function to fetch unreviewed sessions
  const fetchUnreviewedSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ratingService.getUnreviewedSessions();
      setSessions(response.data || []);
    } catch (err) {
      setError("Failed to load unreviewed sessions");
      console.error("Error fetching unreviewed sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreviewedSessions();
  }, [fetchUnreviewedSessions]);

  const handleReviewSubmit = (reviewData) => {
    // Remove the reviewed session from the list
    setSessions(
      sessions.filter((session) => session.id !== selectedSession.id)
    );
    setShowReviewForm(false);
    setSelectedSession(null);
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
    setSelectedSession(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUnreviewedSessions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Sessions to Review
            </h3>
            {sessions && sessions.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {sessions.length} pending
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-8">
              <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h4>
              <p className="text-gray-600">
                You've reviewed all your completed sessions. Great job providing
                feedback to help other students!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(sessions || []).map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Session Info */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex-shrink-0">
                          {session.tutor?.profileImage ? (
                            <img
                              src={session.tutor.profileImage}
                              alt={session.tutor.fullName || session.providerName || session.provider?.fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {(session.tutor?.fullName || session.providerName || session.provider?.fullName)?.charAt(0) || "T"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {session.subject}
                          </h4>
                          <p className="text-sm text-gray-600">
                            with {session.tutor?.fullName || session.providerName || session.provider?.fullName || "Unknown Tutor"}
                          </p>
                          {session.topic && (
                            <p className="text-xs text-gray-500 mt-1">
                              Topic: {session.topic}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(session.startTime)}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTime(session.startTime)}
                        </div>
                      </div>
                    </div>

                    {/* Review Button */}
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowReviewForm(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedSession && (
        <ReviewSubmissionForm
          booking={selectedSession}
          onSubmit={handleReviewSubmit}
          onCancel={handleReviewCancel}
          isModal={true}
        />
      )}
    </>
  );
}
