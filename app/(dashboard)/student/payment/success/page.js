"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { paymentApi } from "../../../../lib/stripe/api";
import { formatCurrency } from "../../../../lib/stripe/config";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const paymentId = searchParams.get("paymentId");
  const amountInCents = searchParams.get("amount");

  const amountInDollars = amountInCents ? parseFloat(amountInCents) / 100 : 0;

  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await paymentApi.getBookingDetails(bookingId);
        if (response && response.data) {
          setBookingDetails(response.data);
        } else {
          console.error("Failed to fetch booking details:", response);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your tutoring session has been booked and is pending tutor
          confirmation. You will receive a notification shortly.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
            Booking Details
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading details...</div>
          ) : bookingDetails ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-mono text-sm">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <span className="font-mono text-sm">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="font-medium">
                  {bookingDetails.providerName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subject:</span>
                <span className="font-medium">
                  {bookingDetails.subject || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">
                  {new Date(bookingDetails.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">
                  {new Date(bookingDetails.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  Amount Paid:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(amountInDollars)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500">
              Could not load booking details.
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/student/my-sessions">
            <button className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
              View My Sessions
            </button>
          </Link>
          <Link href="/student/book-session">
            <button className="w-full bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300">
              Book Another Session
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
