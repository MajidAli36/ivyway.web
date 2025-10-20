"use client";

import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function StudentMyTutors() {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Mock data for student's tutors
  const tutors = [
    {
      id: "tutor_001",
      fullName: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      role: "tutor",
      subjects: ["Mathematics", "Physics"],
      rating: 4.8,
      totalReviews: 25,
      tutorType: "advanced",
      experience: 5,
      status: "active",
      assignmentId: "assign_001",
      assignedAt: "2024-01-10T10:00:00Z",
      teacher: {
        name: "Ms. Sarah Johnson",
        email: "sarah.johnson@school.edu",
        school: "Lincoln High School"
      },
      nextSession: "2024-01-20T15:00:00Z",
      sessionsCompleted: 8,
      totalSessions: 12,
      progress: 67,
      lastSession: "2024-01-15T15:00:00Z",
      upcomingSessions: [
        {
          id: "session_001",
          date: "2024-01-20T15:00:00Z",
          duration: 60,
          subject: "Mathematics",
          topic: "Calculus Derivatives",
          status: "scheduled"
        },
        {
          id: "session_002",
          date: "2024-01-27T15:00:00Z",
          duration: 60,
          subject: "Mathematics",
          topic: "Integration Techniques",
          status: "scheduled"
        }
      ],
      recentSessions: [
        {
          id: "session_003",
          date: "2024-01-15T15:00:00Z",
          duration: 60,
          subject: "Mathematics",
          topic: "Limits and Continuity",
          status: "completed",
          rating: 5,
          notes: "Great session, student understood the concepts well"
        },
        {
          id: "session_004",
          date: "2024-01-08T15:00:00Z",
          duration: 60,
          subject: "Physics",
          topic: "Mechanics",
          status: "completed",
          rating: 4,
          notes: "Good progress on problem-solving"
        }
      ]
    },
    {
      id: "counselor_001",
      fullName: "Ms. Lisa Chen",
      email: "lisa.chen@example.com",
      phone: "(555) 987-6543",
      role: "counselor",
      subjects: ["Academic Counseling", "College Prep"],
      rating: 4.9,
      totalReviews: 32,
      counselorType: "general",
      experience: 8,
      status: "active",
      assignmentId: "assign_002",
      assignedAt: "2024-01-12T14:00:00Z",
      teacher: {
        name: "Mr. David Kim",
        email: "david.kim@school.edu",
        school: "Lincoln High School"
      },
      nextSession: "2024-01-22T10:00:00Z",
      sessionsCompleted: 3,
      totalSessions: 6,
      progress: 50,
      lastSession: "2024-01-15T10:00:00Z",
      upcomingSessions: [
        {
          id: "session_005",
          date: "2024-01-22T10:00:00Z",
          duration: 60,
          subject: "Academic Counseling",
          topic: "College Application Strategy",
          status: "scheduled"
        }
      ],
      recentSessions: [
        {
          id: "session_006",
          date: "2024-01-15T10:00:00Z",
          duration: 60,
          subject: "Academic Counseling",
          topic: "Career Planning",
          status: "completed",
          rating: 5,
          notes: "Excellent discussion about future goals"
        }
      ]
    }
  ];

  const completedTutors = [
    {
      id: "tutor_002",
      fullName: "Mr. David Kim",
      email: "david.kim@example.com",
      role: "tutor",
      subjects: ["English"],
      rating: 4.6,
      status: "completed",
      assignmentId: "assign_003",
      completedAt: "2024-01-05T16:00:00Z",
      sessionsCompleted: 12,
      totalSessions: 12,
      progress: 100,
      teacher: {
        name: "Dr. Maria Rodriguez",
        email: "maria.rodriguez@school.edu",
        school: "Lincoln High School"
      }
    }
  ];

  const currentTutors = tutors.filter(tutor => tutor.status === "active");
  const allTutors = [...currentTutors, ...completedTutors];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "completed": return "text-blue-600 bg-blue-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleMessageTutor = (tutor) => {
    setSelectedTutor(tutor);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (tutorId, message) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Message sent to tutor:", tutorId, message);
    setShowMessageModal(false);
    setSelectedTutor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tutors & Counselors</h1>
              <p className="text-gray-600">View your assigned tutors and counselors</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Messages
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
                { id: "current", name: "Current", count: currentTutors.length },
                { id: "completed", name: "Completed", count: completedTutors.length },
                { id: "all", name: "All", count: allTutors.length },
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

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "current" ? currentTutors : 
            activeTab === "completed" ? completedTutors : 
            allTutors).map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {tutor.fullName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{tutor.fullName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{tutor.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tutor.status)}`}>
                  {tutor.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{tutor.rating}/5</span>
                  <span className="text-gray-500 ml-1">({tutor.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{tutor.subjects.join(", ")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Assigned by {tutor.teacher.name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Assigned {new Date(tutor.assignedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress Bar for Active Tutors */}
              {tutor.status === "active" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{tutor.sessionsCompleted}/{tutor.totalSessions} sessions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${tutor.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Next Session Info */}
              {tutor.status === "active" && tutor.nextSession && (
                <div className="mb-4 bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1">Next Session</h4>
                  <p className="text-sm text-blue-600">
                    {new Date(tutor.nextSession).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMessageTutor(tutor)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  Message
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <CalendarIcon className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <DocumentTextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {((activeTab === "current" ? currentTutors : 
           activeTab === "completed" ? completedTutors : 
           allTutors).length === 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-600">You don't have any tutors matching your current selection.</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedTutor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <MessageModal
                tutor={selectedTutor}
                onSend={handleSendMessage}
                onCancel={() => {
                  setShowMessageModal(false);
                  setSelectedTutor(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Message Modal Component
const MessageModal = ({ tutor, onSend, onCancel }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }
    
    setIsSending(true);
    await onSend(tutor.id, message);
    setIsSending(false);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-4">
        <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Message {tutor.fullName}</h3>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Tutor Information</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Name:</strong> {tutor.fullName}</p>
            <p><strong>Role:</strong> {tutor.role}</p>
            <p><strong>Subjects:</strong> {tutor.subjects.join(", ")}</p>
            <p><strong>Email:</strong> {tutor.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your message here..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={isSending}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          disabled={isSending || !message.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Send Message
            </>
          )}
        </button>
      </div>
    </div>
  );
};
