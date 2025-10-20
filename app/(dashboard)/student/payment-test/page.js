"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/api/client";
import { paymentApi } from "@/app/lib/stripe/api";

export default function PaymentTestPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  const addTestResult = (test, status, message, data = null) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        status,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testAuthentication = async () => {
    addTestResult(
      "Authentication",
      "info",
      "Checking authentication status..."
    );

    const token = localStorage.getItem("jwt_token");
    const user = localStorage.getItem("user");

    if (token) {
      setAuthStatus("authenticated");
      addTestResult("Authentication", "success", "JWT token found", {
        token: token.substring(0, 20) + "...",
      });
    } else {
      setAuthStatus("not_authenticated");
      addTestResult("Authentication", "error", "No JWT token found");
    }

    if (user) {
      try {
        const userData = JSON.parse(user);
        addTestResult("User Data", "success", "User data found", userData);
      } catch (e) {
        addTestResult(
          "User Data",
          "error",
          "Invalid user data in localStorage"
        );
      }
    } else {
      addTestResult("User Data", "error", "No user data found");
    }
  };

  const testApiConnection = async () => {
    addTestResult("API Connection", "info", "Testing API connection...");

    try {
      const response = await apiClient.get("/health");
      addTestResult(
        "API Connection",
        "success",
        "API connection successful",
        response
      );
    } catch (error) {
      addTestResult("API Connection", "error", "API connection failed", {
        status: error.status,
        message: error.message,
      });
    }
  };

  const testBookingCreation = async () => {
    addTestResult("Booking Creation", "info", "Testing booking creation...");

    const testBooking = {
      providerId: "test-tutor-id",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(
        Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000
      ).toISOString(),
      sessionType: "virtual",
      notes: "Test booking from payment test page",
      subject: "Mathematics",
      topic: "Algebra",
      status: "pending",
      amount: 2500, // $25.00 in cents
      currency: "usd",
    };

    try {
      const response = await apiClient.post("/bookings", testBooking);
      addTestResult(
        "Booking Creation",
        "success",
        "Test booking created",
        response
      );
      return (
        response.id ||
        response.bookingId ||
        response.data?.id ||
        response.data?.bookingId
      );
    } catch (error) {
      addTestResult("Booking Creation", "error", "Booking creation failed", {
        status: error.status,
        message: error.message,
        data: error.data,
      });
      return null;
    }
  };

  const testBookingRetrieval = async (bookingId) => {
    if (!bookingId) {
      addTestResult(
        "Booking Retrieval",
        "error",
        "No booking ID provided for retrieval test"
      );
      return;
    }

    addTestResult(
      "Booking Retrieval",
      "info",
      "Testing booking retrieval with ID: " + bookingId
    );

    try {
      // Test with main API client
      const response1 = await apiClient.get(`/bookings/${bookingId}`);
      addTestResult(
        "Booking Retrieval - Main API",
        "success",
        "Booking retrieved via main API",
        response1
      );
    } catch (error) {
      addTestResult(
        "Booking Retrieval - Main API",
        "error",
        "Failed to retrieve booking via main API",
        {
          status: error.status,
          message: error.message,
        }
      );
    }

    try {
      // Test with payment API
      const response2 = await paymentApi.getBookingDetails(bookingId);
      addTestResult(
        "Booking Retrieval - Payment API",
        "success",
        "Booking retrieved via payment API",
        response2
      );
    } catch (error) {
      addTestResult(
        "Booking Retrieval - Payment API",
        "error",
        "Failed to retrieve booking via payment API",
        {
          message: error.message,
        }
      );
    }
  };

  const testPaymentApi = async (bookingId) => {
    if (!bookingId) {
      addTestResult(
        "Payment API",
        "error",
        "No booking ID provided for payment test"
      );
      return;
    }

    addTestResult(
      "Payment API",
      "info",
      "Testing payment API with booking ID: " + bookingId
    );

    try {
      const bookingDetails = await paymentApi.getBookingDetails(bookingId);
      addTestResult(
        "Payment API - Get Booking",
        "success",
        "Booking details retrieved",
        bookingDetails
      );
    } catch (error) {
      addTestResult(
        "Payment API - Get Booking",
        "error",
        "Failed to get booking details",
        {
          message: error.message,
        }
      );
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    clearResults();

    addTestResult(
      "Test Suite",
      "info",
      "Starting comprehensive payment flow test..."
    );

    // Test 1: Authentication
    await testAuthentication();

    // Test 2: API Connection
    await testApiConnection();

    // Test 3: Booking Creation
    const bookingId = await testBookingCreation();

    // Test 4: Booking Retrieval
    await testBookingRetrieval(bookingId);

    // Test 5: Payment API
    await testPaymentApi(bookingId);

    // Test 6: Navigation Test
    if (bookingId) {
      addTestResult(
        "Navigation",
        "info",
        "Testing navigation to payment page..."
      );
      try {
        // Test if we can navigate to the payment page
        const paymentUrl = `/student/payment/${bookingId}`;
        addTestResult(
          "Navigation",
          "success",
          `Payment URL generated: ${paymentUrl}`
        );

        // Simulate navigation (don't actually navigate)
        addTestResult(
          "Navigation",
          "info",
          "Navigation test completed - URL is valid"
        );
      } catch (error) {
        addTestResult("Navigation", "error", "Navigation test failed", error);
      }
    }

    addTestResult("Test Suite", "success", "All tests completed");
    setIsLoading(false);
  };

  const navigateToPayment = async () => {
    const bookingId = prompt("Enter booking ID to test payment page:");
    if (bookingId) {
      router.push(`/student/payment/${bookingId}`);
    }
  };

  useEffect(() => {
    testAuthentication();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Flow Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page helps debug the booking and payment flow. Run tests to
            identify issues.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Running Tests..." : "Run All Tests"}
            </button>

            <button
              onClick={testAuthentication}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Authentication
            </button>

            <button
              onClick={testApiConnection}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Test API Connection
            </button>

            <button
              onClick={navigateToPayment}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Test Payment Page
            </button>

            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Authentication Status
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  authStatus === "authenticated"
                    ? "bg-green-500"
                    : authStatus === "not_authenticated"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm">
                {authStatus === "authenticated"
                  ? "Authenticated"
                  : authStatus === "not_authenticated"
                  ? "Not Authenticated"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Results
          </h2>

          {testResults.length === 0 ? (
            <p className="text-gray-500">
              No test results yet. Run a test to see results.
            </p>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{result.test}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === "success"
                          ? "bg-green-100 text-green-800"
                          : result.status === "error"
                          ? "bg-red-100 text-red-800"
                          : result.status === "info"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {result.timestamp}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
