"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  XMarkIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function StudentScheduleSessionPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = parseInt(params.studentId);

  const [sessionType, setSessionType] = useState("academic");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionScheduled, setSessionScheduled] = useState(false);
  const [previousSessions, setPreviousSessions] = useState([]);

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

  // Session types
  const sessionTypes = [
    {
      id: "academic",
      name: "Academic Planning",
      description:
        "Review courses, set academic goals, and develop study plans",
    },
    {
      id: "career",
      name: "Career Guidance",
      description:
        "Explore career options, interests, and required skills/education",
    },
    {
      id: "college",
      name: "College Application",
      description:
        "Guidance on college selection, applications, and admissions processes",
    },
    {
      id: "personal",
      name: "Personal Development",
      description: "Address social-emotional learning and personal growth",
    },
    {
      id: "crisis",
      name: "Crisis Intervention",
      description:
        "Support for students experiencing urgent academic or personal issues",
    },
  ];

  // Mock previous sessions data - in a real app, this would be fetched from your API
  const mockPreviousSessions = [
    {
      id: 101,
      studentId: 2,
      type: "Academic Planning",
      date: "2025-02-15",
      time: "2:00 PM - 3:00 PM",
      notes:
        "Discussed strategies to improve History grades. Student showed interest in study groups.",
      status: "Completed",
    },
    {
      id: 102,
      studentId: 2,
      type: "Personal Development",
      date: "2025-03-01",
      time: "10:00 AM - 11:00 AM",
      notes:
        "Worked on time management skills and creating a structured study schedule.",
      status: "Completed",
    },
    {
      id: 103,
      studentId: 4,
      type: "Crisis Intervention",
      date: "2025-03-05",
      time: "3:00 PM - 4:00 PM",
      notes: "Addressed absences and developed a plan to improve attendance.",
      status: "Completed",
    },
    {
      id: 104,
      studentId: 6,
      type: "College Application",
      date: "2025-03-10",
      time: "1:00 PM - 2:00 PM",
      notes:
        "Reviewed college list and application timeline. Student is interested in Computer Science programs.",
      status: "Completed",
    },
  ];

  // Time slots - in a real app, these would be dynamically generated based on availability
  const timeSlots = [
    { id: "9", time: "9:00 AM - 10:00 AM" },
    { id: "10", time: "10:00 AM - 11:00 AM" },
    { id: "11", time: "11:00 AM - 12:00 PM" },
    { id: "13", time: "1:00 PM - 2:00 PM" },
    { id: "14", time: "2:00 PM - 3:00 PM" },
    { id: "15", time: "3:00 PM - 4:00 PM" },
    { id: "16", time: "4:00 PM - 5:00 PM" },
  ];

  // Get current date formatted as YYYY-MM-DD for the date input default
  const getCurrentDateFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Find the current student
  const student = students.find((s) => s.id === studentId);

  // Set initial values and fetch data
  useEffect(() => {
    // Set default date to today
    setSessionDate(getCurrentDateFormatted());

    // Filter previous sessions for this student
    const studentSessions = mockPreviousSessions.filter(
      (s) => s.studentId === studentId
    );
    setPreviousSessions(studentSessions);

    // Auto-select recommended session type based on student issue
    if (student) {
      if (student.issue === "Academic decline") {
        setSessionType("academic");
        setSessionNotes(
          "Focus on addressing recent academic decline, particularly in: " +
            student.subjects
              .filter((s) => s.grade.startsWith("C"))
              .map((s) => s.name)
              .join(", ")
        );
      } else if (student.issue === "Missed 2 sessions") {
        setSessionType("crisis");
        setSessionNotes(
          "Discuss attendance issues and develop a plan to ensure consistent participation."
        );
      } else if (student.issue === "Requesting additional support") {
        setSessionType("personal");
        setSessionNotes(
          "Student has requested additional support. Identify specific areas of concern and provide targeted guidance."
        );
      } else if (student.grade === "12th Grade") {
        setSessionType("college");
        setSessionNotes(
          "Focus on college application process and preparation."
        );
      }
    }
  }, [studentId, student]);

  // Handle session scheduling
  const handleScheduleSession = (e) => {
    e.preventDefault();

    if (!sessionDate) {
      alert("Please select a session date.");
      return;
    }

    if (!sessionTime) {
      alert("Please select a session time.");
      return;
    }

    setIsSubmitting(true);

    // In a real app, this would send the data to your backend
    setTimeout(() => {
      console.log("Session scheduled:", {
        studentId,
        studentName: student.name,
        sessionType,
        sessionDate,
        sessionTime,
        sessionNotes,
        scheduledAt: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setSessionScheduled(true);

      // Reset form after a delay or redirect
      setTimeout(() => {
        router.push("/counselor");
      }, 3000);
    }, 1000);
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
          href="/counselor/schedule-session"
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Schedule Session
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/counselor/schedule-session"
            className="inline-flex items-center text-blue-600 hover:underline mb-2"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Schedule Session
          </Link>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Schedule Session with {student.name}
          </h1>
          <p className="text-[#6b7280] mt-1">
            {student.grade} • {student.issue || student.status}
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 border border-${student.statusColor}-200 mr-2`}
          >
            {student.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
                Session Details
              </h2>
            </div>

            <form onSubmit={handleScheduleSession} className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start mb-2">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Scheduling for: {student.name}
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    {student.issue ? (
                      <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{student.issue}</span>
                      </div>
                    ) : (
                      <p>Current status: {student.status}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="session-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Session Type
                </label>
                <select
                  id="session-type"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {sessionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {sessionTypes.find((t) => t.id === sessionType)?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="session-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="session-date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      min={getCurrentDateFormatted()}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="session-time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="session-time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-md shadow-sm pl-10 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="session-notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Session Notes
                </label>
                <textarea
                  id="session-notes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows="5"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any session objectives, topics to cover, or specific concerns to address..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    sessionScheduled ||
                    !sessionDate ||
                    !sessionTime
                  }
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${
                      sessionScheduled
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    } 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    ${
                      isSubmitting ||
                      sessionScheduled ||
                      !sessionDate ||
                      !sessionTime
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
                      Scheduling...
                    </>
                  ) : sessionScheduled ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Session Scheduled
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Schedule Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {previousSessions.length > 0 && (
            <div className="bg-white shadow-md rounded-xl overflow-hidden mt-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                  <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Previous Sessions
                </h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {previousSessions.map((session) => (
                  <li
                    key={session.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {session.type}
                      </h3>
                      <span className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="mx-1">•</span>
                        <ClockIcon className="h-4 w-4 mr-1 ml-1" />
                        {session.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{session.notes}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {session.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column - Info */}
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
              <div className="space-y-3 mb-6">
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
                <Link href={`/counselor/student-progress/${student.id}`}>
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors">
                    <ChartBarIcon className="h-4 w-4 mr-1.5" />
                    View Progress
                  </button>
                </Link>
                <Link href={`/counselor/guidance/${student.id}`}>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                    Offer Guidance
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-md rounded-xl overflow-hidden text-white">
            <div className="p-6">
              <h2 className="text-xl font-semibold">Session Recommendations</h2>
              <p className="mt-2 text-sm text-blue-100">
                Based on {student.name}'s current status, we recommend focusing
                on:
              </p>
              <ul className="mt-4 space-y-3">
                {student.issue === "Academic decline" && (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Reviewing recent test performances and identifying
                        struggle areas
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Developing personalized study strategies for challenging
                        subjects
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Creating a progress monitoring plan with weekly
                        check-ins
                      </p>
                    </li>
                  </>
                )}

                {student.issue === "Missed 2 sessions" && (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Understanding barriers to attendance and addressing them
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Establishing a consistent meeting schedule that
                        accommodates their needs
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Reviewing content missed during previous sessions
                      </p>
                    </li>
                  </>
                )}

                {student.issue === "Requesting additional support" && (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Identifying specific areas where the student needs
                        additional help
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Connecting them with appropriate resources (tutoring,
                        study groups, etc.)
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Creating a personalized support plan with regular
                        check-ins
                      </p>
                    </li>
                  </>
                )}

                {!student.issue && student.grade === "12th Grade" && (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        College application strategy and timeline
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Scholarship and financial aid opportunities
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        College essay review and application materials
                      </p>
                    </li>
                  </>
                )}

                {!student.issue && student.grade !== "12th Grade" && (
                  <>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Academic goal setting and course planning
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Study skills and time management techniques
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 rounded-full bg-white bg-opacity-20 p-1 mt-0.5 mr-3">
                        <CheckCircleIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm">
                        Extracurricular involvement and leadership development
                      </p>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
