"use client";

import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  CreditCardIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import counselorPaymentService from "../../lib/api/counselorPaymentService";

const CounselingPaymentForm = ({ counselor, onSuccess, onError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [sessionType, setSessionType] = useState("30min");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success, error
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pricing configuration
  const pricing = {
    "30min": {
      amount: 3000, // $30.00 in cents
      counselorEarnings: 2000, // $20.00 in cents
      platformFee: 1000, // $10.00 in cents
      duration: 30
    },
    "60min": {
      amount: 4000, // $40.00 in cents
      counselorEarnings: 3000, // $30.00 in cents
      platformFee: 1000, // $10.00 in cents
      duration: 60
    }
  };

  // Available time slots (you can make this dynamic based on counselor availability)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
  ];

  // Available subjects
  const subjects = [
    "Academic Guidance",
    "Career Counseling", 
    "College Preparation",
    "Study Skills",
    "Personal Development",
    "Subject Tutoring",
    "Test Preparation",
    "Other"
  ];

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system not ready. Please try again.");
      return;
    }

    // Validate form
    if (!selectedDate || !selectedTime || !subject || !topic) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setPaymentStep("processing");

    try {
      // Step 1: Create payment intent
      const paymentIntentData = await counselorPaymentService.createPaymentIntent({
        counselorId: counselor.id,
        sessionType,
        amount: pricing[sessionType].amount,
        currency: "usd"
      });

      // Step 2: Process payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const billingDetails = {
        name: "Student Name", // Get from user context
        email: "student@example.com" // Get from user context
      };

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Step 3: Confirm payment and create booking
      const startTime = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
      const endTime = new Date(startTime.getTime() + pricing[sessionType].duration * 60000);

      const bookingData = {
        paymentIntentId: paymentIntent.id,
        counselorId: counselor.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        sessionType,
        subject,
        topic,
        notes
      };

      const booking = await counselorPaymentService.confirmPayment(bookingData);

      setSuccessMessage(`Session booked successfully! Booking ID: ${booking.bookingId}`);
      setPaymentStep("success");
      onSuccess?.(booking);

    } catch (error) {
      console.error("Payment failed:", error);
      setError(error.message);
      setPaymentStep("error");
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStep("form");
    setError("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    onCancel?.();
  };

  // Card element styling
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  if (paymentStep === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </div>
    );
  }

  if (paymentStep === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 text-center mb-4">{successMessage}</p>
        <div className="flex space-x-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Book Another Session
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (paymentStep === "error") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <div className="flex space-x-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Book Counseling Session</h2>
          <p className="text-blue-100">with {counselor.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(pricing).map(([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSessionType(type)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    sessionType === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {config.duration} minutes
                      </div>
                      <div className="text-sm text-gray-600">
                        {counselorPaymentService.formatAmount(config.amount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Counselor earns</div>
                      <div className="font-medium text-green-600">
                        {counselorPaymentService.formatAmount(config.counselorEarnings)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="h-4 w-4 inline mr-1" />
                Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject and Topic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Algebra, Physics, Career Planning"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics or questions you'd like to discuss..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Payment Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCardIcon className="h-4 w-4 inline mr-1" />
              Payment Information
            </label>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="px-6 py-3 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay ${counselorPaymentService.formatAmount(pricing[sessionType].amount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounselingPaymentForm;
