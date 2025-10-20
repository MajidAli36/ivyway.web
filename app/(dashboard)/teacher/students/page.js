"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  UserIcon,
  AcademicCapIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { studentReferrals } from "@/app/lib/api/teacherService";
import { toast } from "react-hot-toast";
import Link from "next/link";

const GRADE_LEVELS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "College/University",
  "Adult Education",
];

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Social Studies",
  "Economics",
  "Psychology",
  "Philosophy",
  "Literature",
  "Writing",
  "Reading",
];

const PARENT_RELATIONSHIPS = [
  "Mother",
  "Father",
  "Guardian",
  "Grandparent",
  "Aunt/Uncle",
  "Other",
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "enrolled", label: "Enrolled" },
];

export default function StudentReferrals() {
  const router = useRouter();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReferral, setEditingReferral] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
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
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    gradeLevel: "",
    subjects: [],
    academicGoals: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentRelationship: "",
    notes: "",
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
    loadReferrals();
  }, [filters.status, filters.search, pagination.page]);

  // Initial data load
  useEffect(() => {
    loadReferrals();
  }, []); // Only run once on mount

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await studentReferrals.getAll(params);
      setReferrals(response.data.referrals || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading referrals:", err);
      setError("Failed to load referrals");
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
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

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentName.trim()) {
      errors.studentName = "Student name is required";
    }

    if (formData.studentEmail && !/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      errors.studentEmail = "Please enter a valid email address";
    }

    if (!formData.gradeLevel) {
      errors.gradeLevel = "Grade level is required";
    }

    if (formData.subjects.length === 0) {
      errors.subjects = "At least one subject is required";
    }

    if (formData.parentEmail && !/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      errors.parentEmail = "Please enter a valid email address";
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

      if (editingReferral) {
        await studentReferrals.update(editingReferral.id, formData);
        toast.success("Referral updated successfully");
      } else {
        await studentReferrals.referStudent(formData);
        toast.success("Student referred successfully");
      }

      setShowCreateModal(false);
      setEditingReferral(null);
      resetForm();
      loadReferrals();
    } catch (err) {
      console.error("Error saving referral:", err);
      toast.error("Failed to save referral");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (referral) => {
    setEditingReferral(referral);
    setFormData({
      studentName: referral.studentName || "",
      studentEmail: referral.studentEmail || "",
      studentPhone: referral.studentPhone || "",
      gradeLevel: referral.gradeLevel || "",
      subjects: referral.subjects || [],
      academicGoals: referral.academicGoals || "",
      parentName: referral.parentName || "",
      parentEmail: referral.parentEmail || "",
      parentPhone: referral.parentPhone || "",
      parentRelationship: referral.parentRelationship || "",
      notes: referral.notes || "",
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (referralId) => {
    if (!confirm("Are you sure you want to delete this referral?")) {
      return;
    }

    try {
      await studentReferrals.delete(referralId);
      toast.success("Referral deleted successfully");
      loadReferrals();
    } catch (err) {
      console.error("Error deleting referral:", err);
      toast.error("Failed to delete referral");
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      studentEmail: "",
      studentPhone: "",
      gradeLevel: "",
      subjects: [],
      academicGoals: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      parentRelationship: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleCreateNew = () => {
    setEditingReferral(null);
    resetForm();
    setShowCreateModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "enrolled":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "enrolled":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && referrals.length === 0) {
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
              Student Referrals
            </h1>
            <p className="text-gray-600">
              Manage your student referrals and track their progress
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Refer New Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                placeholder="Search by name or email..."
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

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ status: "all", search: "" });
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

      {/* Referrals List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No referrals found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by referring your first student.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Refer New Student
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
                    Grade Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {referral.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.studentEmail || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.gradeLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {referral.subjects?.slice(0, 2).map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {subject}
                          </span>
                        ))}
                        {referral.subjects?.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{referral.subjects.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {getStatusIcon(referral.status)}
                        <span className="ml-1 capitalize">
                          {referral.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(referral.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(referral)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(referral.id)}
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
                    {editingReferral ? "Edit Referral" : "Refer New Student"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {editingReferral ? "Update student referral information" : "Add a new student to your referrals"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingReferral(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Student Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) =>
                          handleInputChange("studentName", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.studentName
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      />
                      {formErrors.studentName && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.studentName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Email
                      </label>
                      <input
                        type="email"
                        value={formData.studentEmail}
                        onChange={(e) =>
                          handleInputChange("studentEmail", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.studentEmail
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                      {formErrors.studentEmail && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.studentEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.studentPhone}
                        onChange={(e) =>
                          handleInputChange("studentPhone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade Level *
                      </label>
                      <select
                        value={formData.gradeLevel}
                        onChange={(e) =>
                          handleInputChange("gradeLevel", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.gradeLevel
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                        required
                      >
                        <option value="">Select grade level</option>
                        {GRADE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {formErrors.gradeLevel && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.gradeLevel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Subjects *
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {SUBJECTS.map((subject) => (
                        <label key={subject} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() =>
                              handleArrayChange("subjects", subject)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            {subject}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formErrors.subjects && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.subjects}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Goals
                    </label>
                    <textarea
                      value={formData.academicGoals}
                      onChange={(e) =>
                        handleInputChange("academicGoals", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                      placeholder="Describe the student's academic goals and areas of focus..."
                    />
                  </div>
                </div>

                {/* Parent/Guardian Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
                    Parent/Guardian Information
                  </h4>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(e) =>
                          handleInputChange("parentName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        value={formData.parentRelationship}
                        onChange={(e) =>
                          handleInputChange(
                            "parentRelationship",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      >
                        <option value="">Select relationship</option>
                        {PARENT_RELATIONSHIPS.map((relationship) => (
                          <option key={relationship} value={relationship}>
                            {relationship}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Email
                      </label>
                      <input
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) =>
                          handleInputChange("parentEmail", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          formErrors.parentEmail
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 bg-white"
                        }`}
                      />
                      {formErrors.parentEmail && (
                        <p className="mt-2 text-sm text-red-600">
                          {formErrors.parentEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.parentPhone}
                        onChange={(e) =>
                          handleInputChange("parentPhone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                      placeholder="Any additional information about the student..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingReferral(null);
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
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingReferral ? "Update Referral" : "Create Referral"}
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
