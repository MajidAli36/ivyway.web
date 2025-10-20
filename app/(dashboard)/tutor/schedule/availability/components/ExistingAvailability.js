import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Days of the week (align IDs with API and page: Sunday=0 ... Saturday=6)
const days = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

const recurrenceLabels = {
  "one-time": "One Time",
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  monthly: "Monthly",
};

export default function ExistingAvailability({
  slots = [], // Default to empty array
  isLoading,
  onUpdate,
  onDelete,
  recurrenceOptions,
}) {
  const [editingSlot, setEditingSlot] = useState(null);
  const [groupedSlots, setGroupedSlots] = useState([]);

  // Process slots when they change
  useEffect(() => {
    try {
      console.log("ExistingAvailability received slots:", slots);

      // Safe check for slots being array
      const safeSlots = Array.isArray(slots) ? slots : [];

      // Filter out invalid slots with safe property access
      const validSlots = safeSlots.filter(
        (slot) =>
          slot &&
          typeof slot === "object" &&
          typeof slot.dayOfWeek !== "undefined" &&
          slot.id // Ensure it has an ID
      );

      // Handle empty array gracefully
      if (validSlots.length === 0) {
        console.log("No valid slots found to display");
      }

      // Group slots by day with safe number conversion
      const newGroupedSlots = days.map((day) => ({
        ...day,
        slots: validSlots.filter((slot) => {
          try {
            const slotDay = Number(slot.dayOfWeek);
            return !isNaN(slotDay) && slotDay === day.id;
          } catch (err) {
            console.warn("Error processing slot dayOfWeek:", err);
            return false;
          }
        }),
      }));

      setGroupedSlots(newGroupedSlots);
    } catch (error) {
      console.error("Error processing slots:", error);
      // Fallback to empty groups
      setGroupedSlots(days.map((day) => ({ ...day, slots: [] })));
    }
  }, [slots]);

  // Convert time string to Date object for DatePicker
  const parseTimeToDate = (timeString) => {
    if (!timeString) return new Date();

    console.log(`Parsing time string: "${timeString}"`);

    try {
      // Properly handle time format
      const timeParts = timeString.split(":");
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      console.log(`Extracted hours: ${hours}, minutes: ${minutes}`);

      // Create a new date with today's date but specific time
      const today = new Date();
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes,
        0,
        0
      );

      return date;
    } catch (error) {
      console.error(`Error parsing time "${timeString}":`, error);
      return new Date();
    }
  };

  // Convert Date object to time string for API
  const formatDateToTime = (date) => {
    return format(date, "HH:mm");
  };

  const handleStartEdit = (slot) => {
    setEditingSlot({ ...slot });
  };

  const handleCancelEdit = () => {
    setEditingSlot(null);
  };

  const handleSaveEdit = () => {
    if (editingSlot) {
      onUpdate(editingSlot.id, editingSlot);
      setEditingSlot(null);
    }
  };

  const updateEditingField = (field, value) => {
    setEditingSlot((prev) => ({ ...prev, [field]: value }));
  };

  // Check if there are any slots to display
  const hasSlots = groupedSlots.some(
    (day) => day.slots && day.slots.length > 0
  );

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h2 className="text-xl font-semibold">Your Current Availability</h2>
        <p className="text-sm opacity-90">
          View and manage your existing availability slots
        </p>
      </div>

      {isLoading ? (
        <div className="p-6 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="p-6">
          {!hasSlots ? (
            <div className="text-center p-6 text-gray-500">
              <p>You haven't set any availability slots yet.</p>
              <p className="text-sm mt-2">
                Add slots below to make yourself available for bookings.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedSlots.map(
                (day) =>
                  day.slots.length > 0 && (
                    <div
                      key={day.id}
                      className="border-b pb-5 last:border-b-0 last:pb-0"
                    >
                      <h3 className="font-medium text-[#243b53] mb-3">
                        {day.name}
                      </h3>
                      <div className="space-y-4">
                        {day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`rounded-lg border ${
                              slot.isAvailable
                                ? "border-green-100 bg-green-50"
                                : "border-amber-100 bg-amber-50"
                            }`}
                          >
                            {editingSlot && editingSlot.id === slot.id ? (
                              <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                                  <div>
                                    <label className="block text-sm font-medium text-[#4b5563] mb-2">
                                      Start Time
                                    </label>
                                    <DatePicker
                                      selected={parseTimeToDate(
                                        editingSlot.startTime
                                      )}
                                      onChange={(date) =>
                                        updateEditingField(
                                          "startTime",
                                          formatDateToTime(date)
                                        )
                                      }
                                      showTimeSelect
                                      showTimeSelectOnly
                                      timeIntervals={15}
                                      timeCaption="Time"
                                      dateFormat="h:mm aa"
                                      className="w-full h-11 rounded-md border-gray-300 shadow-sm px-4 py-2 focus:border-blue-600 focus:ring-blue-600 text-base"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-[#4b5563] mb-2">
                                      End Time
                                    </label>
                                    <DatePicker
                                      selected={parseTimeToDate(
                                        editingSlot.endTime
                                      )}
                                      onChange={(date) =>
                                        updateEditingField(
                                          "endTime",
                                          formatDateToTime(date)
                                        )
                                      }
                                      showTimeSelect
                                      showTimeSelectOnly
                                      timeIntervals={15}
                                      timeCaption="Time"
                                      dateFormat="h:mm aa"
                                      className="w-full h-11 rounded-md border-gray-300 shadow-sm px-4 py-2 focus:border-blue-600 focus:ring-blue-600 text-base"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-[#4b5563] mb-2">
                                      Availability
                                    </label>
                                    <select
                                      value={editingSlot.isAvailable.toString()}
                                      onChange={(e) =>
                                        updateEditingField(
                                          "isAvailable",
                                          e.target.value === "true"
                                        )
                                      }
                                      className="w-full h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    >
                                      <option value="true">Available</option>
                                      <option value="false">Unavailable</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-[#4b5563] mb-2">
                                      Recurrence
                                    </label>
                                    <select
                                      value={editingSlot.recurrence}
                                      onChange={(e) =>
                                        updateEditingField(
                                          "recurrence",
                                          e.target.value
                                        )
                                      }
                                      className="w-full h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                                    >
                                      {recurrenceOptions.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                  >
                                    Save Changes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800 text-lg">
                                    {format(
                                      parseTimeToDate(slot.startTime),
                                      "h:mm aa"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      parseTimeToDate(slot.endTime),
                                      "h:mm aa"
                                    )}
                                    {process.env.NODE_ENV === "development" && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        (raw: {slot.startTime} - {slot.endTime})
                                      </span>
                                    )}
                                  </p>
                                  <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-3">
                                    <span
                                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        slot.isAvailable
                                          ? "bg-green-100 text-green-800"
                                          : "bg-amber-100 text-amber-800"
                                      }`}
                                    >
                                      {slot.isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                      {recurrenceLabels[slot.recurrence] ||
                                        slot.recurrence}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleStartEdit(slot)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      console.log("Slot being deleted:", slot);
                                      console.log(
                                        "Slot ID for deletion:",
                                        slot.id
                                      );
                                      onDelete(slot.id);
                                    }}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
