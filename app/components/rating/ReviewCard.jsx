"use client";

import { useState } from "react";
import {
  HandThumbUpIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolidIcon } from "@heroicons/react/24/solid";
import StarRating from "./StarRating";
import ratingService from "../../lib/api/ratingService";

export default function ReviewCard({
  review,
  showActions = true,
  showSession = true,
  onHelpfulClick = null,
  onReportClick = null,
  className = "",
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isSubmittingHelpful, setIsSubmittingHelpful] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const needsExpansion = review.comment && review.comment.length > 200;
  const displayComment =
    needsExpansion && !isExpanded
      ? review.comment.substring(0, 200) + "..."
      : review.comment;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleHelpfulClick = async () => {
    if (isSubmittingHelpful) return;

    setIsSubmittingHelpful(true);
    try {
      const response = await ratingService.markReviewHelpful(review.id);
      setIsHelpful(true);
      setHelpfulCount(response.data.helpfulCount);
      if (onHelpfulClick) onHelpfulClick(review.id);
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    } finally {
      setIsSubmittingHelpful(false);
    }
  };

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        {/* Review Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Student Avatar */}
            <div className="flex-shrink-0">
              {review.reviewStudent?.profileImage ? (
                <img
                  src={review.reviewStudent.profileImage}
                  alt={review.reviewStudent?.fullName || "Anonymous"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {review.isAnonymous
                      ? "A"
                      : review.reviewStudent?.fullName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>

            {/* Student Name and Date */}
            <div>
              <h4 className="font-medium text-gray-900">
                {review.isAnonymous
                  ? "Anonymous"
                  : review.reviewStudent?.fullName || "Unknown Student"}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Rating */}
          <StarRating rating={review.rating} readonly size="sm" />
        </div>

        {/* Session Info */}
        {showSession && review.reviewBooking && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                {review.reviewBooking.subject}
              </span>
              <span className="text-gray-500">
                {formatDate(review.reviewBooking.startTime)}
              </span>
            </div>
            {review.reviewBooking.topic && (
              <p className="text-sm text-gray-600 mt-1">
                Topic: {review.reviewBooking.topic}
              </p>
            )}
          </div>
        )}

        {/* Review Comment */}
        {review.comment && (
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{displayComment}</p>

            {needsExpansion && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUpIcon className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleHelpfulClick}
              disabled={isSubmittingHelpful || isHelpful}
              className={`
                inline-flex items-center space-x-2 text-sm font-medium
                ${
                  isHelpful
                    ? "text-blue-600 cursor-default"
                    : "text-gray-600 hover:text-blue-600"
                }
                ${isSubmittingHelpful ? "opacity-50 cursor-not-allowed" : ""}
                transition-colors duration-150
              `}
            >
              {isHelpful ? (
                <HandThumbUpSolidIcon className="h-4 w-4" />
              ) : (
                <HandThumbUpIcon className="h-4 w-4" />
              )}
              <span>
                {isHelpful ? "Helpful" : "Mark as helpful"}
                {helpfulCount > 0 && ` (${helpfulCount})`}
              </span>
            </button>

            <button
              onClick={handleReportClick}
              className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors duration-150"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span>Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          reviewId={review.id}
          onClose={() => setShowReportModal(false)}
          onReport={(reason) => {
            if (onReportClick) onReportClick(review.id, reason);
            setShowReportModal(false);
          }}
        />
      )}
    </>
  );
}

// Report Modal Component
function ReportModal({ reviewId, onClose, onReport }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "spam", label: "Spam or promotional" },
    { value: "fake", label: "Fake or misleading" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await ratingService.reportReview(reviewId, selectedReason);
      onReport(selectedReason);
    } catch (error) {
      console.error("Error reporting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Report Review
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-6">
            {reportReasons.map((reason) => (
              <label key={reason.value} className="flex items-center">
                <input
                  type="radio"
                  name="reportReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {reason.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Reporting..." : "Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
