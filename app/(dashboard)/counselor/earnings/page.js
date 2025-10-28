"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { counselorPayments, counselorBookings } from "@/app/lib/api/endpoints";
import counselorEarningsService from "@/app/lib/api/counselorEarningsService";
import CounselorPayoutRequestModal from "@/app/components/modals/CounselorPayoutRequestModal";
import StripeConnectStatus from "./components/StripeConnectStatus";
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import authService from "@/app/lib/auth/authService";

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


export default function CounselorEarningsPage() {
  const [earnings, setEarnings] = useState([]);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
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
  const [activeTab, setActiveTab] = useState("earnings");

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
        // Fetch earnings, balance, sessions, history, and payouts in parallel
        const [
          earningsResult,
          balanceResult,
          sessionsResult,
          counselorBalance,
          counselorSummary,
          earningsHistoryResult,
          payoutHistoryResult,
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
          counselorEarningsService.getEarningHistory(),
          counselorEarningsService.getPayoutHistory(),
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

        // Set earnings and payout history
        setEarningsHistory(earningsHistoryResult?.data || []);
        setPayoutHistory(payoutHistoryResult?.data || []);

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

        {/* Earnings History */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-100">
              <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                {[
                  {
                    name: "Earnings History",
                    id: "earnings",
                    count: earningsHistory.length,
                  },
                  {
                    name: "Payout Requests",
                    id: "payouts",
                    count: payoutHistory.length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.name}
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="divide-y divide-gray-200">
              {activeTab === "earnings" && (
                <div>
                  {earningsHistory.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No earnings history available
                    </div>
                  ) : (
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
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {earningsHistory.map((earning) => (
                            <tr key={earning.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(earning.createdAt || earning.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 mr-2" />
                                  {earning.description || earning.studentName || `Counseling Session ${earning.bookingId || earning.id}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${Number(earning.amount || earning.counselorEarnings || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                    earning.status === "available" || earning.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : earning.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : earning.status === "paid"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {earning.status ? earning.status.charAt(0).toUpperCase() + earning.status.slice(1) : "N/A"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "payouts" && (
                <div>
                  {payoutHistory.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-1">No payout requests</p>
                      <p className="text-sm">You haven't made any payout requests yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Requested Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Processed Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payoutHistory.map((payout) => (
                            <tr key={payout.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(payout.requestedAt || payout.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${parseFloat(payout.amount || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                                    payout.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : payout.status === "approved" || payout.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : payout.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {payout.status ? payout.status.charAt(0).toUpperCase() + payout.status.slice(1) : "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {payout.processedAt
                                  ? new Date(payout.processedAt).toLocaleDateString()
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
