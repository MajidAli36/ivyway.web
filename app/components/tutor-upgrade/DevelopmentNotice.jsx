"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DevelopmentNotice() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex">
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Development Mode
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            The tutor upgrade system is running in development mode. Some features may use simulated data until the backend API is fully implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
