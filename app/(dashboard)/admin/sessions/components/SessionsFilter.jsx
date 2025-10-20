import { useState } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SessionsFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
}) {
  const statusOptions = ["Pending", "Confirmed", "Canceled", "Completed"];

  const handleStatusToggle = (status) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter([]);
    setDateRange({ start: null, end: null });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by student, tutor, or subject"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusToggle(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter.includes(status)
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="px-3 py-1 rounded-full text-sm bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
