"use client";

import { useState, useEffect } from "react";
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import adminTutorUpgradeService from "@/app/lib/api/adminTutorUpgradeService";

export default function ApplicationsList({ onViewApplication, onRefresh }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [sortField, setSortField] = useState("applicationDate");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    loadApplications();
  }, [filters]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminTutorUpgradeService.getApplications(filters);
      
      if (response.success) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Failed to load applications");
      }
    } catch (err) {
      console.error("Error loading applications:", err);
      setError(err.message || "An error occurred while loading applications");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query, page: 1 });
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadApplications();
    }, 30000);

    return () => clearInterval(interval);
  }, [filters]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId, checked) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, applicationId]);
    } else {
      setSelectedApplications(selectedApplications.filter(id => id !== applicationId));
    }
  };

  const handleBulkApprove = async () => {
    if (selectedApplications.length === 0) return;
    
    setBulkActionLoading(true);
    try {
      const response = await adminTutorUpgradeService.bulkReviewApplications({
        applicationIds: selectedApplications,
        status: 'approved',
        reviewNotes: 'Bulk approved by admin'
      });
      
      if (response.success) {
        setSelectedApplications([]);
        setShowBulkActions(false);
        await loadApplications();
        onRefresh?.();
      } else {
        setError(response.message || "Failed to approve applications");
      }
    } catch (err) {
      console.error("Error bulk approving applications:", err);
      setError(err.message || "An error occurred while approving applications");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedApplications.length === 0) return;
    
    setBulkActionLoading(true);
    try {
      const response = await adminTutorUpgradeService.bulkReviewApplications({
        applicationIds: selectedApplications,
        status: 'rejected',
        reviewNotes: 'Bulk rejected by admin',
        rejectionReason: 'admin_decision'
      });
      
      if (response.success) {
        setSelectedApplications([]);
        setShowBulkActions(false);
        await loadApplications();
        onRefresh?.();
      } else {
        setError(response.message || "Failed to reject applications");
      }
    } catch (err) {
      console.error("Error bulk rejecting applications:", err);
      setError(err.message || "An error occurred while rejecting applications");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await adminTutorUpgradeService.exportApplications({
        format: 'csv',
        status: filters.status
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tutor-upgrades-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting applications:", err);
      setError(err.message || "An error occurred while exporting applications");
    }
  };

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    setFilters({ ...filters, sort: field, direction: newDirection, page: 1 });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={loadApplications}
          className="mt-4 text-sm text-red-600 hover:text-red-500 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upgrade Applications
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-sm text-gray-500">
                {pagination.totalCount} total applications
              </p>
              {selectedApplications.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedApplications.length} selected
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {selectedApplications.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={bulkActionLoading}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Approve Selected
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={bulkActionLoading}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Reject Selected
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                Export
              </button>
              <button
                onClick={onRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="space-y-4">
          {/* Search and Date Range */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="text-gray-500 text-sm">to</span>
                <input
                  type="date"
                  placeholder="End Date"
                  onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            
            {/* Status and Page Size Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ status: "", page: 1, limit: 10 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedApplications.length === applications.length && applications.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('tutor.fullName')}
              >
                <div className="flex items-center">
                  Tutor
                  {sortField === 'tutor.fullName' && (
                    <ChevronDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    <ChevronDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th 
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('applicationDate')}
              >
                <div className="flex items-center">
                  Application Date
                  {sortField === 'applicationDate' && (
                    <ChevronDownIcon className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Subject Expertise
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Qualifications
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(application.id)}
                    onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {application.tutor?.fullName?.charAt(0) || "?"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.tutor?.fullName || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {application.tutor?.email || "No email"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(application.status)}
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(application.applicationDate)}
                </td>
                <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {application.subjectExpertise?.slice(0, 2).map((subject) => (
                      <span
                        key={subject}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                    {application.subjectExpertise?.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{application.subjectExpertise.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                  <div className="text-sm text-gray-900 truncate max-w-xs">
                    {application.qualifications?.collegeDegree || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {application.qualifications?.teachingExperience || "N/A"}
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onViewApplication(application.id)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center px-2 py-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to approve this application?')) {
                              handleBulkApprove([application.id]);
                            }
                          }}
                          className="text-green-600 hover:text-green-900 inline-flex items-center px-2 py-1 rounded hover:bg-green-50"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to reject this application?')) {
                              handleBulkReject([application.id]);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 inline-flex items-center px-2 py-1 rounded hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{" "}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalCount)}</span> of{" "}
              <span className="font-medium">{pagination.totalCount}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = pageNum === pagination.page;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isCurrentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {applications.length === 0 && !loading && (
        <div className="px-6 py-16 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ClockIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            {filters.status
              ? `No ${filters.status} applications found. Try adjusting your filters or search criteria.`
              : "No applications have been submitted yet. When tutors apply for upgrades, they will appear here."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSearchQuery("");
                setFilters({ status: "", page: 1, limit: 10 });
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
            <button
              onClick={loadApplications}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
