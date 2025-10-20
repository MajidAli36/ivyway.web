"use client";

import StarRating from "./StarRating";
import ratingService from "../../lib/api/ratingService";

export default function RatingStats({
  averageRating = 0,
  totalReviews = 0,
  ratingDistribution = {},
  showDistribution = true,
  size = "md",
  className = "",
}) {
  const maxCount = Math.max(...Object.values(ratingDistribution));

  const getBarWidth = (count) => {
    if (maxCount === 0) return 0;
    return (count / maxCount) * 100;
  };

  const getRatingColor = (rating) => {
    return ratingService.getRatingColor(rating);
  };

  const getRatingStatus = (rating) => {
    return ratingService.getRatingStatus(rating);
  };

  const formatRating = (rating) => {
    return ratingService.formatRating(rating);
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      {/* Overall Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div
              className={`text-4xl font-bold ${getRatingColor(averageRating)}`}
            >
              {formatRating(averageRating)}
            </div>
            <StarRating
              rating={averageRating}
              readonly
              size={size}
              className="mt-1"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {getRatingStatus(averageRating)}
            </p>
            <p className="text-sm text-gray-600">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {showDistribution && Object.keys(ratingDistribution).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Rating Distribution
          </h4>

          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center space-x-3">
                {/* Star Rating Label */}
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-700">
                    {rating}
                  </span>
                  <StarRating rating={1} readonly size="sm" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getBarWidth(count)}%` }}
                    />
                  </div>
                </div>

                {/* Count and Percentage */}
                <div className="w-16 text-right">
                  <span className="text-sm text-gray-600">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {(averageRating * 20).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {(
                (((ratingDistribution[5] || 0) + (ratingDistribution[4] || 0)) /
                  totalReviews) *
                  100 || 0
              ).toFixed(0)}
              %
            </div>
            <div className="text-xs text-gray-600">4+ Star Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
