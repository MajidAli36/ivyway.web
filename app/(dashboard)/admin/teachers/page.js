"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { adminTeachers } from "@/app/lib/api/teacherService";
import { toast } from "react-hot-toast";

const VERIFICATION_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const REFERRAL_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "enrolled", label: "Enrolled" },
];

const ASSIGNMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminTeacherManagement() {
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("teachers");
  const [filters, setFilters] = useState({
    verificationStatus: "all",
    search: "",
  });
  const [referralFilters, setReferralFilters] = useState({
    status: "all",
    search: "",
  });
  const [assignmentFilters, setAssignmentFilters] = useState({
    status: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "teachers") {
      loadTeachers();
    } else if (activeTab === "referrals") {
      loadReferrals();
    } else if (activeTab === "assignments") {
      loadAssignments();
    }
  }, [activeTab, filters, referralFilters, assignmentFilters, pagination.page]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminTeachers.getDashboardStats();
      setDashboardStats(response.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.verificationStatus !== "all" && {
          verificationStatus: filters.verificationStatus,
        }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await adminTeachers.getAll(params);
      setTeachers(response.data.teachers || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading teachers:", err);
      throw err;
    }
  };

  const loadReferrals = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(referralFilters.status !== "all" && {
          status: referralFilters.status,
        }),
        ...(referralFilters.search && { search: referralFilters.search }),
      };

      const response = await adminTeachers.getReferrals(params);
      setReferrals(response.data.referrals || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading referrals:", err);
      throw err;
    }
  };

  const loadAssignments = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(assignmentFilters.status !== "all" && {
          status: assignmentFilters.status,
        }),
        ...(assignmentFilters.search && { search: assignmentFilters.search }),
      };

      const response = await adminTeachers.getAssignments(params);
      setAssignments(response.data.assignments || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading assignments:", err);
      throw err;
    }
  };

  const handleApproveTeacher = async (teacherId) => {
    try {
      await adminTeachers.approve(teacherId, approvalNotes);
      toast.success("Teacher approved successfully");
      setShowTeacherModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadTeachers();
    } catch (err) {
      console.error("Error approving teacher:", err);
      toast.error("Failed to approve teacher");
    }
  };

  const handleRejectTeacher = async (teacherId) => {
    try {
      await adminTeachers.reject(teacherId, approvalNotes);
      toast.success("Teacher rejected successfully");
      setShowTeacherModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadTeachers();
    } catch (err) {
      console.error("Error rejecting teacher:", err);
      toast.error("Failed to reject teacher");
    }
  };

  const handleApproveReferral = async (referralId) => {
    try {
      await adminTeachers.approveReferral(referralId, approvalNotes);
      toast.success("Referral approved successfully");
      setShowReferralModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadReferrals();
    } catch (err) {
      console.error("Error approving referral:", err);
      toast.error("Failed to approve referral");
    }
  };

  const handleRejectReferral = async (referralId) => {
    try {
      await adminTeachers.rejectReferral(referralId, approvalNotes);
      toast.success("Referral rejected successfully");
      setShowReferralModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadReferrals();
    } catch (err) {
      console.error("Error rejecting referral:", err);
      toast.error("Failed to reject referral");
    }
  };

  const handleApproveAssignment = async (assignmentId) => {
    try {
      await adminTeachers.approveAssignment(assignmentId, approvalNotes);
      toast.success("Assignment approved successfully");
      setShowAssignmentModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadAssignments();
    } catch (err) {
      console.error("Error approving assignment:", err);
      toast.error("Failed to approve assignment");
    }
  };

  const handleRejectAssignment = async (assignmentId) => {
    try {
      await adminTeachers.rejectAssignment(assignmentId, approvalNotes);
      toast.success("Assignment rejected successfully");
      setShowAssignmentModal(false);
      setSelectedItem(null);
      setApprovalNotes("");
      loadAssignments();
    } catch (err) {
      console.error("Error rejecting assignment:", err);
      toast.error("Failed to reject assignment");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && !dashboardStats) {
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
              Teacher Management
            </h1>
            <p className="text-gray-600">
              Manage teacher profiles, referrals, and assignments
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-md bg-blue-500">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Teachers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.teachers?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-md bg-yellow-500">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Teachers
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.teachers?.pending || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-md bg-green-500">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Referrals
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.referrals?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-md bg-purple-500">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Assignments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardStats.assignments?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("teachers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "teachers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Teachers
            </button>
            <button
              onClick={() => setActiveTab("referrals")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "referrals"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Referrals
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "assignments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Assignments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Teachers Tab */}
          {activeTab === "teachers" && (
            <>
              {/* Teachers Filters */}
              <div className="mb-6">
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
                        value={filters.search}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                        placeholder="Search teachers..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Verification Status
                    </label>
                    <select
                      value={filters.verificationStatus}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          verificationStatus: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
                    >
                      {VERIFICATION_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilters({ verificationStatus: "all", search: "" });
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

              {/* Teachers List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserGroupIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {teacher.fullName || 
                                 (teacher.firstName && teacher.lastName ? `${teacher.firstName} ${teacher.lastName}` : null) ||
                                 teacher.name || 
                                 "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {teacher.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.schoolName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              teacher.verificationStatus
                            )}`}
                          >
                            {getStatusIcon(teacher.verificationStatus)}
                            <span className="ml-1 capitalize">
                              {teacher.verificationStatus}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {teacher.totalReferrals || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(teacher.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => {
                                setSelectedItem(teacher);
                                setShowTeacherModal(true);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {teacher.verificationStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedItem(teacher);
                                    setShowTeacherModal(true);
                                  }}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(teacher);
                                    setShowTeacherModal(true);
                                  }}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
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
            </>
          )}

          {/* Referrals Tab */}
          {activeTab === "referrals" && (
            <>
              {/* Referrals Filters */}
              <div className="mb-6">
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
                        value={referralFilters.search}
                        onChange={(e) =>
                          setReferralFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                        placeholder="Search referrals..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={referralFilters.status}
                      onChange={(e) =>
                        setReferralFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
                    >
                      {REFERRAL_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setReferralFilters({ status: "all", search: "" });
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
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
                          {referral.teacher?.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.gradeLevel}
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
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => {
                                setSelectedItem(referral);
                                setShowReferralModal(true);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {referral.status === "pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedItem(referral);
                                    setShowReferralModal(true);
                                  }}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(referral);
                                    setShowReferralModal(true);
                                  }}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
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
            </>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <>
              {/* Assignments Filters */}
              <div className="mb-6">
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
                        value={assignmentFilters.search}
                        onChange={(e) =>
                          setAssignmentFilters((prev) => ({
                            ...prev,
                            search: e.target.value,
                          }))
                        }
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
                      value={assignmentFilters.status}
                      onChange={(e) =>
                        setAssignmentFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white shadow-sm"
                    >
                      {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setAssignmentFilters({ status: "all", search: "" });
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
                        Created
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
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.studentReferral?.studentName || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.provider?.fullName || "N/A"}
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
                              assignment.adminApprovalStatus
                            )}`}
                          >
                            {getStatusIcon(assignment.adminApprovalStatus)}
                            <span className="ml-1 capitalize">
                              {assignment.adminApprovalStatus}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(assignment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(assignment);
                                setShowAssignmentModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {assignment.adminApprovalStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedItem(assignment);
                                    setShowAssignmentModal(true);
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedItem(assignment);
                                    setShowAssignmentModal(true);
                                  }}
                                  className="text-red-600 hover:text-red-900"
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
            </>
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
      </div>

      {/* Approval Modals */}
      {showTeacherModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Teacher Approval
                </h3>
                <button
                  onClick={() => {
                    setShowTeacherModal(false);
                    setSelectedItem(null);
                    setApprovalNotes("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    {selectedItem.fullName}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedItem.email}</p>
                  <p className="text-sm text-gray-600">
                    {selectedItem.schoolName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approval Notes
                  </label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add notes about the approval decision..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowTeacherModal(false);
                      setSelectedItem(null);
                      setApprovalNotes("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectTeacher(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveTeacher(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReferralModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Referral Approval
                </h3>
                <button
                  onClick={() => {
                    setShowReferralModal(false);
                    setSelectedItem(null);
                    setApprovalNotes("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    {selectedItem.studentName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedItem.studentEmail || "No email"}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {selectedItem.status}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approval Notes
                  </label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add notes about the approval decision..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowReferralModal(false);
                      setSelectedItem(null);
                      setApprovalNotes("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectReferral(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveReferral(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAssignmentModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Assignment Approval
                </h3>
                <button
                  onClick={() => {
                    setShowAssignmentModal(false);
                    setSelectedItem(null);
                    setApprovalNotes("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    {selectedItem.studentReferral?.studentName || "N/A"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Provider: {selectedItem.provider?.fullName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Type: {selectedItem.assignmentType}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approval Notes
                  </label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add notes about the approval decision..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAssignmentModal(false);
                      setSelectedItem(null);
                      setApprovalNotes("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectAssignment(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveAssignment(selectedItem.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
