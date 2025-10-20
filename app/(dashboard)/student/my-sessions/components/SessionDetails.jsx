import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  VideoCameraIcon,
  MapPinIcon,
  ArrowPathIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SessionButton from "@/app/components/SessionButton";

const statusStyles = {
  pending: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: ClockIcon,
    label: "Pending",
  },
  confirmed: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: CheckCircleIcon,
    label: "Confirmed",
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    icon: CheckCircleIcon,
    label: "Completed",
  },
  canceled: {
    bg: "bg-rose-100",
    text: "text-rose-800",
    icon: XCircleIcon,
    label: "Canceled",
  },
  scheduled: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    icon: CalendarIcon,
    label: "Scheduled",
  },
};

export default function SessionDetails({
  session,
  isOpen,
  onClose,
  onCancelSession,
  onRescheduleSession,
}) {
  if (!session) return null;

  const sessionDate = new Date(session.date);
  const formattedDate = sessionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const statusConfig = statusStyles[session.status] || statusStyles.pending;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Session Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Status */}
                <div className="mt-4 flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    <statusConfig.icon className="h-4 w-4 mr-1.5" />
                    {statusConfig.label}
                  </span>
                </div>

                {/* Session Information */}
                <div className="mt-4">
                  <h4 className="text-base font-semibold">
                    {session.subject?.name || "Tutoring Session"}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {session.notes || "No additional notes provided"}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                  <div className="flex items-start">
                    {session.sessionType === "virtual" ? (
                      <VideoCameraIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                    ) : (
                      <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                    )}
                    <span>
                      {session.sessionType === "virtual"
                        ? "Virtual Session"
                        : "In-person Session"}
                    </span>
                  </div>
                  {session.tutor && (
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 mr-2 flex-shrink-0 text-gray-400" />
                      <span>{session.tutor.name}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {/* <div className="mt-6 flex space-x-3">
                  {(session.status === "scheduled" || session.status === "confirmed") && (
                    <>
                      <button
                        type="button"
                        onClick={() => onRescheduleSession(session.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelSession(session.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-br from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                      >
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  )}
                </div> */}

                {/* Zoom button for virtual sessions */}
                {session.sessionType === "virtual" &&
                  (session.status === "confirmed" ||
                    session.status === "scheduled") && (
                    <div className="mt-4 flex justify-center">
                      <SessionButton session={session} userRole="student" />
                    </div>
                  )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
