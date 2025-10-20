"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
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
import API from "../../../lib/api/apiService";
import PayoutRequestModal from "../../components/shared/PayoutRequestModal";
import StripeConnectStatus from "./components/StripeConnectStatus";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Date range selector component
const DateRangeSelector = ({ selectedRange, setSelectedRange }) => {
  const ranges = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Time Period:</span>
      <div className="relative">
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {ranges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

// Stats card component
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg">
    <div className="p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full ${bgColor} p-3`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <div className="text-sm font-medium text-gray-600">{title}</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">
            {value}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Payment history table
const PaymentHistoryTable = ({ payments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {payment.description || `Session ${payment.bookingId}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium mr-2">
                    {payment.studentName
                      ? payment.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "S"}
                  </div>
                  {payment.studentName || "Student"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                    payment.status === "available"
                      ? "bg-green-100 text-green-800"
                      : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : payment.status === "paid"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Earnings page component
export default function EarningsPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await API.getEarningsSummary();
      console.log("[DEBUG] /earnings/summary response:", response);
      setSummary(response.data); // Fix: use response.data, not response.data.data
    } catch (err) {
      setError("Failed to load earnings summary");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayoutSuccess = () => {
    fetchSummary();
  };

  // Chart data
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

  // Stat cards
  const earningsStats = summary
    ? [
        {
          title: "Available Balance",
          value: `$${Number(summary.availableBalance).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Total Earnings",
          value: `$${Number(summary.totalEarnings).toFixed(2)}`,
          icon: <CalendarIcon className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "This Month",
          value: `$${Number(summary.thisMonthEarnings).toFixed(2)}`,
          icon: <DocumentTextIcon className="h-6 w-6 text-purple-600" />,
          bgColor: "bg-purple-100",
        },
        {
          title: "Pending Earnings",
          value: `$${Number(summary.pendingEarnings).toFixed(2)}`,
          icon: <BanknotesIcon className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-100",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Stripe Connect Status */}
      <StripeConnectStatus />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">
            Track your tutoring income and payment history
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={!summary || summary.availableBalance < 10}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Request Payout
          </button>
          <Link
            href="/tutor/earnings/history"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            View History
          </Link>
        </div>
      </div>

      {/* Earnings Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {earningsStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Charts Row */}
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

      {/* Payout Request Modal */}
      <PayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSuccess={handlePayoutSuccess}
      />
    </div>
  );
}
