"use client";

import { VideoCameraIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function MeetingLoadingState({ 
  type = "list", 
  message = "Loading meetings...",
  showSkeleton = true 
}) {
  if (type === "card") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {showSkeleton && (
          <>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </>
        )}
        
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    );
  }

  if (type === "inline") {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-500">{message}</span>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  );
}
