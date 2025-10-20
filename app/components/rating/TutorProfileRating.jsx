"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import StarRating from "./StarRating";
import RatingStats from "./RatingStats";
import ReviewCard from "./ReviewCard";
import ratingService from "../../lib/api/ratingService";

export default function TutorProfileRating({ tutorId, className = "" }) {
  const [ratingStats, setRatingStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchRatingStats();
    fetchReviews(1);
  }, [tutorId]);

  const fetchRatingStats = async () => {
    try {
      const response = await ratingService.getTutorRatingStats(tutorId);
      setRatingStats(response.data);
    } catch (err) {
      console.error("Error fetching rating stats:", err);
      setError("Failed to load rating statistics");
    }
  };

  const fetchReviews = async (page = 1) => {
    try {
      setReviewsLoading(true);
      const response = await ratingService.getTutorReviews(tutorId, {
        page,
        limit: 5,
      });

      if (page === 1) {
        setReviews(response.data);
        setLoading(false);
      } else {
        setReviews((prev) => [...prev, ...response.data]);
      }

      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      if (page === 1) {
        setError("Failed to load reviews");
        setLoading(false);
      }
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage && !reviewsLoading) {
      fetchReviews(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !ratingStats) {
    return (
      <div
        className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchRatingStats();
              fetchReviews(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Student Reviews
        </h3>
      </div>

      <div className="p-6">
        {/* Rating Statistics */}
        {ratingStats && (
          <div className="mb-8">
            <RatingStats
              averageRating={ratingStats.averageRating}
              totalReviews={ratingStats.totalReviews}
              ratingDistribution={ratingStats.ratingDistribution}
              showDistribution={true}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">
              Recent Reviews
            </h4>

            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions={true}
                  showSession={true}
                  className="border-0 shadow-sm"
                />
              ))}
            </div>

            {/* Load More Button */}
            {pagination?.hasNextPage && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={reviewsLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {reviewsLoading ? "Loading..." : "Load More Reviews"}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {pagination && (
              <div className="text-center text-sm text-gray-600 pt-2">
                Showing {reviews.length} of {pagination.totalItems} reviews
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Reviews Yet
            </h4>
            <p className="text-gray-600">
              This tutor hasn't received any reviews yet. Be the first to book a
              session and share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
