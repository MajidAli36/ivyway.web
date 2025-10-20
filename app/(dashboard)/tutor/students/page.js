"use client";

import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  AcademicCapIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import tutorStudentsService from "@/app/lib/api/tutorStudentsService";
import StudentDetailsModal from "./components/StudentDetailsModal";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    subject: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [pagination.currentPage, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      };

      const response = await tutorStudentsService.getMyStudents(params);

      if (response.success) {
        setStudents(response.data.students);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getProgramLabel = (program) => {
    const labels = {
      undergraduate: "Undergraduate",
      graduate: "Graduate",
      phd: "PhD",
      other: "Other",
    };
    return labels[program] || program;
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow h-80 flex flex-col"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-3 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="mt-4">
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="mt-2 text-gray-600">
            View and manage students who have scheduled sessions with you
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sessions</option>
                <option value="completed">Completed Sessions</option>
                <option value="upcoming">Upcoming Sessions</option>
                <option value="cancelled">Cancelled Sessions</option>
              </select>

              {/* Subject Filter */}
              <input
                type="text"
                placeholder="Filter by subject..."
                value={filters.subject || ""}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Search Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((studentData) => (
            <div
              key={studentData.studentId}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex flex-col h-96"
            >
              {/* Student Header */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {studentData.student.fullName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {studentData.student.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getStatusBadge(studentData.student.isActive)}
                  </div>
                </div>

                {/* Session Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs font-medium text-blue-900">Total Sessions</p>
                    <p className="text-lg font-bold text-blue-700">{studentData.totalSessions}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs font-medium text-green-900">Completed</p>
                    <p className="text-lg font-bold text-green-700">{studentData.completedSessions}</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <p className="text-xs font-medium text-yellow-900">Upcoming</p>
                    <p className="text-lg font-bold text-yellow-700">{studentData.upcomingSessions}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <p className="text-xs font-medium text-purple-900">Earnings</p>
                    <p className="text-lg font-bold text-purple-700">${studentData.totalEarnings.toFixed(2)}</p>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <AcademicCapIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">
                      {studentData.student.gradeLevel || "Grade not specified"}
                    </span>
                  </div>
                  {studentData.student.school && (
                    <div className="flex items-center text-xs text-gray-600">
                      <AcademicCapIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">
                        {studentData.student.school}
                      </span>
                    </div>
                  )}
                  {studentData.averageRating && (
                    <div className="flex items-center text-xs text-gray-600">
                      <AcademicCapIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span>Rating: {studentData.averageRating}/5.0</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info & Subjects */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <EnvelopeIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{studentData.student.email}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <CalendarIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span>First session: {formatDate(studentData.firstSessionDate)}</span>
                  </div>
                  {studentData.subjects && studentData.subjects.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Subjects:</p>
                      <div className="flex flex-wrap gap-1">
                        {studentData.subjects.slice(0, 3).map((subject, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {subject}
                          </span>
                        ))}
                        {studentData.subjects.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{studentData.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button - Fixed at bottom */}
                <div className="mt-4 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(studentData)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-sm"
                  >
                    <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No students found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.status || filters.subject
                ? "Try adjusting your search criteria."
                : "You don't have any students with scheduled sessions yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentsPage;
