"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "@heroicons/react/24/outline";

// Create a separate component for the part that uses searchParams
function ScheduleSessionContent() {
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("student")
    ? parseInt(searchParams.get("student"))
    : null;

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sessionType, setSessionType] = useState("academic");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionScheduled, setSessionScheduled] = useState(false);

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

  // Set initial values
  useEffect(() => {
    // Set default date to today
    setSessionDate(getCurrentDateFormatted());

    // If student ID was provided in URL, preselect that student
    if (preselectedStudentId) {
      const student = students.find((s) => s.id === preselectedStudentId);
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, [preselectedStudentId]);

  // Handle student selection
  const handleStudentSelect = (e) => {
    const studentId = parseInt(e.target.value);
    if (studentId) {
      const student = students.find((s) => s.id === studentId);
      setSelectedStudent(student);
    } else {
      setSelectedStudent(null);
    }
  };

  // Handle session scheduling
  const handleScheduleSession = (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

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
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/counselor"
            className="inline-flex items-center text-blue-600 hover:underline mb-2"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Schedule a Session
          </h1>
          <p className="text-[#6b7280] mt-1">
            Book one-on-one sessions with students to provide personalized
            support.
          </p>
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
              <div>
                <label
                  htmlFor="student"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Student
                </label>
                <select
                  id="student"
                  value={selectedStudent ? selectedStudent.id : ""}
                  onChange={handleStudentSelect}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                      {student.issue ? ` - ${student.issue}` : ""}
                    </option>
                  ))}
                </select>
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
                    !selectedStudent ||
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
                      !selectedStudent ||
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
        </div>

        {/* Right column - Info */}
        <div className="lg:col-span-1 space-y-6">
          {selectedStudent ? (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Selected Student
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold mr-4">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-gray-600">{selectedStudent.grade}</p>
                    {selectedStudent.issue && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${selectedStudent.statusColor}-50 text-${selectedStudent.statusColor}-700 border border-${selectedStudent.statusColor}-200 mt-1`}
                      >
                        {selectedStudent.issue}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3">
                  Academic Performance
                </h4>
                <div className="space-y-3 mb-6">
                  {selectedStudent.subjects.map((subject, idx) => (
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
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/counselor/student-progress/${selectedStudent.id}`}
                  >
                    <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors">
                      <ChartBarIcon className="h-4 w-4 mr-1.5" />
                      View Progress
                    </button>
                  </Link>
                  <Link href={`/counselor/guidance/${selectedStudent.id}`}>
                    <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                      Offer Guidance
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Select a Student
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Choose a student from the dropdown to schedule a
                      one-on-one session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
                Session Planning Tips
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      Set clear objectives
                    </span>{" "}
                    for each session to make the most of your time together.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      Review student history
                    </span>{" "}
                    and previous guidance before your meeting.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      Prioritize students
                    </span>{" "}
                    who are flagged as needing attention or support.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 mt-0.5 mr-3">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">
                      Prepare materials
                    </span>{" "}
                    specific to the session type and student needs.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleSessionPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Schedule Session
          </h1>
          <p className="text-[#6b7280] mt-1">
            Book a one-on-one session with a student
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="animate-pulse p-6 bg-gray-100 rounded-xl">
            Loading session form...
          </div>
        }
      >
        <ScheduleSessionContent />
      </Suspense>
    </div>
  );
}
