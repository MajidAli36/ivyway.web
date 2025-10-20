"use client";

import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ProgressReports = ({ 
  studentId, 
  studentName, 
  onSaveReport, 
  onUpdateReport, 
  onDeleteReport 
}) => {
  const [reports, setReports] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for progress reports
  const mockReports = [
    {
      id: "report_001",
      studentId: "student_001",
      studentName: "Emma Davis",
      reportType: "weekly",
      subject: "Mathematics",
      topic: "Calculus Derivatives",
      progressLevel: "good",
      academicPerformance: {
        testScores: [85, 90, 88],
        homeworkCompletion: 95,
        participation: "excellent"
      },
      skillsDeveloped: ["Problem solving", "Critical thinking", "Mathematical reasoning"],
      areasForImprovement: ["Time management", "Complex problem breakdown"],
      strengths: "Quick learner, asks insightful questions, shows strong analytical thinking",
      challenges: "Sometimes rushes through problems, needs to show more work",
      recommendations: "Continue with current approach, focus on showing all steps in problem solving",
      nextSteps: "Move to integration techniques, practice more word problems",
      parentNotes: "Student is making great progress and seems more confident",
      teacherNotes: "Internal notes for teacher reference",
      reportDate: "2024-01-15",
      createdBy: "Dr. Sarah Johnson",
      createdByRole: "tutor",
      status: "published"
    },
    {
      id: "report_002",
      studentId: "student_001",
      studentName: "Emma Davis",
      reportType: "monthly",
      subject: "Physics",
      topic: "Mechanics",
      progressLevel: "excellent",
      academicPerformance: {
        testScores: [92, 88, 95],
        homeworkCompletion: 100,
        participation: "excellent"
      },
      skillsDeveloped: ["Conceptual understanding", "Problem solving", "Lab skills"],
      areasForImprovement: ["Mathematical applications"],
      strengths: "Excellent conceptual understanding, great lab work",
      challenges: "Sometimes struggles with mathematical applications",
      recommendations: "Focus on connecting concepts to mathematical formulas",
      nextSteps: "Continue with current topics, add more practice problems",
      parentNotes: "Student loves the hands-on approach",
      teacherNotes: "Internal notes for teacher reference",
      reportDate: "2024-01-10",
      createdBy: "Dr. Sarah Johnson",
      createdByRole: "tutor",
      status: "draft"
    }
  ];

  useEffect(() => {
    // Simulate loading reports
    setIsLoading(true);
    setTimeout(() => {
      setReports(mockReports);
      setIsLoading(false);
    }, 1000);
  }, [studentId]);

  const handleCreateReport = () => {
    setSelectedReport(null);
    setShowCreateModal(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setShowEditModal(true);
  };

  const handleDeleteReport = async (reportId) => {
    if (confirm("Are you sure you want to delete this report?")) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(prev => prev.filter(r => r.id !== reportId));
      if (onDeleteReport) onDeleteReport(reportId);
    }
  };

  const getProgressLevelColor = (level) => {
    switch (level) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-blue-600 bg-blue-100";
      case "fair": return "text-yellow-600 bg-yellow-100";
      case "needs_improvement": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "text-green-600 bg-green-100";
      case "draft": return "text-yellow-600 bg-yellow-100";
      case "archived": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Reports</h2>
          <p className="text-gray-600">Track and manage student progress reports</p>
        </div>
        <button
          onClick={handleCreateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Report
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center p-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">Create your first progress report to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.subject} - {report.topic}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProgressLevelColor(report.progressLevel)}`}>
                        {report.progressLevel.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {report.reportType} report • {new Date(report.reportDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Created by {report.createdBy} ({report.createdByRole})
                    </p>
                    
                    {/* Report Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Test Scores</h4>
                        <p className="text-sm text-gray-600">
                          {report.academicPerformance.testScores.join(", ")} 
                          (Avg: {Math.round(report.academicPerformance.testScores.reduce((a, b) => a + b, 0) / report.academicPerformance.testScores.length)})
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Homework</h4>
                        <p className="text-sm text-gray-600">
                          {report.academicPerformance.homeworkCompletion}% completion
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Participation</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {report.academicPerformance.participation}
                        </p>
                      </div>
                    </div>

                    {/* Skills and Areas for Improvement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Skills Developed</h4>
                        <div className="flex flex-wrap gap-1">
                          {report.skillsDeveloped.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Areas for Improvement</h4>
                        <div className="flex flex-wrap gap-1">
                          {report.areasForImprovement.map((area, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                      <p className="text-sm text-gray-600 mb-2">{report.recommendations}</p>
                      <h4 className="font-medium text-gray-800 mb-2">Next Steps</h4>
                      <p className="text-sm text-gray-600">{report.nextSteps}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditReport(report)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Report Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <ProgressReportForm
                report={selectedReport}
                studentId={studentId}
                studentName={studentName}
                onSave={(reportData) => {
                  if (selectedReport) {
                    setReports(prev => prev.map(r => r.id === selectedReport.id ? reportData : r));
                    if (onUpdateReport) onUpdateReport(reportData);
                  } else {
                    setReports(prev => [...prev, reportData]);
                    if (onSaveReport) onSaveReport(reportData);
                  }
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedReport(null);
                }}
                onCancel={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setSelectedReport(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Report Form Component
const ProgressReportForm = ({ report, studentId, studentName, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    reportType: report?.reportType || "weekly",
    subject: report?.subject || "",
    topic: report?.topic || "",
    progressLevel: report?.progressLevel || "good",
    testScores: report?.academicPerformance?.testScores?.join(", ") || "",
    homeworkCompletion: report?.academicPerformance?.homeworkCompletion || "",
    participation: report?.academicPerformance?.participation || "excellent",
    skillsDeveloped: report?.skillsDeveloped?.join(", ") || "",
    areasForImprovement: report?.areasForImprovement?.join(", ") || "",
    strengths: report?.strengths || "",
    challenges: report?.challenges || "",
    recommendations: report?.recommendations || "",
    nextSteps: report?.nextSteps || "",
    parentNotes: report?.parentNotes || "",
    teacherNotes: report?.teacherNotes || "",
    reportDate: report?.reportDate || new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = {
        id: report?.id || `report_${Date.now()}`,
        studentId,
        studentName,
        ...formData,
        academicPerformance: {
          testScores: formData.testScores.split(',').map(score => parseInt(score.trim())).filter(score => !isNaN(score)),
          homeworkCompletion: parseInt(formData.homeworkCompletion),
          participation: formData.participation
        },
        skillsDeveloped: formData.skillsDeveloped.split(',').map(skill => skill.trim()).filter(skill => skill),
        areasForImprovement: formData.areasForImprovement.split(',').map(area => area.trim()).filter(area => area),
        createdBy: "Current User", // In real app, get from auth
        createdByRole: "tutor", // In real app, get from auth
        status: "draft"
      };

      onSave(reportData);
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {report ? "Edit Progress Report" : "Create Progress Report"} for {studentName}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({...formData, reportType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Date
            </label>
            <input
              type="date"
              value={formData.reportDate}
              onChange={(e) => setFormData({...formData, reportDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Progress Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["excellent", "good", "fair", "needs_improvement"].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="progressLevel"
                  value={level}
                  checked={formData.progressLevel === level}
                  onChange={(e) => setFormData({...formData, progressLevel: e.target.value})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">{level.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Scores (comma-separated)
            </label>
            <input
              type="text"
              value={formData.testScores}
              onChange={(e) => setFormData({...formData, testScores: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="85, 90, 88"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Homework Completion (%)
            </label>
            <input
              type="number"
              value={formData.homeworkCompletion}
              onChange={(e) => setFormData({...formData, homeworkCompletion: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participation
            </label>
            <select
              value={formData.participation}
              onChange={(e) => setFormData({...formData, participation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="needs_improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Developed (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skillsDeveloped}
              onChange={(e) => setFormData({...formData, skillsDeveloped: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Problem solving, Critical thinking"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement (comma-separated)
            </label>
            <input
              type="text"
              value={formData.areasForImprovement}
              onChange={(e) => setFormData({...formData, areasForImprovement: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Time management, Complex problems"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Strengths
          </label>
          <textarea
            value={formData.strengths}
            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the student's strengths"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Challenges
          </label>
          <textarea
            value={formData.challenges}
            onChange={(e) => setFormData({...formData, challenges: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe any challenges the student is facing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendations
          </label>
          <textarea
            value={formData.recommendations}
            onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide recommendations for continued progress"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Steps
          </label>
          <textarea
            value={formData.nextSteps}
            onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Outline the next steps for the student"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Notes
            </label>
            <textarea
              value={formData.parentNotes}
              onChange={(e) => setFormData({...formData, parentNotes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes for parents"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher Notes
            </label>
            <textarea
              value={formData.teacherNotes}
              onChange={(e) => setFormData({...formData, teacherNotes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Internal notes for teacher reference"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                {report ? "Update Report" : "Create Report"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgressReports;
