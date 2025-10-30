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
        
      </div>
      {/* Back to Dashboard button removed for this flow */}
    </div>
  );
}
