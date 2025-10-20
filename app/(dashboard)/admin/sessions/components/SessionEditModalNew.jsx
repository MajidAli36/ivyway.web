import { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function SessionEditModal({
  isOpen,
  onClose,
  session,
  onUpdate,
}) {
  if (!session) return null;

  // State for form data with real-time updates
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    status: session.status || "pending",
    sessionType: session.location || "virtual",
    notes: session.notes || "",
    meetingLink: session.meetingLink || ""
  });

  // Debounced auto-update to prevent too many API calls
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);

  // Helper function to safely format date for datetime-local input
  const formatDateForInput = (dateStr, timeStr) => {
    try {
      if (!dateStr || !timeStr) {
        console.warn("Missing date or time:", { dateStr, timeStr });
        return "";
      }
      
      // Ensure we have valid date and time strings
      const date = dateStr.toString().trim();
      const time = timeStr.toString().trim();
      
      if (!date || !time) {
        console.warn("Empty date or time after trim:", { date, time });
        return "";
      }
      
      // Create the full datetime string
      const dateTimeStr = `${date}T${time}`;
      console.log("Creating date from:", dateTimeStr);
      
      // Validate the date
      const dateObj = new Date(dateTimeStr);
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid date:", dateTimeStr);
        return "";
      }
      
      // Return formatted string for datetime-local input
      return dateObj.toISOString().slice(0, 16);
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "";
    }
  };

  // Initialize form data when session changes
  useEffect(() => {
    if (session) {
      const startDateTime = formatDateForInput(session.date, session.startTime);
      const endDateTime = formatDateForInput(session.date, session.endTime);
      
      setFormData({
        startTime: startDateTime,
        endTime: endDateTime,
        status: session.status || "pending",
        sessionType: session.location || "virtual",
        notes: session.notes || "",
        meetingLink: session.meetingLink || ""
      });
    }
  }, [session]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
    };
  }, [updateTimeout]);

  // Handle real-time form updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear existing timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // Set new timeout for auto-update (500ms delay)
    if (name === 'startTime' || name === 'endTime') {
      const newTimeout = setTimeout(() => {
        if (formData.startTime && formData.endTime) {
          autoUpdateSession();
        }
      }, 500);
      setUpdateTimeout(newTimeout);
    }
  };

  // Auto-update session when dates change
  const autoUpdateSession = useCallback(() => {
    try {
      if (!formData.startTime || !formData.endTime) return;

      const startTime = new Date(formData.startTime).toISOString();
      const endTime = new Date(formData.endTime).toISOString();

      // Validate that end time is after start time
      if (new Date(endTime) <= new Date(startTime)) {
        console.warn("End time must be after start time");
        return;
      }

      setIsAutoUpdating(true);

      const updatedSession = {
        id: session.id,
        studentId: session.student.id,
        providerId: session.tutor.id,
        startTime: startTime,
        endTime: endTime,
        status: formData.status,
        sessionType: formData.sessionType,
        notes: formData.notes,
        meetingLink: formData.meetingLink
      };

      // Call the update function immediately
      onUpdate(updatedSession);
      console.log("Session auto-updated:", updatedSession);

      // Reset auto-updating status after a short delay
      setTimeout(() => setIsAutoUpdating(false), 1000);
    } catch (error) {
      console.error("Error auto-updating session:", error);
      setIsAutoUpdating(false);
    }
  }, [formData, session, onUpdate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      if (!formData.startTime || !formData.endTime) {
        alert("Please provide both start and end times");
        return;
      }

      const startTime = new Date(formData.startTime).toISOString();
      const endTime = new Date(formData.endTime).toISOString();

      // Validate that end time is after start time
      if (new Date(endTime) <= new Date(startTime)) {
        alert("End time must be after start time");
        return;
      }

      const updatedSession = {
        id: session.id,
        studentId: session.student.id,
        providerId: session.tutor.id,
        startTime: startTime,
        endTime: endTime,
        status: formData.status,
        sessionType: formData.sessionType,
        notes: formData.notes,
        meetingLink: formData.meetingLink
      };

      onUpdate(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Error updating session. Please check the date/time values.");
    }
  };

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
          <div className="fixed inset-0 bg-black/25" />
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
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Edit Session
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Auto-update status indicator */}
                {isAutoUpdating && (
                  <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700">
                      🔄 Auto-updating session...
                    </p>
                  </div>
                )}

                {/* Auto-update ready indicator */}
                {formData.startTime && formData.endTime && !isAutoUpdating && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✅ Session will auto-update when you change dates
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Session Type
                    </label>
                    <select
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="virtual">Virtual</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meeting Link
                    </label>
                    <input
                      type="text"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
