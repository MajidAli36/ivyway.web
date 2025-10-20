import { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function SessionFilter({
  onFilterChange,
  totalSessions,
  pendingCount,
  confirmedCount,
  completedCount,
  canceledCount,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const statusOptions = [
    { id: "pending", name: "Pending", count: pendingCount },
    { id: "confirmed", name: "Confirmed", count: confirmedCount },
    { id: "completed", name: "Completed", count: completedCount },
    { id: "canceled", name: "Canceled", count: canceledCount },
  ];

  // Removed service type, subject, and date range filters

  const handleSearchChange = (e) => {
    const newFilters = {
      ...filters,
      search: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleStatus = (statusId) => {
    // Avoid layout jank by deferring state updates to end of frame
    const newFilters = {
      ...filters,
      status: filters.status === statusId ? "" : statusId,
    };
    // Use requestAnimationFrame to batch DOM writes and prevent reflow shake
    window.requestAnimationFrame(() => {
      setFilters(newFilters);
      onFilterChange(newFilters);
    });
  };

  const clearAllFilters = () => {
    const newFilters = {
      search: "",
      status: "",
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters =
    filters.search || Boolean(filters.status) || Boolean(filters.search);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          placeholder="Search by tutor name or subject..."
          value={filters.search}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {filters.search && (
          <button
            onClick={() => {
              setFilters({ ...filters, search: "" });
              onFilterChange({ ...filters, search: "" });
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center text-sm font-medium ${
            isExpanded ? "text-blue-600" : "text-gray-600"
          }`}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters ? (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        ) : (
          // Reserve space to avoid layout shift when toggling filters
          <span className="text-sm invisible select-none">Clear all</span>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* Status Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => toggleStatus(status.id)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    filters.status === status.id
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {status.name}
                  <span className="ml-1 text-xs bg-gray-200 text-gray-800 px-1.5 rounded-full">
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
