import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  addDays,
  isSameDay,
  parse,
  getDay,
  setHours,
  setMinutes,
  addMinutes,
} from "date-fns";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { apiCall } from "../../utils/api";
import { availability } from "@/app/lib/api/endpoints";

export default function DateTimePicker({
  tutorId,
  selectedDate,
  selectedTime,
  duration,
  onSelect,
}) {
  const router = useRouter();
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(duration || 60);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [recentlyBookedSlots, setRecentlyBookedSlots] = useState([]);

  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(selectedTime);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState(null);

  // Check authentication before component mounts
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setAuthError(true);
      const returnPath = "/student/book-session";
      setTimeout(() => {
        router.push(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
      }, 1500);
    }
  }, [router]);

  // Fetch tutor availability
  useEffect(() => {
    if (!tutorId || authError) return;

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const response = await availability.getTutorAvailability(tutorId);
        console.log("Fetched tutor availability:", response.data);
        console.log("Availability data type:", typeof response.data);
        console.log("Is array:", Array.isArray(response.data));
        
        // Extract the availabilities array from the response
        let processedData = [];
        if (response.data && response.data.availabilities) {
          processedData = response.data.availabilities;
          console.log("Extracted availabilities array:", processedData);
        } else if (Array.isArray(response.data)) {
          processedData = response.data;
        }
        
        setAvailabilityData(processedData);
      } catch (error) {
        console.error("Error fetching tutor availability:", error);
        setError("Failed to load availability. Please try again.");
        setAvailabilityData([]); // Set empty array as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [tutorId, authError]);

  // Load recently booked slots from localStorage to avoid showing duplicates immediately
  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentlyBookedSlots');
      const parsed = raw ? JSON.parse(raw) : [];
      setRecentlyBookedSlots(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setRecentlyBookedSlots([]);
    }
  }, [tutorId]);

  // Keep internal duration in sync with parent-provided duration
  useEffect(() => {
    setSelectedDuration(duration || 60);
  }, [duration]);

  // Normalize incoming selected time (label like "3:00 PM" or value like "15:00")
  useEffect(() => {
    if (!selectedTime) return;
    try {
      // If the prop already looks like HH:mm, keep it; otherwise parse label
      const isValue = /^\d{2}:\d{2}$/.test(selectedTime);
      const normalized = isValue
        ? selectedTime
        : format(parse(selectedTime, "h:mm a", new Date()), "HH:mm");
      setTime(normalized);
    } catch (e) {
      // If parsing fails, keep as-is
      setTime(selectedTime);
    }
  }, [selectedTime]);

  // Keep local date in sync if parent updates it (e.g., navigating back)
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  // Generate available dates based on tutor availability
  useEffect(() => {
    if (!availabilityData || !Array.isArray(availabilityData) || availabilityData.length === 0) {
      console.warn("No valid availability data found, showing next 7 days as fallback");
      const fallbackDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
      setAvailableDates(fallbackDates);
      return;
    }

    const dates = [];
    const today = new Date();
    
    console.log("Processing availability data:", availabilityData);
    
    // Check next 30 days for availability
    for (let i = 0; i < 30; i++) {
      const checkDate = addDays(today, i);
      const dayOfWeek = getDay(checkDate); // 0 = Sunday, 1 = Monday, etc.
      
      console.log(`Checking date ${format(checkDate, 'yyyy-MM-dd')} (day ${dayOfWeek})`);
      
      // Check if tutor has availability on this day
      const hasAvailability = availabilityData.some(slot => {
        if (!slot || typeof slot !== 'object') return false;
        
        const slotDayOfWeek = Number(slot.dayOfWeek);
        const isAvailable = slot.isAvailable !== false;
        const hasSessionType = slot.sessionTypes && slot.sessionTypes.length > 0;
        
        console.log(`  Slot: dayOfWeek=${slotDayOfWeek}, isAvailable=${isAvailable}, sessionTypes=${slot.sessionTypes}, matches=${slotDayOfWeek === dayOfWeek}`);
        
        return slotDayOfWeek === dayOfWeek && isAvailable && hasSessionType;
      });
      
      if (hasAvailability) {
        dates.push(checkDate);
        console.log(`  ✓ Added date: ${format(checkDate, 'yyyy-MM-dd')}`);
      }
      
      // Limit to 14 available dates to keep the UI manageable
      if (dates.length >= 14) {
        break;
      }
    }
    
    console.log("Final available dates:", dates.map(d => format(d, 'yyyy-MM-dd')));
    setAvailableDates(dates);
  }, [availabilityData]);

  // Build available times when date changes
  useEffect(() => {
    if (!date || !availabilityData || !Array.isArray(availabilityData)) {
      setAvailableTimes([]);
      return;
    }

    const dayOfWeek = getDay(date);
    console.log(`Building times for date ${format(date, 'yyyy-MM-dd')} (day ${dayOfWeek})`);
    
    const daySlots = availabilityData.filter(slot => {
      if (!slot || typeof slot !== 'object') return false;
      const slotDayOfWeek = Number(slot.dayOfWeek);
      const isAvailable = slot.isAvailable !== false;
      const matches = slotDayOfWeek === dayOfWeek && isAvailable;
      
      console.log(`  Slot: dayOfWeek=${slotDayOfWeek}, isAvailable=${isAvailable}, matches=${matches}`);
      return matches;
    });

    console.log(`Found ${daySlots.length} slots for this day:`, daySlots);

    if (!daySlots.length) {
      setAvailableTimes([]);
      return;
    }

    const times = [];
    daySlots.forEach((slot) => {
      if (!slot.startTime || !slot.endTime) {
        console.warn("Slot missing startTime or endTime:", slot);
        return;
      }

      console.log(`Processing slot: ${slot.startTime} - ${slot.endTime}, sessionTypes: ${slot.sessionTypes}`);

      try {
        const [sh, sm] = slot.startTime.split(":").map(Number);
        const [eh, em] = slot.endTime.split(":").map(Number);
        
        // Create start and end times for the selected date
        let cur = setMinutes(setHours(new Date(date), sh), sm);
        let endObj = setMinutes(setHours(new Date(date), eh), em);
        
        // Check if this is a cross-midnight slot
        const isCrossMidnight = endObj <= cur;
        
        if (isCrossMidnight) {
          // For cross-midnight slots, we need to handle two parts:
          // 1. From start time to midnight (23:59)
          // 2. From midnight (00:00) to end time
          
          // Part 1: From start time to end of day
          const endOfDay = setMinutes(setHours(new Date(date), 23), 59);
          let currentTime = cur;
          
          while (currentTime <= endOfDay) {
            const nextTime = addMinutes(currentTime, selectedDuration);
            if (nextTime > endOfDay) break;

            const timeSlot = {
              label: format(currentTime, "h:mm a"),
              value: format(currentTime, "HH:mm"),
              availabilityId: slot.id,
            };
            
            times.push(timeSlot);
            console.log(`  Added time slot (part 1): ${timeSlot.label} (${timeSlot.value})`);
            
            currentTime = addMinutes(currentTime, 30); // 30-minute intervals
          }
          
          // Part 2: From midnight to end time
          const startOfDay = setMinutes(setHours(new Date(date), 0), 0);
          currentTime = startOfDay;
          
          while (currentTime < endObj) {
            const nextTime = addMinutes(currentTime, selectedDuration);
            if (nextTime > endObj) break;

            const timeSlot = {
              label: format(currentTime, "h:mm a"),
              value: format(currentTime, "HH:mm"),
              availabilityId: slot.id,
            };
            
            times.push(timeSlot);
            console.log(`  Added time slot (part 2): ${timeSlot.label} (${timeSlot.value})`);
            
            currentTime = addMinutes(currentTime, 30); // 30-minute intervals
          }
        } else {
          // Regular slot (same day)
          while (cur < endObj) {
            const nxt = addMinutes(cur, selectedDuration);
            if (nxt > endObj) break;

            const timeSlot = {
              label: format(cur, "h:mm a"),
              value: format(cur, "HH:mm"),
              availabilityId: slot.id,
            };
            
            times.push(timeSlot);
            console.log(`  Added time slot: ${timeSlot.label} (${timeSlot.value})`);
            
            cur = addMinutes(cur, 30); // 30-minute intervals
          }
        }
      } catch (e) {
        console.warn("Error parsing time slot:", slot, e);
      }
    });

    console.log(`Generated ${times.length} time slots:`, times);
    // Filter out any recently booked slots for this tutor/date to prevent duplicates
    const dateKey = format(date, 'yyyy-MM-dd');
    const filtered = times.filter((t) => {
      return !recentlyBookedSlots.some((b) =>
        b && b.tutorId === tutorId && b.date === dateKey && b.value === t.value
      );
    });
    setAvailableTimes(filtered);
  }, [date, availabilityData, selectedDuration, recentlyBookedSlots, tutorId]);

  // After generating available times, if we already have a selected time value,
  // ensure the highlight persists and restore availabilityId for the slot
  useEffect(() => {
    if (!time || !availableTimes || availableTimes.length === 0) return;
    const matched = availableTimes.find((t) => t.value === time);
    if (matched) {
      setSelectedAvailabilityId(matched.availabilityId);
    }
  }, [availableTimes, time]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setTime(null);
  };

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime.value);
    setSelectedAvailabilityId(selectedTime.availabilityId);
    if (date) {
      const endTime = addMinutes(
        parse(selectedTime.value, "HH:mm", new Date()),
        selectedDuration
      );
      
      onSelect(
        date,
        selectedTime.label,
        format(endTime, "h:mm a"),
        selectedDuration,
        createISO(date, selectedTime.value),
        createISO(date, format(endTime, "HH:mm")),
        selectedTime.availabilityId
      );
    }
  };

  const createISO = (date, timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result.toISOString();
  };

  // When duration changes after a time is already selected, propagate the new duration
  useEffect(() => {
    if (!date || !time) return;
    try {
      const startLabel = format(parse(time, "HH:mm", new Date()), "h:mm a");
      const endTime = addMinutes(parse(time, "HH:mm", new Date()), selectedDuration);
      onSelect(
        date,
        startLabel,
        format(endTime, "h:mm a"),
        selectedDuration,
        createISO(date, time),
        createISO(date, format(endTime, "HH:mm")),
        selectedAvailabilityId
      );
    } catch (e) {
      // no-op; guard against parsing issues
    }
  }, [selectedDuration]);

  // Show authentication error
  if (authError) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Authentication Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You need to be logged in to book a session. Redirecting to login
                page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Select Date
        </h3>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading available dates...
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we check the tutor's schedule
            </p>
          </div>
        ) : availableDates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {availableDates.map((dateItem) => (
              <button
                key={dateItem.toISOString()}
                onClick={() => handleDateSelect(dateItem)}
                className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                  isSameDay(dateItem, date)
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {format(dateItem, "EEE")}
                </div>
                <div className="text-2xl font-bold">{format(dateItem, "d")}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(dateItem, "MMM")}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No available dates
            </h3>
            <p className="text-gray-500 mb-4">
              This tutor doesn't have any available slots in the next 30 days.
            </p>
            <p className="text-sm text-gray-400">
              Please try selecting a different tutor or contact support for assistance.
            </p>
          </div>
        )}
      </div>

      {date && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Select Time
          </h3>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading availability...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please wait while we check available times
              </p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {availableTimes.map((timeSlot) => (
                <button
                  key={timeSlot.value}
                  onClick={() => handleTimeSelect(timeSlot)}
                  className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                    time === timeSlot.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105"
                  }`}
                >
                  <div className="text-sm font-semibold">{timeSlot.label}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No available times
              </h3>
              <p className="text-gray-500 mb-4">
                This tutor doesn't have any available slots on {format(date, "EEEE, MMMM d, yyyy")}.
              </p>
              <p className="text-sm text-gray-400">
                Try selecting a different date.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Duration selector */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Session Duration</h4>
        <div className="flex space-x-3">
          {[30, 60, 90, 120].map((mins) => (
            <button
              key={mins}
              onClick={() => setSelectedDuration(mins)}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                selectedDuration === mins
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}