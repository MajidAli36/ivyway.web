"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { adminService, mockAdminData } from "@/app/lib/api/adminService";

export default function PendingApprovals() {
  const router = useRouter();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    status: "pending",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApprovals();
  }, [filters]);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getApprovals(filters);
      
      if (response.success) {
        setApprovals(response.data.approvals || []);
        setPagination({
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          currentPage: response.data.currentPage || 1
        });
      } else {
        throw new Error(response.message || "Failed to load approvals");
      }
    } catch (err) {
      console.error("Error loading approvals:", err);
      setError(err.message);
      
      // Fallback to mock data for development
      console.log("Using mock data for development");
      setApprovals(mockAdminData.approvals);
      setPagination({
        total: mockAdminData.approvals.length,
        totalPages: 1,
        currentPage: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (approval) => {
    setSelectedApproval(approval);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      const response = await adminService.approveItem(selectedApproval.id, {
        notes: "Approved by admin"
      });
      
      if (response.success) {
        // Remove from list or update status
        setApprovals(prev => prev.filter(approval => approval.id !== selectedApproval.id));
        closeModal();
        alert(`Successfully approved: ${selectedApproval.title} for ${selectedApproval.user}`);
      } else {
        throw new Error(response.message || "Failed to approve");
      }
    } catch (err) {
      console.error("Error approving item:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      setProcessing(true);
      const response = await adminService.rejectItem(selectedApproval.id, {
        reason: reason
      });
      
      if (response.success) {
        // Remove from list or update status
        setApprovals(prev => prev.filter(approval => approval.id !== selectedApproval.id));
        closeModal();
        alert(`Successfully rejected: ${selectedApproval.title} for ${selectedApproval.user}`);
      } else {
        throw new Error(response.message || "Failed to reject");
      }
    } catch (err) {
      console.error("Error rejecting item:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleTypeFilter = (type) => {
    setFilters(prev => ({ ...prev, type, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getApprovalTypeOptions = () => {
    const types = [...new Set(approvals.map(approval => approval.type))];
    return [
      { value: "all", label: "All Types" },
      ...types.map(type => ({
        value: type,
        label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
    ];
  };

  if (loading && approvals.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center mr-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.total} total approvals
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Approvals
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearch}
                placeholder="Search by user, type, or details..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {getApprovalTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Status</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: "", type: "all", status: "pending", page: 1, limit: 10 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={loadApprovals}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {approvals.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {approvals.map((approval) => (
              <li
                key={approval.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                      {approval.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-700">
                        {approval.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {approval.user} • {approval.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-3 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                      approval.status === 'pending' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : approval.status === 'approved'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {approval.status?.charAt(0).toUpperCase() + approval.status?.slice(1)}
                    </span>
                    <button
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => openModal(approval)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-600">No approvals found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{" "}
              {Math.min(pagination.currentPage * filters.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md">
                {pagination.currentPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  {selectedApproval.title}
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={closeModal}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium text-lg">
                    {selectedApproval.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-slate-800">
                      {selectedApproval.user}
                    </p>
                    <p className="text-sm text-slate-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        {selectedApproval.status}
                      </span>
                      <span className="ml-2">{selectedApproval.time}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-slate-600 mb-3">
                    {selectedApproval.details}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-slate-500">Email:</div>
                      <div className="text-slate-800">
                        {selectedApproval.userEmail}
                      </div>

                      <div className="text-slate-500">Type:</div>
                      <div className="text-slate-800">
                        {selectedApproval.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>

                      <div className="text-slate-500">Created:</div>
                      <div className="text-slate-800">
                        {new Date(selectedApproval.createdAt).toLocaleString()}
                      </div>

                      {/* Dynamic metadata based on approval type */}
                      {selectedApproval.metadata && Object.entries(selectedApproval.metadata).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <div className="text-slate-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </div>
                          <div className="text-slate-800">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  onClick={closeModal}
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 flex items-center bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleReject}
                  disabled={processing}
                >
                  <XCircleIcon className="h-5 w-5 mr-1" />
                  {processing ? "Processing..." : "Reject"}
                </button>
                <button
                  className="px-4 py-2 flex items-center bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleApprove}
                  disabled={processing}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-1" />
                  {processing ? "Processing..." : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
