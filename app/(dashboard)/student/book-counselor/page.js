"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  format,
  addDays,
  isSameDay,
  parse,
  getDay,
  setHours,
  setMinutes,
  addMinutes,
  isValid as isValidDate,
} from "date-fns";
import { ServiceTypes, getServicePlans } from "@/app/constants/serviceTypes";
import PlanCard from "@/app/components/plans/PlanCard";
import { counselors, counselorBookings, availability } from "@/app/lib/api/endpoints";
import { safeApiCall, ensureArray } from "@/app/utils/apiResponseHandler";
import apiClient from "@/app/lib/api/client";
import authService from "@/app/lib/auth/authService";
import PaymentForm from "@/app/components/payment/PaymentForm";
import PaymentStripeProvider from "@/app/providers/PaymentStripeProvider";
import toast from "react-hot-toast";

// This will be replaced with real API data

// Session type configuration
const getSessionTypeInfo = (sessionType) => {
  if (sessionType === "30min") {
    return { label: "30 minutes", price: 49.99, duration: 30 };
  }
  return { label: "60 minutes", price: 89.99, duration: 60 };
};

function CounselorCard({ counselor, onSelect, isSelected }) {
  return (
    <div
      className={`group relative border-2 rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-lg transform scale-[1.02]"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
      onClick={() => onSelect(counselor)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
          <CheckCircleIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
        </div>
      )}

      <div className="flex flex-col space-y-3 sm:space-y-4 h-full">
        {/* Header: Avatar + Basic Info */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={counselor.avatar || "/default-avatar.png"}
                alt={counselor.name}
                className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full object-cover border-2 sm:border-3 border-white shadow-lg"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              {/* Online status indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white shadow-sm">
                <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  {counselor.name}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-blue-600 mt-0.5 truncate">
                  {counselor.title || counselor.role || "Academic Counselor"}
                </p>
              </div>

              {/* Rating - All screens */}
              <div className="flex items-center space-x-1 mt-1 sm:mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        i < Math.floor(counselor.rating || 4.5)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">
                  {counselor.rating || 4.5}
                </span>
                <span className="text-xs text-gray-500">
                  ({counselor.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 sm:space-y-3 flex-1">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 break-words">
            {counselor.bio ||
              counselor.description ||
              "Experienced counselor ready to help you achieve your academic and career goals with personalized guidance and support."}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {(
              counselor.specialties ||
              counselor.specializations || 
              ["College Counseling", "Academic Planning", "Career Guidance"]
            )
              .slice(0, 2)
              .map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200/50 shadow-sm truncate max-w-[120px] sm:max-w-none"
                  title={specialty}
                >
                  {specialty}
                </span>
              ))}
            {(counselor.specialties || counselor.specializations || []).length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                +{(counselor.specialties || counselor.specializations || []).length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Footer - Experience and Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-gray-100 space-y-1 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{counselor.experience || 5}+ years exp</span>
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 flex-shrink-0"></div>
              <span className="truncate">Available today</span>
            </span>
          </div>
          
          {isSelected && (
            <div className="flex items-center text-xs font-medium text-blue-600">
              <CheckCircleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">Selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DateTimePicker({
  counselor,
  selectedDate,
  selectedTime,
  duration,
  onSelect,
}) {
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState(selectedTime);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch counselor availability (use provider availability API same as tutor)
  useEffect(() => {
    if (!counselor) return;

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        console.log("Fetching provider availability for counselor:", counselor.id);
        const response = await availability.getTutorAvailability(counselor.id);
        let processed = [];
        if (response.data && response.data.availabilities) {
          processed = response.data.availabilities;
        } else if (Array.isArray(response.data)) {
          processed = response.data;
        }
        setAvailabilityData(processed);
      } catch (error) {
        console.error("Error fetching counselor availability:", error);
        console.error("Error details:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [counselor]);

  // Build available dates based on availability slots (respect one-time)
  useEffect(() => {
    if (!availabilityData || !Array.isArray(availabilityData) || availabilityData.length === 0) {
      setAvailableDates([]);
      return;
    }
    const dateSet = new Set();
    const today = new Date();
    
    // Add explicit one-time dates
    availabilityData.forEach((slot) => {
      if (slot?.recurrence === 'one-time' && slot?.nextDate) {
        dateSet.add(slot.nextDate);
      }
    });

    // Expand recurring by next 30 days
    for (let i = 0; i < 30; i++) {
      const checkDate = addDays(today, i);
      const dayOfWeek = getDay(checkDate);
      const hasRecurring = availabilityData.some((slot) => {
        if (slot?.recurrence === 'one-time') return false;
        const dow = Number(slot.dayOfWeek);
        const isAvailable = slot.isAvailable !== false;
        const hasSessionType = !slot.sessionTypes || slot.sessionTypes.length > 0;
        return dow === dayOfWeek && isAvailable && hasSessionType;
      });
      if (hasRecurring) {
        dateSet.add(format(checkDate, 'yyyy-MM-dd'));
      }
      if (dateSet.size >= 14) break;
    }

    const dates = Array.from(dateSet)
      .map((ds) => {
        const [y, m, d] = ds.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
      })
      .sort((a, b) => a - b);

    setAvailableDates(dates);
  }, [availabilityData, duration]);

  // Build available times for selected date (30-minute steps; one-time -> only start)
  useEffect(() => {
    if (!date || !availabilityData || !Array.isArray(availabilityData)) {
      setAvailableTimes([]);
      return;
    }
    const dayOfWeek = getDay(date);
    const selectedDuration = duration === "30min" ? 30 : 60;
    const dateKey = format(date, 'yyyy-MM-dd');
    const daySlots = availabilityData.filter((slot) => {
      const dow = Number(slot.dayOfWeek);
      const isAvailable = slot.isAvailable !== false;
      if (slot?.recurrence === 'one-time') {
        return isAvailable && slot.nextDate === dateKey;
      }
      return dow === dayOfWeek && isAvailable;
    });
    if (!daySlots.length) {
      setAvailableTimes([]);
      return;
    }
    const times = [];
    daySlots.forEach((slot) => {
      if (!slot.startTime || !slot.endTime) return;
      // Respect session types: skip slots that don't support current duration
      if (Array.isArray(slot.sessionTypes) && !slot.sessionTypes.includes(duration)) return;
      const [sh, sm] = String(slot.startTime).split(":").map(Number);
      const [eh, em] = String(slot.endTime).split(":").map(Number);
      let cur = setMinutes(setHours(new Date(date), sh), sm);
      let endObj = setMinutes(setHours(new Date(date), eh), em);
      const crossMidnight = endObj <= cur;
      const emit = (dt) => {
        times.push({ label: format(dt, "h:mm a"), value: format(dt, "HH:mm") });
      };
      if (crossMidnight) {
        const endOfDay = setMinutes(setHours(new Date(date), 23), 59);
        let currentTime = cur;
        while (currentTime <= endOfDay) {
          const nextTime = addMinutes(currentTime, selectedDuration);
          if (nextTime > endOfDay) break;
          emit(currentTime);
          currentTime = addMinutes(currentTime, 30);
        }
        const startOfDay = setMinutes(setHours(new Date(date), 0), 0);
        currentTime = startOfDay;
        while (currentTime < endObj) {
          const nextTime = addMinutes(currentTime, selectedDuration);
          if (nextTime > endObj) break;
          emit(currentTime);
          currentTime = addMinutes(currentTime, 30);
        }
      } else {
        while (cur < endObj) {
          const nxt = addMinutes(cur, selectedDuration);
          if (nxt > endObj) break;
          emit(cur);
          cur = addMinutes(cur, 30);
        }
      }
    });
    setAvailableTimes(times);
  }, [date, availabilityData, duration]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setTime(null);
    onSelect({ date: selectedDate, time: null });
  };

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
    onSelect({ date, time: selectedTime });
  };

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
              Please wait while we check the counselor's schedule
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
              This counselor doesn't have any available slots for {duration === "30min" ? "30-minute" : "60-minute"} sessions in the next 30 days.
            </p>
            <p className="text-sm text-gray-400">
              Try selecting a different session duration or contact support for assistance.
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
                  onClick={() => handleTimeSelect(timeSlot.value)}
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
          ) : availableDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Availability Found
              </h3>
              <p className="text-gray-600 mb-4">
                This counselor hasn't set up their availability yet.
              </p>
              <p className="text-sm text-gray-500">
                Please try selecting a different counselor or contact support.
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No available times for this date
              </h3>
              <p className="text-gray-500 mb-4">
                This counselor doesn't have any {duration === "30min" ? "30-minute" : "60-minute"} slots available on {format(date, "EEEE, MMMM d, yyyy")}.
              </p>
              <p className="text-sm text-gray-400">
                Try selecting a different date or session duration.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BookCounselorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedSessionType, setSelectedSessionType] = useState("30min"); // Default to 30min for counselors
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: null,
    time: null,
  });
  const [sessionNotes, setSessionNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [counselorsList, setCounselorsList] = useState([]);
  const [counselorsLoading, setCounselorsLoading] = useState(false);
  const [counselorsError, setCounselorsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentAmountInCents, setPaymentAmountInCents] = useState(0);
  const [error, setError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);

  const steps = [
    { id: "plan", name: "Plan" },
    { id: "counselor", name: "Choose Counselor" },
    { id: "datetime", name: "Date & Time" },
    { id: "details", name: "Session Details" },
    { id: "confirm", name: "Confirm Booking" },
    { id: "payment", name: "Payment" },
  ];

  // Filter counselors based on search query
  const filteredCounselors = counselorsList.filter((counselor) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const college =
      counselor.college || counselor.university || counselor.education || "";
    const name = counselor.name || counselor.fullName || "";
    const specialization =
      counselor.specialization || counselor.expertise || "";

    return (
      college.toLowerCase().includes(searchLower) ||
      name.toLowerCase().includes(searchLower) ||
      specialization.toLowerCase().includes(searchLower)
    );
  });

  // Fetch counselors from API
  const fetchCounselors = async () => {
    setCounselorsLoading(true);
    setCounselorsError(null);

    const result = await safeApiCall(
      () =>
        counselors.getAll({
          page: 1,
          limit: 50,
          status: "active",
        }),
      {
        extractArray: true,
        dataKey: "data",
        defaultData: [],
        errorMessage: "Failed to load counselors. Please try again.",
      }
    );

    if (result.success) {
      setCounselorsList(ensureArray(result.data));
    } else {
      setCounselorsError(result.error);
      setCounselorsList([]);
    }

    setCounselorsLoading(false);
  };

  // Check authentication and load selected plan
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    };

    checkAuth();

    // Load selected counseling plan from localStorage
    const storedPlan = localStorage.getItem("selectedCounselingPlan");
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setSelectedPlan(parsedPlan);
        console.log("Loaded selected counseling plan:", parsedPlan);
      } catch (error) {
        console.error("Error parsing stored counseling plan:", error);
        localStorage.removeItem("selectedCounselingPlan");
      }
    }

    // Fetch counselors
    fetchCounselors();
  }, []);

  // Plans state and fetch for counseling
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  useEffect(() => {
    if (currentStep !== 0) return;
    setPlansLoading(true);
    setPlansError(null);
    try {
      const counselingPlans = getServicePlans(ServiceTypes.COUNSELING);
      setPlans(Array.isArray(counselingPlans) ? counselingPlans : []);
    } catch (e) {
      setPlansError(e?.message || "Failed to load plans");
    } finally {
      setPlansLoading(false);
    }
  }, [currentStep]);

  const handleCounselorSelect = (counselor) => {
    setSelectedCounselor(counselor);
    setError(null); // Clear any existing errors when selecting counselor
    
    // Auto-detect available session types for this counselor
    if (counselor.availability) {
      const allSessionTypes = new Set();
      Object.values(counselor.availability).forEach(daySlots => {
        if (Array.isArray(daySlots)) {
          daySlots.forEach(slot => {
            if (slot.sessionTypes) {
              slot.sessionTypes.forEach(type => allSessionTypes.add(type));
            }
          });
        }
      });
      
      const availableTypes = Array.from(allSessionTypes);
      if (availableTypes.length > 0) {
        // Prefer 30min if available, otherwise use the first available type
        const preferredType = availableTypes.includes("30min") ? "30min" : availableTypes[0];
        setSelectedSessionType(preferredType);
        console.log(`Auto-selected session type: ${preferredType} from available: ${availableTypes.join(", ")}`);
      }
    }
    // Do not auto-advance; let user click Continue
  };

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
    setError(null); // Clear any existing errors when selecting date/time
    // Do not auto-advance; use the Continue button to proceed
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null); // Clear any existing errors when moving forward
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null); // Clear any existing errors when moving back
    }
  };

  const handleSubmit = async () => {
    if (
      !selectedCounselor ||
      !selectedDateTime.date ||
      !selectedDateTime.time
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please log in to create a booking");
      return;
    }

    // Check authentication token
    const token = authService.getToken();
    console.log("Authentication token:", token ? "Present" : "Missing");

    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      return;
    }

    setIsLoading(true);

    try {
      const sessionType = getSessionTypeInfo(selectedSessionType);
      // Use selected plan price instead of hardcoded session type price
      const sessionPrice = selectedPlan ? (selectedPlan.calculatedPrice || selectedPlan.price) : sessionType.price;
      
      console.log("Payment calculation:", {
        selectedPlan: selectedPlan,
        planPrice: selectedPlan ? (selectedPlan.calculatedPrice || selectedPlan.price) : null,
        sessionTypePrice: sessionType.price,
        finalSessionPrice: sessionPrice,
        paymentAmountInCents: sessionPrice * 100
      });
      const startTime = new Date(selectedDateTime.date);
      const [hours, minutes] = selectedDateTime.time.split(":");
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const endTime = addMinutes(startTime, sessionType.duration);

      // Prepare booking data for API
      const counselorBookingData = {
        counselorId: selectedCounselor.id,
        providerRole: "counselor",
        serviceType: "counseling",
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        sessionType: selectedSessionType,
        duration: sessionType.duration,
        notes: sessionNotes,
        subject: "Academic Counseling",
        topic: "General Guidance",
        status: "pending",
        amount: sessionPrice * 100, // Convert to cents
        currency: "usd",
      };

      console.log("Creating counselor booking:", counselorBookingData);

      // Validate required data before API call
      if (!selectedCounselor?.id) {
        throw new Error("No counselor selected");
      }
      if (!selectedDateTime.date || !selectedDateTime.time) {
        throw new Error("No date/time selected");
      }
      if (!sessionType) {
        throw new Error("Invalid session type");
      }

      // Create booking via API - handle errors BEFORE opening payment modal
      console.log("Calling counselorBookings.create with:", counselorBookingData);

      const response = await counselorBookings.create(counselorBookingData);
      console.log("Booking created successfully:", response);
      console.log("Response data:", response.data);

      // Validate response
      if (!response || !response.data) {
        throw new Error("Invalid response from booking API");
      }

      if (!response.data.id) {
        throw new Error("Booking created but no ID returned");
      }

      // Prepare booking data for payment modal
      const bookingData = {
        bookingId: response.data.id,
        counselorId: selectedCounselor.id,
        counselorName: selectedCounselor.name,
        counselorTitle: selectedCounselor.title || "Academic Counselor",
        counselorAvatar: selectedCounselor.avatar || "/default-avatar.png",
        sessionType: selectedSessionType,
        date: selectedDateTime.date.toISOString().split("T")[0],
        time: selectedDateTime.time,
        notes: sessionNotes || "",
        amount: sessionPrice * 100, // Convert to cents
        currency: "usd",
        duration: sessionType.duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        subject: "Academic Counseling",
        topic: "General Guidance",
        status: "pending",
      };

      // Clear the selected plan from localStorage since we're proceeding to payment
      localStorage.removeItem("selectedCounselingPlan");

      // Proceed to inline payment step
      setCreatedBooking(bookingData);
      setPaymentAmountInCents(sessionPrice * 100); // cents
      setCurrentStep(5);
    } catch (error) {
      console.error("Error creating booking:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config,
      });

      // Extract message and status for friendlier UX (like tutor booking)
      const status = error?.response?.status || error?.status;
      const backendMsg = error?.response?.data?.message || error?.message || "";

      // Handle already booked/duplicate selection (like tutor booking)
      if (String(status) === "400" || /already\s*book|already\s*exists|already\s*reserved|time\s*slot\s*is\s*already\s*reserved/i.test(backendMsg)) {
        // Store this attempted slot to prevent re-selection
        try {
          const raw = localStorage.getItem("recentlyBookedSlots");
          const list = raw ? JSON.parse(raw) : [];
          list.push({
            counselorId: selectedCounselor.id,
            date: selectedDateTime.date.toISOString().split("T")[0],
            value: selectedDateTime.time,
          });
          localStorage.setItem("recentlyBookedSlots", JSON.stringify(list.filter(Boolean)));
        } catch (e) {}

        setError("That time slot was just taken. Please choose another time.");
        toast.error("That time slot was just taken. Please choose another time.");
        setCurrentStep(1); // Go back to date/time picker step
        setSelectedDateTime({ date: null, time: null }); // Clear selection
        window.scrollTo(0, 0);
        return;
      }

      // Auth required
      if (String(status) === "401") {
        setError("Please log in to create a booking");
        toast.error("Please log in to create a booking");
        return;
      }

      // Map common errors to friendly copy
      let friendly = "Booking failed. Please try again.";
      switch (String(status)) {
        case "400":
          friendly = "Invalid booking data. Please check your selection.";
          break;
        case "403":
          friendly = "You don't have permission to create this booking.";
          break;
        case "409":
          friendly = "This time slot is no longer available. Please choose a different time.";
          break;
        case "422":
          friendly = "Please check your booking details and try again.";
          break;
        case "500":
          friendly = "Server error. Please try again later.";
          break;
        default:
          if (backendMsg) {
            friendly = backendMsg;
          }
      }

      setError(friendly);
      toast.error(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-500 mb-4">
            Please log in to book a counseling session.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book Counseling Session
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Get expert guidance for your academic and career goals
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-6">
          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-100">
            <nav aria-label="Progress">
              {/* Mobile: Vertical Timeline */}
              <div className="block sm:hidden">
                <div className="space-y-6">
                  {steps.map((step, stepIdx) => (
                    <div key={step.name} className="flex items-start space-x-4">
                      {/* Step Circle */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            currentStep >= stepIdx
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          {currentStep > stepIdx ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">
                              {stepIdx + 1}
                            </span>
                          )}
                        </div>

                        {/* Active indicator */}
                        {currentStep === stepIdx && (
                          <div className="absolute -inset-1 rounded-full bg-blue-100 animate-pulse"></div>
                        )}

                        {/* Vertical connector line */}
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute top-12 left-1/2 w-0.5 h-6 -translate-x-1/2">
                            <div
                              className={`h-full w-full transition-colors duration-300 ${
                                currentStep > stepIdx
                                  ? "bg-blue-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div
                          className={`text-base font-semibold transition-colors duration-300 ${
                            currentStep >= stepIdx
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        >
                          {step.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Horizontal Timeline */}
              <div className="hidden sm:block">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {steps.map((step, stepIdx) => (
                      <div
                        key={step.name}
                        className="flex flex-col items-center text-center relative"
                        style={{ 
                          width: `${100 / steps.length}%`,
                          minWidth: '100px'
                        }}
                      >
                        {/* Step Circle */}
                        <div className="relative mb-3 z-10">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              currentStep >= stepIdx
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {currentStep > stepIdx ? (
                              <CheckCircleIcon className="h-6 w-6" />
                            ) : (
                              <span className="text-base font-bold">
                                {stepIdx + 1}
                              </span>
                            )}
                          </div>

                          {/* Active indicator */}
                          {currentStep === stepIdx && (
                            <div className="absolute -inset-1 rounded-full bg-blue-100 animate-pulse"></div>
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="w-full px-2">
                          <div
                            className={`text-sm font-semibold transition-colors duration-300 mb-1 text-center whitespace-nowrap ${
                              currentStep >= stepIdx
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continuous horizontal line */}
                  <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300" 
                      style={{ 
                        width: `${(currentStep / (steps.length - 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100">
            {/* Error Display */}
            {error && (
              <div className="mb-6">
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-red-800">Error</h3>
                      <p className="text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 0 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Select a Counseling Plan
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose the plan that best fits your goals and budget
                  </p>
                </div>

                {plansLoading ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading plans...</p>
                  </div>
                ) : plansError ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load plans</h3>
                    <p className="text-red-600 mb-6">{plansError}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Try Again</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {(Array.isArray(plans) ? plans : []).map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlan?.id === plan.id}
                        onSelect={setSelectedPlan}
                      />
                    ))}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(1)}
                    disabled={!selectedPlan}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Choose Your Counselor
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Select a qualified counselor who matches your needs and
                    goals
                  </p>
                </div>

                {/* Search removed */}

                {counselorsLoading ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading counselors...
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please wait while we fetch the best counselors for you
                    </p>
                  </div>
                ) : counselorsError ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Unable to load counselors
                    </h3>
                    <p className="text-red-600 mb-6">{counselorsError}</p>
                    <button
                      onClick={fetchCounselors}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                ) : !Array.isArray(counselorsList) ||
                  counselorsList.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No counselors available
                    </h3>
                    <p className="text-gray-500">
                      We're working on adding more counselors. Please check back
                      later.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Filtered counselors count */}
                    {searchQuery && (
                      <div className="mb-4 text-center">
                        <p className="text-sm text-gray-600">
                          {filteredCounselors.length} counselor
                          {filteredCounselors.length !== 1 ? "s" : ""} found
                          {searchQuery && ` for "${searchQuery}"`}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredCounselors.map((counselor) => (
                        <CounselorCard
                          key={counselor.id}
                          counselor={counselor}
                          onSelect={handleCounselorSelect}
                          isSelected={selectedCounselor?.id === counselor.id}
                        />
                      ))}
                    </div>

                    {filteredCounselors.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No counselors found
                        </h3>
                        <p className="text-gray-500">
                          Try searching with different keywords or clear your
                          search to see all counselors.
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedCounselor}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Select Date & Time
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose a convenient time for your counseling session
                  </p>
                </div>

                {/* Counselor info */}
                {selectedCounselor && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-8">
                    <div className="flex items-center">
                      <img
                        src={selectedCounselor.avatar || "/default-avatar.png"}
                        alt={selectedCounselor.name}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedCounselor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedCounselor.title || "Academic Counselor"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration Selector */}
                {selectedCounselor && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Session Duration
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {["30min", "60min"].map((duration) => (
                        <button
                          key={duration}
                          onClick={() => setSelectedSessionType(duration)}
                          className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                            selectedSessionType === duration
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          <div className="text-lg font-semibold">
                            {duration === "30min" ? "30 minutes" : "60 minutes"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {duration === "30min" ? "Quick consultation" : "In-depth session"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <DateTimePicker
                  counselor={selectedCounselor}
                  selectedDate={selectedDateTime.date}
                  selectedTime={selectedDateTime.time}
                  duration={selectedSessionType}
                  onSelect={handleDateTimeSelect}
                />

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedDateTime.date || !selectedDateTime.time}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Session Details
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Help your counselor prepare by sharing your goals and topics
                    of interest
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      What would you like to discuss?
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        rows={6}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell us about your academic goals, career aspirations, challenges you're facing, or specific topics you'd like to cover during the session..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {sessionNotes.length}/500
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      💡 The more details you provide, the better your counselor
                      can prepare for your session
                    </p>
                  </div>

                  {/* Session summary */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Session Summary
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">
                          Counselor:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {selectedCounselor?.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">
                          Duration:
                        </span>
                        <span className="ml-2 text-blue-700">
                          {getSessionTypeInfo(selectedSessionType).label}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Date:</span>
                        <span className="ml-2 text-blue-700">
                          {(() => {
                            try {
                              return selectedDateTime?.date && isValidDate(selectedDateTime.date)
                                ? format(selectedDateTime.date, "EEEE, MMMM d, yyyy")
                                : "Not selected";
                            } catch {
                              return "Not selected";
                            }
                          })()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Time:</span>
                        <span className="ml-2 text-blue-700">
                          {(() => {
                            try {
                              const t = selectedDateTime?.time;
                              if (!t || typeof t !== "string") return "Not selected";
                              const parsedT = parse(t, "HH:mm", new Date());
                              return isValidDate(parsedT) ? format(parsedT, "h:mm a") : t;
                            } catch {
                              return "Not selected";
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Confirm Your Booking
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Review your session details before proceeding to payment
                  </p>
                </div>

                {/* Show selected plan info */}
                {selectedPlan && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">
                          Selected Plan
                        </h3>
                        <p className="text-sm text-blue-700">
                          Your counseling plan is ready
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-blue-800 font-bold text-xl">
                          {selectedPlan.name}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          {selectedPlan.features?.slice(0, 2).join(" • ") ||
                            "Counseling sessions included"}
                        </p>
                      </div>
                      <div className="text-right mt-4 sm:mt-0">
                        <p className="text-3xl font-bold text-blue-900">
                          ${selectedPlan.calculatedPrice || selectedPlan.price}
                        </p>
                        <p className="text-sm text-blue-600">
                          {selectedPlan.type === "single"
                            ? "One-time"
                            : selectedPlan.type === "monthly"
                            ? "Monthly"
                            : selectedPlan.type === "multi_hour"
                            ? "Package"
                            : "Plan"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Booking details */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 space-y-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={selectedCounselor.avatar || "/default-avatar.png"}
                      alt={selectedCounselor.name}
                      className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedCounselor.name}
                      </h3>
                      <p className="text-lg text-blue-600 font-medium">
                        {selectedCounselor.title || "Academic Counselor"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-sm font-semibold text-gray-700">
                          Date
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {(() => {
                          try {
                            return selectedDateTime?.date && isValidDate(selectedDateTime.date)
                              ? format(selectedDateTime.date, "MMM d, yyyy")
                              : "-";
                          } catch {
                            return "-";
                          }
                        })()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          try {
                            return selectedDateTime?.date && isValidDate(selectedDateTime.date)
                              ? format(selectedDateTime.date, "EEEE")
                              : "";
                          } catch {
                            return "";
                          }
                        })()}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-sm font-semibold text-gray-700">
                          Time
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {(() => {
                          try {
                            const t = selectedDateTime?.time;
                            if (!t || typeof t !== "string") return "-";
                            const parsed = parse(t, "HH:mm", new Date());
                            return isValidDate(parsed) ? format(parsed, "h:mm a") : t;
                          } catch {
                            return "-";
                          }
                        })()}
                      </p>
                      <p className="text-sm text-gray-600">Session time</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg
                          className="h-5 w-5 text-blue-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">
                          Duration
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {getSessionTypeInfo(selectedSessionType).label}
                      </p>
                      <p className="text-sm text-gray-600">Session length</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <svg
                          className="h-5 w-5 text-blue-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">
                          Price
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${getSessionTypeInfo(selectedSessionType).price}
                      </p>
                      <p className="text-sm text-gray-600">per session</p>
                    </div>
                  </div>

                  {sessionNotes && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-sm font-semibold text-blue-800">
                          Session Notes
                        </p>
                      </div>
                      <p className="text-gray-700">{sessionNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-bold text-lg shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && createdBooking && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Payment
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Complete your payment to finalize the booking
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <PaymentStripeProvider>
                    <PaymentForm
                      bookingId={createdBooking.bookingId}
                      amount={paymentAmountInCents || 0}
                      currency={createdBooking.currency || "usd"}
                      booking={{
                        ...createdBooking,
                        providerName: createdBooking.counselorName,
                        providerRole: "counselor",
                      }}
                      onSuccess={() => {
                        setShowPaymentModal(false);
                        setShowSuccessPopup(true);
                        setSuccessCountdown(5);
                        const interval = setInterval(() => {
                          setSuccessCountdown((s) => {
                            if (s <= 1) {
                              clearInterval(interval);
                              router.push('/student/my-sessions');
                              return 0;
                            }
                            return s - 1;
                          });
                        }, 1000);
                      }}
                      onError={(error) => {
                        console.error("Payment error:", error);
                        toast.error("Payment failed. Please try again.");
                      }}
                      onCancel={() => {
                        // Allow going back to confirm
                        setCurrentStep(4);
                      }}
                    />
                  </PaymentStripeProvider>
                </div>

                <div className="mt-8 flex justify-between gap-4">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal removed: handled as step 5 inline */}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-green-600">
                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42l2.29 2.29 6.54-6.54a1 1 0 011.42 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment successful</h3>
            <p className="text-gray-600 mt-1">Redirecting to your sessions in {successCountdown}s</p>
            <div className="mt-5 flex gap-3 justify-center">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 cursor-pointer"
                onClick={() => router.push('/student/book-counselor')}
              >
                Book another session
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push('/student/my-sessions')}
              >
                View sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
