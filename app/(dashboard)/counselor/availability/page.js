"use client";

import { useState, useEffect, Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { counselorAvailability as availabilityAPI } from "@/app/lib/api/endpoints";
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import apiClient from "@/app/lib/api/client";
import authService from "@/app/lib/auth/authService";

// Days of the week
const days = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

// Recurrence options
const recurrenceOptions = [
  { value: "one-time", label: "One Time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
];

// Session types for counselors
const sessionTypes = [
  { value: "30min", label: "30 minutes", price: 30, counselorEarnings: 20 },
  { value: "60min", label: "60 minutes", price: 40, counselorEarnings: 30 },
];

export default function CounselorAvailability() {
  const [scheduleData, setScheduleData] = useState([]);
  const [newSlots, setNewSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [defaultIsAvailable, setDefaultIsAvailable] = useState(true);
  const [defaultRecurrence, setDefaultRecurrence] = useState("weekly");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();
  }, []);

  // Fetch existing availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!authService.isAuthenticated()) {
        console.warn("User not authenticated, can't fetch availability");
        return;
      }

      setIsLoading(true);

      const result = await safeApiCall(
        () => availabilityAPI.getMyAvailability(),
        {
          extractArray: false,
          dataKey: "data",
          defaultData: {},
          errorMessage: "Failed to load availability data. Please try again.",
        }
      );

      if (result.success) {
        console.log("Fetched availability data:", result.data);

        // Handle the new API response format
        const availabilityData = result.data.availability || result.data;

        // Convert the availability object to array format for display
        const formattedData = [];
        if (availabilityData && typeof availabilityData === "object") {
          Object.keys(availabilityData).forEach((dayOfWeek) => {
            const daySlots = availabilityData[dayOfWeek];
            if (Array.isArray(daySlots)) {
              daySlots.forEach((slot) => {
                // Ensure we have a proper ID - use server ID if available, otherwise generate a temp one
                const slotId =
                  slot.id ||
                  slot._id ||
                  `temp-${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}`;

                formattedData.push({
                  id: slotId,
                  dayOfWeek: parseInt(dayOfWeek),
                  startTime: slot.startTime
                    ? slot.startTime.substring(0, 5)
                    : "09:00",
                  endTime: slot.endTime
                    ? slot.endTime.substring(0, 5)
                    : "10:00",
                  isAvailable: slot.isAvailable !== false,
                  recurrence: slot.recurrence || "weekly",
                  sessionTypes: slot.sessionTypes || ["30min", "60min"],
                  maxSessionsPerDay: slot.maxSessionsPerDay || 8,
                });
              });
            }
          });
        }

        setScheduleData(formattedData);
        setErrorMessage("");
      } else {
        console.error(
          "API call failed, using empty data for testing:",
          result.error
        );
        setScheduleData([]);
        setErrorMessage("Failed to load availability data. Please try again.");
      }

      setIsLoading(false);
    };

    fetchAvailability();
  }, []);

  // Add new slot
  const addNewSlot = () => {
    const newSlot = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      dayOfWeek: 1, // Default to Monday
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: defaultIsAvailable,
      recurrence: defaultRecurrence,
      sessionTypes: ["30min", "60min"],
      maxSessionsPerDay: 8,
    };

    setNewSlots((prev) => [...prev, newSlot]);
  };

  // Update slot
  const updateSlot = (slotId, field, value) => {
    setNewSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    );
  };

  // Remove slot
  const removeSlot = (slotId) => {
    setNewSlots((prev) => prev.filter((slot) => slot.id !== slotId));
  };

  // Delete existing slot
  const deleteSlot = async (slotId) => {
    console.log("🔴 DELETE SLOT: Starting delete process for slot ID:", slotId);
    try {
      setIsLoading(true);
      setErrorMessage("");

      // Find the slot to get its server ID
      const slot = scheduleData.find((s) => s.id === slotId);
      console.log("🔴 DELETE SLOT: Found slot:", slot);
      if (!slot) {
        console.error("🔴 DELETE SLOT: Slot not found with ID:", slotId);
        console.error(
          "🔴 DELETE SLOT: Available slots:",
          scheduleData.map((s) => ({ id: s.id, dayOfWeek: s.dayOfWeek }))
        );
        throw new Error(
          "Slot not found. Please refresh the page and try again."
        );
      }

      // Check if it's a temporary slot (not saved yet)
      if (slot.id.startsWith("temp-")) {
        console.log("🔴 DELETE SLOT: This is a temporary slot, removing from local state only");
        // For temporary slots, just remove from local state
        setScheduleData((prev) => {
          const filtered = prev.filter((s) => s.id !== slotId);
          console.log("🔴 DELETE SLOT: Updated schedule data:", filtered);
          return filtered;
        });
        toast.success("Availability slot removed");
        console.log("🔴 DELETE SLOT: Temporary slot removed successfully");
        return;
      }

      // For saved slots, make API call to delete
      console.log("🔴 DELETE SLOT: Making API call to delete slot ID:", slotId);
      const result = await safeApiCall(() => availabilityAPI.delete(slotId), {
        extractArray: false,
        dataKey: "data",
        defaultData: null,
        errorMessage: "Failed to delete availability slot. Please try again.",
      });
      console.log("🔴 DELETE SLOT: API call result:", result);

      if (result.success) {
        setScheduleData((prev) => prev.filter((s) => s.id !== slotId));
        toast.success("Availability slot deleted");
      } else {
        console.error("Error deleting slot:", result.error);
        setErrorMessage("Failed to delete slot: " + result.error);
        toast.error("Failed to delete slot");
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      setErrorMessage("Failed to delete slot: " + (error.message || error));
      toast.error("Failed to delete slot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Validate time slots
      for (const slot of newSlots) {
        if (slot.startTime >= slot.endTime) {
          throw new Error("Start time must be before end time");
        }

        // Validate dayOfWeek is a number between 0-6
        const dayOfWeek = Number(slot.dayOfWeek);
        if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
          throw new Error(
            `Invalid day of week: ${slot.dayOfWeek}. Must be between 0-6.`
          );
        }
      }

      // Format data for API - removing any temporary UI IDs
      const formattedData = newSlots.map((slot) => ({
        dayOfWeek: Number(slot.dayOfWeek),
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        isAvailable: slot.isAvailable,
        recurrence: slot.recurrence,
        sessionTypes: slot.sessionTypes,
        maxSessionsPerDay: slot.maxSessionsPerDay,
        advanceBookingDays: 14, // Always 14 days for counselors
      }));

      if (formattedData.length === 0) {
        throw new Error("Please add at least one availability slot");
      }

      console.log("Saving counselor availability data:", formattedData);

      // Save all time slots using safe API calls
      const savePromises = formattedData.map((slot) =>
        safeApiCall(() => availabilityAPI.create(slot), {
          extractArray: false,
          dataKey: "data",
          defaultData: null,
          errorMessage: "Failed to save availability slot. Please try again.",
        })
      );

      const results = await Promise.all(savePromises);
      console.log("API responses:", results);

      // Check if all saves were successful
      const failedSaves = results.filter((result) => !result.success);
      if (failedSaves.length > 0) {
        console.error("Some saves failed:", failedSaves);
        setErrorMessage(
          "Some availability slots failed to save. Please try again."
        );
        return;
      }

      // Process the successful responses to get the new slots with their server-generated IDs
      const newSlotsWithIds = results.map((result, index) => {
        const slotData = formattedData[index];
        return {
          id:
            result.data?.id ||
            result.data?.id ||
            `saved-${Date.now()}-${index}`,
          dayOfWeek: slotData.dayOfWeek,
          startTime: slotData.startTime,
          endTime: slotData.endTime,
          isAvailable: slotData.isAvailable,
          recurrence: slotData.recurrence,
          sessionTypes: slotData.sessionTypes,
          maxSessionsPerDay: slotData.maxSessionsPerDay,
        };
      });

      // Add the new slots to the existing schedule data
      setScheduleData((prev) => [...prev, ...newSlotsWithIds]);

      // Clear the new slots
      setNewSlots([]);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error saving availability:", error);
      setErrorMessage(
        "Failed to save availability: " + (error.message || error)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmation handlers
  const handleDeleteConfirm = (slotId) => {
    console.log("🔴 DELETE CONFIRM: Attempting to delete slot with ID:", slotId);
    console.log("🔴 DELETE CONFIRM: Current schedule data:", scheduleData);
    const slot = scheduleData.find((s) => s.id === slotId);
    console.log("🔴 DELETE CONFIRM: Found slot:", slot);

    setPendingAction(() => () => {
      console.log("🔴 PENDING ACTION: About to call deleteSlot with ID:", slotId);
      return deleteSlot(slotId);
    });
    setShowDeleteConfirm(true);
  };

  const handleUpdateConfirm = () => {
    setPendingAction(() => handleSave);
    setShowUpdateConfirm(true);
  };

  const executePendingAction = () => {
    console.log("🔴 EXECUTE PENDING ACTION: pendingAction exists?", !!pendingAction);
    if (pendingAction) {
      console.log("🔴 EXECUTE PENDING ACTION: Calling pending action...");
      pendingAction();
      setPendingAction(null);
    } else {
      console.log("🔴 EXECUTE PENDING ACTION: No pending action to execute!");
    }
  };

  // Refresh data function
  const refreshData = async () => {
    if (!authService.isAuthenticated()) {
      console.warn("User not authenticated, can't refresh availability");
      return;
    }

    setIsLoading(true);

    const result = await safeApiCall(
      () => availabilityAPI.getMyAvailability(),
      {
        extractArray: false,
        dataKey: "data",
        defaultData: {},
        errorMessage: "Failed to refresh availability data. Please try again.",
      }
    );

    if (result.success) {
      console.log("Refreshed availability data:", result.data);

      // Handle the new API response format
      const availabilityData = result.data.availability || result.data;

      // Convert the availability object to array format for display
      const formattedData = [];
      if (availabilityData && typeof availabilityData === "object") {
        Object.keys(availabilityData).forEach((dayOfWeek) => {
          const daySlots = availabilityData[dayOfWeek];
          if (Array.isArray(daySlots)) {
            daySlots.forEach((slot) => {
              // Ensure we have a proper ID - use server ID if available, otherwise generate a temp one
              const slotId =
                slot.id ||
                slot._id ||
                `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;

              formattedData.push({
                id: slotId,
                dayOfWeek: parseInt(dayOfWeek),
                startTime: slot.startTime
                  ? slot.startTime.substring(0, 5)
                  : "09:00",
                endTime: slot.endTime ? slot.endTime.substring(0, 5) : "10:00",
                isAvailable: slot.isAvailable !== false,
                recurrence: slot.recurrence || "weekly",
                sessionTypes: slot.sessionTypes || ["30min", "60min"],
                maxSessionsPerDay: slot.maxSessionsPerDay || 8,
              });
            });
          }
        });
      }

      setScheduleData(formattedData);
      setErrorMessage("");
    } else {
      console.error("Failed to refresh availability data:", result.error);
      setErrorMessage("Failed to refresh availability data. Please try again.");
    }

    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Authentication Required
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please log in to manage your availability.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/counselor"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Counselor Availability
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Set your available hours for counseling sessions
                </p>
              </div>
              {/* <button
                onClick={refreshData}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button> */}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Availability updated successfully!
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errorMessage}
                </h3>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Current Availability
              </h3>

              {/* Existing Availability */}
              {scheduleData.length > 0 ? (
                <div className="space-y-4">
                  {scheduleData.map((slot) => (
                    <div
                      key={slot.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">
                              {days[slot.dayOfWeek]?.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                            <span>
                              {slot.sessionTypes?.join(", ") || "30min, 60min"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            Max: {slot.maxSessionsPerDay} sessions/day
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            console.log("🔴 DELETE BUTTON CLICKED: Slot ID:", slot.id);
                            handleDeleteConfirm(slot.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                          title={
                            slot.id.startsWith("temp-")
                              ? "Remove unsaved slot"
                              : "Delete saved slot"
                          }
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No availability set. Add your first time slot below.
                </p>
              )}

              {/* Add New Slots */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Add New Time Slots
                  </h4>
                  <button
                    onClick={addNewSlot}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Slot
                  </button>
                </div>

                {newSlots.length > 0 && (
                  <div className="space-y-4">
                    {newSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-xl p-5 bg-white border border-gray-100 shadow-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Day of Week */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              Day
                            </label>
                            <select
                              value={slot.dayOfWeek}
                              onChange={(e) =>
                                updateSlot(slot.id, "dayOfWeek", e.target.value)
                              }
                              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {days.map((day) => (
                                <option key={day.id} value={day.id}>
                                  {day.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Start Time */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateSlot(slot.id, "startTime", e.target.value)
                              }
                              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* End Time */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateSlot(slot.id, "endTime", e.target.value)
                              }
                              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* Session Types */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              Session Types
                            </label>
                            <div className="space-y-2">
                              {sessionTypes.map((type) => (
                                <label
                                  key={type.value}
                                  className="flex items-center"
                                >
                                  <input
                                    type="checkbox"
                                    checked={slot.sessionTypes?.includes(
                                      type.value
                                    )}
                                    onChange={(e) => {
                                      const currentTypes =
                                        slot.sessionTypes || [];
                                      const newTypes = e.target.checked
                                        ? [...currentTypes, type.value]
                                        : currentTypes.filter(
                                            (t) => t !== type.value
                                          );
                                      updateSlot(
                                        slot.id,
                                        "sessionTypes",
                                        newTypes
                                      );
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    {type.label} (${type.price})
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Additional Options */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              Max Sessions Per Day
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={slot.maxSessionsPerDay}
                              onChange={(e) =>
                                updateSlot(
                                  slot.id,
                                  "maxSessionsPerDay",
                                  parseInt(e.target.value)
                                )
                              }
                              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                              Recurrence
                            </label>
                            <select
                              value={slot.recurrence}
                              onChange={(e) =>
                                updateSlot(
                                  slot.id,
                                  "recurrence",
                                  e.target.value
                                )
                              }
                              className="block w-full rounded-lg border-gray-200 bg-white py-2.5 px-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {recurrenceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => removeSlot(slot.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove Slot
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleUpdateConfirm}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isLoading ? "Saving..." : "Save Availability"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={showDeleteConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowDeleteConfirm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm" />
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Availability Slot
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this availability slot?
                      This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={() => {
                        console.log("🔴 CONFIRM DELETE BUTTON CLICKED");
                        executePendingAction();
                        setShowDeleteConfirm(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Update Confirmation Modal */}
      <Transition appear show={showUpdateConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowUpdateConfirm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm" />
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Save Availability
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to save these availability slots?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setShowUpdateConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={() => {
                        executePendingAction();
                        setShowUpdateConfirm(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
