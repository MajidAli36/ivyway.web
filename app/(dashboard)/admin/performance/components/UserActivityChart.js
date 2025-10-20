"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { formatChartData } from "@/app/utils/chartUtils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

const UserActivityChart = ({ data, timeRange }) => {
  const [chartType, setChartType] = useState("line");
  const [chartData, setChartData] = useState(null);
  const [viewMode, setViewMode] = useState("all"); // 'all', 'students', 'tutors', 'admins'

  useEffect(() => {
    if (!data) return;
    const formattedData = formatChartData(data, viewMode, timeRange);
    setChartData(formattedData);
  }, [data, viewMode, timeRange]);

  if (!chartData)
    return (
      <div className="p-4 text-center text-gray-500">Loading chart data...</div>
    );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Activity Over Time",
      },
      colors: {
        forceOverride: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("all")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              viewMode === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setViewMode("students")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              viewMode === "students"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setViewMode("tutors")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              viewMode === "tutors"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Tutors
          </button>
          <button
            onClick={() => setViewMode("admins")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              viewMode === "admins"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Admins
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              chartType === "line"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              chartType === "bar"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      <div className="h-80">
        {chartType === "line" ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default UserActivityChart;
