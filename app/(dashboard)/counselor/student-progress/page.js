"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ArrowLongRightIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function StudentProgressPage() {
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

  // Filter state
  const [filter, setFilter] = useState("all");

  // Filter students based on status
  const filteredStudents =
    filter === "all"
      ? students
      : filter === "attention"
      ? students.filter((student) => student.status !== "On Track")
      : students.filter((student) => student.status === "On Track");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53]">
            Student Progress
          </h1>
          <p className="text-[#6b7280] mt-1">
            Review student performance, identify areas for improvement, and
            track academic progress.
          </p>
        </div>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              filter === "all"
                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700"
                : "text-gray-700 bg-white hover:bg-gray-50"
            } border border-gray-300`}
          >
            All Students
          </button>
          <button
            type="button"
            onClick={() => setFilter("attention")}
            className={`px-4 py-2 text-sm font-medium ${
              filter === "attention"
                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700"
                : "text-gray-700 bg-white hover:bg-gray-50"
            } border-t border-b border-r border-gray-300`}
          >
            Needs Attention
          </button>
          <button
            type="button"
            onClick={() => setFilter("ontrack")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              filter === "ontrack"
                ? "text-white bg-gradient-to-r from-blue-600 to-blue-700"
                : "text-gray-700 bg-white hover:bg-gray-50"
            } border-t border-b border-r border-gray-300`}
          >
            On Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="border border-gray-100 rounded-xl p-5 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold mr-3">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#243b53]">
                    {student.name}{" "}
                    <span className="font-normal">({student.grade})</span>
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Last updated: {student.lastUpdated}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${student.statusColor}-50 text-${student.statusColor}-700 border border-${student.statusColor}-200`}
              >
                {student.issue || student.status}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {student.subjects.map((subject, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#6b7280] flex items-center">
                      <BookOpenIcon className="h-3 w-3 mr-1" />
                      {subject.name}
                    </span>
                    <span className="text-xs font-medium text-[#243b53]">
                      {subject.grade}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`${
                        subject.progress >= 80
                          ? "bg-gradient-to-r from-blue-600 to-blue-700"
                          : subject.progress >= 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                      } h-1.5 rounded-full`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/counselor/student-progress/${student.id}`}>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none">
                  <ChartBarIcon className="h-4 w-4 mr-1.5" />
                  Full Report
                </button>
              </Link>
              <Link href={`/counselor/guidance/${student.id}`}>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                  Offer Guidance
                </button>
              </Link>
              <Link
                href={`/counselor/schedule-session?studentId=${student.id}`}
              >
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 border border-blue-600 bg-white hover:bg-blue-50 focus:outline-none">
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  Schedule Session
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
          <ChartBarIcon className="mx-auto h-10 w-10 text-[#9ca3af]" />
          <p className="mt-2 text-[#6b7280]">
            No students match your current filter.
          </p>
          <button
            onClick={() => setFilter("all")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none"
          >
            View All Students
          </button>
        </div>
      )}
    </div>
  );
}
