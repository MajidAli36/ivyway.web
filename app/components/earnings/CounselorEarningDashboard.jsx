"use client";

import React, { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import counselorEarningsService from "../../lib/api/counselorEarningsService";
import CounselorPayoutRequestModal from "../modals/CounselorPayoutRequestModal";

const CounselorEarningDashboard = () => {
  const [balance, setBalance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [balanceData, summaryData, earningsData, payoutsData] = await Promise.all([
        counselorEarningsService.getBalance(),
        counselorEarningsService.getEarningSummary(),
        counselorEarningsService.getEarningHistory({ limit: 10 }),
        counselorEarningsService.getPayoutHistory()
      ]);

      setBalance(balanceData);
      setSummary(summaryData);
      setEarnings(earningsData.data || []);
      setPayouts(payoutsData || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutSuccess = () => {
    loadDashboardData(); // Refresh data
    setShowPayoutModal(false);
  };

  const formatCurrency = (amount) => {
    return counselorEarningsService.formatCurrency(amount);
  };

  const getPayoutEligibility = () => {
    if (!balance) return { isEligible: false, minimumAmount: 1000 };
    return counselorEarningsService.getPayoutEligibility(balance.balance);
  };

  const eligibility = getPayoutEligibility();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your counseling income and manage payouts</p>
        </div>
        <button
          onClick={() => setShowPayoutModal(true)}
          disabled={!eligibility.isEligible}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Request Payout
        </button>
      </div>

      {/* Balance Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium mb-2">Available Balance</h2>
            <div className="text-4xl font-bold">
              {formatCurrency(balance?.balance || 0)}
            </div>
            <p className="text-blue-100 mt-1">
              Ready for payout
            </p>
          </div>
          <div className="text-right">
            <CurrencyDollarIcon className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        {!eligibility.isEligible && (
          <div className="mt-4 p-3 bg-blue-500 bg-opacity-50 rounded-lg">
            <p className="text-sm">
              Minimum payout: {formatCurrency(eligibility.minimumAmount)}. 
              You need {formatCurrency(eligibility.shortfall)} more to request a payout.
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-green-100 p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-600">Total Earnings</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.totalEarnings)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-600">This Month</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.thisMonthEarnings)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-yellow-100 p-3">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-600">Pending</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.pendingEarnings)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-purple-100 p-3">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5">
                <div className="text-sm font-medium text-gray-600">Paid Out</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(summary.paidEarnings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {[
              { name: "Overview", id: "overview", icon: ChartBarIcon },
              { name: "Recent Earnings", id: "earnings", icon: CurrencyDollarIcon },
              { name: "Payout History", id: "payouts", icon: ArrowDownTrayIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Monthly Earnings Chart */}
              {summary?.monthlyEarnings && summary.monthlyEarnings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Earnings Trend
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {summary.monthlyEarnings.slice(-4).map((month, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm text-gray-600">
                            {new Date(month.month).toLocaleDateString("en-US", {
                              month: "short",
                              year: "2-digit"
                            })}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency(month.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Earnings by Subject */}
              {summary?.earningsBySubject && summary.earningsBySubject.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Earnings by Subject
                  </h3>
                  <div className="space-y-3">
                    {summary.earningsBySubject.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{subject.subject}</span>
                        <span className="text-lg font-semibold text-blue-600">
                          {formatCurrency(subject.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Earnings Tab */}
          {activeTab === "earnings" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Earnings
              </h3>
              {earnings.length > 0 ? (
                <div className="space-y-3">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {earning.booking?.subject} - {earning.booking?.topic}
                          </div>
                          <div className="text-sm text-gray-600">
                            {earning.booking?.student?.name} • {new Date(earning.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          +{formatCurrency(earning.amount)}
                        </div>
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          earning.status === "available"
                            ? "bg-green-100 text-green-800"
                            : earning.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No earnings yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your earnings will appear here after completing counseling sessions.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Payout History Tab */}
          {activeTab === "payouts" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payout History
              </h3>
              {payouts.length > 0 ? (
                <div className="space-y-3">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payout.type.charAt(0).toUpperCase() + payout.type.slice(1)} Payout
                        </div>
                        <div className="text-sm text-gray-600">
                          Requested: {new Date(payout.requestedAt).toLocaleDateString()}
                          {payout.processedAt && (
                            <span> • Processed: {new Date(payout.processedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(payout.amount)}
                        </div>
                        {payout.fee > 0 && (
                          <div className="text-sm text-gray-500">
                            Fee: {formatCurrency(payout.fee)}
                          </div>
                        )}
                        <div className={`text-sm px-2 py-1 rounded-full ${
                          payout.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : payout.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : payout.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ArrowDownTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payout requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't made any payout requests yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payout Request Modal */}
      <CounselorPayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSuccess={handlePayoutSuccess}
        currentBalance={balance?.balance || 0}
      />
    </div>
  );
};

export default CounselorEarningDashboard;
