"use client";

import { useState } from "react";

export default function RefundRequests() {
  const [requests, setRequests] = useState([
    {
      id: "REF-3921",
      transactionId: "TRX-8731",
      user: "Oliver Thomas",
      email: "oliver.t@example.com",
      date: "2025-04-09",
      amount: 49.99,
      reason: "Course not as described",
      status: "pending",
    },
    {
      id: "REF-3920",
      transactionId: "TRX-8720",
      user: "Sophia Miller",
      email: "sophia.m@example.com",
      date: "2025-04-08",
      amount: 99.99,
      reason: "Technical issues prevented course access",
      status: "pending",
    },
    {
      id: "REF-3919",
      transactionId: "TRX-8715",
      user: "Lucas Garcia",
      email: "lucas.g@example.com",
      date: "2025-04-07",
      amount: 149.99,
      reason: "Unsatisfied with tutor quality",
      status: "pending",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request
      )
    );
  };

  const handleReject = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request
      )
    );
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    // In a real implementation, this would open a modal or navigate to details page
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Request ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Reason
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {request.id}
                  <div className="text-xs text-gray-500">
                    Transaction: {request.transactionId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-medium text-sm">
                      {request.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.user}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${request.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {request.reason}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
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
          <h3 className="text-lg font-medium text-gray-900">
            No refund requests
          </h3>
          <p className="mt-1 text-gray-500">
            There are no pending refund requests at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
