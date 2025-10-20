"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { waitlist } from "@/app/lib/api/endpoints";

export default function WaitlistPage() {
  const [waitlistUsers, setWaitlistUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchWaitlistUsers();
  }, []);

  const fetchWaitlistUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await waitlist.getAll();
      setWaitlistUsers(response.data || []);
    } catch (error) {
      setError("Failed to fetch waitlist users. Please try again.");
      console.error("Error fetching waitlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = waitlistUsers.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      user.requestedRole?.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Waitlist
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchWaitlistUsers}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#243b53] flex items-center">
            <UserGroupIcon className="h-7 w-7 mr-2 text-blue-600" />
            Waitlist Management
          </h1>
          <p className="mt-1 text-[#6b7280]">
            Review and manage users waiting for platform access
          </p>
        </div>
      </div>

      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex overflow-x-auto pb-1 md:pb-0 space-x-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("all")}
              >
                All Applications
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "student"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("student")}
              >
                Students
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedFilter === "tutor"
                    ? "bg-blue-600 text-white"
                    : "text-[#6b7280] hover:bg-[#dbeafe] hover:text-[#4f46e5]"
                }`}
                onClick={() => setSelectedFilter("tutor")}
              >
                Tutors
              </button>
            </div>

            <div className="relative rounded-lg shadow-sm md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-[#9ca3af]"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                className="focus:ring-[#4f46e5] focus:border-[#4f46e5] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Applied Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No applications found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery
                        ? "No results match your search criteria"
                        : "No waitlist applications available"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                          {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#243b53]">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      {user.phoneNumber || "N/A"}{" "}
                      {/* Changed from user.phone to user.phoneNumber */}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6b7280] max-w-xs truncate">
                      {user.message || "No message"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      {user.createdAt /* Changed from user.appliedDate to user.createdAt */
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
