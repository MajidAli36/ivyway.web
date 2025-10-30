import Image from "next/image";
import {
  StarIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  getProfileImageUrl,
  handleProfileImageError,
} from "@/app/utils/profileImage";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function TutorCard({ tutor, isSelected, onSelect }) {
  return (
    <div
      className={`group relative border-2 rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-lg"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
      onClick={() => onSelect(tutor.id)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
          <CheckCircleIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
        </div>
      )}

      <div className="flex flex-col space-y-3 sm:space-y-4 h-full">
        {/* Header: Avatar + Basic Info */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={getProfileImageUrl(tutor.image)}
                alt={tutor.name}
                className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full object-cover border-2 sm:border-3 border-white shadow-lg"
                onError={handleProfileImageError}
              />
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  {tutor.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mt-0.5 truncate">
                  Academic Tutor
                </p>
              </div>

              {/* Rating - All screens */}
              <div className="flex items-center space-x-1 mt-1 sm:mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        i < Math.floor(tutor.rating || 4.5)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {tutor.rating || 4.5}
                </span>
                <span className="text-xs text-gray-500">
                  ({tutor.reviews || 0})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 sm:space-y-3 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 break-words">
            {tutor.bio ||
              "Experienced tutor ready to help you achieve your academic goals with personalized guidance and support."}
          </p>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {(tutor.subjects || ["Mathematics", "Science", "English"]).map(
              (subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200/50 shadow-sm truncate max-w-[120px] sm:max-w-none"
                  title={subject}
                >
                  <AcademicCapIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  {subject}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer - Experience and Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100 space-y-1 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">
                {tutor.experience || 3}+ years exp
              </span>
            </span>
          </div>

          {isSelected && (
            <div className="flex items-center text-xs font-medium text-blue-600">
              <CheckCircleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">Selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
