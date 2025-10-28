import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BookingHeader({ selectedPlan }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-0">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Book a Tutoring Session
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Schedule a session with one of our expert tutors
        </p>
        {selectedPlan && (
          <div className="mt-2 text-xs sm:text-sm text-blue-700 bg-blue-50 px-2 sm:px-3 py-1 rounded inline-block">
            <span className="font-semibold">Plan:</span>{" "}
            <span className="block sm:inline">{selectedPlan.name} ({selectedPlan.sessionCount ? `${selectedPlan.sessionCount} sessions` : selectedPlan.type})</span>
          </div>
        )}
      </div>
      <Link
        href="/student"
        className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap self-start sm:self-auto"
      >
        <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Back to Dashboard</span>
        <span className="sm:hidden">Back</span>
      </Link>
    </div>
  );
}
