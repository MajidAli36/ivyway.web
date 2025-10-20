"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChevronRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function GuidancePage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const students = [
    {
      id: 1,
      name: "Emma Davis",
      grade: "11th Grade",
      subjects: [
        { name: "Mathematics", grade: "A-" },
        { name: "Physics", grade: "B+" },
        { name: "Chemistry", grade: "B" },
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
        { name: "English", grade: "B-" },
        { name: "History", grade: "C+" },
        { name: "Economics", grade: "B" },
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
        { name: "Biology", grade: "A" },
        { name: "Chemistry", grade: "A-" },
        { name: "Physics", grade: "B+" },
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
        { name: "Algebra", grade: "C" },
        { name: "Biology", grade: "B-" },
        { name: "English", grade: "B" },
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
        { name: "Pre-Calculus", grade: "C+" },
        { name: "Spanish", grade: "B" },
        { name: "Physics", grade: "C-" },
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
        { name: "Calculus", grade: "B+" },
        { name: "Literature", grade: "A-" },
        { name: "Computer Science", grade: "A" },
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
    },
    {
      id: 2,
      title: "College Application Strategy",
      category: "College",
      description:
        "Guidance on college selection, application process, and deadlines.",
    },
    {
      id: 3,
      title: "Study Skills Development",
      category: "Academic",
      description:
        "Techniques for effective note-taking, time management, and test preparation.",
    },
    {
      id: 4,
      title: "Career Path Exploration",
      category: "Career",
      description:
        "Assessment of interests and skills to identify potential career paths.",
    },
    {
      id: 5,
      title: "Personal Development Plan",
      category: "Personal",
      description:
        "Building self-confidence, resilience, and emotional intelligence.",
    },
    {
      id: 6,
      title: "Subject-Specific Support",
      category: "Academic",
      description:
        "Customized resources and strategies for specific academic subjects.",
    },
  ];

  // Recent guidance provided
  const recentGuidance = [
    {
      id: 1,
      student: "Sophie Martinez",
      studentId: 3,
      date: "Mar 18, 2025",
      topic: "College Application Strategy",
      summary:
        "Discussed application timeline and provided resources for scholarship opportunities.",
    },
    {
      id: 2,
      student: "James Wilson",
      studentId: 2,
      date: "Mar 17, 2025",
      topic: "Academic Improvement Plan",
      summary:
        "Created a structured study schedule and set specific goals for History improvement.",
    },
    {
      id: 3,
      student: "Ryan Thompson",
      studentId: 4,
      date: "Mar 15, 2025",
      topic: "Attendance Improvement",
      summary:
        "Addressed barriers to regular attendance and established check-in system.",
    },
  ];

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter students needing attention
  const studentsNeedingAttention = students.filter(
    (student) => student.status !== "On Track"
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">Offer Guidance</h1>
          <p className="text-[#6b7280] mt-1">
            Provide personalized academic and career guidance to students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2 text-blue-600" />
                Students Needing Guidance
              </h2>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <ul className="divide-y divide-gray-100">
              {searchTerm
                ? filteredStudents.map((student) => (
                    <li
                      key={student.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-[#334e68]">
                              {student.name}{" "}
                              <span className="text-sm font-normal">
                                ({student.grade})
                              </span>
                            </p>
                            <div className="flex items-center mt-1">
                              {student.issue && (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 border border-${student.statusColor}-200 mr-2`}
                                >
                                  {student.issue}
                                </span>
                              )}
                              <span className="text-sm text-[#6b7280]">
                                Last updated: {student.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/counselor/guidance/${student.id}`}>
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                            Offer Guidance
                          </button>
                        </Link>
                      </div>
                    </li>
                  ))
                : studentsNeedingAttention.map((student) => (
                    <li
                      key={student.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-base font-medium text-[#334e68]">
                              {student.name}{" "}
                              <span className="text-sm font-normal">
                                ({student.grade})
                              </span>
                            </p>
                            <div className="flex items-center mt-1">
                              {student.issue && (
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 border border-${student.statusColor}-200 mr-2`}
                                >
                                  {student.issue}
                                </span>
                              )}
                              <span className="text-sm text-[#6b7280]">
                                Last updated: {student.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/counselor/guidance/${student.id}`}>
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                            Offer Guidance
                          </button>
                        </Link>
                      </div>
                    </li>
                  ))}

              {searchTerm && filteredStudents.length === 0 && (
                <li className="px-6 py-10 text-center">
                  <CheckCircleIcon className="mx-auto h-10 w-10 text-[#9ca3af]" />
                  <p className="mt-2 text-[#6b7280]">
                    No students match your search.
                  </p>
                </li>
              )}

              {!searchTerm && studentsNeedingAttention.length === 0 && (
                <li className="px-6 py-10 text-center">
                  <CheckCircleIcon className="mx-auto h-10 w-10 text-green-500" />
                  <p className="mt-2 text-[#6b7280]">
                    No students require immediate guidance.
                  </p>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                Recent Guidance Provided
              </h2>
            </div>

            <ul className="divide-y divide-gray-100">
              {recentGuidance.map((record) => (
                <li
                  key={record.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-base font-medium text-[#334e68]">
                        {record.topic} for {record.student}
                      </p>
                      <p className="text-sm text-[#6b7280] mt-1">
                        {record.summary}
                      </p>
                      <span className="inline-block mt-2 text-xs text-[#6b7280]">
                        Provided on {record.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/counselor/guidance/${record.studentId}`}>
                        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                          Follow Up
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}

              {recentGuidance.length === 0 && (
                <li className="px-6 py-10 text-center">
                  <DocumentTextIcon className="mx-auto h-10 w-10 text-[#9ca3af]" />
                  <p className="mt-2 text-[#6b7280]">
                    No recent guidance provided.
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                Guidance Templates
              </h2>
            </div>

            <ul className="divide-y divide-gray-100">
              {guidanceTemplates.map((template) => (
                <li
                  key={template.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // In a real app, this would select the template
                    alert(`Template selected: ${template.title}`);
                  }}
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
                </li>
              ))}
            </ul>

            {/* <div className="p-4 bg-blue-50 flex justify-center">
              <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none"
                onClick={() => {
                  // In a real app, this would open a form to create a new template
                  alert("Create new template functionality would open here");
                }}
              >
                Create New Template
              </button>
            </div> */}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-md rounded-xl overflow-hidden text-white">
            <div className="p-6">
              <h2 className="text-xl font-semibold flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2" />
                Guidance Tips
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Focus on specific, actionable advice that students can
                    implement immediately.
                  </p>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Follow up with students within one week of providing
                    guidance to check on progress.
                  </p>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Document all guidance conversations for future reference and
                    continuity.
                  </p>
                </li>
                <li className="flex items-start">
                  <ChevronRightIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Include both short-term goals and long-term development
                    plans in your guidance.
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
