"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { usePayment, useBooking } from "../../lib/stripe/hooks";
import { formatCurrency } from "../../lib/stripe/config";

// Note: This component should use a Stripe provider instead of direct initialization
// For now, we'll use a fallback approach
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

const testPlans = [
  {
    id: "monthly_regular",
    name: "Monthly Regular",
    price: 375,
    description:
      "4 sessions/month (1 hour each). Best for consistent progress.",
    details: "$375/month ($93.75/hr)",
  },
  {
    id: "monthly_advanced",
    name: "Monthly Advanced",
    price: 520,
    description: "4 advanced sessions/month (1 hour each). For advanced needs.",
    details: "$520/month ($130/hr)",
  },
  {
    id: "multi_hour",
    name: "Multi-Hour Pack",
    price: null,
    description: "Book 2+ hours and get automatic discounts:",
    details: "2–5 hrs: 5% off, 6–10 hrs: 10% off, 11+ hrs: 20% off",
  },
  {
    id: "single",
    name: "Single Session",
    price: 100,
    description: "Book a single session at the standard rate.",
    details: "$100/hr (example)",
  },
];

const PaymentTest = () => {
  const [testMode, setTestMode] = useState("success");
  const [showForm, setShowForm] = useState(false);
  const [testData, setTestData] = useState({
    bookingId: "test_booking_123",
    amount: 5000, // $50.00
    currency: "usd",
    tutorName: "Dr. Sarah Johnson",
    subject: "Advanced Mathematics",
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
  });
  const [selectedPlan, setSelectedPlan] = useState(testPlans[0]);

  const { processPayment, isProcessing, paymentStatus, error } = usePayment();
  const { fetchBooking, booking, isLoading } = useBooking();

  const testCards = {
    success: {
      number: "4242 4242 4242 4242",
      description: "Successful payment",
    },
    declined: {
      number: "4000 0000 0000 0002",
      description: "Card declined",
    },
    insufficient: {
      number: "4000 0000 0000 9995",
      description: "Insufficient funds",
    },
    expired: {
      number: "4000 0000 0000 0069",
      description: "Expired card",
    },
    incorrect_cvc: {
      number: "4000 0000 0000 0127",
      description: "Incorrect CVC",
    },
  };

  const handleTestPayment = async () => {
    const result = await processPayment({
      ...testData,
      customerName: "Test Student",
      customerEmail: "test@example.com",
    });

    console.log("Payment result:", result);
  };

  const handleFetchBooking = async () => {
    try {
      await fetchBooking(testData.bookingId);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Payment Integration Test
        </h1>

        {/* Test Configuration */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Test Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Mode
              </label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(testCards).map(([key, card]) => (
                  <option key={key} value={key}>
                    {card.description} ({card.number})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (cents)
              </label>
              <input
                type="number"
                value={testData.amount}
                onChange={(e) =>
                  setTestData((prev) => ({
                    ...prev,
                    amount: parseInt(e.target.value),
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(testData.amount, testData.currency)}
              </p>
            </div>
          </div>

          {/* Test Data Display */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Test Data
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Booking ID:</span>
                <p className="font-medium">{testData.bookingId}</p>
              </div>
              <div>
                <span className="text-gray-600">Tutor:</span>
                <p className="font-medium">{testData.tutorName}</p>
              </div>
              <div>
                <span className="text-gray-600">Subject:</span>
                <p className="font-medium">{testData.subject}</p>
              </div>
              <div>
                <span className="text-gray-600">Date/Time:</span>
                <p className="font-medium">
                  {testData.date} at {testData.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cards Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Test Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(testCards).map(([key, card]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 ${
                  testMode === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-1">
                  {card.description}
                </h3>
                <p className="text-sm text-gray-600 font-mono">{card.number}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Expiry: Any future date | CVC: Any 3 digits
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Test Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Hide" : "Show"} Payment Form
            </button>

            <button
              onClick={handleFetchBooking}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : "Fetch Booking"}
            </button>

            <button
              onClick={handleTestPayment}
              disabled={isProcessing}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              {isProcessing ? "Processing..." : "Test Payment API"}
            </button>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Status</h3>
              <p
                className={`text-sm font-medium ${
                  paymentStatus === "success"
                    ? "text-green-600"
                    : paymentStatus === "failed"
                    ? "text-red-600"
                    : paymentStatus === "processing"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {paymentStatus.toUpperCase()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Processing
              </h3>
              <p
                className={`text-sm font-medium ${
                  isProcessing ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {isProcessing ? "YES" : "NO"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Error</h3>
              <p className="text-sm text-red-600 font-medium">
                {error || "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Data */}
        {booking && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Data
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(booking, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {showForm && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Form
            </h2>
            <div className="border border-gray-200 rounded-lg p-6">
              <Elements stripe={stripePromise}>
                <PaymentForm
                  bookingId={testData.bookingId}
                  amount={testData.amount}
                  currency={testData.currency}
                  onSuccess={(paymentIntent) => {
                    console.log("Payment successful:", paymentIntent);
                    alert("Payment successful! Check console for details.");
                  }}
                  onError={(error) => {
                    console.error("Payment failed:", error);
                    alert(`Payment failed: ${error.message}`);
                  }}
                  onCancel={() => {
                    console.log("Payment cancelled");
                    alert("Payment cancelled");
                  }}
                  bookingDetails={testData}
                  plan={selectedPlan}
                />
              </Elements>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Testing Instructions
          </h2>
          <ol className="text-blue-800 text-sm space-y-2">
            <li>1. Select a test mode from the dropdown above</li>
            <li>2. Use the corresponding test card number when prompted</li>
            <li>3. Use any future expiry date and any 3-digit CVC</li>
            <li>4. Click "Show Payment Form" to test the complete flow</li>
            <li>5. Monitor the payment status and console for results</li>
            <li>6. Check the browser's network tab for API calls</li>
          </ol>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Test Plan Selection:</label>
          <select
            className="border rounded px-3 py-2"
            value={selectedPlan.id}
            onChange={(e) =>
              setSelectedPlan(testPlans.find((p) => p.id === e.target.value))
            }
          >
            {testPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;
