"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlanTypes } from "../../../../lib/api/plans";

export default function PlanFilters({ filters, onFiltersChange, searchTerm, onSearchChange }) {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceRangeChange = (key, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [key]: value,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: "",
      priceRange: { min: "", max: "" },
      status: "",
    });
    onSearchChange("");
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      filters.type ||
      filters.priceRange.min ||
      filters.priceRange.max ||
      filters.status
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.type) count++;
    if (filters.priceRange.min) count++;
    if (filters.priceRange.max) count++;
    if (filters.status) count++;
    return count;
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
              showFilters
                ? "border-blue-500 text-blue-700 bg-blue-50"
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan Type Filter */}
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type
              </label>
              <select
                id="type-filter"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value={PlanTypes.MONTHLY}>Monthly Subscription</option>
                <option value={PlanTypes.MULTI_HOUR}>Multi-Hour Package</option>
                <option value={PlanTypes.SINGLE}>Single Session</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (USD)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
                <span className="flex items-center text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
              
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    type: PlanTypes.MONTHLY,
                    priceRange: { min: "", max: "" },
                    status: "",
                  });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filters.type === PlanTypes.MONTHLY
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                Monthly Plans
              </button>
              
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    type: PlanTypes.MULTI_HOUR,
                    priceRange: { min: "", max: "" },
                    status: "",
                  });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filters.type === PlanTypes.MULTI_HOUR
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                Multi-Hour Plans
              </button>
              
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    type: PlanTypes.SINGLE,
                    priceRange: { min: "", max: "" },
                    status: "",
                  });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filters.type === PlanTypes.SINGLE
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                Single Sessions
              </button>
              
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    priceRange: { min: "100", max: "" },
                    type: "",
                    status: "",
                  });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filters.priceRange.min === "100"
                    ? "bg-orange-100 text-orange-800 border-orange-200"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                Premium ($100+)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
