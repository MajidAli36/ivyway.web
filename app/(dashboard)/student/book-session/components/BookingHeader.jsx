import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BookingHeader({ selectedPlan }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Book a Tutoring Session
        </h1>
        <p className="text-gray-600 mt-1">
          Schedule a session with one of our expert tutors
        </p>
        {selectedPlan && (
          <div className="mt-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded inline-block">
            <span className="font-semibold">Plan:</span> {selectedPlan.name} (
            {selectedPlan.sessionCount
              ? `${selectedPlan.sessionCount} sessions`
              : selectedPlan.type}
            )
          </div>
        )}
      </div>
      <Link
        href="/student"
        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
    </div>
  );
}
