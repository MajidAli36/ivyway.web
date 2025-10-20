"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { adminService, mockAdminData } from "@/app/lib/api/adminService";

export default function RecentActivities() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getActivities(filters);
      
      if (response.success) {
        setActivities(response.data.activities || []);
        setPagination({
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          currentPage: response.data.currentPage || 1
        });
      } else {
        throw new Error(response.message || "Failed to load activities");
      }
    } catch (err) {
      console.error("Error loading activities:", err);
      setError(err.message);
      
      // Fallback to mock data for development
      console.log("Using mock data for development");
      setActivities(mockAdminData.activities);
      setPagination({
        total: mockAdminData.activities.length,
        totalPages: 1,
        currentPage: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleTypeFilter = (type) => {
    setFilters(prev => ({ ...prev, type, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getActivityTypeOptions = () => {
    const types = [...new Set(activities.map(activity => activity.type))];
    return [
      { value: "all", label: "All Types" },
      ...types.map(type => ({
        value: type,
        label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
    ];
  };

  if (loading && activities.length === 0) {
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
          <h1 className="text-2xl font-bold text-slate-800">Recent Activities</h1>
        </div>
        <div className="text-sm text-gray-500">
          {pagination.total} total activities
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Activities
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearch}
                placeholder="Search by user, event, or details..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {getActivityTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: "", type: "all", page: 1, limit: 10 })}
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
            onClick={loadActivities}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {activities.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-medium">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-700">
                        {activity.event}
                      </p>
                      <p className="text-sm text-slate-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => openModal(activity)}
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-600">No activities found</p>
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
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  {selectedActivity.event}
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
                    {selectedActivity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-slate-800">
                      {selectedActivity.user}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedActivity.time}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-slate-600 mb-3">
                    {selectedActivity.details}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-slate-500">Email:</div>
                      <div className="text-slate-800">
                        {selectedActivity.userEmail}
                      </div>

                      <div className="text-slate-500">Type:</div>
                      <div className="text-slate-800">
                        {selectedActivity.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>

                      <div className="text-slate-500">Created:</div>
                      <div className="text-slate-800">
                        {new Date(selectedActivity.createdAt).toLocaleString()}
                      </div>

                      {/* Dynamic metadata based on activity type */}
                      {selectedActivity.metadata && Object.entries(selectedActivity.metadata).map(([key, value]) => (
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

              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
