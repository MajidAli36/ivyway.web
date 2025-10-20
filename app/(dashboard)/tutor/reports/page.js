"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  ChevronDownIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// Filter component for reports
const ReportFilters = ({ filters, setFilters }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by student or subject..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Status Filter */}
        <div className="relative w-full sm:w-40">
          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="relative w-full sm:w-48">
          <select
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={filters.timePeriod}
            onChange={(e) =>
              setFilters({ ...filters, timePeriod: e.target.value })
            }
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Report Card Component
const ReportCard = ({ session, onViewReport, onCreateReport }) => {
  const hasReport = session.reportStatus === "completed";

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {session.student
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {session.student}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <AcademicCapIcon className="h-4 w-4 mr-1" />
                {session.subject}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              hasReport
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {hasReport ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Report Complete
              </>
            ) : (
              <>
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                Report Pending
              </>
            )}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
            {session.date}
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
            {session.time}
          </div>
        </div>

        <div className="mt-5 space-x-3 flex justify-end">
          {hasReport ? (
            <button
              onClick={() => onViewReport(session)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-4 w-4 mr-1.5" />
              View Report
            </button>
          ) : (
            <button
              onClick={() => onCreateReport(session)}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PencilIcon className="h-4 w-4 mr-1.5" />
              Create Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Report Form Modal
const ReportFormModal = ({
  isOpen,
  closeModal,
  session,
  existingReport = null,
}) => {
  const isEditMode = !!existingReport;
  const [report, setReport] = useState({
    topics: existingReport?.topics || "",
    progress: existingReport?.progress || "",
    strengths: existingReport?.strengths || "",
    improvements: existingReport?.improvements || "",
    homework: existingReport?.homework || "",
    nextSteps: existingReport?.nextSteps || "",
    progressRating: existingReport?.progressRating || 3,
  });

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert(
      isEditMode ? "Report updated successfully" : "Report created successfully"
    );
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    {isEditMode
                      ? "Edit Session Report"
                      : "Create Session Report"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="mb-5 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {session.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {session.student}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {session.subject}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {session.date}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topics Covered
                      </label>
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={report.topics}
                        onChange={(e) =>
                          setReport({ ...report, topics: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress Summary
                      </label>
                      <textarea
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Overall progress of the student in this session"
                        value={report.progress}
                        onChange={(e) =>
                          setReport({ ...report, progress: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Strengths
                        </label>
                        <textarea
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Areas where the student excelled"
                          value={report.strengths}
                          onChange={(e) =>
                            setReport({ ...report, strengths: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Areas for Improvement
                        </label>
                        <textarea
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Topics that need additional focus"
                          value={report.improvements}
                          onChange={(e) =>
                            setReport({
                              ...report,
                              improvements: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Homework Assigned
                      </label>
                      <textarea
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Assignments or practice given to the student"
                        value={report.homework}
                        onChange={(e) =>
                          setReport({ ...report, homework: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Session Plan
                      </label>
                      <textarea
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Topics and goals for the next session"
                        value={report.nextSteps}
                        onChange={(e) =>
                          setReport({ ...report, nextSteps: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Progress Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReport({ ...report, progressRating: star })
                            }
                            className="focus:outline-none"
                          >
                            <StarIcon
                              className={`h-6 w-6 ${
                                report.progressRating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {report.progressRating === 1 &&
                            "Needs significant help"}
                          {report.progressRating === 2 && "Below expectations"}
                          {report.progressRating === 3 &&
                            "Meeting expectations"}
                          {report.progressRating === 4 && "Above expectations"}
                          {report.progressRating === 5 && "Excellent progress"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {isEditMode ? "Update Report" : "Submit Report"}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// View Report Modal
const ViewReportModal = ({ isOpen, closeModal, session, report }) => {
  if (!session || !report) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Session Report
                  </Dialog.Title>
                  <div className="flex space-x-2">
                    <button
                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100"
                      onClick={() => {
                        /* Download functionality */
                      }}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-5 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {session.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {session.student}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {session.subject}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {session.date}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {session.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        TOPICS COVERED
                      </h4>
                      <p className="text-sm text-gray-900">{report.topics}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        PROGRESS SUMMARY
                      </h4>
                      <p className="text-sm text-gray-900">{report.progress}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          STRENGTHS
                        </h4>
                        <p className="text-sm text-gray-900">
                          {report.strengths}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          AREAS FOR IMPROVEMENT
                        </h4>
                        <p className="text-sm text-gray-900">
                          {report.improvements}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        HOMEWORK ASSIGNED
                      </h4>
                      <p className="text-sm text-gray-900">{report.homework}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        NEXT SESSION PLAN
                      </h4>
                      <p className="text-sm text-gray-900">
                        {report.nextSteps}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        PROGRESS RATING
                      </h4>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              report.progressRating >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {report.progressRating === 1 &&
                            "Needs significant help"}
                          {report.progressRating === 2 && "Below expectations"}
                          {report.progressRating === 3 &&
                            "Meeting expectations"}
                          {report.progressRating === 4 && "Above expectations"}
                          {report.progressRating === 5 && "Excellent progress"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      <PencilIcon className="h-4 w-4 mr-1.5 inline" />
                      Edit Report
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Main page component
export default function SessionReportPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    timePeriod: "all",
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Mock session data
  const sessions = [
    {
      id: 1,
      student: "Emily Johnson",
      subject: "Mathematics",
      date: "Apr 15, 2025",
      time: "3:00 PM - 4:00 PM",
      reportStatus: "completed",
    },
    {
      id: 2,
      student: "Michael Brown",
      subject: "Physics",
      date: "Apr 16, 2025",
      time: "5:00 PM - 6:00 PM",
      reportStatus: "pending",
    },
    {
      id: 3,
      student: "Sarah Wilson",
      subject: "Chemistry",
      date: "Apr 17, 2025",
      time: "2:00 PM - 3:00 PM",
      reportStatus: "completed",
    },
    {
      id: 4,
      student: "James Miller",
      subject: "Biology",
      date: "Apr 18, 2025",
      time: "4:00 PM - 5:00 PM",
      reportStatus: "pending",
    },
    {
      id: 5,
      student: "Emma Davis",
      subject: "Computer Science",
      date: "Apr 19, 2025",
      time: "1:00 PM - 2:00 PM",
      reportStatus: "completed",
    },
  ];

  // Sample report data (in a real app, would be fetched from API)
  const sampleReport = {
    topics: "Quadratic equations, Completing the square, Quadratic formula",
    progress:
      "Emily has shown good understanding of solving quadratic equations using various methods. She was able to complete most of the exercises with minimal help.",
    strengths:
      "Strong algebraic manipulation skills. Quick at recognizing patterns in equations.",
    improvements:
      "Still needs practice with word problems and applications of quadratic equations.",
    homework:
      "Complete exercises 4-12 on page 87 of the textbook. Review the word problem examples we covered.",
    nextSteps:
      "Focus on applications of quadratic equations in real-world scenarios. Prepare for the upcoming quiz on this topic.",
    progressRating: 4,
  };

  // Filter sessions based on filters
  const filteredSessions = sessions.filter((session) => {
    // Filter by search term
    if (
      filters.search &&
      !session.student.toLowerCase().includes(filters.search.toLowerCase()) &&
      !session.subject.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (
      filters.status !== "all" &&
      ((filters.status === "completed" &&
        session.reportStatus !== "completed") ||
        (filters.status === "pending" && session.reportStatus !== "pending"))
    ) {
      return false;
    }

    // Time period filtering would be implemented here in a real app

    return true;
  });

  const handleCreateReport = (session) => {
    setSelectedSession(session);
    setIsFormModalOpen(true);
  };

  const handleViewReport = (session) => {
    setSelectedSession(session);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Reports</h1>
          <p className="text-gray-600 mt-1">
            Create and manage detailed reports for your tutoring sessions
          </p>
        </div>
      </div>

      {/* Filters */}
      <ReportFilters filters={filters} setFilters={setFilters} />

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Total Reports</div>
              <div className="text-xl font-semibold">{sessions.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-xl font-semibold">
                {sessions.filter((s) => s.reportStatus === "completed").length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-semibold">
                {sessions.filter((s) => s.reportStatus === "pending").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Report Cards */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <ReportCard
              key={session.id}
              session={session}
              onViewReport={handleViewReport}
              onCreateReport={handleCreateReport}
            />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No reports found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No session reports match your current filters.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  setFilters({ search: "", status: "all", timePeriod: "all" })
                }
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReportFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        session={selectedSession}
      />

      <ViewReportModal
        isOpen={isViewModalOpen}
        closeModal={() => setIsViewModalOpen(false)}
        session={selectedSession}
        report={sampleReport} // In a real app, this would be fetched based on the session
      />
    </div>
  );
}
