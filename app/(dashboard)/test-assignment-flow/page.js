"use client";

import { useState, useEffect } from "react";
import assignmentStore from "@/app/lib/data/assignmentStore";
import { 
  PlusIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TrashIcon,
  EyeIcon 
} from "@heroicons/react/24/outline";

export default function TestAssignmentFlow() {
  const [assignments, setAssignments] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "Test Student",
    studentEmail: "test@example.com",
    studentGrade: "11th Grade",
    subjects: "Mathematics",
    goals: "Learn calculus",
    providerId: "tutor_001"
  });

  useEffect(() => {
    const loadAssignments = () => {
      const allAssignments = assignmentStore.getAllAssignments();
      setAssignments(allAssignments);
    };

    loadAssignments();
    const unsubscribe = assignmentStore.subscribe(loadAssignments);
    return unsubscribe;
  }, []);

  const handleCreateAssignment = () => {
    const newAssignment = assignmentStore.addAssignment({
      teacherId: 'teacher_test',
      studentId: 'student_test',
      providerId: formData.providerId,
      providerRole: 'tutor',
      assignmentType: 'tutoring',
      subjects: [formData.subjects],
      goals: formData.goals,
      specialInstructions: 'Test assignment',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      frequency: 'weekly',
      sessionDuration: 60,
      referralStudent: {
        id: 'student_test',
        fullName: formData.studentName,
        email: formData.studentEmail,
        grade: formData.studentGrade,
        school: 'Test School'
      },
      assignmentTeacher: {
        id: 'teacher_test',
        fullName: 'Test Teacher',
        email: 'teacher@test.com',
        school: 'Test School'
      },
      referral: {
        id: `referral_${Date.now()}`,
        studentName: formData.studentName,
        gradeLevel: formData.studentGrade,
        subjects: [formData.subjects],
        academicGoals: formData.goals
      }
    });

    console.log("Assignment created:", newAssignment);
    alert("Assignment created! Check the tutor assignments page.");
    setShowCreateForm(false);
  };

  const handleAccept = (assignmentId) => {
    const updated = assignmentStore.acceptAssignment(assignmentId);
    console.log("Assignment accepted:", updated);
    alert("Assignment accepted!");
  };

  const handleDecline = (assignmentId) => {
    const updated = assignmentStore.declineAssignment(assignmentId, "Test decline reason");
    console.log("Assignment declined:", updated);
    alert("Assignment declined!");
  };

  const handleDelete = (assignmentId) => {
    if (confirm("Delete this assignment?")) {
      // Note: assignmentStore doesn't have delete method, but we can clear all for testing
      assignmentStore.clearAll();
      alert("All assignments cleared!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test Assignment Flow
        </h1>

        {/* Create Assignment Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create Test Assignment</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {showCreateForm ? 'Cancel' : 'Create Assignment'}
            </button>
          </div>

          {showCreateForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={formData.studentGrade}
                    onChange={(e) => setFormData({...formData, studentGrade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects
                  </label>
                  <input
                    type="text"
                    value={formData.subjects}
                    onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goals
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleCreateAssignment}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Assignments ({assignments.length})
            </h2>
          </div>
          
          {assignments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No assignments found. Create one above!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {assignment.referralStudent?.fullName || 'Unknown Student'}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          assignment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'declined' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.status}
                        </span>
                        {assignment.currentStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assignment.currentStatus === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.currentStatus}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Student:</strong> {assignment.referralStudent?.email}</p>
                          <p><strong>Grade:</strong> {assignment.referralStudent?.grade}</p>
                          <p><strong>Subjects:</strong> {assignment.subjects?.join(', ')}</p>
                        </div>
                        <div>
                          <p><strong>Teacher:</strong> {assignment.assignmentTeacher?.fullName}</p>
                          <p><strong>Goals:</strong> {assignment.goals}</p>
                          <p><strong>Assigned:</strong> {new Date(assignment.assignedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {assignment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(assignment.id)}
                            className="p-2 text-green-600 hover:text-green-900"
                            title="Accept"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDecline(assignment.id)}
                            className="p-2 text-red-600 hover:text-red-900"
                            title="Decline"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Create a new assignment using the form above</li>
            <li>Go to <code className="bg-blue-100 px-1 rounded">/tutor/assignments</code> to see the assignment appear</li>
            <li>Accept or decline the assignment from the tutor view</li>
            <li>Come back here to see the status update in real-time</li>
            <li>Check the browser console to see the data flow</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
