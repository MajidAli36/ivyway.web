"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/20/solid";
import {
  UserGroupIcon,
  CalendarIcon,
  ArrowLongRightIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Student progress status types
const statusStyles = {
  "On Track": "bg-green-50 text-green-700 border border-green-200",
  "Needs Attention": "bg-amber-50 text-amber-700 border border-amber-200",
  "At Risk": "bg-red-50 text-red-700 border border-red-200",
};

export default function CounselorStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // Mock data (would come from API in real implementation)
  const students = [
    {
      id: 1,
      name: "Emma Davis",
      grade: "10th",
      subjects: ["Mathematics", "Physics", "Chemistry"],
      status: "On Track",
      lastSessionDate: "2025-03-18",
    },
    {
      id: 2,
      name: "James Wilson",
      grade: "11th",
      subjects: ["English", "History", "Economics"],
      status: "Needs Attention",
      lastSessionDate: "2025-03-17",
    },
    {
      id: 3,
      name: "Sophie Martinez",
      grade: "12th",
      subjects: ["Biology", "Chemistry", "Physics"],
      status: "On Track",
      lastSessionDate: "2025-03-15",
    },
    {
      id: 4,
      name: "Ryan Thompson",
      grade: "10th",
      subjects: ["Mathematics", "Computer Science"],
      status: "At Risk",
      lastSessionDate: "2025-03-12",
    },
    {
      id: 5,
      name: "Olivia Garcia",
      grade: "11th",
      subjects: ["English", "Spanish", "History"],
      status: "Needs Attention",
      lastSessionDate: "2025-03-19",
    },
    {
      id: 6,
      name: "Lucas Kim",
      grade: "9th",
      subjects: ["Mathematics", "Science"],
      status: "On Track",
      lastSessionDate: "2025-03-20",
    },
    {
      id: 7,
      name: "Isabella Chen",
      grade: "12th",
      subjects: ["Calculus", "Physics", "Chemistry"],
      status: "On Track",
      lastSessionDate: "2025-03-16",
    },
    {
      id: 8,
      name: "Ethan Williams",
      grade: "10th",
      subjects: ["Biology", "English"],
      status: "Needs Attention",
      lastSessionDate: "2025-03-14",
    },
  ];

  // Filter grades for dropdown
  const grades = [
    "All Grades",
    ...new Set(students.map((student) => student.grade)),
  ];

  // Filter statuses for dropdown
  const statuses = [
    "All Status",
    ...new Set(students.map((student) => student.status)),
  ];

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesGrade =
      selectedGrade === "All Grades" || student.grade === selectedGrade;
    const matchesStatus =
      selectedStatus === "All Status" || student.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#243b53] flex items-center">
          <UserGroupIcon className="h-8 w-8 mr-3 text-[#4f46e5]" />
          My Students
        </h1>
        <p className="mt-1 text-[#6b7280]">
          Manage and track progress for all your assigned students
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              Search students
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-[#9ca3af]"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-[#4f46e5] focus:border-[#4f46e5] block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
                placeholder="Search by name or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-[#334e68]"
            >
              Grade
            </label>
            <select
              id="grade"
              name="grade"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] sm:text-sm rounded-lg"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[#334e68]"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] sm:text-sm rounded-lg"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-4">
          <div className="text-sm text-[#6b7280]">
            <span className="font-medium text-[#243b53]">
              {filteredStudents.length}
            </span>{" "}
            students found
          </div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-[#4f46e5] text-sm font-medium rounded-full text-[#4f46e5] bg-white hover:bg-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors"
          >
            <FunnelIcon className="h-4 w-4 mr-1.5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Subjects
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Last Session
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-medium text-[#4b5563] uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#486581] to-[#4f46e5] flex items-center justify-center text-white font-semibold">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#334e68]">
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-[#6b7280]">
                      <AcademicCapIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                      {student.grade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#4f46e5]"
                        >
                          <BookOpenIcon className="h-3 w-3 mr-1" />
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                        statusStyles[student.status]
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-[#6b7280]">
                      <CalendarIcon className="h-4 w-4 mr-1.5 text-[#9ca3af]" />
                      {new Date(student.lastSessionDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/counselor/students/${student.id}`}
                      className="mr-4"
                    >
                      <button className="inline-flex items-center px-3 py-1.5 border border-[#4f46e5] shadow-sm text-sm font-medium rounded-full text-[#4f46e5] bg-white hover:bg-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors">
                        View Details
                      </button>
                    </Link>
                    <Link href={`/counselor/students/${student.id}/schedule`}>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-gradient-to-r from-[#486581] to-[#4f46e5] hover:from-[#334e68] hover:to-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all">
                        Schedule
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UserGroupIcon className="h-10 w-10 text-[#9ca3af]" />
            </div>
            <h3 className="text-lg font-medium text-[#243b53]">
              No students found
            </h3>
            <p className="mt-1 text-[#6b7280]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredStudents.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-[#4f46e5] bg-white hover:bg-[#dbeafe] transition-colors">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-[#4f46e5] bg-white hover:bg-[#dbeafe] transition-colors">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#6b7280]">
                Showing <span className="font-medium text-[#243b53]">1</span> to{" "}
                <span className="font-medium text-[#243b53]">8</span> of{" "}
                <span className="font-medium text-[#243b53]">8</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-full shadow-sm -space-x-px overflow-hidden"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-[#6b7280] hover:bg-[#dbeafe] transition-colors">
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-[#4f46e5] text-sm font-medium text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-[#6b7280] hover:bg-[#dbeafe] transition-colors">
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
