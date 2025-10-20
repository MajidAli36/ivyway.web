"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { counselorPayments, counselorBookings } from "@/app/lib/api/endpoints";
import counselorEarningsService from "@/app/lib/api/counselorEarningsService";
import CounselorPayoutRequestModal from "@/app/components/modals/CounselorPayoutRequestModal";
import StripeConnectStatus from "./components/StripeConnectStatus";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import authService from "@/app/lib/auth/authService";

// Earnings Chart Component
const EarningsChart = ({ earningsData, timeRange }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (earningsData && earningsData.length > 0) {
      // Group earnings by date and calculate totals
      const grouped = earningsData.reduce((acc, earning) => {
        const date = new Date(earning.date || earning.createdAt)
          .toISOString()
          .split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, amount: 0, sessions: 0 };
        }
        acc[date].amount += earning.amount || 0;
        acc[date].sessions += 1;
        return acc;
      }, {});

      const sortedData = Object.values(grouped)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7); // Last 7 days

      setChartData(sortedData);
    }
  }, [earningsData]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Trend</h3>
      <div className="h-64 flex items-end space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${(data.amount / maxAmount) * 200}px` }}
              title={`$${data.amount} - ${data.sessions} sessions`}
            />
            <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
              {new Date(data.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Last 7 days earnings
      </div>
    </div>
  );
};

