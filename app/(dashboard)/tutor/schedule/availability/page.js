"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { availability as availabilityAPI } from "@/app/lib/api/endpoints";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ExistingAvailability from "../availability/components/ExistingAvailability";
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

export default function TutorAvailability() {
  const [scheduleData, setScheduleData] = useState([]);
  const [newSlots, setNewSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ type: '', message: '', description: '' });
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
      try {
        setIsLoading(true);

        if (!authService.isAuthenticated()) {
          console.warn("User not authenticated, can't fetch availability");
          return;
        }

        const response = await availabilityAPI.getMyAvailability();

        // Handle various response formats safely
        if (response && response.data) {
          console.log("Fetched availability data:", response.data);

          // Handle both array and object responses
          const slotsData = Array.isArray(response.data)
            ? response.data
            : Object.values(response.data || {});

          // Format the data, handling potential missing properties
          const formattedData = slotsData
            .map((slot) => ({
              id: slot.id || `temp-${Math.random().toString(36).substring(2)}`,
              dayOfWeek:
                typeof slot.dayOfWeek === "number" ? slot.dayOfWeek : 0,
              startTime: slot.startTime
                ? slot.startTime.substring(0, 5)
                : "09:00",
              endTime: slot.endTime ? slot.endTime.substring(0, 5) : "10:00",
              isAvailable:
                typeof slot.isAvailable === "boolean" ? slot.isAvailable : true,
              recurrence: slot.recurrence || "weekly",
            }))
            .filter((slot) => slot.id); // Filter out any malformed slots

          console.log("Formatted availability data:", formattedData);
          setScheduleData(formattedData);
        } else {
          // Handle missing data gracefully
          console.log(
            "No availability data found - this is normal for new users"
          );
          setScheduleData([]);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Don't show error message for empty data - it's a normal state
        // Just initialize with empty array
        setScheduleData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchAvailability();
    }
  }, [isAuthenticated]);

  // Convert time string to Date object for DatePicker
  const parseTimeToDate = (timeString) => {
    if (!timeString) return new Date();
    try {
      const [hours, minutes] = timeString.split(":");
      const today = new Date();
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    } catch (error) {
      console.error("Error parsing time:", error);
      return new Date();
    }
  };

  // Convert Date object to time string for API
  const formatDateToTime = (date) => {
    // Ensure format HH:MM with proper padding for minutes
    return format(date, "HH:mm");
  };

  const addTimeSlot = (dayId) => {
    const newSlot = {
      id: Math.random().toString(36).substring(2), // Temporary ID for UI
      dayOfWeek: Number(dayId),
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: defaultIsAvailable,
      recurrence: defaultRecurrence,
    };

    setNewSlots([...newSlots, newSlot]);
  };

  const removeTimeSlot = (slotId) => {
    setNewSlots(newSlots.filter((slot) => slot.id !== slotId));
  };

  const updateTimeSlot = (slotId, field, value) => {
    setNewSlots(
      newSlots.map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      )
    );
  };

  // Prepare to update existing slot - show confirmation dialog
  const prepareUpdate = (slotId, updatedData) => {
    setPendingAction({ type: "update", id: slotId, data: updatedData });
    setShowUpdateConfirm(true);
  };

  // Actually update existing availability after confirmation
  const updateExistingSlot = async () => {
    if (!pendingAction || pendingAction.type !== "update") return;

    const { id: slotId, data: updatedData } = pendingAction;

    try {
      setIsLoading(true);
      setShowUpdateConfirm(false);

      await availabilityAPI.update(slotId, {
        dayOfWeek: Number(updatedData.dayOfWeek),
        startTime: updatedData.startTime.substring(0, 5),
        endTime: updatedData.endTime.substring(0, 5),
        isAvailable: updatedData.isAvailable,
        recurrence: updatedData.recurrence,
      });

      await refreshAvailabilityData();

      showSuccess('update', 'Updated!', 'Availability slot updated successfully');
    } catch (error) {
      console.error("Error updating availability:", error);
      setErrorMessage(
        error.message ||
          error.response?.data?.message ||
          "Failed to update availability"
      );
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  // Prepare to delete slot - show confirmation dialog
  const prepareDelete = (slotId) => {
    console.log("prepareDelete received ID:", slotId);
    console.log("Current scheduleData:", scheduleData);

    // Find the slot in scheduleData to verify the ID
    const slotToDelete = scheduleData.find((slot) => slot.id === slotId);
    console.log("Found slot to delete:", slotToDelete);

    setPendingAction({ type: "delete", id: slotId });
    setShowDeleteConfirm(true);
  };

  const deleteSlot = async () => {
    if (!pendingAction || pendingAction.type !== "delete") return;

    const slotId = pendingAction.id;

    // Debug logs
    console.log("Attempting to delete availability slot with ID:", slotId);

    // Find the slot in scheduleData to double-check
    const slotToDelete = scheduleData.find((slot) => slot.id === slotId);
    console.log("Full slot being deleted:", slotToDelete);

    try {
      setIsLoading(true);
      setShowDeleteConfirm(false);

      // Use the ID exactly as it appears in the data, without any transformation
      console.log("Sending delete request to API for ID:", slotId);
      await availabilityAPI.delete(slotId);

      // Instead of manually updating state, refresh from API
      await refreshAvailabilityData();

      showSuccess('delete', 'Deleted!', 'Availability slot removed successfully');
    } catch (error) {
      console.error("Error deleting availability:", error);

      // More detailed error logging
      if (error.response) {
        console.log("API Error Status:", error.response.status);
        console.log("API Error Headers:", error.response.headers);
        console.log("API Error Data:", error.response.data);
      }

      setErrorMessage(
        error.message ||
          error.response?.data?.message ||
          "Failed to delete availability"
      );
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  // Helper function to convert time string to minutes for comparison
  const toMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to check if a slot crosses midnight
  const isCrossMidnight = (startTime, endTime) => {
    const startMin = toMinutes(startTime);
    const endMin = toMinutes(endTime);
    return endMin <= startMin;
  };

  // Helper function to show success messages
  const showSuccess = (type, message, description) => {
    setSuccessMessage({ type, message, description });
    setShowSuccessMessage(true);
    // Auto-close popup after 3 seconds
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Validate time slots - allow cross-midnight slots
      for (const slot of newSlots) {
        const startMin = toMinutes(slot.startTime);
        const endMin = toMinutes(slot.endTime);
        
        // Allow cross-midnight slots (end <= start means it continues to next day)
        // Only validate that times are valid format
        if (isNaN(startMin) || isNaN(endMin)) {
          throw new Error(`Invalid time format for slot: ${slot.startTime} - ${slot.endTime}`);
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
        // Just use HH:MM format without adding seconds
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        isAvailable: slot.isAvailable,
        recurrence: slot.recurrence,
      }));

      if (formattedData.length === 0) {
        throw new Error("Please add at least one availability slot");
      }

      console.log("Saving availability data:", formattedData);

      // Save all time slots
      const savePromises = formattedData.map((slot) =>
        availabilityAPI.create(slot)
      );

      const responses = await Promise.all(savePromises);
      console.log("API responses:", responses);

      // Process the responses to get the new slots with their server-generated IDs
      const newServerSlots = responses
        .map((response) => {
          // Check if response and response.data exist
          if (!response || !response.data) {
            console.warn("Invalid response format:", response);
            return null;
          }

          const slotData = response.data;
          console.log("Processing slot data:", slotData);

          return {
            id: slotData.id || Math.random().toString(36).substring(2),
            dayOfWeek: slotData.dayOfWeek || 0,
            // Safely handle undefined time strings
            startTime: slotData.startTime
              ? slotData.startTime.substring(0, 5)
              : "09:00",
            endTime: slotData.endTime
              ? slotData.endTime.substring(0, 5)
              : "10:00",
            isAvailable:
              typeof slotData.isAvailable === "boolean"
                ? slotData.isAvailable
                : true,
            recurrence: slotData.recurrence || "weekly",
          };
        })
        // Filter out any null values that might have resulted from invalid responses
        .filter((slot) => slot !== null);

      console.log("Formatted new slots:", newServerSlots);

      // Clear the new slots form first
      setNewSlots([]);

      // Refresh data from server to get the latest state
      await refreshAvailabilityData();

      // Show success message
      showSuccess('save', 'Success!', 'Availability saved successfully');
    } catch (error) {
      console.error("Error saving availability:", error);
      setErrorMessage(
        error.message ||
          error.response?.data?.message ||
          "Failed to save availability"
      );

      // Scroll to error message
      document.getElementById("error-message")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDaySlots = (dayId) => {
    const numDayId = Number(dayId);
    return newSlots.filter((slot) => Number(slot.dayOfWeek) === numDayId);
  };

  // Add this function to refresh data
  const refreshAvailabilityData = async () => {
    try {
      setIsLoading(true);
      const response = await availabilityAPI.getMyAvailability();

      // Handle both successful and empty responses
      if (response && response.data) {
        // Handle both array and object responses
        const slotsData = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data || {});

        // Safely process data with fallbacks for missing properties
        const formattedData = slotsData
          .map((slot) => ({
            id: slot.id || `temp-${Math.random().toString(36).substring(2)}`,
            dayOfWeek: typeof slot.dayOfWeek === "number" ? slot.dayOfWeek : 0,
            startTime: slot.startTime
              ? slot.startTime.substring(0, 5)
              : "09:00",
            endTime: slot.endTime ? slot.endTime.substring(0, 5) : "10:00",
            isAvailable:
              typeof slot.isAvailable === "boolean" ? slot.isAvailable : true,
            recurrence: slot.recurrence || "weekly",
          }))
          .filter((slot) => slot.id); // Filter out any malformed slots

        console.log("Refreshed availability data:", formattedData);
        setScheduleData(formattedData);
      } else {
        // Simply set to empty array without showing errors - this is normal
        console.log("No availability data found on refresh");
        setScheduleData([]);
      }
    } catch (error) {
      console.error("Error refreshing availability:", error);
      // Don't change existing data on error - leave as is
      // Don't show error message for standard "no data" cases
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#243b53] flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-blue-600" />
            Manage Availability
          </h1>
          <p className="text-[#6b7280] mt-2 max-w-3xl">
            Set your weekly availability by creating time slots when you're
            available to teach. Students will only be able to book sessions
            during these times.
          </p>
        </div>
        <Link href="/tutor">
          <button className="inline-flex items-center px-4 py-2 border border-blue-600 shadow-sm text-sm font-medium rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Success Message Popup */}
      <Transition.Root show={showSuccessMessage} as={Fragment}>
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <div className="pointer-events-auto transform transition-all">
              <div className={`bg-white rounded-lg shadow-lg border p-4 max-w-sm ${
                successMessage.type === 'delete' ? 'border-red-200' : 'border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      successMessage.type === 'delete' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {successMessage.type === 'delete' ? (
                        <svg
                          className="h-5 w-5 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {successMessage.message}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {successMessage.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Transition.Root>

      {/* Existing Availability Section */}
      <ExistingAvailability
        slots={scheduleData}
        isLoading={isLoading}
        onUpdate={prepareUpdate}
        onDelete={prepareDelete}
        recurrenceOptions={recurrenceOptions}
      />

      {/* Add New Availability Section */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <h2 className="text-xl font-semibold">Add New Availability</h2>
          <p className="text-sm opacity-90">
            Create new time slots when you're available to teach
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Error Message - Moved inside this section */}
          {errorMessage && (
            <div
              id="error-message"
              className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 flex items-center"
            >
              <svg
                className="h-5 w-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Default Settings */}
          <div className="mb-6 p-5 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-700 mb-3">
              Default Settings for New Slots
            </h3>
            <div className="flex flex-wrap gap-6">
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  value={defaultIsAvailable.toString()}
                  onChange={(e) =>
                    setDefaultIsAvailable(e.target.value === "true")
                  }
                  className="w-full min-w-[180px] h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Recurrence
                </label>
                <select
                  value={defaultRecurrence}
                  onChange={(e) => setDefaultRecurrence(e.target.value)}
                  className="w-full min-w-[180px] h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                >
                  {recurrenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {days.map((day) => (
            <div key={day.id} className="mb-8 last:mb-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-[#243b53]">
                    {day.name}
                  </h3>
                  <span className="ml-2 text-[#6b7280] text-sm">
                    {getDaySlots(day.id).length} new slots
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addTimeSlot(day.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Time Slot
                </button>
              </div>

              {getDaySlots(day.id).length === 0 ? (
                <div className="bg-gray-50 rounded-lg py-4 px-4 text-center text-[#6b7280]">
                  No new slots for {day.name}. Click "Add Time Slot" to create
                  one.
                </div>
              ) : (
                <div className="space-y-4">
                  {getDaySlots(day.id).map((slot) => (
                    <div key={slot.id} className="space-y-2">
                      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-sm font-medium text-[#4b5563] mb-2">
                            Start Time
                          </label>
                          <DatePicker
                            selected={parseTimeToDate(slot.startTime)}
                            onChange={(date) =>
                              updateTimeSlot(
                                slot.id,
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

                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-sm font-medium text-[#4b5563] mb-2">
                            End Time
                          </label>
                          <DatePicker
                            selected={parseTimeToDate(slot.endTime)}
                            onChange={(date) =>
                              updateTimeSlot(
                                slot.id,
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

                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-sm font-medium text-[#4b5563] mb-2">
                            Availability
                          </label>
                          <select
                            value={slot.isAvailable.toString()}
                            onChange={(e) =>
                              updateTimeSlot(
                                slot.id,
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

                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-sm font-medium text-[#4b5563] mb-2">
                            Recurrence
                          </label>
                          <select
                            value={slot.recurrence}
                            onChange={(e) =>
                              updateTimeSlot(
                                slot.id,
                                "recurrence",
                                e.target.value
                              )
                            }
                            className="w-full h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                          >
                            {recurrenceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="p-3 text-red-500 hover:text-red-700 transition-colors duration-200 h-11 self-end"
                          aria-label="Remove time slot"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Cross-midnight indicator */}
                      {isCrossMidnight(slot.startTime, slot.endTime) && (
                        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center text-sm text-blue-700">
                            <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>This slot continues into the next day</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-5 bg-gray-50 flex justify-end">
          <button
            type="button"
            className={`
              inline-flex justify-center items-center py-3 px-6 text-base font-medium rounded-full shadow-sm
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
              ${
                isLoading || newSlots.length === 0
                  ? "bg-gray-500 text-white cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              }
            `}
            onClick={handleSave}
            disabled={isLoading || newSlots.length === 0}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save New Availability"
            )}
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-xl p-5 text-blue-900 text-sm">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-1.5">
          <li>View and manage your existing availability slots at the top</li>
          <li>Add new time slots for each day you're available to teach</li>
          <li>Choose specific start and end times for each slot</li>
          <li>Set availability status (available or unavailable)</li>
          <li>
            Choose recurrence pattern (one-time, weekly, bi-weekly, or monthly)
          </li>
          <li>
            Students will only be able to book sessions during times marked as
            available
          </li>
          <li>
            <strong>Cross-midnight slots:</strong> You can create slots that continue into the next day 
            (e.g., 11:00 PM to 1:00 AM). These will be clearly marked with a blue indicator.
          </li>
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={showDeleteConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setShowDeleteConfirm}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete Availability Slot
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this availability
                            slot? This action cannot be undone, and any existing
                            student bookings may be affected.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={deleteSlot}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Update Confirmation Modal */}
      <Transition.Root show={showUpdateConfirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setShowUpdateConfirm}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <CalendarIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Update Availability Slot
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to update this availability
                            slot? This may affect any existing student bookings
                            during this time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={updateExistingSlot}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowUpdateConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
