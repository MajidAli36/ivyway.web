"use client";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlanTypes } from "../../lib/api/plans";

export default function PlanFilters({
  plans,
  onFilterChange,
  onSearchChange,
  onSortChange,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("price-asc");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleTypeChange = (type) => {
    const newType = selectedType === type ? "" : type;
    setSelectedType(newType);
    onFilterChange?.({ type: newType, priceRange });
  };

  const handlePriceRangeChange = (field, value) => {
    const newPriceRange = { ...priceRange, [field]: value };
    setPriceRange(newPriceRange);
    onFilterChange?.({ type: selectedType, priceRange: newPriceRange });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("price-asc");
    onSearchChange?.("");
    onFilterChange?.({ type: "", priceRange: { min: "", max: "" } });
    onSortChange?.("price-asc");
  };

  const hasActiveFilters =
    searchTerm || selectedType || priceRange.min || priceRange.max;

  const planTypeOptions = [
    { value: PlanTypes.MONTHLY, label: "Monthly Plans" },
    { value: PlanTypes.MULTI_HOUR, label: "Multi-Hour Packages" },
    { value: PlanTypes.SINGLE, label: "Single Sessions" },
  ];

  const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-6">
          {/* Plan Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Plan Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {planTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === option.value
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Price Range
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange("min", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={priceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange("max", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Type:{" "}
                {
                  planTypeOptions.find((opt) => opt.value === selectedType)
                    ?.label
                }
                <button
                  onClick={() => handleTypeChange(selectedType)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Price: ${priceRange.min || "0"} - ${priceRange.max || "∞"}
                <button
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
