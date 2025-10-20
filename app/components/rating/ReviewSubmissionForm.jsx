"use client";

import { useState, useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import StarRating from "./StarRating";
import ratingService from "../../lib/api/ratingService";

export default function ReviewSubmissionForm({
  booking,
  onSubmit,
  onCancel,
  isModal = false,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      bookingId: booking.id,
      rating,
      comment: comment.trim(),
      isAnonymous,
    };

    // Validate data
    const validation = ratingService.validateReviewData(reviewData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await ratingService.submitReview(reviewData);
      setSuccess(true);
      setTimeout(() => {
        onSubmit(response);
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formContent = useMemo(() => (
    <div className="space-y-6">
      {/* Session Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Session Details</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Subject:</span> {booking.subject}
          </p>
          {booking.topic && (
            <p>
              <span className="font-medium">Topic:</span> {booking.topic}
            </p>
          )}
          <p>
            <span className="font-medium">Date:</span>{" "}
            {formatDate(booking.startTime)}
          </p>
          {(booking.tutor?.fullName || booking.providerName || booking.provider?.fullName) && (
            <p>
              <span className="font-medium">Tutor:</span>{" "}
              {booking.tutor?.fullName || booking.providerName || booking.provider?.fullName}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate this session? *
          </label>
          <div className="flex items-center space-x-4">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              readonly={success}
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                {rating} star{rating !== 1 ? "s" : ""} -{" "}
                {ratingService.getRatingStatus(rating)}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Share your experience (optional)
          </label>
          <textarea
            key="review-comment-textarea"
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell other students about your experience with this tutor..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            maxLength={1000}
            disabled={success}
          />
          <div className="mt-1 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {comment.length}/1000 characters
            </span>
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment}</p>
            )}
          </div>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            id="anonymous"
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
            Submit this review anonymously
          </label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 font-medium">
              ✅ Review submitted successfully!
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting || success}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? "Submitting..."
              : success
              ? "Success!"
              : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  ), [booking, rating, comment, isAnonymous, success, errors, handleSubmit, onCancel]);

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          key="review-modal"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Rate Your Session
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Rate Your Session
      </h2>
      {formContent}
    </div>
  );
}
