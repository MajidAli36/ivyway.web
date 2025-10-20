"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

export default function StarRating({
  rating = 0,
  onRatingChange = null,
  size = "md",
  showValue = false,
  readonly = false,
  className = "",
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const isInteractive = !readonly && onRatingChange;

  // Size classes
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const handleStarClick = (starValue) => {
    if (!isInteractive) return;
    setCurrentRating(starValue);
    onRatingChange(starValue);
  };

  const handleStarHover = (starValue) => {
    if (!isInteractive) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (!isInteractive) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating || rating;

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= displayRating;
          const StarComponent = isFilled ? StarIcon : StarOutlineIcon;

          return (
            <button
              key={starValue}
              type="button"
              className={`
                ${sizeClasses[size]}
                ${
                  isFilled
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }
                ${
                  isInteractive
                    ? "cursor-pointer transition-colors duration-150"
                    : "cursor-default"
                }
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded
              `}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              disabled={!isInteractive}
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              <StarComponent />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {(displayRating || 0).toFixed(1)}
        </span>
      )}
    </div>
  );
}
