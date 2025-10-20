"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeftIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function StudentProgressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in a real app you'd fetch this based on the studentId
  const students = [
    {
      id: "1",
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
      email: "emma.davis@example.com",
      recentActivities: [
        {
          date: "Mar 16, 2025",
          description: "Completed Calculus assignment with 92%",
        },
        {
          date: "Mar 14, 2025",
          description: "Attended Physics tutoring session",
        },
        { date: "Mar 10, 2025", description: "Submitted Chemistry lab report" },
      ],
      strengths: [
        "Advanced mathematics",
        "Analytical thinking",
        "Written communication",
      ],
      areasForImprovement: ["Time management", "Physics problem-solving"],
      goalsAndObjectives: [
        "Improve Physics grade to A- by end of semester",
        "Prepare for upcoming SAT Math Subject Test",
        "Explore STEM summer internship opportunities",
      ],
      counselorNotes:
        "Emma has shown excellent progress in Mathematics and continues to maintain high academic standards. Some additional support in Physics would be beneficial.",
    },
    {
      id: "2",
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
      email: "james.wilson@example.com",
      recentActivities: [
        {
          date: "Mar 15, 2025",
          description: "Missed English literature discussion",
        },
        { date: "Mar 12, 2025", description: "Scored 65% on History midterm" },
        { date: "Mar 9, 2025", description: "Completed Economics project" },
      ],
      strengths: ["Verbal reasoning", "Creative writing", "Economic concepts"],
      areasForImprovement: [
        "Attendance",
        "Study habits",
        "History subject knowledge",
      ],
      goalsAndObjectives: [
        "Raise History grade to B by end of term",
        "Establish regular attendance pattern",
        "Develop structured study plan for humanities subjects",
      ],
      counselorNotes:
        "James has been struggling with attendance issues which has impacted his academic performance. Regular check-ins and a structured study plan would help get him back on track.",
    },
    // More students...
  ];

  useEffect(() => {
    // Simulate API call to get student data
    setLoading(true);
    setTimeout(() => {
      const foundStudent = students.find((s) => s.id === studentId);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        // Handle not found
        router.push("/counselor/student-progress");
      }
      setLoading(false);
    }, 300);
  }, [studentId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10">
        <p className="text-[#6b7280]">Student not found</p>
        <Link href="/counselor/student-progress">
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Back to All Students
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Link href="/counselor/student-progress">
            <button className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#243b53]">
              {student.name}
            </h1>
            <p className="text-[#6b7280]">
              {student.grade} • {student.email}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/counselor/guidance/${studentId}`}>
            <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
              Offer Guidance
            </button>
          </Link>
          <Link href={`/counselor/schedule-session?studentId=${studentId}`}>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              Schedule Session
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4 sm:px-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("academic")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "academic"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Academic Performance
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "goals"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Goals & Planning
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notes"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Counselor Notes
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-sm font-medium text-blue-900">
                      Academic Status
                    </h2>
                  </div>
                  <p
                    className={`mt-2 text-${student.statusColor}-700 font-medium`}
                  >
                    {student.issue || student.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {student.lastUpdated}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />
                    <h2 className="text-sm font-medium text-gray-900">
                      Overall Grade Average
                    </h2>
                  </div>
                  <p className="mt-2 text-gray-700 font-medium">
                    {/* Calculate average grade */}
                    {(
                      student.subjects.reduce((total, subj) => {
                        const grade = subj.grade;
                        // Convert letter grades to numbers
                        const value =
                          grade === "A"
                            ? 4.0
                            : grade === "A-"
                            ? 3.7
                            : grade === "B+"
                            ? 3.3
                            : grade === "B"
                            ? 3.0
                            : grade === "B-"
                            ? 2.7
                            : grade === "C+"
                            ? 2.3
                            : grade === "C"
                            ? 2.0
                            : grade === "C-"
                            ? 1.7
                            : grade === "D+"
                            ? 1.3
                            : grade === "D"
                            ? 1.0
                            : 0;
                        return total + value;
                      }, 0) / student.subjects.length
                    ).toFixed(2)}
                    GPA
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {student.subjects.length} subjects
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-sm font-medium text-blue-900">
                      Recent Activities
                    </h2>
                  </div>
                  <ul className="mt-2 text-sm space-y-1">
                    {student.recentActivities
                      ?.slice(0, 2)
                      .map((activity, idx) => (
                        <li key={idx} className="text-gray-700">
                          <span className="text-xs text-gray-500">
                            {activity.date}:{" "}
                          </span>
                          {activity.description}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Subject Performance
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {student.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      className={`p-4 ${
                        idx < student.subjects.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-medium text-gray-800 flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-2 text-blue-600" />
                          {subject.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className={`${
                                subject.progress >= 80
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700"
                                  : subject.progress >= 70
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              } h-2.5 rounded-full`}
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {subject.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">
                    Strengths
                  </h2>
                  <ul className="space-y-2 bg-blue-50 rounded-lg p-4">
                    {student.strengths?.map((strength, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span className="text-gray-800">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">
                    Areas for Improvement
                  </h2>
                  <ul className="space-y-2 bg-amber-50 rounded-lg p-4">
                    {student.areasForImprovement?.map((area, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-amber-500 mr-2">!</span>
                        <span className="text-gray-800">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Recent Activities
                </h2>
                <div className="border-l-2 border-blue-200 pl-4 space-y-4">
                  {student.recentActivities?.map((activity, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 mt-1.5">
                        <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      </div>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                      <p className="text-base text-gray-800">
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Goals & Objectives
                </h2>
                <ul className="space-y-3 bg-gray-50 rounded-lg p-4">
                  {student.goalsAndObjectives?.map((goal, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-2">
                        {idx + 1}
                      </div>
                      <span className="text-gray-800">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Recommended Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Schedule Regular Sessions
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Regular one-on-one sessions can help track progress and
                      address challenges in real-time.
                    </p>
                    <Link
                      href={`/counselor/schedule-session?studentId=${studentId}`}
                    >
                      <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        Schedule Now
                      </button>
                    </Link>
                  </div>

                  <div className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Provide Academic Guidance
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Offer specific guidance on study strategies and resources
                      for areas needing improvement.
                    </p>
                    <Link href={`/counselor/guidance/${studentId}`}>
                      <button className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                        Offer Guidance
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Counselor Notes
                </h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-line">
                    {student.counselorNotes ||
                      "No counselor notes available yet."}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Add New Note
                </h2>
                <div className="bg-white rounded-lg border border-gray-300 p-4">
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your notes about this student..."
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none">
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
