"use client";

import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import assignmentStore from "@/app/lib/data/assignmentStore";

export default function TutorAssignments() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [assignments, setAssignments] = useState([]);

  // Load assignments from store
  useEffect(() => {
    const loadAssignments = () => {
      // In real app, get tutor ID from auth
      const tutorId = 'tutor_001';
      const tutorAssignments = assignmentStore.getAssignmentsByTutor(tutorId);
      setAssignments(tutorAssignments);
    };

    loadAssignments();
    
    // Subscribe to changes
    const unsubscribe = assignmentStore.subscribe(loadAssignments);
    
    return unsubscribe;
  }, []);

  // Mock data for tutor assignments (fallback)
  const mockAssignments = [
    {
      id: "assign_001",
      status: "pending",
      assignedAt: "2024-01-10T10:00:00Z",
      assignmentType: "tutoring",
      subjects: ["Mathematics"],
      goals: "Master calculus concepts",
      specialInstructions: "Focus on problem-solving techniques",
      referralStudent: {
        id: "student_001",
        fullName: "Emma Davis",
        email: "emma.davis@school.edu",
        grade: "11th Grade",
        school: "Lincoln High School"
      },
      assignmentTeacher: {
        id: "teacher_001",
        fullName: "Ms. Sarah Johnson",
        email: "sarah.johnson@school.edu",
        school: "Lincoln High School"
      },
      referral: {
        id: "referral_001",
        studentName: "Emma Davis",
        gradeLevel: "11th Grade",
        subjects: ["Mathematics"],
        academicGoals: "Improve math skills and prepare for SAT"
      },
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      frequency: "weekly",
      sessionDuration: 60
    },
    {
      id: "assign_002",
      status: "accepted",
      assignedAt: "2024-01-08T14:00:00Z",
      acceptedAt: "2024-01-08T15:30:00Z",
      assignmentType: "tutoring",
      subjects: ["Physics"],
      goals: "Understand mechanics concepts",
      specialInstructions: "Focus on practical applications",
      referralStudent: {
        id: "student_002",
        fullName: "James Wilson",
        email: "james.wilson@school.edu",
        grade: "10th Grade",
        school: "Roosevelt High School"
      },
      assignmentTeacher: {
        id: "teacher_002",
        fullName: "Mr. David Kim",
        email: "david.kim@school.edu",
        school: "Roosevelt High School"
      },
      referral: {
        id: "referral_002",
        studentName: "James Wilson",
        gradeLevel: "10th Grade",
        subjects: ["Physics"],
        academicGoals: "Improve physics understanding"
      },
      startDate: "2024-01-12",
      endDate: "2024-05-12",
      frequency: "bi-weekly",
      sessionDuration: 60,
      currentStatus: "active",
      sessionsCompleted: 3,
      nextSession: "2024-01-20T15:00:00Z"
    },
    {
      id: "assign_003",
      status: "declined",
      assignedAt: "2024-01-05T09:00:00Z",
      declinedAt: "2024-01-05T10:15:00Z",
      assignmentType: "tutoring",
      subjects: ["Chemistry"],
      goals: "Master organic chemistry",
      specialInstructions: "Focus on reaction mechanisms",
      referralStudent: {
        id: "student_003",
        fullName: "Sophie Martinez",
        email: "sophie.martinez@school.edu",
        grade: "12th Grade",
        school: "Washington High School"
      },
      assignmentTeacher: {
        id: "teacher_003",
        fullName: "Dr. Maria Rodriguez",
        email: "maria.rodriguez@school.edu",
        school: "Washington High School"
      },
      referral: {
        id: "referral_003",
        studentName: "Sophie Martinez",
        gradeLevel: "12th Grade",
        subjects: ["Chemistry"],
        academicGoals: "Prepare for AP Chemistry exam"
      },
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      frequency: "weekly",
      sessionDuration: 90,
      declineReason: "Schedule conflict with existing commitments"
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.referralStudent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.assignmentTeacher.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeTab === "all" || assignment.status === activeTab;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "accepted": return "text-green-600 bg-green-100";
      case "declined": return "text-red-600 bg-red-100";
      case "active": return "text-blue-600 bg-blue-100";
      case "completed": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleAcceptAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAcceptModal(true);
  };

  const handleDeclineAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeclineModal(true);
  };

  const handleUpdateStatus = (assignment) => {
    setSelectedAssignment(assignment);
    setShowStatusModal(true);
  };

  const handleAccept = async (assignmentId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update assignment in store
    const updatedAssignment = assignmentStore.acceptAssignment(assignmentId);
    console.log("Assignment accepted:", updatedAssignment);
    
    setShowAcceptModal(false);
    setSelectedAssignment(null);
    alert("Assignment accepted successfully!");
  };

  const handleDecline = async (assignmentId, reason) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update assignment in store
    const updatedAssignment = assignmentStore.declineAssignment(assignmentId, reason);
    console.log("Assignment declined:", updatedAssignment);
    
    setShowDeclineModal(false);
    setSelectedAssignment(null);
    alert("Assignment declined successfully!");
  };

  const handleStatusUpdate = async (assignmentId, status, notes) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update assignment in store
    const updatedAssignment = assignmentStore.updateAssignmentStatus(assignmentId, status, notes);
    console.log("Status updated:", updatedAssignment);
    
    setShowStatusModal(false);
    setSelectedAssignment(null);
    alert("Status updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
              <p className="text-gray-600">Manage your student assignments and track progress</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Create Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "pending", name: "Pending", count: assignments.filter(a => a.status === "pending").length },
                { id: "accepted", name: "Accepted", count: assignments.filter(a => a.status === "accepted").length },
                { id: "active", name: "Active", count: assignments.filter(a => a.currentStatus === "active").length },
                { id: "completed", name: "Completed", count: assignments.filter(a => a.status === "completed").length },
                { id: "all", name: "All", count: assignments.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {assignment.referralStudent.fullName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                      {assignment.currentStatus && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.currentStatus)}`}>
                          {assignment.currentStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {assignment.assignmentType} • {assignment.subjects.join(", ")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Assigned by {assignment.assignmentTeacher.fullName} • {assignment.assignmentTeacher.school}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                      {assignment.acceptedAt && (
                        <span> • Accepted: {new Date(assignment.acceptedAt).toLocaleDateString()}</span>
                      )}
                      {assignment.declinedAt && (
                        <span> • Declined: {new Date(assignment.declinedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Goals</h4>
                  <p className="text-sm text-gray-600">{assignment.goals}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-600">{assignment.specialInstructions}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Schedule</h4>
                  <p className="text-sm text-gray-600">
                    {assignment.frequency} • {assignment.sessionDuration} min sessions
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Student Info</h4>
                  <p className="text-sm text-gray-600">{assignment.referralStudent.grade} • {assignment.referralStudent.school}</p>
                  <p className="text-sm text-gray-500">{assignment.referralStudent.email}</p>
                </div>
              </div>

              {/* Progress Info for Active Assignments */}
              {assignment.currentStatus === "active" && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Sessions Completed</h4>
                      <p className="text-2xl font-bold text-blue-600">{assignment.sessionsCompleted}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Next Session</h4>
                      <p className="text-sm text-blue-600">
                        {assignment.nextSession ? new Date(assignment.nextSession).toLocaleString() : "Not scheduled"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Progress</h4>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Decline Reason for Declined Assignments */}
              {assignment.status === "declined" && assignment.declineReason && (
                <div className="mt-4 bg-red-50 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-1">Decline Reason</h4>
                  <p className="text-sm text-red-600">{assignment.declineReason}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                {assignment.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAcceptAssignment(assignment)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineAssignment(assignment)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center"
                    >
                      <XCircleIcon className="h-4 w-4 mr-2" />
                      Decline
                    </button>
                  </>
                )}
                {assignment.status === "accepted" && (
                  <button
                    onClick={() => handleUpdateStatus(assignment)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
                  >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Update Status
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600">You don't have any assignments matching your current filters.</p>
          </div>
        )}
      </div>

      {/* Accept Assignment Modal */}
      {showAcceptModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <AcceptAssignmentModal
                assignment={selectedAssignment}
                onAccept={handleAccept}
                onCancel={() => {
                  setShowAcceptModal(false);
                  setSelectedAssignment(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Decline Assignment Modal */}
      {showDeclineModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <DeclineAssignmentModal
                assignment={selectedAssignment}
                onDecline={handleDecline}
                onCancel={() => {
                  setShowDeclineModal(false);
                  setSelectedAssignment(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <UpdateStatusModal
                assignment={selectedAssignment}
                onUpdate={handleStatusUpdate}
                onCancel={() => {
                  setShowStatusModal(false);
                  setSelectedAssignment(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Accept Assignment Modal Component
const AcceptAssignmentModal = ({ assignment, onAccept, onCancel }) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept(assignment.id);
    setIsAccepting(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Accept Assignment</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Are you sure you want to accept this assignment for <strong>{assignment.referralStudent.fullName}</strong>?
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Assignment Details</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Student:</strong> {assignment.referralStudent.fullName} ({assignment.referralStudent.grade})</p>
            <p><strong>Subjects:</strong> {assignment.subjects.join(", ")}</p>
            <p><strong>Goals:</strong> {assignment.goals}</p>
            <p><strong>Schedule:</strong> {assignment.frequency} • {assignment.sessionDuration} min sessions</p>
            <p><strong>Duration:</strong> {new Date(assignment.startDate).toLocaleDateString()} - {new Date(assignment.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={isAccepting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
        >
          {isAccepting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Accepting...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Accept Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Decline Assignment Modal Component
const DeclineAssignmentModal = ({ assignment, onDecline, onCancel }) => {
  const [declineReason, setDeclineReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining");
      return;
    }
    
    setIsDeclining(true);
    await onDecline(assignment.id, declineReason);
    setIsDeclining(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-4">
        <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Decline Assignment</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          You are about to decline the assignment for <strong>{assignment.referralStudent.fullName}</strong>.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Assignment Details</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Student:</strong> {assignment.referralStudent.fullName} ({assignment.referralStudent.grade})</p>
            <p><strong>Subjects:</strong> {assignment.subjects.join(", ")}</p>
            <p><strong>Goals:</strong> {assignment.goals}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Declining *
          </label>
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Please provide a reason for declining this assignment..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={isDeclining}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDecline}
          disabled={isDeclining || !declineReason.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
        >
          {isDeclining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Declining...
            </>
          ) : (
            <>
              <XCircleIcon className="h-4 w-4 mr-2" />
              Decline Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Update Status Modal Component
const UpdateStatusModal = ({ assignment, onUpdate, onCancel }) => {
  const [status, setStatus] = useState(assignment.currentStatus || "active");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await onUpdate(assignment.id, status, notes);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ClockIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Update Assignment Status</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Update the status for assignment with <strong>{assignment.referralStudent.fullName}</strong>.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any notes about the status update..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={isUpdating}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            <>
              <ClockIcon className="h-4 w-4 mr-2" />
              Update Status
            </>
          )}
        </button>
      </div>
    </div>
  );
};
