"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  progressReports,
  studentReferrals,
  teacherAssignments,
} from "@/app/lib/api/teacherService";
import { toast } from "react-hot-toast";

const REPORT_TYPES = [
  { value: "academic", label: "Academic Progress" },
  { value: "behavioral", label: "Behavioral" },
  { value: "attendance", label: "Attendance" },
  { value: "general", label: "General" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewed", label: "Reviewed" },
];

const GRADE_OPTIONS = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
];

export default function ProgressReports() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    reportType: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    studentReferralId: "",
    assignmentId: "",
    reportType: "",
    title: "",
    content: "",
    academicProgress: {
      subjects: [],
      grades: {},
      improvements: [],
      challenges: [],
    },
    behavioralNotes: "",
    attendanceData: {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      tardyDays: 0,
      notes: "",
    },
    recommendations: "",
    nextSteps: "",
    attachments: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadReports(), loadStudents(), loadAssignments()]);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.reportType !== "all" && { reportType: filters.reportType }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await progressReports.getAll(params);
      setReports(response.data.reports || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0,
      }));
    } catch (err) {
      console.error("Error loading reports:", err);
      throw err;
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentReferrals.getAll({ status: "approved" });
      setStudents(response.data.referrals || []);
    } catch (err) {
      console.error("Error loading students:", err);
      throw err;
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await teacherAssignments.getTeacherAssignments({
        status: "active",
      });
      setAssignments(response.data.assignments || []);
    } catch (err) {
      console.error("Error loading assignments:", err);
      throw err;
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].includes(value)
            ? prev[parent][child].filter((item) => item !== value)
            : [...prev[parent][child], value],
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      }));
    }
  };

  const handleGradeChange = (subject, grade) => {
    setFormData((prev) => ({
      ...prev,
      academicProgress: {
        ...prev.academicProgress,
        grades: {
          ...prev.academicProgress.grades,
          [subject]: grade,
        },
      },
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentReferralId) {
      errors.studentReferralId = "Student is required";
    }

    if (!formData.reportType) {
      errors.reportType = "Report type is required";
    }

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (
      formData.reportType === "academic" &&
      formData.academicProgress.subjects.length === 0
    ) {
      errors.academicSubjects =
        "At least one subject is required for academic reports";
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

      if (editingReport) {
        await progressReports.update(editingReport.id, formData);
        toast.success("Report updated successfully");
      } else {
        await progressReports.create(formData);
        toast.success("Report created successfully");
      }

      setShowCreateModal(false);
      setEditingReport(null);
      resetForm();
      loadReports();
    } catch (err) {
      console.error("Error saving report:", err);
      toast.error("Failed to save report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      studentReferralId: report.studentReferralId || "",
      assignmentId: report.assignmentId || "",
      reportType: report.reportType || "",
      title: report.title || "",
      content: report.content || "",
      academicProgress: report.academicProgress || {
        subjects: [],
        grades: {},
        improvements: [],
        challenges: [],
      },
      behavioralNotes: report.behavioralNotes || "",
      attendanceData: report.attendanceData || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        tardyDays: 0,
        notes: "",
      },
      recommendations: report.recommendations || "",
      nextSteps: report.nextSteps || "",
      attachments: report.attachments || [],
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await progressReports.delete(reportId);
      toast.success("Report deleted successfully");
      loadReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("Failed to delete report");
    }
  };

  const handleSubmitReport = async (reportId) => {
    try {
      await progressReports.submit(reportId);
      toast.success("Report submitted successfully");
      loadReports();
    } catch (err) {
      console.error("Error submitting report:", err);
      toast.error("Failed to submit report");
    }
  };

  const resetForm = () => {
    setFormData({
      studentReferralId: "",
      assignmentId: "",
      reportType: "",
      title: "",
      content: "",
      academicProgress: {
        subjects: [],
        grades: {},
        improvements: [],
        challenges: [],
      },
      behavioralNotes: "",
      attendanceData: {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        tardyDays: 0,
        notes: "",
      },
      recommendations: "",
      nextSteps: "",
      attachments: [],
    });
    setFormErrors({});
  };

  const handleCreateNew = () => {
    setEditingReport(null);
    resetForm();
    setShowCreateModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "reviewed":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case "draft":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "draft":
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

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    return assignment
      ? `${assignment.assignmentType} - ${assignment.frequency}`
      : "No Assignment";
  };

  if (loading && reports.length === 0) {
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
              Progress Reports
            </h1>
            <p className="text-gray-600">
              Create and manage student progress reports
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search reports..."
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
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, reportType: e.target.value }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              {REPORT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ status: "all", reportType: "all", search: "" });
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

      {/* Reports List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No reports found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first progress report.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Report
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getAssignmentTitle(report.assignmentId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getStudentName(report.studentReferralId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {report.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.status === "draft" && (
                          <button
                            onClick={() => handleSubmitReport(report.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Submit Report"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(report)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingReport ? "Edit Report" : "Create New Report"}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingReport(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Student *
                    </label>
                    <select
                      value={formData.studentReferralId}
                      onChange={(e) =>
                        handleInputChange("studentReferralId", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        formErrors.studentReferralId
                          ? "border-red-300"
                          : "border-gray-300"
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
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.studentReferralId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Assignment
                    </label>
                    <select
                      value={formData.assignmentId}
                      onChange={(e) =>
                        handleInputChange("assignmentId", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select an assignment (optional)</option>
                      {assignments.map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.assignmentType} - {assignment.frequency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Report Type *
                    </label>
                    <select
                      value={formData.reportType}
                      onChange={(e) =>
                        handleInputChange("reportType", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        formErrors.reportType
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select report type</option>
                      {REPORT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.reportType && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.reportType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        formErrors.title ? "border-red-300" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    rows={4}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.content ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Describe the student's progress and any observations..."
                    required
                  />
                  {formErrors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                {/* Academic Progress Section */}
                {formData.reportType === "academic" && (
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Academic Progress
                    </h4>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subjects *
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {[
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
                        ].map((subject) => (
                          <label key={subject} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.academicProgress.subjects.includes(
                                subject
                              )}
                              onChange={() =>
                                handleArrayChange(
                                  "academicProgress.subjects",
                                  subject
                                )
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {subject}
                            </span>
                          </label>
                        ))}
                      </div>
                      {formErrors.academicSubjects && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.academicSubjects}
                        </p>
                      )}
                    </div>

                    {/* Grades for selected subjects */}
                    {formData.academicProgress.subjects.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grades
                        </label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {formData.academicProgress.subjects.map((subject) => (
                            <div
                              key={subject}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-700">
                                {subject}
                              </span>
                              <select
                                value={
                                  formData.academicProgress.grades[subject] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleGradeChange(subject, e.target.value)
                                }
                                className="ml-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              >
                                <option value="">Select grade</option>
                                {GRADE_OPTIONS.map((grade) => (
                                  <option key={grade} value={grade}>
                                    {grade}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Improvements
                        </label>
                        <textarea
                          value={formData.academicProgress.improvements.join(
                            "\n"
                          )}
                          onChange={(e) =>
                            handleInputChange(
                              "academicProgress.improvements",
                              e.target.value
                                .split("\n")
                                .filter((item) => item.trim())
                            )
                          }
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="List areas of improvement..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Challenges
                        </label>
                        <textarea
                          value={formData.academicProgress.challenges.join(
                            "\n"
                          )}
                          onChange={(e) =>
                            handleInputChange(
                              "academicProgress.challenges",
                              e.target.value
                                .split("\n")
                                .filter((item) => item.trim())
                            )
                          }
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="List areas that need attention..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Behavioral Notes Section */}
                {formData.reportType === "behavioral" && (
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Behavioral Notes
                    </h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Behavioral Observations
                      </label>
                      <textarea
                        value={formData.behavioralNotes}
                        onChange={(e) =>
                          handleInputChange("behavioralNotes", e.target.value)
                        }
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Describe the student's behavior, interactions, and any concerns..."
                      />
                    </div>
                  </div>
                )}

                {/* Attendance Data Section */}
                {formData.reportType === "attendance" && (
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Attendance Data
                    </h4>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Total Days
                        </label>
                        <input
                          type="number"
                          value={formData.attendanceData.totalDays}
                          onChange={(e) =>
                            handleInputChange(
                              "attendanceData.totalDays",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Present Days
                        </label>
                        <input
                          type="number"
                          value={formData.attendanceData.presentDays}
                          onChange={(e) =>
                            handleInputChange(
                              "attendanceData.presentDays",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Absent Days
                        </label>
                        <input
                          type="number"
                          value={formData.attendanceData.absentDays}
                          onChange={(e) =>
                            handleInputChange(
                              "attendanceData.absentDays",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tardy Days
                        </label>
                        <input
                          type="number"
                          value={formData.attendanceData.tardyDays}
                          onChange={(e) =>
                            handleInputChange(
                              "attendanceData.tardyDays",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Attendance Notes
                      </label>
                      <textarea
                        value={formData.attendanceData.notes}
                        onChange={(e) =>
                          handleInputChange(
                            "attendanceData.notes",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Additional notes about attendance patterns..."
                      />
                    </div>
                  </div>
                )}

                {/* Recommendations and Next Steps */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    Recommendations & Next Steps
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Recommendations
                      </label>
                      <textarea
                        value={formData.recommendations}
                        onChange={(e) =>
                          handleInputChange("recommendations", e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Recommendations for the student's continued progress..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Next Steps
                      </label>
                      <textarea
                        value={formData.nextSteps}
                        onChange={(e) =>
                          handleInputChange("nextSteps", e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Specific next steps or action items..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingReport(null);
                      resetForm();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingReport
                      ? "Update Report"
                      : "Create Report"}
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
