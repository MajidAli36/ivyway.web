"use client";

import { useState } from "react";
import {
  AcademicCapIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Component for showing detailed subject progress
const DetailedSubjectProgress = ({ subject }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden mb-6">
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#334e68]">{subject.name}</h3>
        <span className="bg-[#dbeafe] text-[#4f46e5] px-3 py-1 rounded-full text-sm font-medium">
          {subject.progress}% Complete
        </span>
      </div>

      {/* Subject tabs */}
      <div className="border-b border-gray-100">
        <nav className="flex px-6" aria-label="Tabs">
          {["overview", "assignments", "quizzes", "notes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-3 border-b-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-[#6b7280] hover:text-[#4b5563] hover:border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="px-6 py-4">
        {activeTab === "overview" && (
          <div>
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="font-medium text-[#243b53]">Progress Breakdown</h4>
            </div>

            <div className="space-y-3">
              {subject.modules.map((module) => (
                <div key={module.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[#4b5563]">
                      {module.name}
                    </span>
                    <span className="text-sm font-medium text-blue-500">
                      {module.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-[#6b7280]">Hours Spent</p>
                <p className="font-semibold text-lg text-[#334e68]">
                  {subject.hoursSpent}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-[#6b7280]">Sessions</p>
                <p className="font-semibold text-lg text-[#334e68]">
                  {subject.sessions}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-[#6b7280]">Average Score</p>
                <p className="font-semibold text-lg text-[#334e68]">
                  {subject.averageScore}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="py-2">
            {subject.assignments.map((assignment, index) => (
              <div
                key={index}
                className="py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-[#243b53]">
                    {assignment.title}
                  </h4>
                  <span
                    className={`text-sm rounded-full px-2 py-1 ${
                      assignment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : assignment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {assignment.status.charAt(0).toUpperCase() +
                      assignment.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-[#6b7280] mt-1">
                  {assignment.description}
                </p>
                <div className="flex items-center mt-2 text-xs text-[#6b7280]">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>Due: {assignment.dueDate}</span>
                  {assignment.grade && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Grade: {assignment.grade}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="py-2">
            {subject.quizzes.map((quiz, index) => (
              <div
                key={index}
                className="py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-[#243b53]">{quiz.title}</h4>
                  <span className="text-sm font-medium text-[#334e68]">
                    {quiz.score}/{quiz.totalPoints}
                  </span>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(quiz.score / quiz.totalPoints) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-blue-500">
                    {Math.round((quiz.score / quiz.totalPoints) * 100)}%
                  </span>
                </div>
                <div className="flex items-center mt-2 text-xs text-[#6b7280]">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>Completed: {quiz.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="py-2">
            {subject.notes.length > 0 ? (
              subject.notes.map((note, index) => (
                <div
                  key={index}
                  className="py-3 border-b border-gray-100 last:border-b-0"
                >
                  <h4 className="font-medium text-[#243b53]">{note.title}</h4>
                  <p className="text-sm text-[#6b7280] mt-1">{note.content}</p>
                  <div className="flex items-center mt-2 text-xs text-[#6b7280]">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>Added: {note.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[#6b7280]">
                <p>No notes added for this subject yet.</p>
                <button className="mt-2 text-sm text-blue-500 font-medium">
                  Add your first note
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function DetailedProgressPage() {
  // Mock data for detailed subject progress
  const subjectsWithDetails = [
    {
      name: "Mathematics",
      progress: 85,
      hoursSpent: 18,
      sessions: 12,
      averageScore: "87%",
      modules: [
        { name: "Algebra", progress: 95 },
        { name: "Geometry", progress: 80 },
        { name: "Calculus", progress: 75 },
        { name: "Statistics", progress: 90 },
      ],
      assignments: [
        {
          title: "Quadratic Equations Problem Set",
          description: "Complete problems 1-20 on quadratic equations",
          status: "completed",
          dueDate: "Mar 15, 2025",
          grade: "A",
        },
        {
          title: "Geometry Proofs",
          description: "Complete the proof exercises in Chapter 7",
          status: "pending",
          dueDate: "Apr 20, 2025",
        },
        {
          title: "Statistics Project",
          description: "Data analysis project on population demographics",
          status: "in progress",
          dueDate: "May 5, 2025",
        },
      ],
      quizzes: [
        {
          title: "Algebra Mid-Term Quiz",
          score: 18,
          totalPoints: 20,
          date: "Mar 10, 2025",
        },
        {
          title: "Geometry Concepts Quiz",
          score: 12,
          totalPoints: 15,
          date: "Feb 25, 2025",
        },
      ],
      notes: [
        {
          title: "Logarithm Rules",
          content:
            "Notes on the key rules for logarithms and how to apply them...",
          date: "Mar 5, 2025",
        },
        {
          title: "Trigonometric Identities",
          content:
            "Reference sheet with all important trigonometric formulas...",
          date: "Feb 15, 2025",
        },
      ],
    },
    {
      name: "Physics",
      progress: 72,
      hoursSpent: 14,
      sessions: 9,
      averageScore: "76%",
      modules: [
        { name: "Mechanics", progress: 85 },
        { name: "Thermodynamics", progress: 65 },
        { name: "Electromagnetism", progress: 60 },
        { name: "Optics", progress: 80 },
      ],
      assignments: [
        {
          title: "Newton's Laws Lab Report",
          description: "Analysis of experimental data from Newton's Laws lab",
          status: "completed",
          dueDate: "Mar 8, 2025",
          grade: "B+",
        },
        {
          title: "Energy Conservation Problems",
          description: "Solve problems 5-15 on energy conservation",
          status: "pending",
          dueDate: "Apr 18, 2025",
        },
      ],
      quizzes: [
        {
          title: "Mechanics Quiz",
          score: 22,
          totalPoints: 30,
          date: "Mar 12, 2025",
        },
      ],
      notes: [
        {
          title: "Electric Field Formulas",
          content: "Summary of key electric field formulas and applications...",
          date: "Mar 1, 2025",
        },
      ],
    },
    {
      name: "Chemistry",
      progress: 90,
      hoursSpent: 16,
      sessions: 10,
      averageScore: "92%",
      modules: [
        { name: "Atomic Structure", progress: 100 },
        { name: "Chemical Bonding", progress: 95 },
        { name: "Organic Chemistry", progress: 80 },
        { name: "Thermochemistry", progress: 85 },
      ],
      assignments: [
        {
          title: "Periodic Table Analysis",
          description: "Analysis of element trends in the periodic table",
          status: "completed",
          dueDate: "Feb 28, 2025",
          grade: "A",
        },
        {
          title: "Molecular Structure Report",
          description: "Report on molecular structures and bond types",
          status: "completed",
          dueDate: "Mar 20, 2025",
          grade: "A-",
        },
      ],
      quizzes: [
        {
          title: "Chemical Bonding Quiz",
          score: 19,
          totalPoints: 20,
          date: "Mar 5, 2025",
        },
        {
          title: "Organic Chemistry Quiz",
          score: 14,
          totalPoints: 15,
          date: "Mar 19, 2025",
        },
      ],
      notes: [
        {
          title: "Reaction Mechanisms",
          content:
            "Notes on important organic chemistry reaction mechanisms...",
          date: "Mar 15, 2025",
        },
      ],
    },
    {
      name: "Biology",
      progress: 65,
      hoursSpent: 12,
      sessions: 8,
      averageScore: "71%",
      modules: [
        { name: "Cell Biology", progress: 85 },
        { name: "Genetics", progress: 70 },
        { name: "Ecology", progress: 50 },
        { name: "Evolution", progress: 55 },
      ],
      assignments: [
        {
          title: "Cell Structure Drawing",
          description: "Detailed labeled drawing of cellular structures",
          status: "completed",
          dueDate: "Mar 10, 2025",
          grade: "B",
        },
        {
          title: "Genetics Problem Set",
          description: "Complete Mendelian genetics problems on pg. 45",
          status: "in progress",
          dueDate: "Apr 12, 2025",
        },
      ],
      quizzes: [
        {
          title: "Cell Biology Quiz",
          score: 18,
          totalPoints: 25,
          date: "Feb 28, 2025",
        },
      ],
      notes: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
      {/* Header with back button */}
      <div className="mb-8">
        <Link
          href="/student"
          className="inline-flex items-center text-[#4b5563] hover:text-blue-500 mb-4"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to Dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-[#243b53] flex items-center">
          <AcademicCapIcon className="h-8 w-8 mr-2 text-blue-500" />
          My Learning Progress
        </h1>
        <p className="text-[#4b5563] mt-1">
          Track your academic journey across all subjects
        </p>
      </div>

      {/* Overall progress card */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#243b53] flex items-center">
            <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-blue-500" />
            Overall Progress
          </h2>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-100 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">Average Score</p>
              <p className="font-bold text-2xl text-blue-700">87%</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">Total Sessions</p>
              <p className="font-bold text-2xl text-blue-700">39</p>
            </div>
            <div className="bg-blue-100 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">Hours of Learning</p>
              <p className="font-bold text-2xl text-blue-700">60</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">Completion Rate</p>
              <p className="font-bold text-2xl text-blue-700">78%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Individual subject progress details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#243b53] mb-4">
          Subject Breakdown
        </h2>
        {subjectsWithDetails.map((subject) => (
          <DetailedSubjectProgress key={subject.name} subject={subject} />
        ))}
      </div>
    </div>
  );
}
