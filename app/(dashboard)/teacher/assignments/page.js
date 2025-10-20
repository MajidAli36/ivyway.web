"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  teacherAssignments,
  studentReferrals,
  providers,
} from "@/app/lib/api/teacherService";
import { toast } from "react-hot-toast";

const ASSIGNMENT_TYPES = [
  { value: "tutoring", label: "Tutoring" },
  { value: "counseling", label: "Counseling" },
];

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "as-needed", label: "As Needed" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const APPROVAL_STATUS_OPTIONS = [
  { value: "all", label: "All Approval Statuses" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function TeacherAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    approvalStatus: "all",
    assignmentType: "all",
    search: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // Separate state for immediate UI updates
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    studentReferralId: "",
    providerId: "",
    assignmentType: "",
    frequency: "",
    startDate: "",
    endDate: "",
    sessionDuration: 60,
    goals: "",
    specialInstructions: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Debounced search with useRef to prevent re-renders
  const searchTimeoutRef = useRef(null);
  
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    // Update searchTerm immediately for UI
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Update filters.search after debounce for API calls
    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
    }, 300);
  }, []);

  // Load data when filters or pagination change
  useEffect(() => {
    loadData();
  }, [filters.status, filters.approvalStatus, filters.assignmentType, filters.search, pagination.page]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, []); // Only run once on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadAssignments(), loadStudents(), loadProviders()]);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.approvalStatus !== "all" && {
          approvalStatus: filters.approvalStatus,
        }),
        ...(filters.assignmentType !== "all" && {
          assignmentType: filters.assignmentType,
        }),
        ...(filters.search && { search: filters.search }),
      };

      console.log("Loading assignments with params:", params);
      const response = await teacherAssignments.getTeacherAssignments(params);
      console.log("Assignments response:", response);

      // Handle backend response structure: { success, message, data: { assignments, pagination } }
      const assignments =
        response.data?.assignments || response.assignments || [];
      const paginationData =
        response.data?.pagination || response.pagination || {};

      setAssignments(assignments);
      setPagination((prev) => ({
        ...prev,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading assignments:", err);

      // If assignments fail to load, show empty state instead of throwing
      if (err.status === 404) {
        console.warn("Assignments endpoint not found, showing empty state");
        setAssignments([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          totalPages: 0,
        }));
        return;
      }

      throw err;
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentReferrals.getAll({ status: "approved" });
      // Handle backend response structure: { success, message, data: { referrals } }
      const referrals = response.data?.referrals || response.referrals || [];
      setStudents(referrals);
    } catch (err) {
      console.error("Error loading students:", err);
      throw err;
    }
  };

  const loadProviders = async () => {
    try {
      const response = await providers.getAll();
      console.log("Provider API Response:", response);

      // Handle the specific API response structure with tutors and counselors arrays
      let providersList = [];

      if (Array.isArray(response.data)) {
        providersList = response.data;
      } else if (Array.isArray(response.data?.providers)) {
        providersList = response.data.providers;
      } else if (Array.isArray(response.data?.items)) {
        providersList = response.data.items;
      } else if (response.data?.tutors || response.data?.counselors) {
        // Handle the specific structure: { tutors: [...], counselors: [...] }
        const tutors = (response.data.tutors || []).map((tutor) => ({
          ...tutor,
          role: tutor.role || "tutor",
          firstName:
            tutor.firstName || tutor.fullName?.split(" ")[0] || "Unknown",
          lastName:
            tutor.lastName ||
            tutor.fullName?.split(" ").slice(1).join(" ") ||
            "",
        }));
        const counselors = (response.data.counselors || []).map(
          (counselor) => ({
            ...counselor,
            role: counselor.role || "counselor",
            firstName:
              counselor.firstName ||
              counselor.fullName?.split(" ")[0] ||
              "Unknown",
            lastName:
              counselor.lastName ||
              counselor.fullName?.split(" ").slice(1).join(" ") ||
              "",
          })
        );
        providersList = [...tutors, ...counselors];
      }

      console.log("Processed providers list:", providersList);
      setAvailableProviders(providersList);
    } catch (err) {
      console.error("Error loading providers:", err);
      throw err;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentReferralId) {
      errors.studentReferralId = "Student is required";
    }

    if (!formData.providerId) {
      errors.providerId = "Provider is required";
    }

    if (!formData.assignmentType) {
      errors.assignmentType = "Assignment type is required";
    }

    if (!formData.frequency) {
      errors.frequency = "Frequency is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (formData.sessionDuration < 15 || formData.sessionDuration > 480) {
      errors.sessionDuration =
        "Session duration must be between 15 and 480 minutes";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setSubmitting(true);

      // Format dates properly for the backend
      const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        // Convert YYYY-MM-DD to ISO timestamp
        const date = new Date(dateString + "T00:00:00.000Z");
        return date.toISOString();
      };

      const assignmentData = {
        ...formData,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
      };

      // Validate that required fields are present
      if (!assignmentData.studentReferralId) {
        throw new Error("Student is required");
      }
      if (!assignmentData.providerId) {
        throw new Error("Provider is required");
      }
      if (!assignmentData.assignmentType) {
        throw new Error("Assignment type is required");
      }
      if (!assignmentData.frequency) {
        throw new Error("Frequency is required");
      }
      if (!assignmentData.startDate) {
        throw new Error("Start date is required");
      }

      console.log("Sending assignment data:", assignmentData);

      if (editingAssignment) {
        await teacherAssignments.update(editingAssignment.id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        await teacherAssignments.assignProvider(assignmentData);
        toast.success("Assignment created successfully");
      }

      setShowCreateModal(false);
      setEditingAssignment(null);
      resetForm();
      loadAssignments();
    } catch (err) {
      console.error("Error saving assignment:", err);

      // Better error handling with more specific messages
      let errorMessage = "Failed to save assignment";

      if (err.status === 400) {
        errorMessage = "Invalid data provided. Please check all fields.";
      } else if (err.status === 401) {
        errorMessage = "Authentication required. Please log in again.";
      } else if (err.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (err.status === 404) {
        errorMessage = "Student or provider not found.";
      } else if (err.status === 409) {
        errorMessage =
          "Assignment already exists for this student and provider.";
      } else if (err.status === 422) {
        errorMessage = "Validation error. Please check your input.";
      } else if (err.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      } else if (
        err.name === "TypeError" &&
        err.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.isCorsError) {
        errorMessage = "CORS error. Please contact the administrator.";
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      studentReferralId: assignment.studentReferralId || "",
      providerId: assignment.providerId || "",
      assignmentType: assignment.assignmentType || "",
      frequency: assignment.frequency || "",
      startDate: assignment.startDate ? assignment.startDate.split("T")[0] : "",
      endDate: assignment.endDate ? assignment.endDate.split("T")[0] : "",
      sessionDuration: assignment.sessionDuration || 60,
      goals: assignment.goals || "",
      specialInstructions: assignment.specialInstructions || "",
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return;
    }

    try {
      await teacherAssignments.delete(assignmentId);
      toast.success("Assignment deleted successfully");
      loadAssignments();
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Failed to delete assignment");
    }
  };

  const resetForm = () => {
    setFormData({
      studentReferralId: "",
      providerId: "",
      assignmentType: "",
      frequency: "",
      startDate: "",
      endDate: "",
      sessionDuration: 60,
      goals: "",
      specialInstructions: "",
    });
    setFormErrors({});
  };

  const handleCreateNew = () => {
    setEditingAssignment(null);
    resetForm();
    setShowCreateModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStudentName = (studentReferralId) => {
    const student = students.find((s) => s.id === studentReferralId);
    return student ? student.studentName : "Unknown Student";
  };

  const getProviderName = (providerId) => {
    const provider = availableProviders.find((p) => p.id === providerId);
    return provider ? provider.fullName : "Unknown Provider";
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Teacher Assignments
            </h1>
            <p className="text-gray-600">
              Manage assignments between students and providers
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                placeholder="Search assignments..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Approval Status
            </label>
            <select
              value={filters.approvalStatus}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  approvalStatus: e.target.value,
                }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
            >
              {APPROVAL_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assignment Type
            </label>
            <select
              value={filters.assignmentType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  assignmentType: e.target.value,
                }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
            >
              <option value="all">All Types</option>
              {ASSIGNMENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({
                  status: "all",
                  approvalStatus: "all",
                  assignmentType: "all",
                  search: "",
                });
                setSearchTerm(""); // Reset search term display
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No assignments found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first assignment.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Assignment
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getStudentName(assignment.studentReferralId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <AcademicCapIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {getProviderName(assignment.providerId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {assignment.assignmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          assignment.status
                        )}`}
                      >
                        {getStatusIcon(assignment.status)}
                        <span className="ml-1 capitalize">
                          {assignment.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(
                          assignment.adminApprovalStatus
                        )}`}
                      >
                        <span className="capitalize">
                          {assignment.adminApprovalStatus}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(assignment.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {Math.min(
                      (pagination.page - 1) * pagination.limit + 1,
                      pagination.total
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-0 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl rounded-2xl bg-white border border-gray-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingAssignment
                      ? "Edit Assignment"
                      : "Create New Assignment"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {editingAssignment ? "Update assignment details" : "Create a new assignment for a student"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAssignment(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student and Provider Selection */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Assignment Details
                  </h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student *
                      </label>
                      <select
                        value={formData.studentReferralId}
                        onChange={(e) =>
                          handleInputChange("studentReferralId", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.studentReferralId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.studentName} - {student.gradeLevel}
                          </option>
                        ))}
                      </select>
                      {formErrors.studentReferralId && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.studentReferralId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provider *
                      </label>
                      <select
                        value={formData.providerId}
                        onChange={(e) =>
                          handleInputChange("providerId", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.providerId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      >
                        <option value="">Select a provider</option>
                        {availableProviders.map((provider) => (
                          <option key={provider.id} value={provider.id}>
                            {provider.fullName} - {provider.role}
                          </option>
                        ))}
                      </select>
                      {formErrors.providerId && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.providerId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Type *
                      </label>
                      <select
                        value={formData.assignmentType}
                        onChange={(e) =>
                          handleInputChange("assignmentType", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.assignmentType
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      >
                        <option value="">Select assignment type</option>
                        {ASSIGNMENT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.assignmentType && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.assignmentType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) =>
                          handleInputChange("frequency", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.frequency
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      >
                        <option value="">Select frequency</option>
                        {FREQUENCY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formErrors.frequency && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.frequency}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dates and Duration */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Schedule & Duration
                  </h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.startDate
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      />
                      {formErrors.startDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="480"
                        value={formData.sessionDuration}
                        onChange={(e) =>
                          handleInputChange(
                            "sessionDuration",
                            parseInt(e.target.value)
                          )
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.sessionDuration
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      />
                      {formErrors.sessionDuration && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.sessionDuration}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Goals and Instructions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Goals & Instructions
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Goals
                      </label>
                      <textarea
                        value={formData.goals}
                        onChange={(e) => handleInputChange("goals", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                        placeholder="Describe the goals for this assignment..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={formData.specialInstructions}
                        onChange={(e) =>
                          handleInputChange("specialInstructions", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                        placeholder="Any special instructions for the provider..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingAssignment(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingAssignment ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingAssignment ? "Update Assignment" : "Create Assignment"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
