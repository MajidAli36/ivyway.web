"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ClockIcon,
  XMarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function StudentGuidancePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.studentId);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [guidanceMessage, setGuidanceMessage] = useState("");
  const [guidanceTopic, setGuidanceTopic] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [guidanceSent, setGuidanceSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in a real app, this would be fetched from your API
  const students = [
    {
      id: 1,
      name: "Emma Davis",
      grade: "11th Grade",
      subjects: [
        { name: "Mathematics", grade: "A-", progress: 85 },
        { name: "Physics", grade: "B+", progress: 78 },
        { name: "Chemistry", grade: "B", progress: 70 },
      ],
      lastUpdated: "Mar 18, 2025",
      status: "On Track",
      statusColor: "green",
    },
    {
      id: 2,
      name: "James Wilson",
      grade: "10th Grade",
      subjects: [
        { name: "English", grade: "B-", progress: 68 },
        { name: "History", grade: "C+", progress: 62 },
        { name: "Economics", grade: "B", progress: 75 },
      ],
      lastUpdated: "Mar 17, 2025",
      status: "Needs Attention",
      statusColor: "amber",
      issue: "Academic decline",
    },
    {
      id: 3,
      name: "Sophie Martinez",
      grade: "12th Grade",
      subjects: [
        { name: "Biology", grade: "A", progress: 92 },
        { name: "Chemistry", grade: "A-", progress: 88 },
        { name: "Physics", grade: "B+", progress: 82 },
      ],
      lastUpdated: "Mar 16, 2025",
      status: "On Track",
      statusColor: "green",
    },
    {
      id: 4,
      name: "Ryan Thompson",
      grade: "9th Grade",
      subjects: [
        { name: "Algebra", grade: "C", progress: 65 },
        { name: "Biology", grade: "B-", progress: 68 },
        { name: "English", grade: "B", progress: 75 },
      ],
      lastUpdated: "Mar 15, 2025",
      status: "Needs Attention",
      statusColor: "red",
      issue: "Missed 2 sessions",
    },
    {
      id: 5,
      name: "Olivia Garcia",
      grade: "11th Grade",
      subjects: [
        { name: "Pre-Calculus", grade: "C+", progress: 69 },
        { name: "Spanish", grade: "B", progress: 75 },
        { name: "Physics", grade: "C-", progress: 60 },
      ],
      lastUpdated: "Mar 14, 2025",
      status: "Needs Attention",
      statusColor: "red",
      issue: "Academic decline",
    },
    {
      id: 6,
      name: "Lucas Kim",
      grade: "12th Grade",
      subjects: [
        { name: "Calculus", grade: "B+", progress: 78 },
        { name: "Literature", grade: "A-", progress: 85 },
        { name: "Computer Science", grade: "A", progress: 92 },
      ],
      lastUpdated: "Mar 19, 2025",
      status: "Needs Support",
      statusColor: "amber",
      issue: "Requesting additional support",
    },
  ];

  // Guidance templates
  const guidanceTemplates = [
    {
      id: 1,
      title: "Academic Improvement Plan",
      category: "Academic",
      description:
        "Personalized steps to improve grades and academic performance.",
      template:
        "Dear [Student Name],\n\nBased on your recent academic performance, I've created a personalized improvement plan for you. Here are some key steps you can take to improve your grades:\n\n1. [Specific recommendation]\n2. [Specific recommendation]\n3. [Specific recommendation]\n\nLet's schedule a follow-up session next week to review your progress.\n\nBest regards,\n[Your Name]",
    },
    {
      id: 2,
      title: "College Application Strategy",
      category: "College",
      description:
        "Guidance on college selection, application process, and deadlines.",
      template:
        "Dear [Student Name],\n\nAs you prepare for college applications, here's a strategic approach to make the process more manageable:\n\n1. [College application recommendation]\n2. [College application recommendation]\n3. [College application recommendation]\n\nThe following deadlines are important to keep in mind:\n- [Deadline]\n- [Deadline]\n\nPlease let me know if you need any clarification or additional support.\n\nBest regards,\n[Your Name]",
    },
    {
      id: 3,
      title: "Study Skills Development",
      category: "Academic",
      description:
        "Techniques for effective note-taking, time management, and test preparation.",
      template:
        "Dear [Student Name],\n\nTo help improve your study skills, I recommend the following techniques:\n\n1. [Study technique]\n2. [Study technique]\n3. [Study technique]\n\nImplementing these strategies should help you better prepare for upcoming tests and manage your coursework more effectively.\n\nBest regards,\n[Your Name]",
    },
    {
      id: 4,
      title: "Career Path Exploration",
      category: "Career",
      description:
        "Assessment of interests and skills to identify potential career paths.",
      template:
        "Dear [Student Name],\n\nBased on our discussions about your interests and strengths, here are some potential career paths that might be a good fit for you:\n\n1. [Career path] - [Brief explanation]\n2. [Career path] - [Brief explanation]\n3. [Career path] - [Brief explanation]\n\nTo explore these further, I recommend the following resources:\n- [Resource]\n- [Resource]\n\nBest regards,\n[Your Name]",
    },
    {
      id: 5,
      title: "Personal Development Plan",
      category: "Personal",
      description:
        "Building self-confidence, resilience, and emotional intelligence.",
      template:
        "Dear [Student Name],\n\nTo support your personal development goals, I suggest focusing on these areas:\n\n1. [Personal development area]\n2. [Personal development area]\n3. [Personal development area]\n\nHere are some strategies that might help you in this journey:\n- [Strategy]\n- [Strategy]\n\nRemember that personal growth takes time, and I'm here to support you.\n\nBest regards,\n[Your Name]",
    },
    {
      id: 6,
      title: "Subject-Specific Support",
      category: "Academic",
      description:
        "Customized resources and strategies for specific academic subjects.",
      template:
        "Dear [Student Name],\n\nI want to provide you with some specific resources to help with your [Subject] course:\n\n1. [Resource/Strategy]\n2. [Resource/Strategy]\n3. [Resource/Strategy]\n\nI'd be happy to review any specific questions or areas where you're struggling during our next session.\n\nBest regards,\n[Your Name]",
    },
  ];

  // Previous guidance for this student
  const previousGuidance = [
    {
      id: 1,
      studentId: 2,
      date: "Feb 15, 2025",
      topic: "Academic Improvement Plan",
      message:
        "Dear James,\n\nI've noticed some challenges in your recent History assignments. Let's work together on a strategy to improve your understanding and grades in this subject.\n\nI recommend:\n1. Setting aside 30 minutes daily for History review\n2. Using the Cornell note-taking method for better retention\n3. Joining the peer study group that meets on Wednesdays\n\nLet me know if you'd like to discuss these suggestions further.\n\nBest regards,\nYour Counselor",
    },
    {
      id: 2,
      studentId: 4,
      date: "Mar 1, 2025",
      topic: "Attendance Improvement",
      message:
        "Dear Ryan,\n\nI wanted to reach out regarding your recent absences. Regular attendance is crucial for academic success, and I'm concerned about the classes you've missed.\n\nCan we meet to discuss any challenges you're facing and how we might address them? I'm available this week and would be happy to work with you on strategies to ensure consistent attendance.\n\nBest regards,\nYour Counselor",
    },
    {
      id: 3,
      studentId: 6,
      date: "Mar 10, 2025",
      topic: "College Application Support",
      message:
        "Dear Lucas,\n\nAs discussed in our meeting, here are the key deadlines for your college applications:\n\n- Common App submission: November 1\n- Financial aid forms: January 15\n- Scholarship applications: Varies (see attached list)\n\nI've also added information about the essay writing workshop next week, which I highly recommend attending.\n\nBest regards,\nYour Counselor",
    },
    {
      id: 4,
      studentId: 2,
      date: "Mar 8, 2025",
      topic: "Study Skills Development",
      message:
        "Dear James,\n\nFollowing our recent meeting, here are the study techniques we discussed that might help improve your academic performance:\n\n1. The Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break\n2. Active recall practice instead of passive re-reading\n3. Creating concept maps for complex topics\n\nLet's check in next week to see how these are working for you.\n\nBest regards,\nYour Counselor",
    },
  ];

  // Find the current student
  const student = students.find((s) => s.id === studentId);

  // Find previous guidance for this student
  const studentPreviousGuidance = previousGuidance.filter(
    (g) => g.studentId === studentId
  );

  // When a template is selected
  const handleSelectTemplate = (template) => {
    // Replace [Student Name] with actual student name
    let customizedTemplate = template.template.replace(
      "[Student Name]",
      student.name
    );
    setSelectedTemplate(template);
    setGuidanceTopic(template.title);
    setGuidanceMessage(customizedTemplate);
    setShowTemplateModal(false);
  };

  // Submit guidance
  const handleSubmitGuidance = () => {
    if (!guidanceTopic.trim()) {
      alert("Please enter a guidance topic.");
      return;
    }

    if (!guidanceMessage.trim()) {
      alert("Please enter a guidance message.");
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would send the data to your backend
    setTimeout(() => {
      console.log("Guidance submitted:", {
        studentId,
        topic: guidanceTopic,
        message: guidanceMessage,
        template: selectedTemplate ? selectedTemplate.id : null,
        date: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setGuidanceSent(true);

      // Reset after a delay
      setTimeout(() => {
        setGuidanceSent(false);
      }, 3000);
    }, 1000);
  };

  // Navigate to schedule session
  const handleScheduleSession = () => {
    router.push(`/counselor/schedule-session?student=${studentId}`);
  };

  // Navigate to progress page
  const handleViewProgress = () => {
    router.push(`/counselor/student-progress/${studentId}`);
  };

  // If student not found
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg inline-flex items-center">
          <XMarkIcon className="h-5 w-5 mr-2" />
          Student not found
        </div>
        <Link
          href="/counselor/guidance"
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Guidance
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/counselor/guidance"
            className="inline-flex items-center text-blue-600 hover:underline mb-2"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to All Students
          </Link>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Guidance for {student.name}
          </h1>
          <p className="text-[#6b7280] mt-1">
            {student.grade} • Last updated: {student.lastUpdated}
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 border border-${student.statusColor}-200 mr-2`}
          >
            {student.issue || student.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column - Student Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2 text-blue-600" />
                Student Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold mr-4">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{student.name}</h3>
                  <p className="text-gray-600">{student.grade}</p>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-3">
                Academic Performance
              </h4>
              <div className="space-y-4 mb-6">
                {student.subjects.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {subject.name}
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded ${
                          subject.grade.startsWith("A")
                            ? "bg-green-100 text-green-800"
                            : subject.grade.startsWith("B")
                            ? "bg-blue-100 text-blue-800"
                            : subject.grade.startsWith("C")
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject.grade}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${
                          subject.progress >= 80
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : subject.progress >= 70
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : subject.progress >= 60
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                        } h-2 rounded-full`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleViewProgress}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
                >
                  <ChartBarIcon className="h-4 w-4 mr-1.5" />
                  View Full Progress
                </button>
                <button
                  onClick={handleScheduleSession}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all"
                >
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  Schedule Session
                </button>
              </div>
            </div>
          </div>

          {studentPreviousGuidance.length > 0 && (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                  <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Previous Guidance
                </h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {studentPreviousGuidance.map((guidance) => (
                  <li
                    key={guidance.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {guidance.topic}
                      </h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {guidance.date}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-line max-h-40 overflow-y-auto">
                      {guidance.message}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column - Guidance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Provide Guidance
                </h2>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedTemplate && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {selectedTemplate.category === "Academic" && (
                      <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                    )}
                    {selectedTemplate.category === "College" && (
                      <BookOpenIcon className="h-5 w-5 text-purple-600" />
                    )}
                    {selectedTemplate.category === "Career" && (
                      <BriefcaseIcon className="h-5 w-5 text-green-600" />
                    )}
                    {selectedTemplate.category === "Personal" && (
                      <UserGroupIcon className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-blue-800">
                        {selectedTemplate.title}
                      </p>
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-blue-600">
                      {selectedTemplate.category}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="guidance-topic"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Guidance Topic
                </label>
                <input
                  type="text"
                  id="guidance-topic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E.g., Study Skills Improvement, College Application Strategy"
                  value={guidanceTopic}
                  onChange={(e) => setGuidanceTopic(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="guidance-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Guidance Message
                </label>
                <textarea
                  id="guidance-message"
                  rows="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your personalized guidance message here..."
                  value={guidanceMessage}
                  onChange={(e) => setGuidanceMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitGuidance}
                  disabled={
                    !guidanceTopic.trim() ||
                    !guidanceMessage.trim() ||
                    guidanceSent ||
                    isSubmitting
                  }
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${
                      guidanceSent
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    } 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    ${
                      !guidanceTopic.trim() ||
                      !guidanceMessage.trim() ||
                      guidanceSent ||
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : guidanceSent ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Guidance Sent
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      Send Guidance
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-md rounded-xl overflow-hidden text-white">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Guidance Best Practices</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm">
                    Be specific and provide actionable advice that the student
                    can implement right away.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm">
                    Reference the student's specific academic challenges or
                    goals in your guidance.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm">
                    Offer encouragement along with constructive feedback.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm">
                    Include a follow-up plan and specific next steps.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowTemplateModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Select a Guidance Template
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {guidanceTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {template.category === "Academic" && (
                        <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                      )}
                      {template.category === "College" && (
                        <BookOpenIcon className="h-6 w-6 text-purple-600" />
                      )}
                      {template.category === "Career" && (
                        <BriefcaseIcon className="h-6 w-6 text-green-600" />
                      )}
                      {template.category === "Personal" && (
                        <UserGroupIcon className="h-6 w-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-medium text-[#334e68]">
                        {template.title}
                      </p>
                      <p className="text-sm text-[#6b7280] mt-1">
                        {template.description}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
