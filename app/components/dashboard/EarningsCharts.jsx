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
import API from "../../lib/api/apiService";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EarningsCharts() {
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
      const response = await API.getEarningsSummary();
      setSummary(response.data);
    } catch (err) {
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
  const monthlyChartData = summary
    ? {
        labels: summary.monthlyEarnings.map((m) =>
          new Date(m.month).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })
        ),
        datasets: [
          {
            label: "Monthly Earnings ($)",
            data: summary.monthlyEarnings.map((m) => m.total),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 4,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const subjectChartData = summary
    ? {
        labels: summary.earningsBySubject.map((s) => s.subject),
        datasets: [
          {
            label: "Subject Earnings ($)",
            data: summary.earningsBySubject.map((s) => s.total),
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
              Earnings by Subject
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Earnings (last 12 months)
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchSummary}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Earnings by Subject
            </h3>
          </div>
          <div className="p-4 h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchSummary}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Retry
              </button>
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
          {summary && monthlyChartData.datasets.length > 0 && (
            <Bar data={monthlyChartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Earnings by Subject Chart */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Earnings by Subject
          </h3>
        </div>
        <div className="p-4 h-64">
          {summary && subjectChartData.datasets.length > 0 && (
            <Bar data={subjectChartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
}
