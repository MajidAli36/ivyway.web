"use client";
import { useState } from "react";
import {
  StarIcon,
  UserIcon,
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { ServiceTypes } from "../../constants/serviceTypes";

export default function ProviderCard({
  provider,
  serviceType = ServiceTypes.TUTORING,
  isSelected = false,
  onSelect,
  isLoading = false,
  variant = "default", // default, compact, featured
}) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    fullName,
    subjects = [],
    rating = 4.5,
    reviews = 0,
    bio = "",
    experience = 0,
    specialization = "",
    profileImage = "",
    hourlyRate = 0,
  } = provider;

  const displayName = fullName || name || `${serviceType === ServiceTypes.COUNSELING ? 'Counselor' : 'Tutor'} #${id}`;
  const isCounselor = serviceType === ServiceTypes.COUNSELING;
  const providerIcon = isCounselor ? ChatBubbleLeftIcon : AcademicCapIcon;

  const handleSelect = () => {
    if (!isLoading && onSelect) {
      onSelect(provider);
    }
  };

  const getCardClasses = () => {
    const baseClasses = "relative rounded-xl border transition-all duration-200 cursor-pointer";
    
    if (variant === "compact") {
      return `${baseClasses} p-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`;
    }

    if (variant === "featured") {
      return `${baseClasses} p-8 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`;
    }

    // default variant
    return `${baseClasses} p-6 ${
      isSelected
        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
    }`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIconSolid className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div
      className={getCardClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select ${displayName}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Provider Header */}
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {displayName}
            </h3>
            {isSelected && (
              <div className="flex-shrink-0 ml-2">
                <CheckIcon className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {rating} ({reviews} reviews)
            </span>
          </div>
          
          <div className="flex items-center mt-1">
            <providerIcon className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">
              {isCounselor ? 'Academic Counselor' : 'Tutor'}
            </span>
            {experience > 0 && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">
                  {experience} year{experience > 1 ? 's' : ''} experience
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Specialization */}
      {specialization && (
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {specialization}
          </span>
        </div>
      )}

      {/* Subjects/Skills */}
      {subjects.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {isCounselor ? 'Specializations' : 'Subjects'}
          </h4>
          <div className="flex flex-wrap gap-1">
            {subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                +{subjects.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bio */}
      {bio && variant !== "compact" && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{bio}</p>
        </div>
      )}

      {/* Pricing */}
      {hourlyRate > 0 && (
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-900">
            ${hourlyRate}/hour
          </div>
        </div>
      )}

      {/* Select Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect();
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Loading...
          </div>
        ) : isSelected ? (
          <div className="flex items-center justify-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Selected
          </div>
        ) : (
          `Select ${isCounselor ? 'Counselor' : 'Tutor'}`
        )}
      </button>

      {/* Popular Badge */}
      {rating >= 4.8 && reviews >= 20 && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
          Popular
        </div>
      )}
    </div>
  );
}

