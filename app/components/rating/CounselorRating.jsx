"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { counselorRatings } from "@/app/lib/api/endpoints";
import { toast } from "react-hot-toast";

export default function CounselorRating({ 
  rating = 0, 
  reviewCount = 0, 
  interactive = false, 
  onRate = null,
  size = "md" 
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= (hoverRating || rating);
        const StarComponent = isFilled ? StarIcon : StarIconOutline;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              interactive 
                ? "cursor-pointer hover:scale-110 transition-transform" 
                : "cursor-default"
            } ${
              isFilled ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            <StarComponent className="h-full w-full" />
          </button>
        );
      })}
      {reviewCount > 0 && (
        <span className="text-sm text-gray-500 ml-1">
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
}

// Rating breakdown component for counselor profiles
export function CounselorRatingBreakdown({ ratings = {} }) {
  const totalReviews = Object.values(ratings).reduce((sum, count) => sum + count, 0);
  const averageRating = totalReviews > 0 
    ? Object.entries(ratings).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0) / totalReviews
    : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <div className="text-3xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </div>
        <CounselorRating rating={averageRating} reviewCount={totalReviews} />
      </div>
      
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratings[star] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 w-2">
                {star}
              </span>
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Rating form component for students to rate counselors
export function CounselorRatingForm({ onSubmit, onCancel, counselorName, counselorId, bookingId, sessionType }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit rating via API
      const ratingData = {
        counselorId: counselorId,
        bookingId: bookingId,
        rating: rating,
        comment: comment,
        sessionType: sessionType || "60min"
      };

      const response = await counselorRatings.create(ratingData);
      console.log("Rating submitted:", response.data);
      
      toast.success("Thank you for your feedback!");
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({ rating, comment });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rate your session with {counselorName}
        </label>
        <CounselorRating 
          rating={rating} 
          interactive={true} 
          onRate={setRating}
          size="lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comments (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your experience with this counselor..."
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </form>
  );
}