// Earnings Summary Component
const EarningsSummary = ({
  totalEarnings,
  thisMonthEarnings,
  lastMonthEarnings,
  totalSessions,
}) => {
  const monthlyChange =
    lastMonthEarnings > 0
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${thisMonthEarnings.toFixed(2)}
            </p>
            <div className="flex items-center mt-1">
              {monthlyChange >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  monthlyChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(monthlyChange).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-8 w-8 text-purple-500" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Sessions</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totalSessions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Earnings List Component
const EarningsList = ({ earnings, loading }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Earnings</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {earnings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No earnings data available
          </div>
        ) : (
          earnings.map((earning) => (
            <div key={earning.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Session with {earning.studentName || "Student"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(earning.date || earning.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      earning.status
                    )}`}
                  >
                    {earning.status}
                  </span>
                  <p className="text-lg font-semibold text-gray-900">
                    ${earning.amount || earning.counselorEarnings || 0}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function CounselorEarningsPage() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState("30days");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [balanceCents, setBalanceCents] = useState(0);
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    totalSessions: 0,
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

  // Fetch earnings data
  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!authService.isAuthenticated()) {
        console.warn("User not authenticated, can't fetch earnings data");
        return;
      }

      setLoading(true);

      try {
        // Fetch earnings, balance, and sessions in parallel
        const [
          earningsResult,
          balanceResult,
          sessionsResult,
          counselorBalance,
          counselorSummary,
        ] = await Promise.all([
          safeApiCall(
            () =>
              counselorPayments.getHistory({
                page: 1,
                limit: 100,
                timeRange: timeRange,
              }),
            {
              extractArray: true,
              dataKey: "data",
              defaultData: [],
              errorMessage: "Failed to load earnings data",
            }
          ),
          safeApiCall(() => counselorPayments.getBalance(), {
            extractData: true,
            dataKey: "data",
            defaultData: { balance: 0 },
            errorMessage: "Failed to load balance data",
          }),
          safeApiCall(
            () =>
              counselorBookings.getCounselorSessions({
                page: 1,
                limit: 100,
                status: "completed",
              }),
            {
              extractArray: true,
              dataKey: "data",
              defaultData: [],
              errorMessage: "Failed to load sessions data",
            }
          ),
          // Counselor balance with cents via counselorEarningsService
          counselorEarningsService.getBalance(),
          counselorEarningsService.getEarningSummary(),
        ]);

        const earningsData = ensureArray(
          earningsResult.success ? earningsResult.data : []
        );
        const sessionsData = ensureArray(
          sessionsResult.success ? sessionsResult.data : []
        );
        const balanceData = balanceResult.success
          ? balanceResult.data
          : { balance: 0 };

        // Set counselor balance in cents for payout eligibility/modal
        const counselorBalanceCents =
          typeof counselorBalance?.balance === "number"
            ? counselorBalance.balance
            : 0;
        setBalanceCents(counselorBalanceCents);

        if (counselorSummary) {
          setSummary(counselorSummary);
        }

        console.log("Earnings data:", earningsData);
        console.log("Balance data:", balanceData);
        console.log("Sessions data:", sessionsData);

        // Calculate stats
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const thisMonthEarnings = earningsData
          .filter((e) => {
            const earningDate = new Date(e.date || e.createdAt);
            return (
              earningDate.getMonth() === thisMonth &&
              earningDate.getFullYear() === thisYear
            );
          })
          .reduce(
            (sum, e) => sum + parseFloat(e.amount || e.counselorEarnings || 0),
            0
          );

        const lastMonthEarnings = earningsData
          .filter((e) => {
            const earningDate = new Date(e.date || e.createdAt);
            return (
              earningDate.getMonth() === lastMonth &&
              earningDate.getFullYear() === lastYear
            );
          })
          .reduce(
            (sum, e) => sum + parseFloat(e.amount || e.counselorEarnings || 0),
            0
          );

        // Use balance from API or calculate from earnings data
        const totalEarnings =
          balanceData.balance ||
          earningsData.reduce(
            (sum, e) => sum + parseFloat(e.amount || e.counselorEarnings || 0),
            0
          );

        const newStats = {
          totalEarnings,
          thisMonthEarnings,
          lastMonthEarnings,
          totalSessions: sessionsData.length,
        };

        console.log("Calculated stats:", newStats);

        setEarnings(earningsData);
        setStats(newStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching earnings data:", err);
        setError("Failed to load earnings data");

        // Use mock data for demonstration
        const mockEarnings = [
          {
            id: "1",
            amount: 30,
            status: "completed",
            studentName: "Emma Davis",
            date: new Date().toISOString(),
            counselorEarnings: 30,
          },
          {
            id: "2",
            amount: 40,
            status: "completed",
            studentName: "Michael Chen",
            date: new Date(Date.now() - 86400000).toISOString(),
            counselorEarnings: 40,
          },
          {
            id: "3",
            amount: 20,
            status: "completed",
            studentName: "Sophie Martinez",
            date: new Date(Date.now() - 172800000).toISOString(),
            counselorEarnings: 20,
          },
        ];

        console.log("Using mock data fallback");
        setEarnings(mockEarnings);
        setStats({
          totalEarnings: 90,
          thisMonthEarnings: 90,
          lastMonthEarnings: 0,
          totalSessions: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [timeRange]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Authentication Required
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to view your earnings.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Chart.js options and data (match tutor layout)
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

  const monthlyChartData = summary
    ? {
        labels: (summary.monthlyEarnings || []).map((m) =>
          new Date(m.month).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          })
        ),
        datasets: [
          {
            label: "Monthly Earnings ($)",
            data: (summary.monthlyEarnings || []).map((m) => m.total),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 4,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const subjectChartData = summary
    ? {
        labels: (summary.earningsBySubject || []).map((s) => s.subject),
        datasets: [
          {
            label: "Subject Earnings ($)",
            data: (summary.earningsBySubject || []).map((s) => s.total),
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

  const earningsStats = summary
    ? [
        {
          title: "Available Balance",
          value: `$${Number(summary.availableBalance || 0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-6 w-6 text-green-600" />,
          bgColor: "bg-green-100",
        },
        {
          title: "Total Earnings",
          value: `$${Number(summary.totalEarnings || 0).toFixed(2)}`,
          icon: <CalendarIcon className="h-6 w-6 text-blue-600" />,
          bgColor: "bg-blue-100",
        },
        {
          title: "This Month",
          value: `$${Number(summary.thisMonthEarnings || 0).toFixed(2)}`,
          icon: <DocumentTextIcon className="h-6 w-6 text-purple-600" />,
          bgColor: "bg-purple-100",
        },
        {
          title: "Pending Earnings",
          value: `$${Number(summary.pendingEarnings || 0).toFixed(2)}`,
          icon: <BanknotesIcon className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-100",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stripe Connect Status */}
        <StripeConnectStatus />
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/counselor"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Track your counseling session earnings and performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Request Payout */}
              <button
                onClick={() => setShowPayoutModal(true)}
                disabled={
                  !counselorEarningsService.getPayoutEligibility(balanceCents)
                    .isEligible
                }
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Request Payout
              </button>
              <Link
                href="/counselor/earnings/history"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                View History
              </Link>
              {/* Time Range Selector */}
              <div className="flex">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Summary (Cards like tutor) */}
        <div className="px-4 py-6 sm:px-0">
          {earningsStats.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {earningsStats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl overflow-hidden shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-full ${stat.bgColor} p-3`}
                      >
                        {stat.icon}
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </div>
                        <div className="text-2xl font-semibold text-gray-900 mt-1">
                          {stat.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts Row (match tutor layout) */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>

        {/* Earnings List */}
        <div className="px-4 py-6 sm:px-0">
          <EarningsList earnings={earnings} loading={loading} />
        </div>

        {/* Payout Request Modal */}
        <CounselorPayoutRequestModal
          isOpen={showPayoutModal}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={() => {
            // Refresh balance and stats after successful payout request
            counselorEarningsService
              .getBalance()
              .then((b) => setBalanceCents(b?.balance || 0));
          }}
          currentBalance={balanceCents}
        />
      </div>
    </div>
  );
}
