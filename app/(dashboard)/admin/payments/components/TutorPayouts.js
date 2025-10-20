"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

export default function TutorPayouts() {
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Mock payout data
  const payouts = [
    {
      id: "PAY-4521",
      date: "2025-04-15",
      tutor: "David Wilson",
      email: "david.w@example.com",
      amount: 1245.75,
      status: "pending",
      paymentMethod: "Bank Transfer",
      accountDetails: "*****6789",
      sessions: 28,
    },
    {
      id: "PAY-4520",
      date: "2025-04-15",
      tutor: "Jennifer Lopez",
      email: "j.lopez@example.com",
      amount: 867.5,
      status: "pending",
      paymentMethod: "PayPal",
      accountDetails: "j.lopez@example.com",
      sessions: 19,
    },
    {
      id: "PAY-4519",
      date: "2025-04-01",
      tutor: "Michael Brown",
      email: "m.brown@example.com",
      amount: 1580.25,
      status: "processed",
      paymentMethod: "Bank Transfer",
      accountDetails: "*****3456",
      sessions: 35,
    },
    {
      id: "PAY-4518",
      date: "2025-04-01",
      tutor: "Sarah Davis",
      email: "s.davis@example.com",
      amount: 955.0,
      status: "processed",
      paymentMethod: "Bank Transfer",
      accountDetails: "*****7890",
      sessions: 21,
    },
  ];

  // Sorting function
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Get sorted payouts
  const getSortedPayouts = () => {
    return [...payouts].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle different types
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedPayouts = getSortedPayouts();

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return (
        <ChevronUpIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      );
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-blue-600" />
    );
  };

  const handleProcess = (id) => {
    // In real implementation, this would call an API to process the payout
    alert(`Processing payout ${id}`);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tutor Payouts</h3>
          <p className="text-sm text-gray-500">
            Manage and process payments to tutors
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Process All Pending
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  Payout ID
                  <SortIcon column="id" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("tutor")}
              >
                <div className="flex items-center">
                  Tutor
                  <SortIcon column="tutor" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon column="status" />
                </div>
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
            {sortedPayouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {payout.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payout.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium text-sm">
                      {payout.tutor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payout.tutor}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payout.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${payout.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {payout.sessions} sessions
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      payout.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : payout.status === "processed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {payout.status.charAt(0).toUpperCase() +
                      payout.status.slice(1)}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    Via {payout.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                    {payout.status === "pending" && (
                      <button
                        onClick={() => handleProcess(payout.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Process
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Total pending payouts:{" "}
            <span className="font-medium text-gray-900">
              $
              {sortedPayouts
                .filter((p) => p.status === "pending")
                .reduce((sum, payout) => sum + payout.amount, 0)
                .toFixed(2)}
            </span>
          </span>
          <div className="flex space-x-2">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
              Export to CSV
            </button>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-900">
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
