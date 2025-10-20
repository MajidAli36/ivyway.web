"use client";

import { useState } from "react";
import BookingHeader from "./components/BookingHeader";
import BookingWizard from "./components/BookingWizard";

export default function BookSession() {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(() => {
    if (typeof window !== "undefined") {
      const plan = localStorage.getItem("activePlan");
      return plan ? JSON.parse(plan) : null;
    }
    return null;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BookingHeader selectedPlan={selectedPlan} />

      <div className="max-w-4xl mx-auto mt-8">
        {bookingComplete ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your tutoring session has been scheduled successfully. You can
              view your upcoming sessions in the dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/student/my-sessions")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Sessions
              </button>
              <button
                onClick={() => setBookingComplete(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Book Another Session
              </button>
            </div>
          </div>
        ) : (
          <BookingWizard onComplete={() => setBookingComplete(true)} />
        )}
      </div>
    </div>
  );
}
