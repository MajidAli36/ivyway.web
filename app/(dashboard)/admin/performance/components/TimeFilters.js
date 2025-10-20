"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimeFilters = ({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
}) => {
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(dateRange.start);
  const [endDate, setEndDate] = useState(dateRange.end);

  const handleTimeRangeClick = (range) => {
    if (range === "custom") {
      setIsCustomRange(true);
    } else {
      setIsCustomRange(false);

      // Calculate date range based on selected time range
      const end = new Date();
      let start = new Date();

      switch (range) {
        case "day":
          start.setDate(end.getDate() - 1);
          break;
        case "week":
          start.setDate(end.getDate() - 7);
          break;
        case "month":
          start.setMonth(end.getMonth() - 1);
          break;
        case "quarter":
          start.setMonth(end.getMonth() - 3);
          break;
        case "year":
          start.setFullYear(end.getFullYear() - 1);
          break;
        default:
          start.setDate(end.getDate() - 7);
      }

      setStartDate(start);
      setEndDate(end);
      onDateRangeChange({ start, end });
      onTimeRangeChange(range);
    }
  };

  const handleDateChange = () => {
    onDateRangeChange({ start: startDate, end: endDate });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTimeRangeClick("day")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              timeRange === "day" && !isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleTimeRangeClick("week")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              timeRange === "week" && !isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handleTimeRangeClick("month")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              timeRange === "month" && !isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleTimeRangeClick("quarter")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              timeRange === "quarter" && !isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => handleTimeRangeClick("year")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              timeRange === "year" && !isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Year
          </button>
          <button
            onClick={() => handleTimeRangeClick("custom")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              isCustomRange
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Custom
          </button>
        </div>

        {isCustomRange && (
          <div className="mt-4 sm:mt-0 flex space-x-2 items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
            />
            <span className="text-gray-500">to</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm"
            />
            <button
              onClick={handleDateChange}
              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeFilters;
