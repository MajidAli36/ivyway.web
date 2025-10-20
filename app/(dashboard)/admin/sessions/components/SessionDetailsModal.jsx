import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SessionDetailsModal({
  isOpen,
  onClose,
  session,
  onCancel,
}) {
  if (!session) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Session Details
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mb-6">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      (session.status || "").toLowerCase() === "scheduled" || (session.status || "").toLowerCase() === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : (session.status || "").toLowerCase() === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {(session.status || "").toString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Student Information
                      </h4>
                      <div className="mt-1 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                          {session.student.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {session.student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.student.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.student.grade}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Tutor Information
                      </h4>
                      <div className="mt-1 flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                          {session.tutor.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {session.tutor.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.tutor.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            Specializes in {session.tutor.subject}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Session Details
                      </h4>
                      <div className="mt-1 bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Subject:</p>
                          <p className="text-sm text-gray-900">{session.subject || session.planName || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Topic:</p>
                          <p className="text-sm text-gray-900">{session.topic || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Date:</p>
                          <p className="text-sm text-gray-900">
                            {new Date(session.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Time:</p>
                          <p className="text-sm text-gray-900">
                            {session.startTime} - {session.endTime}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Session Type:</p>
                          <p className="text-sm text-gray-900">{session.sessionType || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Price:</p>
                          <p className="text-sm text-gray-900">{session.price ? `$${session.price}` : '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Plan:</p>
                          <p className="text-sm text-gray-900">{session.planName || session.planType || '-'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Duration:</p>
                          <p className="text-sm text-gray-900">
                            {session.duration} minutes
                          </p>
                        </div>
                        {/* <div className="grid grid-cols-2 gap-1">
                          <p className="text-xs text-gray-500">Price:</p>
                          <p className="text-sm text-gray-900">
                            ${session.price}
                          </p>
                        </div> */}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Location
                      </h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {session.location}
                      </p>
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-500 underline"
                        >
                          Join Meeting Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {session.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">
                      Session Notes
                    </h4>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {session.notes}
                    </p>
                  </div>
                )}

                <div className="mt-8 border-t pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    onClick={onClose}
                  >
                    Close
                  </button>

                  {session.status === "Scheduled" && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                      onClick={() => {
                        onCancel(session.id);
                        onClose();
                      }}
                    >
                      Cancel Session
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
