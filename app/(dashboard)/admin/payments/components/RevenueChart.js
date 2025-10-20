"use client";

import { useState, useEffect } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RevenueChart({ dateRange, setDateRange }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Generate mock data based on selected date range
  useEffect(() => {
    let labels = [];
    let values = [];

    switch (dateRange) {
      case "last7":
        // Last 7 days data
        labels = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        });
        values = [1250, 1420, 1100, 1680, 1950, 2100, 1890];
        break;

      case "last30":
        // Last 30 days data (simplified to weeks)
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        values = [4500, 5200, 6100, 8700];
        break;

      case "last90":
        // Last 90 days data (simplified to months)
        labels = ["Month 1", "Month 2", "Month 3"];
        values = [15200, 18500, 24500];
        break;

      default:
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        values = [4500, 5200, 6100, 8700];
    }

    // Create Chart.js data structure
    setChartData({
      labels,
      datasets: [
        {
          label: "Revenue ($)",
          data: values,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: "rgba(37, 99, 235, 0.8)",
        },
      ],
    });
  }, [dateRange]);

  // Calculate total revenue
  const totalRevenue =
    chartData.datasets?.[0]?.data.reduce((a, b) => a + b, 0) || 0;

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value.toLocaleString();
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
          <h2 className="text-xl font-semibold text-slate-800">
            Revenue Overview
          </h2>
        </div>
        <div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 text-sm"
          >
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="h-64">
          <Bar options={options} data={chartData} />
        </div>

        <div className="mt-6 flex justify-between items-center text-sm">
          <div className="text-slate-500">
            Total Revenue:{" "}
            <span className="font-semibold text-slate-800">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
