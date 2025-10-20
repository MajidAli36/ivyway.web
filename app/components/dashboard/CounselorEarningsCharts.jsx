"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import counselorEarningsService from "../../lib/api/counselorEarningsService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CounselorEarningsCharts() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await counselorEarningsService.getEarningSummary();
      setSummary(response.data);
    } catch (err) {
      console.error("Error fetching counselor earnings:", err);
      setError("Failed to load earnings data");
    } finally {
      setIsLoading(false);
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#111827",
        bodyColor: "#111827",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  // Prepare chart data from summary
  const monthlyEarningsData = summary
    ? {
        labels: summary.monthlyEarnings?.map((m) =>
          new Date(m.month).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })
        ) || [],
        datasets: [
          {
            label: "Monthly Earnings ($)",
            data: summary.monthlyEarnings?.map((m) => m.total) || [],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 4,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const serviceTypeData = summary
    ? {
        labels: summary.earningsByService?.map((s) => s.service) || ["Counseling Sessions"],
        datasets: [
          {
            label: "Earnings by Service Type ($)",
            data: summary.earningsByService?.map((s) => s.total) || [summary.totalEarnings || 0],
            backgroundColor: [
              "rgba(59, 130, 246, 0.9)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(59, 130, 246, 0.6)",
              "rgba(59, 130, 246, 0.5)",
            ],
            borderRadius: 4,
          },
        ],
      }
    : { labels: [], datasets: [] };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Earnings (last 12 months)
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Earnings by Service Type
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Earnings (last 12 months)
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="text-amber-600 text-sm text-center">
              <p>API endpoint not available</p>
              <p className="text-xs mt-1">Using demo data for testing</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Earnings by Service Type
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="text-amber-600 text-sm text-center">
              <p>API endpoint not available</p>
              <p className="text-xs mt-1">Using demo data for testing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Earnings Chart */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Earnings (last 12 months)
          </h3>
        </div>
        <div className="p-4 h-64">
          {monthlyEarningsData.datasets.length > 0 ? (
            <Bar data={monthlyEarningsData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No earnings data available
            </div>
          )}
        </div>
      </div>

      {/* Earnings by Service Type Chart */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Earnings by Service Type
          </h3>
        </div>
        <div className="p-4 h-64">
          {serviceTypeData.datasets.length > 0 ? (
            <Bar data={serviceTypeData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No service earnings data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
