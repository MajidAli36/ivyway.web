import React from "react";

const StudentProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-blue-400 rounded mr-2"></div>
              <div className="h-6 w-48 bg-blue-400 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-white rounded"></div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
            <div className="sm:col-span-2">
              <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-16 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information Skeleton */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-green-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-green-400 rounded mr-2"></div>
              <div className="h-6 w-48 bg-green-400 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-white rounded"></div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tutoring Preferences Skeleton */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-purple-400 rounded mr-2"></div>
              <div className="h-6 w-48 bg-purple-400 rounded"></div>
            </div>
            <div className="h-8 w-16 bg-white rounded"></div>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Subjects Skeleton */}
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-20 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Availability Skeleton */}
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-24 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Preferred Format Skeleton */}
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>

            {/* Additional Notes Skeleton */}
            <div className="sm:col-span-2">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats Skeleton */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="text-center">
              <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Completion Skeleton */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-12 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2"></div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileSkeleton;
