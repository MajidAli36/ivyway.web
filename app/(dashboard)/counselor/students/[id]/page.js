"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function StudentDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration - would come from API in real implementation
  const student = {
    id,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    gradeLevel: "10th Grade",
    enrolledSince: "September 2024",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    avatar: null, // Would be an image URL in real implementation
  };

  const academicProgress = {
    overall: 78,
    subjects: [
      { name: "Mathematics", progress: 85, trend: "improving" },
      { name: "Physics", progress: 72, trend: "stable" },
      { name: "Chemistry", progress: 68, trend: "declining" },
    ],
    recentAssessments: [
      {
        id: 1,
        subject: "Mathematics",
        date: "2025-03-15",
        score: "88%",
        topic: "Algebra II",
      },
      {
        id: 2,
        subject: "Physics",
        date: "2025-03-10",
        score: "75%",
        topic: "Mechanics",
      },
      {
        id: 3,
        subject: "Chemistry",
        date: "2025-03-05",
        score: "65%",
        topic: "Organic Chemistry",
      },
    ],
  };

  const tutoringSessions = [
    {
      id: 1,
      subject: "Mathematics",
      tutor: "John Smith",
      date: "2025-03-18",
      status: "Completed",
      attendance: "Attended",
      notes: "Good participation, completed all practice problems",
    },
    {
      id: 2,
      subject: "Physics",
      tutor: "Maria Garcia",
      date: "2025-03-15",
      status: "Completed",
      attendance: "Attended",
      notes: "Struggling with force diagrams, needs more practice",
    },
    {
      id: 3,
      subject: "Chemistry",
      tutor: "David Wilson",
      date: "2025-03-12",
      status: "Completed",
      attendance: "Missed",
      notes: "N/A - Student did not attend",
    },
    {
      id: 4,
      subject: "Mathematics",
      tutor: "John Smith",
      date: "2025-03-10",
      status: "Completed",
      attendance: "Attended",
      notes: "Showed improvement in algebraic manipulation",
    },
  ];

  const counselingNotes = [
    {
      id: 1,
      date: "2025-03-17",
      note: "Discussed academic goals and created study plan",
      author: "You",
    },
    {
      id: 2,
      date: "2025-03-10",
      note: "Student expressed concern about chemistry performance. Recommended additional tutoring sessions.",
      author: "You",
    },
    {
      id: 3,
      date: "2025-03-01",
      note: "Initial assessment meeting. Student seems motivated but anxious about physics.",
      author: "Jane Cooper",
    },
  ];

  const actionItems = [
    {
      id: 1,
      description: "Schedule follow-up on chemistry progress",
      status: "Pending",
      dueDate: "2025-03-25",
    },
    {
      id: 2,
      description: "Contact parents about upcoming progress report",
      status: "Completed",
      dueDate: "2025-03-15",
    },
    {
      id: 3,
      description: "Recommend summer study materials",
      status: "Pending",
      dueDate: "2025-04-10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex items-center space-x-3">
        <Link
          href="/counselor/students"
          className="text-[#6b7280] hover:text-[#4f46e5] transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-[#243b53]">Student Profile</h1>
      </div>

      {/* Student info card */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#486581] to-[#4f46e5] flex items-center justify-center text-white text-xl font-semibold">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-[#243b53]">
                  {student.name}
                </h2>
                <p className="text-sm text-[#6b7280]">{student.email}</p>
                <p className="text-sm text-[#6b7280] flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                  {student.gradeLevel} • Enrolled since {student.enrolledSince}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="inline-flex items-center px-4 py-2 border border-[#4f46e5] text-sm font-medium rounded-full text-[#4f46e5] bg-white hover:bg-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors"
                onClick={async () => {
                  try {
                    const { messaging } = await import("@/app/lib/api/messaging");
                    const res = await messaging.getOrCreateConversation(id);
                    if (res && res.success && res.data?.id) {
                      router.push(`/counselor/messages?conversation=${res.data.id}`);
                    } else {
                      router.push("/counselor/messages");
                    }
                  } catch (e) {
                    console.error("Failed to open conversation:", e);
                    router.push("/counselor/messages");
                  }
                }}
              >
                <ChatBubbleLeftRightIcon className="mr-1.5 h-4 w-4" />
                Message Student
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all">
                <CalendarIcon className="mr-1.5 h-4 w-4" />
                Schedule Meeting
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-[#6b7280]">Subjects</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {student.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#4f46e5]"
                    >
                      <BookOpenIcon className="h-3 w-3 mr-1" />
                      {subject}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-[#6b7280]">
                  Overall Progress
                </dt>
                <dd className="mt-1 text-sm text-[#243b53]">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-100 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-gradient-to-r from-[#486581] to-[#4f46e5] h-2.5 rounded-full"
                        style={{ width: `${academicProgress.overall}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">
                      {academicProgress.overall}%
                    </span>
                  </div>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-[#6b7280]">
                  Next Session
                </dt>
                <dd className="mt-1 text-sm text-[#243b53] flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                  March 25, 2025 (Mathematics)
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === "overview"
                ? "border-[#4f46e5] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#243b53] hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === "sessions"
                ? "border-[#4f46e5] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#243b53] hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            onClick={() => setActiveTab("sessions")}
          >
            Tutoring Sessions
          </button>
          <button
            className={`${
              activeTab === "notes"
                ? "border-[#4f46e5] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#243b53] hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            onClick={() => setActiveTab("notes")}
          >
            Counseling Notes
          </button>
          <button
            className={`${
              activeTab === "actions"
                ? "border-[#4f46e5] text-[#4f46e5]"
                : "border-transparent text-[#6b7280] hover:text-[#243b53] hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            onClick={() => setActiveTab("actions")}
          >
            Action Items
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Subject Progress */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Subject Progress
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-5">
                  {academicProgress.subjects.map((subject) => (
                    <div key={subject.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-[#334e68]">
                            {subject.name}
                          </span>
                          {subject.trend === "improving" && (
                            <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                              <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                              Improving
                            </span>
                          )}
                          {subject.trend === "declining" && (
                            <span className="ml-2 text-xs font-medium text-red-600 flex items-center">
                              <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                              Declining
                            </span>
                          )}
                          {subject.trend === "stable" && (
                            <span className="ml-2 text-xs font-medium text-[#6b7280] flex items-center">
                              <ArrowRightIcon className="h-3 w-3 mr-0.5" />
                              Stable
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#334e68]">
                          {subject.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.trend === "improving"
                              ? "bg-green-500"
                              : subject.trend === "declining"
                              ? "bg-red-500"
                              : "bg-gradient-to-r from-[#486581] to-[#4f46e5]"
                          }`}
                          style={{ width: `${subject.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Recent Assessments
                </h3>
              </div>
              <div className="bg-white">
                <ul className="divide-y divide-gray-100">
                  {academicProgress.recentAssessments.map((assessment) => (
                    <li
                      key={assessment.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#334e68]">
                            {assessment.subject} - {assessment.topic}
                          </p>
                          <p className="text-sm text-[#6b7280] flex items-center mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                            {new Date(assessment.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-[#dbeafe] text-[#4f46e5]">
                          {assessment.score}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Attendance Summary
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-[#6b7280] flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-1.5 text-[#4f46e5]" />
                      Sessions Attended
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-[#243b53]">
                      85%
                    </div>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-[#486581] to-[#4f46e5] h-1.5 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-[#6b7280] flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1.5 text-[#4f46e5]" />
                      On Time
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-[#243b53]">
                      90%
                    </div>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-[#486581] to-[#4f46e5] h-1.5 rounded-full"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-[#6b7280] flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-red-500" />
                      Missed Sessions
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-[#243b53]">
                      3
                    </div>
                    <div className="mt-2 text-sm text-[#6b7280]">
                      Last missed: Mar 12, 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tutoring Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                Tutoring Session History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                    >
                      Tutor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                    >
                      Attendance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tutoringSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#334e68] flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                          {session.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#6b7280] flex items-center">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#486581] to-[#4f46e5] flex items-center justify-center text-white text-xs font-semibold mr-2">
                            {session.tutor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          {session.tutor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#6b7280] flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                          {new Date(session.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            session.attendance === "Attended"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {session.attendance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#6b7280]">
                          {session.notes}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Counseling Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Counseling Notes
                </h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Note
                </button>
              </div>
              <div className="bg-white">
                <ul className="divide-y divide-gray-100">
                  {counselingNotes.map((note) => (
                    <li
                      key={note.id}
                      className="px-6 py-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#486581] to-[#4f46e5] flex items-center justify-center text-white font-medium text-sm">
                            {note.author === "You"
                              ? "You"
                              : note.author.split(" ")[0][0]}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#334e68] mb-1 flex items-center">
                            {note.author}
                            <span className="mx-2 text-[#9ca3af]">•</span>
                            <span className="text-[#6b7280] font-normal flex items-center">
                              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                              {new Date(note.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-[#6b7280] whitespace-pre-line">
                            {note.note}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Add Note Form */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <PlusIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Add New Note
                </h3>
              </div>
              <div className="px-6 py-5">
                <form className="space-y-4">
                  <div>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      className="shadow-sm focus:ring-[#4f46e5] focus:border-[#4f46e5] block w-full sm:text-sm border border-gray-300 rounded-lg"
                      placeholder="Enter your counseling notes here..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Action Items Tab */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Action Items
                </h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Action Item
                </button>
              </div>
              <div className="bg-white">
                <ul className="divide-y divide-gray-100">
                  {actionItems.map((item) => (
                    <li
                      key={item.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          id={`action-${item.id}`}
                          name={`action-${item.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#4f46e5] focus:ring-[#4f46e5] border-gray-300 rounded"
                          checked={item.status === "Completed"}
                          readOnly
                        />
                        <label
                          htmlFor={`action-${item.id}`}
                          className="ml-3 flex-1"
                        >
                          <span
                            className={`text-sm ${
                              item.status === "Completed"
                                ? "text-[#6b7280] line-through"
                                : "text-[#334e68]"
                            }`}
                          >
                            {item.description}
                          </span>
                          <p className="text-xs text-[#6b7280] flex items-center mt-1">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            Due:{" "}
                            {new Date(item.dueDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </label>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Completed"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Add Action Item Form */}
            <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-[#243b53] flex items-center">
                  <PlusIcon className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Add New Action Item
                </h3>
              </div>
              <div className="px-6 py-5">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="action-description"
                      className="block text-sm font-medium text-[#6b7280]"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="action-description"
                        id="action-description"
                        className="shadow-sm focus:ring-[#4f46e5] focus:border-[#4f46e5] block w-full sm:text-sm border border-gray-300 rounded-lg"
                        placeholder="Describe the action item..."
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="due-date"
                      className="block text-sm font-medium text-[#6b7280]"
                    >
                      Due Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="due-date"
                        id="due-date"
                        className="shadow-sm focus:ring-[#4f46e5] focus:border-[#4f46e5] block w-full sm:text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all"
                    >
                      Add Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
