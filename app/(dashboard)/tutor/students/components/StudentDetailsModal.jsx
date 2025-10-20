import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  XMarkIcon,
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const StudentDetailsModal = ({ student, isOpen, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getProgramLabel = (program) => {
    const labels = {
      undergraduate: "Undergraduate",
      graduate: "Graduate",
      phd: "PhD",
      other: "Other",
    };
    return labels[program] || program;
  };

  const getPreferredFormatLabel = (format) => {
    const labels = {
      online: "Online",
      "in-person": "In-Person",
      hybrid: "Hybrid",
    };
    return labels[format] || format;
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const get2FABadge = (isEnabled, isVerified) => {
    if (!isEnabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Not Enabled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="h-3 w-3 mr-1" />
        {isVerified ? "Verified" : "Pending"}
      </span>
    );
  };

  const getProfileCompletionColor = (completion) => {
    if (completion >= 80) return "text-green-600";
    if (completion >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-gray-900"
                  >
                    Student Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                  {/* Student Header */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {student.fullName}
                          </h2>
                          <p className="text-gray-600">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(student.isActive)}
                        {get2FABadge(
                          student.is_2fa_enabled,
                          student.is_2fa_verified
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <EnvelopeIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Email:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {student.email}
                          </span>
                        </div>
                        {student.studentProfile?.phoneNumber && (
                          <div className="flex items-center text-sm">
                            <PhoneIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Phone:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {student.studentProfile.phoneNumber}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.dateOfBirth && (
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Date of Birth:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {formatDate(student.studentProfile.dateOfBirth)}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.bio && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              Bio:
                            </span>
                            <p className="mt-1 text-gray-900">
                              {student.studentProfile.bio}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Member Since:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {formatDate(student.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Last Login:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {formatDateTime(student.lastLogin)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                        Academic Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Program:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {student.studentProfile?.program
                              ? getProgramLabel(student.studentProfile.program)
                              : "Not specified"}
                          </span>
                        </div>
                        {student.studentProfile?.major && (
                          <div className="flex items-center text-sm">
                            <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Major:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {student.studentProfile.major}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.gpa && (
                          <div className="flex items-center text-sm">
                            <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              GPA:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {student.studentProfile.gpa}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.expectedGraduation && (
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Expected Graduation:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {student.studentProfile.expectedGraduation}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.academicStanding && (
                          <div className="flex items-center text-sm">
                            <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Academic Standing:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {student.studentProfile.academicStanding}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.enrollmentDate && (
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Enrollment Date:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {formatDate(
                                student.studentProfile.enrollmentDate
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tutoring Preferences */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        Tutoring Preferences
                      </h3>
                      <div className="space-y-3">
                        {student.studentProfile?.subjects &&
                          student.studentProfile.subjects.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">
                                Subjects:
                              </span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {student.studentProfile.subjects.map(
                                  (subject, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {subject}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {student.studentProfile?.availability &&
                          student.studentProfile.availability.length > 0 && (
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">
                                Availability:
                              </span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {student.studentProfile.availability.map(
                                  (time, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                    >
                                      {time}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        {student.studentProfile?.preferredFormat && (
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Preferred Format:
                            </span>
                            <span className="ml-2 text-gray-900">
                              {getPreferredFormatLabel(
                                student.studentProfile.preferredFormat
                              )}
                            </span>
                          </div>
                        )}
                        {student.studentProfile?.additionalNotes && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">
                              Additional Notes:
                            </span>
                            <p className="mt-1 text-gray-900">
                              {student.studentProfile.additionalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Status */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                        Profile Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CheckCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Profile Completion:
                          </span>
                          <span
                            className={`ml-2 font-semibold ${getProfileCompletionColor(
                              student.studentProfile?.profileCompletion || 0
                            )}`}
                          >
                            {student.studentProfile?.profileCompletion || 0}%
                          </span>
                        </div>
                        {student.studentProfile?.introVideoUrl && (
                          <div className="flex items-center text-sm">
                            <VideoCameraIcon className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              Intro Video:
                            </span>
                            <span className="ml-2 text-green-600">
                              Available
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <DocumentTextIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Profile Status:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {student.studentProfile?.status || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            Last Updated:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {formatDateTime(student.studentProfile?.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StudentDetailsModal;
