"use client";

import React, { useState, useEffect } from "react";
import OverviewStats from "./components/OverviewStats";
import TimeFilters from "./components/TimeFilters";
import UserActivityChart from "./components/UserActivityChart";
import RolePerformance from "./components/RolePerformance";
import PlatformUsageStats from "./components/PlatformUsageStats";
import { fetchPerformanceData } from "@/app/utils/adminUtils";

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week"); // 'day', 'week', 'month', 'quarter', 'year'
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPerformanceData(timeRange, dateRange);
        setPerformanceData(data);
      } catch (error) {
        console.error("Error loading performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange, dateRange]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Performance Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor platform performance and user activity
          </p>
        </div>

        <TimeFilters
          timeRange={timeRange}
          dateRange={dateRange}
          onTimeRangeChange={handleTimeRangeChange}
          onDateRangeChange={handleDateRangeChange}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : performanceData ? (
          <>
            <div className="mt-6">
              <OverviewStats data={performanceData.overview} />
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Activity
                </h3>
                <UserActivityChart
                  data={performanceData.userActivity}
                  timeRange={timeRange}
                />
              </div>
            </div>

            <div className="mt-8">
              <RolePerformance data={performanceData.roleMetrics} />
            </div>

            <div className="mt-8">
              <PlatformUsageStats data={performanceData.platformUsage} />
            </div>
          </>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No performance data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;
