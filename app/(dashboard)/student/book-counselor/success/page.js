"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { format, parse } from "date-fns";
import toast from "react-hot-toast";

export default function CounselingBookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from URL params
    const bookingId = searchParams.get("booking");
    const counselorId = searchParams.get("counselor");
    const sessionType = searchParams.get("type");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const notes = searchParams.get("notes");

    if (!bookingId || !counselorId || !sessionType || !date || !time) {
      toast.error("Invalid booking confirmation. Redirecting to dashboard.");
      router.push("/student");
      return;
    }

    // Get counselor data from localStorage or create fallback
    let counselor = null;
    
    // Try to get counselor data from localStorage first
    const storedBookingData = localStorage.getItem("pendingBooking");
    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        if (parsedData.counselor) {
          counselor = parsedData.counselor;
        }
      } catch (e) {
        console.error("Error parsing stored booking data:", e);
      }
    }
    
    // If no counselor data found, create a basic structure
    if (!counselor) {
      counselor = {
        id: counselorId,
        name: `Counselor #${counselorId}`,
        title: "Academic Counselor",
        avatar: "/default-avatar.png",
      };
    }

    const sessionTypeLabel = sessionType === "30min" ? "30 minutes" : "60 minutes";
    const price = sessionType === "30min" ? 30 : 40;

    const booking = {
      id: bookingId,
      counselorId,
      counselor,
      sessionType,
      sessionTypeLabel,
      duration: sessionType === "30min" ? 30 : 60,
      date,
      time,
      notes: notes || "",
      price,
      status: "pending"
    };

    setBookingData(booking);
    setLoading(false);
  }, [searchParams, router]);

  const handleViewSessions = () => {
    router.push("/student/my-sessions");
  };

  const handleBookAnother = () => {
    router.push("/student/book-counselor");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Booking Not Found
          </h3>
          <p className="text-gray-500 mb-4">
            We couldn't find your booking confirmation.
          </p>
          <Link
            href="/student"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center py-12">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your counseling session has been successfully booked and payment processed.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Counselor Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Counselor</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={bookingData.counselor.avatar}
                  alt={bookingData.counselor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{bookingData.counselor.name}</h4>
                  <p className="text-sm text-gray-500">{bookingData.counselor.title}</p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Session Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{format(new Date(bookingData.date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>
                    {format(parse(bookingData.time, "HH:mm", new Date()), "h:mm a")} - 
                    {format(parse(bookingData.time, "HH:mm", new Date()).setMinutes(parse(bookingData.time, "HH:mm", new Date()).getMinutes() + bookingData.duration), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>{bookingData.sessionTypeLabel} Counseling Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          {bookingData.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Session Notes</h3>
              <p className="text-sm text-gray-600">{bookingData.notes}</p>
            </div>
          )}

          {/* Payment Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Total Paid</span>
              <span className="text-lg font-semibold text-gray-900">${bookingData.price}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-blue-900 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Your counselor will receive a notification about your booking request</p>
            <p>• They will review and accept your request within 24 hours</p>
            <p>• You'll receive a confirmation email once your session is approved</p>
            <p>• A calendar invite will be sent to your email before the session</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleViewSessions}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            View My Sessions
          </button>
          
          <button
            onClick={handleBookAnother}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowRightIcon className="h-5 w-5 mr-2" />
            Book Another Session
          </button>
          
          <Link
            href="/student"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

