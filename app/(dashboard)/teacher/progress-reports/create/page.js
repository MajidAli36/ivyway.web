"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  progressReports,
  studentReferrals,
  mockTeacherData,
} from "@/app/lib/api/teacherService";

export default function CreateProgressReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    reportType: "academic",
    title: "",
    subject: "",
    topic: "",
    progressLevel: "good",
    academicPerformance: {
      homeworkCompletion: 0,
      testScores: 0,
      participation: 0,
    },
    skillsDeveloped: [],
    areasForImprovement: [],
    strengths: [],
    challenges: [],
    recommendations: "",
    nextSteps: "",
    parentNotes: "",
    teacherNotes: "",
    reportDate: new Date().toISOString().split("T")[0],
  });

  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await studentReferrals.getReferredStudents();
      // Ensure we always have an array
      const students = Array.isArray(response.data) ? response.data : [];
      setAvailableStudents(students);
    } catch (err) {
      console.log("Using mock data for development");
      setAvailableStudents(mockTeacherData.referrals || []);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (parentKey, childKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: parseInt(value) || 0,
      },
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Find the selected student details
      const selectedStudent = availableStudents.find(
        (student) => student.id === formData.studentId
      );

      const reportData = {
        ...formData,
        studentName: selectedStudent?.studentName || "N/A",
        gradeLevel: selectedStudent?.gradeLevel || "N/A",
        referralId: selectedStudent?.id,
        status: "draft",
      };

      await progressReports.create(reportData);
      router.push("/teacher/progress-reports");
    } catch (err) {
      console.error("Error creating progress report:", err);
      setError("Failed to create progress report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = Array.isArray(availableStudents)
    ? availableStudents.find((student) => student.id === formData.studentId)
    : null;

  const progressLevels = [
    { value: "excellent", label: "Excellent", color: "text-green-600" },
    { value: "good", label: "Good", color: "text-blue-600" },
    { value: "satisfactory", label: "Satisfactory", color: "text-yellow-600" },
    {
      value: "needs_improvement",
      label: "Needs Improvement",
      color: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Progress Report
            </h1>
            <p className="text-gray-600">
              Create a detailed progress report for a student.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XCircleIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <XCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Student Selection */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose a student...</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.studentName} - Grade {student.gradeLevel} -{" "}
                    {student.subjects?.join(", ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="academic">Academic</option>
                <option value="behavioral">Behavioral</option>
                <option value="attendance">Attendance</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Mathematics, Physics, etc."
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Monthly Progress Report - Calculus"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Topic */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Coverage *
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="e.g., Calculus - Derivatives and Applications"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Progress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Progress Level *
              </label>
              <select
                name="progressLevel"
                value={formData.progressLevel}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {progressLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Date *
              </label>
              <input
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Academic Performance */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Academic Performance (0-100%)
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Homework Completion
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.academicPerformance.homeworkCompletion}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "academicPerformance",
                      "homeworkCompletion",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Scores
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.academicPerformance.testScores}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "academicPerformance",
                      "testScores",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participation
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.academicPerformance.participation}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "academicPerformance",
                      "participation",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Skills and Areas */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Skills and Areas
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Developed (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsDeveloped.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange("skillsDeveloped", e.target.value)
                  }
                  placeholder="Problem-solving, Critical thinking, Mathematical reasoning"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.areasForImprovement.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "areasForImprovement",
                      e.target.value
                    )
                  }
                  placeholder="Time management, Complex problem breakdown"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strengths (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.strengths.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange("strengths", e.target.value)
                  }
                  placeholder="Strong conceptual understanding, Good work ethic"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenges (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.challenges.join(", ")}
                  onChange={(e) =>
                    handleArrayInputChange("challenges", e.target.value)
                  }
                  placeholder="Rushing through problems, Need for more practice"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Recommendations and Notes */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recommendations and Notes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations *
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Continue with current approach, add more practice problems..."
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Steps *
                </label>
                <textarea
                  name="nextSteps"
                  value={formData.nextSteps}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Focus on integration techniques next month..."
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Notes
                </label>
                <textarea
                  name="parentNotes"
                  value={formData.parentNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Student is making good progress, keep up the great work!"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Notes
                </label>
                <textarea
                  name="teacherNotes"
                  value={formData.teacherNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Student shows improvement in problem-solving approach..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Student Info Display */}
          {selectedStudent && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Selected Student Information
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-blue-700">Name:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Grade:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.gradeLevel}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Subjects:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.subjects?.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Goals:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.academicGoals}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Create Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
