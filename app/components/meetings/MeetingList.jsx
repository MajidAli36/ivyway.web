"use client";

import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";
import MeetingCard from "./MeetingCard";
import MeetingErrorBoundary from "./MeetingErrorBoundary";
import MeetingLoadingState from "./MeetingLoadingState";
import { zoomService } from "../../lib/api/zoomService";

const statusFilters = [
  { value: "all", label: "All Meetings" },
  { value: "scheduled", label: "Scheduled" },
  { value: "started", label: "In Progress" },
  { value: "ended", label: "Completed" },
  { value: "cancelled", label: "Cancelled" }
];

const sortOptions = [
  { value: "startTime-asc", label: "Start Time (Earliest First)" },
  { value: "startTime-desc", label: "Start Time (Latest First)" },
  { value: "createdAt-desc", label: "Recently Created" },
  { value: "status", label: "Status" }
];

export default function MeetingList({ 
  userId, 
  userRole, 
  initialMeetings = [], 
  onMeetingUpdate,
  onMeetingDelete,
  showFilters = true,
  showSearch = true,
  limit = 10
}) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("startTime-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Fetch meetings
  const fetchMeetings = async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      let response;
      if (userRole === "counselor") {
        response = await zoomService.getCounselorMeetings(userId, params);
      } else if (userRole === "student") {
        response = await zoomService.getStudentMeetings(userId, params);
      } else {
        throw new Error("Invalid user role");
      }

      if (response && response.meetings) {
        setMeetings(response.meetings);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
      } else {
        setMeetings([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again.");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (userId && userRole) {
      fetchMeetings();
    }
  }, [userId, userRole]);

  // Apply filters and search
  const applyFilters = () => {
    const filters = {};
    
    if (statusFilter !== "all") {
      filters.status = statusFilter;
    }
    
    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    setCurrentPage(1);
    fetchMeetings(1, filters);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "sort") {
      setSortBy(value);
    }
    
    // Auto-apply filters
    setTimeout(() => {
      applyFilters();
    }, 100);
  };

  // Sort meetings
  const sortMeetings = (meetingsList) => {
    if (!sortBy || sortBy === "startTime-asc") {
      return meetingsList.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (sortBy === "startTime-desc") {
      return meetingsList.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sortBy === "createdAt-desc") {
      return meetingsList.sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime));
    } else if (sortBy === "status") {
      return meetingsList.sort((a, b) => a.status.localeCompare(b.status));
    }
    return meetingsList;
  };

  // Filter meetings by search term
  const filterBySearch = (meetingsList) => {
    if (!searchTerm.trim()) return meetingsList;
    
    const term = searchTerm.toLowerCase();
    return meetingsList.filter(meeting => 
      (meeting.topic && meeting.topic.toLowerCase().includes(term)) ||
      (meeting.counselor?.name && meeting.counselor.name.toLowerCase().includes(term)) ||
      (meeting.student?.name && meeting.student.name.toLowerCase().includes(term)) ||
      (meeting.serviceType && meeting.serviceType.toLowerCase().includes(term))
    );
  };

  // Get filtered and sorted meetings
  const filteredMeetings = sortMeetings(filterBySearch(meetings));

  // Handle meeting updates
  const handleMeetingUpdate = (updatedMeeting) => {
    if (onMeetingUpdate) {
      onMeetingUpdate(updatedMeeting);
    }
    // Refresh the list
    fetchMeetings(currentPage);
  };

  const handleMeetingDelete = (meetingId) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    if (onMeetingDelete) {
      onMeetingDelete(meetingId);
    }
  };

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMeetings(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing {meetings.length} of {totalPages * limit} meetings
        </div>
        <div className="flex space-x-2">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Previous
            </button>
          )}
          {pages}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MeetingErrorBoundary onRetry={() => fetchMeetings(currentPage)}>
      <div className="space-y-6">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            {showSearch && (
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusFilters.map(filter => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <FunnelIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <MeetingLoadingState 
          type="list" 
          message="Loading meetings..." 
          showSkeleton={true}
        />
      )}

      {/* Error State */}
      {error && (
        <MeetingErrorBoundary onRetry={() => fetchMeetings(currentPage)}>
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">
              <VideoCameraIcon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => fetchMeetings(currentPage)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </MeetingErrorBoundary>
      )}

      {/* Meetings List */}
      {!loading && !error && (
        <>
          {filteredMeetings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "You don't have any meetings scheduled yet"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  userRole={userRole}
                  onUpdate={handleMeetingUpdate}
                  onDelete={handleMeetingDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {renderPagination()}
        </>
      )}
      </div>
    </MeetingErrorBoundary>
  );
}
