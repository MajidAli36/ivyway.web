"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import API from "../../../../lib/api/apiService";

export default function EarningsHistoryPage() {
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("earnings");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch earnings history
      const earningsResponse = await API.getEarningsHistory();
      setEarningsHistory(earningsResponse.data || []);

      // Fetch payout history
      const payoutsResponse = await API.getPayoutHistory();
      setPayoutHistory(payoutsResponse.data || []);
    } catch (err) {
      console.error("Error fetching history data:", err);
      setError("Failed to load history data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return (
        <ChevronUpIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      );
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-blue-600" />
    );
  };

  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle different types
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      } else if (sortBy === "createdAt" || sortBy === "requestedAt") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredData = (data) => {
    return data.filter((item) => {
      // Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const itemDate = new Date(item.createdAt || item.requestedAt);
        const now = new Date();
        const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case "7days":
            if (daysDiff > 7) return false;
            break;
          case "30days":
            if (daysDiff > 30) return false;
            break;
          case "3months":
            if (daysDiff > 90) return false;
            break;
          default:
            break;
        }
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const description = (item.description || "").toLowerCase();
        const bookingId = (item.bookingId || "").toLowerCase();

        if (
          !description.includes(searchTerm) &&
          !bookingId.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const EarningsTable = ({ earnings }) => {
    const filteredEarnings = getFilteredData(earnings);
    const sortedEarnings = getSortedData(filteredEarnings);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="createdAt" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("description")}
              >
                <div className="flex items-center">
                  Description
                  <SortIcon column="description" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEarnings.map((earning) => (
              <tr key={earning.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(earning.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                    {earning.description || `Session ${earning.bookingId}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${Number(earning.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                      earning.status === "available"
                        ? "bg-green-100 text-green-800"
                        : earning.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : earning.status === "paid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {earning.status.charAt(0).toUpperCase() +
                      earning.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedEarnings.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No earnings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or complete more sessions.
            </p>
          </div>
        )}
      </div>
    );
  };

  const PayoutsTable = ({ payouts }) => {
    const filteredPayouts = getFilteredData(payouts);
    const sortedPayouts = getSortedData(filteredPayouts);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("requestedAt")}
              >
                <div className="flex items-center">
                  Requested Date
                  <SortIcon column="requestedAt" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Processed Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPayouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payout.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${parseFloat(payout.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                      payout.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : payout.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : payout.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {payout.status.charAt(0).toUpperCase() +
                      payout.status.slice(1)}
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
        {sortedPayouts.length === 0 && (
          <div className="text-center py-12">
            <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No payout requests
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any payout requests yet.
            </p>
          </div>
        )}
      </div>
    );
  };

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
          onClick={fetchHistoryData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/tutor/earnings"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Earnings
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings History
            </h1>
            <p className="text-gray-600 mt-1">
              View your complete earnings and payout history
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            {[
              {
                name: "Earnings",
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

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">
                  Status:
                </span>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">
                  Date Range:
                </span>
                <select
                  value={filters.dateRange}
                  onChange={(e) =>
                    setFilters({ ...filters, dateRange: e.target.value })
                  }
                  className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-200 rounded-lg py-2 px-3 w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="px-6 py-4">
          {activeTab === "earnings" && (
            <EarningsTable earnings={earningsHistory} />
          )}
          {activeTab === "payouts" && <PayoutsTable payouts={payoutHistory} />}
        </div>
      </div>
    </div>
  );
}
