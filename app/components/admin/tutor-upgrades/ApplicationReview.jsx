"use client";

import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import adminTutorUpgradeService from "@/app/lib/api/adminTutorUpgradeService";
import { RejectionReason } from "@/app/types/tutorUpgrade";

export default function ApplicationReview({ applicationId, onBack, onReviewComplete }) {
  const [application, setApplication] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState({
    status: "approved",
    reviewNotes: "",
    rejectionReason: "",
    customRejectionReason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminTutorUpgradeService.getApplicationDetails(applicationId);
      
      if (response.success) {
        setApplication(response.data.application);
        setRecentSessions(response.data.recentSessions || []);
        setRecentReviews(response.data.recentReviews || []);
      } else {
        setError(response.message || "Failed to load application details");
      }
    } catch (err) {
      console.error("Error loading application:", err);
      setError(err.message || "An error occurred while loading application");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (status) => {
    if (status === "rejected" && !reviewData.rejectionReason) {
      setError("Please select a rejection reason");
      return;
    }

    if (!reviewData.reviewNotes.trim()) {
      setError("Please provide review notes");
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminTutorUpgradeService.reviewApplication(applicationId, {
        ...reviewData,
        status,
      });
      
      if (response.success) {
        onReviewComplete?.(response.data);
      } else {
        setError(response.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.message || "An error occurred while submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={loadApplication}
          className="mt-4 text-sm text-red-600 hover:text-red-500 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Application Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The requested application could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Review Application
              </h3>
              <p className="text-sm text-gray-500">
                Application ID: {application.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                application.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : application.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {application.status === "pending" && "Under Review"}
              {application.status === "approved" && "Approved"}
              {application.status === "rejected" && "Rejected"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Details */}
          <div className="space-y-6">
            {/* Tutor Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tutor Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {application.tutor?.fullName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {application.tutor?.fullName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.tutor?.email || "No email"}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Application Date:</strong> {formatDate(application.applicationDate)}</p>
                  {application.reviewedDate && (
                    <p><strong>Reviewed Date:</strong> {formatDate(application.reviewedDate)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Qualification Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Qualification Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${
                  application.sessionsCompleted >= 100 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center">
                    <ChartBarIcon className={`h-6 w-6 ${application.sessionsCompleted >= 100 ? 'text-green-600' : 'text-yellow-600'}`} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Sessions</p>
                      <p className="text-lg font-bold">{application.sessionsCompleted}/100</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  application.averageRating >= 4.5 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center">
                    <StarIcon className={`h-6 w-6 ${application.averageRating >= 4.5 ? 'text-green-600' : 'text-yellow-600'}`} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Rating</p>
                      <p className="text-lg font-bold">{application.averageRating?.toFixed(1) || 0}/4.5</p>
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  application.profileCompletion >= 90 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-center">
                    <UserIcon className={`h-6 w-6 ${application.profileCompletion >= 90 ? 'text-green-600' : 'text-yellow-600'}`} />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Profile</p>
                      <p className="text-lg font-bold">{application.profileCompletion || 0}/90%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Expertise */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Subject Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {application.subjectExpertise.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Qualifications</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">College Degree</p>
                  <p className="text-sm text-gray-600">{application.qualifications.collegeDegree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Teaching Experience</p>
                  <p className="text-sm text-gray-600">{application.qualifications.teachingExperience}</p>
                </div>
                {application.qualifications.standardizedTests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Standardized Tests</p>
                    <p className="text-sm text-gray-600">
                      {application.qualifications.standardizedTests.join(", ")}
                    </p>
                  </div>
                )}
                {application.qualifications.apIbSubjects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">AP/IB Subjects</p>
                    <p className="text-sm text-gray-600">
                      {application.qualifications.apIbSubjects.join(", ")}
                    </p>
                  </div>
                )}
                {application.qualifications.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Certifications</p>
                    <p className="text-sm text-gray-600">
                      {application.qualifications.certifications.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Motivation */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Motivation</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{application.motivation}</p>
              </div>
            </div>

            {/* Additional Information */}
            {application.additionalInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{application.additionalInfo}</p>
                </div>
              </div>
            )}

            {/* Recent Sessions & Reviews Tabs */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "sessions"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Recent Sessions
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "reviews"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Recent Reviews
                    </button>
                  </nav>
                </div>
                
                <div className="p-6">
                  {activeTab === "sessions" && (
                    <div className="space-y-3">
                      {recentSessions.length > 0 ? (
                        recentSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{session.subject}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(session.startTime)} - {formatDate(session.endTime)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {session.status}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                ${session.price}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No recent sessions found</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "reviews" && (
                    <div className="space-y-3">
                      {recentReviews.length > 0 ? (
                        recentReviews.map((review) => (
                          <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No recent reviews found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Review Decision</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setReviewData({ ...reviewData, status: "approved" })}
                    className={`flex items-center px-4 py-2 border rounded-md ${
                      reviewData.status === "approved"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setReviewData({ ...reviewData, status: "rejected" });
                      setShowRejectionForm(true);
                    }}
                    className={`flex items-center px-4 py-2 border rounded-md ${
                      reviewData.status === "rejected"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Rejection Reasons */}
            {showRejectionForm && reviewData.status === "rejected" && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Rejection Reason</h4>
                <select
                  value={reviewData.rejectionReason}
                  onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a reason</option>
                  {Object.values(RejectionReason).map((reason) => (
                    <option key={reason} value={reason}>
                      {reason.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
                {reviewData.rejectionReason === RejectionReason.OTHER && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Reason
                    </label>
                    <input
                      type="text"
                      value={reviewData.customRejectionReason}
                      onChange={(e) => setReviewData({ ...reviewData, customRejectionReason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter custom rejection reason"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Review Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes *
              </label>
              <textarea
                value={reviewData.reviewNotes}
                onChange={(e) => setReviewData({ ...reviewData, reviewNotes: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide detailed feedback about this application..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReviewSubmit(reviewData.status)}
                disabled={submitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  reviewData.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {submitting ? "Submitting..." : `Submit ${reviewData.status === "approved" ? "Approval" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
