"use client";

import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import API from "../../../lib/api/apiService";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState("requestedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processingPayout, setProcessingPayout] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await API.getAdminPayouts();
      setPayouts(response.data || []);
    } catch (err) {
      console.error("Error fetching payouts:", err);
      setError("Failed to load payout requests");
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
      let valueA, valueB;
      if (sortBy === "requestedAt") {
        valueA = a.requestedAt;
        valueB = b.requestedAt;
      } else if (sortBy === "userEmail") {
        valueA = a.requestUser?.email?.toLowerCase() || "";
        valueB = b.requestUser?.email?.toLowerCase() || "";
      } else if (sortBy === "status") {
        valueA = a.status;
        valueB = b.status;
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
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
    return data.filter((payout) => {
      // Status filter
      if (filters.status !== "all" && payout.status !== filters.status) {
        return false;
      }
      // Date range filter
      if (filters.dateRange !== "all") {
        const payoutDate = new Date(payout.requestedAt);
        const now = new Date();
        const daysDiff = Math.floor((now - payoutDate) / (1000 * 60 * 60 * 24));
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
        const userEmail = (payout.requestUser?.email || "").toLowerCase();
        if (!userEmail.includes(searchTerm)) {
          return false;
        }
      }
      return true;
    });
  };

  const handleApprove = async (payoutId) => {
    if (!confirm("Are you sure you want to approve this payout request?")) {
      return;
    }

    setProcessingPayout(payoutId);
    try {
      await API.approvePayout(payoutId);
      await fetchPayouts(); // Refresh data
      alert("Payout approved successfully!");
    } catch (err) {
      console.error("Error approving payout:", err);
      alert("Failed to approve payout: " + API.handleError(err));
    } finally {
      setProcessingPayout(null);
    }
  };

  const handleReject = async (payoutId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    setProcessingPayout(payoutId);
    try {
      await API.rejectPayout(payoutId);
      await fetchPayouts(); // Refresh data
      alert("Payout rejected successfully!");
    } catch (err) {
      console.error("Error rejecting payout:", err);
      alert("Failed to reject payout: " + API.handleError(err));
    } finally {
      setProcessingPayout(null);
    }
  };

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setShowDetailsModal(true);
  };

  const filteredPayouts = getFilteredData(payouts);
  const sortedPayouts = getSortedData(filteredPayouts);

  // Calculate stats
  const stats = {
    total: payouts.length,
    pending: payouts.filter((p) => p.status === "pending").length,
    approved: payouts.filter((p) => p.status === "approved").length,
    rejected: payouts.filter((p) => p.status === "rejected").length,
    totalAmount: payouts.reduce((sum, p) => sum + parseFloat(p.amount), 0),
    pendingAmount: payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0),
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
          onClick={fetchPayouts}
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payout Management
          </h1>
          <p className="text-gray-600 mt-1">
            Review and process payout requests
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-blue-100 p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-600">
                  Pending Requests
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-500">
                  ${stats.pendingAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-green-100 p-3">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-600">
                  Approved
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.approved}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-red-100 p-3">
                <XMarkIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-600">
                  Rejected
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.rejected}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-purple-100 p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-600">
                  Total Amount
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${stats.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                  <option value="pending">Pending</option>
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
                  placeholder="Search by name or email..."
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

        {/* Table */}
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
                  onClick={() => handleSort("userEmail")}
                >
                  <div className="flex items-center">
                    User
                    <SortIcon column="userEmail" />
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No payout requests found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your filters or check back later.
                      <br />
                      <span className="text-xs text-gray-400">
                        Loaded payouts: {payouts.length}
                      </span>
                    </p>
                  </td>
                </tr>
              ) : (
                sortedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payout.requestedAt
                        ? new Date(payout.requestedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                          {payout.requestUser?.email
                            ? payout.requestUser.email.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payout.requestUser?.fullName ||
                              payout.requestUser?.email ||
                              "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payout.requestUser?.email || "No email"}
                          </div>
                        </div>
                      </div>
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
                            : payout.status === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payout.status
                          ? payout.status.charAt(0).toUpperCase() +
                            payout.status.slice(1)
                          : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(payout)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {payout.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(payout.id)}
                              disabled={processingPayout === payout.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(payout.id)}
                              disabled={processingPayout === payout.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Details Modal */}
      {showDetailsModal && selectedPayout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetailsModal(false)}
            />

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payout Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      User
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayout.requestUser?.email || "Unknown User"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      ${parseFloat(selectedPayout.amount).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <span
                      className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        selectedPayout.requestUser?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedPayout.requestUser?.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedPayout.requestUser?.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedPayout.requestUser?.status
                        ? selectedPayout.requestUser.status
                            .charAt(0)
                            .toUpperCase() +
                          selectedPayout.requestUser.status.slice(1)
                        : "-"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Requested Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayout.requestUser?.requestedAt
                        ? new Date(
                            selectedPayout.requestUser.requestedAt
                          ).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  {selectedPayout.processedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Processed Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedPayout.processedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedPayout.reason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Reason
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayout.reason}
                      </p>
                    </div>
                  )}
                </div>

                {selectedPayout.requestUser?.status === "pending" && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => handleReject(selectedPayout.id)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedPayout.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
