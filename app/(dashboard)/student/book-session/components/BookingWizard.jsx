// File: src/components/BookingWizard.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SubjectPicker from "./SubjectPicker";
import TutorCard from "./TutorCard";
import DateTimePicker from "./DateTimePicker";
import SessionForm from "./SessionForm";
import BookingSummary from "./BookingSummary";
import PaymentForm from "@/app/components/payment/PaymentForm";
import apiClient from "@/app/lib/api/client";
import PlanCard from "../../../../components/plans/PlanCard";
import PlanFilters from "../../../../components/plans/PlanFilters";
import PlansAPI from "../../../../lib/api/plans";
import toast from "react-hot-toast";
import { apiPost, apiGet } from "../../utils/api";
import ServiceSelection from "../../../../components/services/ServiceSelection";
import {
  ServiceTypes,
  getServicePlans,
} from "../../../../constants/serviceTypes";
import { getParentSubject } from "../../../../constants/enhancedSubjects";
import { getProfileImageUrl } from "@/app/utils/profileImage";

const steps = [
  { id: "service", name: "Service" },
  { id: "plan", name: "Plan" },
  { id: "subject", name: "Subject" },
  { id: "provider", name: "Provider" },
  { id: "datetime", name: "Date & Time" },
  { id: "details", name: "Session Details" },
  { id: "confirm", name: "Confirm" },
];

export default function BookingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const [bookingData, setBookingData] = useState({
    serviceType: "",
    subject: "",
    gradeLevel: "",
    topic: "",
    fullSubject: "",
    providerId: null,
    providerName: "",
    providerRole: "",
    date: null,
    startTime: null,
    endTime: null,
    startTimeISO: null,
    endTimeISO: null,
    duration: 60,
    notes: "",
    sessionType: "virtual",
    availabilityId: null,
  });
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);
  const [planFilters, setPlanFilters] = useState({
    type: "",
    priceRange: { min: "", max: "" },
  });
  const [planSearch, setPlanSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentAmountInCents, setPaymentAmountInCents] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setAuthenticated(true);
      // Clear any previous booking state when starting fresh
      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("selectedService");
    } else {
      const returnPath = "/student/book-session";
      router.push(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
    }
  }, [router]);

  // Check for pending booking or restore active plan on component mount
  useEffect(() => {
    if (!authenticated) return;

    // Check for reschedule or change plan data
    const urlParams = new URLSearchParams(window.location.search);
    const isReschedule = urlParams.get("reschedule") === "true";
    const isChangePlan = urlParams.get("changePlan") === "true";

    if (isReschedule) {
      const rescheduleData = localStorage.getItem("rescheduleData");
      if (rescheduleData) {
        try {
          const data = JSON.parse(rescheduleData);
          setSelectedService(data.serviceType || ServiceTypes.TUTORING);
          setBookingData((prev) => ({
            ...prev,
            serviceType: data.serviceType,
            subject: data.subject,
            providerId: data.providerId,
            rescheduleSessionId: data.rescheduleSessionId,
          }));
          setCurrentStep(1); // Start at plan selection for reschedule
          localStorage.removeItem("rescheduleData");
          return;
        } catch (e) {
          console.error("Error parsing reschedule data:", e);
          localStorage.removeItem("rescheduleData");
        }
      }
    }

    if (isChangePlan) {
      const changePlanData = localStorage.getItem("changePlanData");
      if (changePlanData) {
        try {
          const data = JSON.parse(changePlanData);
          setSelectedService(data.serviceType || ServiceTypes.TUTORING);
          setBookingData((prev) => ({
            ...prev,
            serviceType: data.serviceType,
            subject: data.subject,
            providerId: data.providerId,
            changePlanSessionId: data.changePlanSessionId,
          }));
          setCurrentStep(1); // Start at plan selection for change plan
          localStorage.removeItem("changePlanData");
          return;
        } catch (e) {
          console.error("Error parsing change plan data:", e);
          localStorage.removeItem("changePlanData");
        }
      }
    }

    // Check for service type from URL params only (ignore localStorage for fresh start)
    const serviceFromUrl = urlParams.get("service");
    const serviceType = serviceFromUrl || ServiceTypes.TUTORING;

    setSelectedService(serviceType);
    setBookingData((prev) => ({ ...prev, serviceType }));

    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      try {
        const savedData = JSON.parse(pendingBooking);
        setBookingData(savedData);
        setSelectedService(savedData.serviceType || ServiceTypes.TUTORING);

        if (savedData.subject) {
          fetchProvidersBySubject(
            savedData.subject,
            savedData.serviceType || ServiceTypes.TUTORING
          );
          if (savedData.providerId) {
            if (savedData.startTimeISO) {
              setCurrentStep(savedData.notes ? 6 : 5);
            } else {
              setCurrentStep(4);
            }
          } else {
            setCurrentStep(3);
          }
        } else {
          setCurrentStep(2);
        }
      } catch (e) {
        console.error("Error restoring pending booking:", e);
        localStorage.removeItem("pendingBooking");
      }
    } else {
      // Always start from the beginning when accessing book session directly
      // Clear any stored booking data to ensure fresh start
      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("selectedService");

      // Start from step 0 (service selection) for fresh booking flow
      setCurrentStep(0);

      // Load any existing active plan for display purposes only
      const storedPlan = localStorage.getItem("activePlan");
      if (storedPlan) {
        try {
          const parsedPlan = JSON.parse(storedPlan);
          setSelectedPlan(parsedPlan);
        } catch (e) {
          console.error("Error parsing stored plan:", e);
          localStorage.removeItem("activePlan");
        }
      }
    }
  }, [authenticated]);

  // Fetch plans based on selected service
  useEffect(() => {
    if (currentStep !== 1 || !selectedService) return;
    setPlansLoading(true);
    setPlansError(null);

    const fetchPlans = async () => {
      try {
        // First try to get real plans from API
        const response = await apiGet("plans");
        const apiPlans = Array.isArray(response.data)
          ? response.data
          : response.plans || [];

        if (apiPlans.length > 0) {
          // Filter plans by service type if they have a serviceType field
          const filteredPlans = apiPlans.filter(
            (plan) => !plan.serviceType || plan.serviceType === selectedService
          );
          // Only use filtered plans if we have plans for the specific service
          if (filteredPlans.length > 0) {
            setPlans(filteredPlans);
          } else {
            // If no plans found for this service, use mock plans instead of all API plans
            const servicePlans = getServicePlans(selectedService);
            setPlans(servicePlans);
          }
        } else {
          // Fallback to mock plans if no API plans available
          const servicePlans = getServicePlans(selectedService);
          setPlans(servicePlans);
        }
        setPlansLoading(false);
      } catch (err) {
        console.warn("Failed to fetch plans from API, using mock plans:", err);
        // Fallback to mock plans on API error
        try {
          const servicePlans = getServicePlans(selectedService);
          setPlans(servicePlans);
        } catch (mockErr) {
          setPlansError(mockErr.message || "Failed to load plans");
        }
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [currentStep, selectedService]);

  // Save selected plan to localStorage
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem("activePlan", JSON.stringify(selectedPlan));
    }
  }, [selectedPlan]);

  const fetchProvidersBySubject = async (
    subject,
    serviceType = ServiceTypes.TUTORING
  ) => {
    if (!authenticated) return;

    setLoading(true);
    setError(null);
    try {
      // Determine the API endpoint based on service type
      const endpoint =
        serviceType === ServiceTypes.COUNSELING ? "counselors" : "tutors";
      const response = await apiClient.get(
        `/${endpoint}?subject=${encodeURIComponent(subject)}`
      );
      console.log(`${serviceType} API response:`, response.data);

      // Extract providers from response
      const fetchedProviders =
        response.data?.tutors ||
        response.data?.counselors ||
        response.data ||
        [];
      setProviders(fetchedProviders);
    } catch (err) {
      console.error(`Error fetching ${serviceType}:`, err);

      // Handle authentication errors
      if (err.response?.status === 401) {
        const returnPath = "/student/book-session";
        router.push(`/login?returnUrl=${encodeURIComponent(returnPath)}`);
        return;
      }

      setError(err.message || `Failed to fetch ${serviceType}`);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingData = (data) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = async () => {
    // Handle service selection on step 0
    if (currentStep === 0) {
      if (!selectedService) {
        toast.error("Please select a service type to continue");
        return;
      }
      setCurrentStep(1);
      window.scrollTo(0, 0);
      return;
    }

    // Handle plan selection on step 1
    if (currentStep === 1) {
      if (!selectedPlan) {
        toast.error("Please select a plan to continue");
        return;
      }

      // Check if this is a counseling plan - redirect to counselor booking flow
      if (selectedService === ServiceTypes.COUNSELING) {
        console.log(
          "Counseling plan selected, redirecting to counselor booking flow"
        );
        toast.success("Redirecting to counselor booking...");

        // Store the selected plan for counselor booking
        localStorage.setItem(
          "selectedCounselingPlan",
          JSON.stringify(selectedPlan)
        );

        // Redirect to counselor booking page
        router.push("/student/book-counselor");
        return;
      }

      // Check if this is a mock plan (has string ID instead of UUID)
      const isMockPlan =
        selectedPlan.id &&
        typeof selectedPlan.id === "string" &&
        !selectedPlan.id.includes("-");

      if (isMockPlan) {
        // For mock plans, skip activation and just proceed to next step
        console.log("Mock plan selected, skipping activation:", selectedPlan);
        toast.success("Plan selected! Please note: This is a demo plan.");
        setCurrentStep(2);
        window.scrollTo(0, 0);
        return;
      }

      try {
        console.log("Selected plan for purchase:", selectedPlan);
        // Use the UUID id for real API plans
        await apiPost("users/plan/change", { planId: selectedPlan.id });
        toast.success("Plan activated!");
        setCurrentStep(2);
        window.scrollTo(0, 0);
        return;
      } catch (err) {
        toast.error("Failed to activate plan: " + (err?.message || err));
        return;
      }
    }

    // Handle subject selection on step 2
    if (
      currentStep === 2 &&
      bookingData.subject &&
      bookingData.topic &&
      bookingData.gradeLevel
    ) {
      fetchProvidersBySubject(bookingData.subject, selectedService);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo(0, 0);
    }
  };

  // Allow navigation back to previous steps from the header timeline
  const canNavigateTo = (stepIdx) => stepIdx <= currentStep;
  const handleGoToStep = (stepIdx) => {
    if (stepIdx < currentStep) {
      setCurrentStep(stepIdx);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!authenticated) {
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      router.push("/login?redirect=/student/book-session");
      return;
    }
    setLoading(true);
    setError(null);
    if (
      !bookingData.providerId ||
      !bookingData.startTimeISO ||
      !bookingData.endTimeISO
    ) {
      setError("Please select a provider and a valid date/time.");
      setLoading(false);
      return;
    }

    // Use the selectedPlan from the component's state
    const currentPlan = selectedPlan;

    // Ensure there is a plan to proceed
    if (!currentPlan) {
      setError("No plan selected. Please go back and select a plan.");
      toast.error("No plan selected. Please go back and select a plan.");
      setLoading(false);
      return;
    }

    // Check if this is a counseling service - should not reach here due to redirect in handleNext
    // But add safety check to prevent duplicate bookings
    if (selectedService === ServiceTypes.COUNSELING) {
      console.error(
        "Counseling service reached handleSubmit - this should not happen!"
      );
      setError(
        "Counseling services should be handled through the counselor booking flow."
      );
      toast.error(
        "Please use the counselor booking flow for counseling services."
      );
      setLoading(false);
      return;
    }

    // Check if this is a mock plan (has string ID instead of UUID)
    const isMockPlan =
      currentPlan.id &&
      typeof currentPlan.id === "string" &&
      !currentPlan.id.includes("-");

    // Calculate the correct price based on the actual duration selected
    let sessionPriceInCents;

    if (currentPlan.type === "single") {
      // For single sessions, calculate price based on duration
      // Base price is per hour (60 minutes), so calculate proportionally
      const basePricePerHour = currentPlan.price; // $74.99 per hour
      const durationInHours = bookingData.duration / 60; // Convert minutes to hours
      const calculatedPrice = basePricePerHour * durationInHours;
      sessionPriceInCents = Math.round(calculatedPrice * 100);

      console.log(
        `Single session pricing: ${basePricePerHour}/hour × ${durationInHours} hours = $${calculatedPrice.toFixed(
          2
        )}`
      );
    } else if (currentPlan.type === "multi_hour") {
      // For multi-hour packages, use the calculated price from the duration selector
      sessionPriceInCents = Math.round(currentPlan.calculatedPrice * 100);
    } else {
      // For monthly plans, use the plan price as is
      sessionPriceInCents = Math.round(currentPlan.calculatedPrice * 100);
    }

    console.log(`Final amountInCents sent to backend: ${sessionPriceInCents}`);
    // Save for inline payment form
    setPaymentAmountInCents(sessionPriceInCents);

    const bookingPayload = {
      providerId: bookingData.providerId,
      providerRole:
        bookingData.providerRole ||
        (selectedService === ServiceTypes.COUNSELING ? "counselor" : "tutor"),
      serviceType: selectedService,
      startTime: bookingData.startTimeISO,
      endTime: bookingData.endTimeISO,
      sessionType: bookingData.sessionType || "virtual",
      notes: bookingData.notes || "",
      subject: bookingData.subject,
      topic: bookingData.topic || "",
      status: "pending",
      availabilityId: bookingData.availabilityId,
      // Handle mock plans by using a placeholder UUID or skipping planId
      ...(isMockPlan
        ? {
            planName: currentPlan.name,
            isDemoPlan: true,
          }
        : {
            planId: currentPlan.id,
            planName: currentPlan.name,
          }),
      // Pass the correct amount to the backend
      amount: sessionPriceInCents,
      currency: "usd",
    };

    console.log("Submitting with Final Booking Payload:", bookingPayload);

    try {
      const response = await apiClient.post("/bookings", bookingPayload);
      const booking = response.data;
      
      // Check if payment is required
      if (response.status === 402 || !booking.isPaid) {
        // Payment is required - show payment modal
        setCreatedBooking(booking);
        setShowPaymentModal(true);
        return;
      }
      
      localStorage.removeItem("pendingBooking");
      localStorage.setItem("currentBooking", JSON.stringify(booking));
      if (booking.bookingId) {
        // Open inline payment modal instead of navigating
        setCreatedBooking(booking);
        setShowPaymentModal(true);
      } else {
        setError("Booking failed: No bookingId returned from backend.");
      }
    } catch (err) {
      // Extract message and status for friendlier UX
      const status = err?.response?.status || err?.status;
      const backendMsg = err?.response?.data?.message || err?.message || "";

      // Handle already booked/duplicate selection
      if (String(status) === "400" || /already\s*book/i.test(backendMsg)) {
        // Persist this attempted slot so pickers hide/disable it on return
        try {
          const raw = localStorage.getItem("recentlyBookedSlots");
          const list = raw ? JSON.parse(raw) : [];
          list.push({
            tutorId: bookingData.providerId,
            date: (bookingData.startTimeISO
              ? new Date(bookingData.startTimeISO)
              : new Date()
            )
              .toISOString()
              .slice(0, 10),
            value: bookingData.startTimeISO
              ? new Date(bookingData.startTimeISO).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : null,
          });
          localStorage.setItem(
            "recentlyBookedSlots",
            JSON.stringify(list.filter(Boolean))
          );
        } catch (e) {}

        setError("That time slot was just taken. Please choose another time.");
        toast.error("That time slot was just taken. Please choose another time.");
        setCurrentStep(4);
        window.scrollTo(0, 0);
        return;
      }

      // Auth required
      if (String(status) === "401") {
        localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
        router.push("/login?redirect=/student/book-session");
        return;
      }

      // Payment required (402)
      if (String(status) === "402") {
        const bookingDetails = err?.response?.data?.bookingData || bookingPayload;
        // Show payment modal with booking details
        const tempBooking = {
          ...bookingDetails,
          bookingId: `temp-${Date.now()}`,
          requiresPayment: true,
          price: err?.response?.data?.price || sessionPriceInCents / 100,
          paymentAmount: sessionPriceInCents
        };
        setCreatedBooking(tempBooking);
        setShowPaymentModal(true);
        return;
      }

      // Map common errors to friendly copy
      let friendly = "Booking failed. Please try again.";
      switch (String(status)) {
        case "403":
          friendly = "You don't have permission to book this session.";
          break;
        case "404":
          friendly = "Selected provider was not found. Please reselect a tutor.";
          break;
        case "409":
          friendly = "This time slot is no longer available. Please pick another.";
          break;
        case "422":
          friendly = "Please check your booking details and try again.";
          break;
        case "500":
          friendly = "Server error while creating your booking. Please try again later.";
          break;
        default:
          // Fall back to backend message if it's user-friendly, otherwise generic
          friendly = backendMsg && /[a-z]/i.test(backendMsg)
            ? backendMsg
            : friendly;
      }

      setError(friendly);
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  // Service selection step UI
  const renderServiceSelection = () => {
    return (
      <div>
        <ServiceSelection
          onSelectService={(serviceType) => {
            setSelectedService(serviceType);
            setBookingData((prev) => ({ ...prev, serviceType }));
            // Save service selection to localStorage
            localStorage.setItem("selectedService", serviceType);
          }}
          selectedService={selectedService}
          variant="featured"
        />
      </div>
    );
  };

  // Plan selection step UI
  const renderPlanSelection = () => {
    // Filter/search plans, ensuring 'plans' is always treated as an array to prevent crashes
    const planList = Array.isArray(plans) ? plans : [];
    let filteredPlans = planList;
    if (planFilters.type) {
      filteredPlans = planList.filter((p) => p.type === planFilters.type);
    }
    if (planFilters.priceRange.min) {
      filteredPlans = filteredPlans.filter(
        (p) => p.calculatedPrice >= Number(planFilters.priceRange.min)
      );
    }
    if (planFilters.priceRange.max) {
      filteredPlans = filteredPlans.filter(
        (p) => p.calculatedPrice <= Number(planFilters.priceRange.max)
      );
    }
    if (planSearch) {
      filteredPlans = filteredPlans.filter((p) =>
        p.name.toLowerCase().includes(planSearch.toLowerCase())
      );
    }

    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Select a{" "}
            {selectedService === ServiceTypes.COUNSELING
              ? "Counseling"
              : selectedService === ServiceTypes.TEST_PREP
              ? "Test Prep"
              : selectedService === ServiceTypes.IWGSP
              ? "IWGSP"
              : "Tutoring"}{" "}
            Plan
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose the plan that best fits your learning goals and budget
          </p>
        </div>

        <PlanFilters
          plans={plans}
          onFilterChange={setPlanFilters}
          onSearchChange={setPlanSearch}
        />

        {plansLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading plans...</p>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we fetch the best plans for you
            </p>
          </div>
        ) : plansError ? (
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
              Unable to load plans
            </h3>
            <p className="text-red-600 mb-6">{plansError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={setSelectedPlan}
                disableHourSelection={
                  selectedService === ServiceTypes.TEST_PREP
                }
                fixedHoursLabel={"10 sessions"}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Reschedule/Change Plan Banner */}
        {(bookingData.rescheduleSessionId ||
          bookingData.changePlanSessionId) && (
          <div className="mb-4 sm:mb-6">
            <div
              className={`bg-gradient-to-r rounded-xl p-4 sm:p-6 border-2 ${
                bookingData.rescheduleSessionId
                  ? "from-blue-50 to-indigo-50 border-blue-200"
                  : "from-purple-50 to-pink-50 border-purple-200"
              }`}
            >
              <div className="flex items-start sm:items-center">
                <div
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                    bookingData.rescheduleSessionId
                      ? "bg-blue-100"
                      : "bg-purple-100"
                  }`}
                >
                  {bookingData.rescheduleSessionId ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <h3
                    className={`text-base sm:text-lg font-semibold ${
                      bookingData.rescheduleSessionId
                        ? "text-blue-900"
                        : "text-purple-900"
                    }`}
                  >
                    {bookingData.rescheduleSessionId
                      ? "Rescheduling Session"
                      : "Changing Plan"}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      bookingData.rescheduleSessionId
                        ? "text-blue-700"
                        : "text-purple-700"
                    }`}
                  >
                    {bookingData.rescheduleSessionId
                      ? "Select a new date and time for your session. Your current session will be cancelled once confirmed."
                      : "Choose a new plan for your session. You can upgrade to Advanced Single Hour or select a different plan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-100">
            <nav aria-label="Progress">
              {/* Mobile: Vertical Timeline */}
              <div className="block md:hidden">
                <div className="space-y-6">
                  {steps.map((step, stepIdx) => (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-4 ${
                        canNavigateTo(stepIdx)
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={() => handleGoToStep(stepIdx)}
                      role="button"
                      aria-disabled={!canNavigateTo(stepIdx)}
                      title={
                        canNavigateTo(stepIdx)
                          ? "Go to this step"
                          : "You can only navigate to completed steps"
                      }
                    >
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
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

                        {/* Show selected service for step 0 */}
                        {stepIdx === 0 && selectedService && (
                          <div className="text-sm text-blue-500 font-medium mt-1">
                            {selectedService === ServiceTypes.COUNSELING
                              ? "Counseling"
                              : selectedService === ServiceTypes.TEST_PREP
                              ? "Test Prep"
                              : selectedService === ServiceTypes.IWGSP
                              ? "IWGSP"
                              : "Tutoring"}
                          </div>
                        )}

                        {/* Show selected plan name for step 1 */}
                        {stepIdx === 1 && selectedPlan && (
                          <div className="text-sm text-blue-500 font-medium mt-1">
                            {selectedPlan.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablet: Compact Horizontal Timeline */}
              <div className="hidden md:block lg:hidden">
                <div className="relative">
                  <div className="flex items-center justify-start overflow-x-auto pb-4 gap-2">
                    {steps.map((step, stepIdx) => (
                      <div
                        key={step.id}
                        className={`flex flex-col items-center text-center relative flex-shrink-0 ${
                          canNavigateTo(stepIdx)
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                        onClick={() => handleGoToStep(stepIdx)}
                        role="button"
                        style={{ minWidth: "90px" }}
                      >
                        {/* Step Circle */}
                        <div className="relative mb-2 z-10">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              currentStep >= stepIdx
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {currentStep > stepIdx ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-xs font-bold">
                                {stepIdx + 1}
                              </span>
                            )}
                          </div>
                          {currentStep === stepIdx && (
                            <div className="absolute -inset-1 rounded-full bg-blue-100 animate-pulse"></div>
                          )}
                        </div>

                        {/* Step Label */}
                        <div className="w-full">
                          <div
                            className={`text-xs font-semibold transition-colors duration-300 mb-1 ${
                              currentStep >= stepIdx
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </div>
                          {stepIdx === 0 && selectedService && (
                            <div className="text-[10px] text-blue-500 font-medium">
                              {selectedService === ServiceTypes.COUNSELING ? "Counseling" : "Tutoring"}
                            </div>
                          )}
                          {stepIdx === 1 && selectedPlan && (
                            <div className="text-[10px] text-blue-500 font-medium truncate">
                              {selectedPlan.name.length > 12 
                                ? selectedPlan.name.substring(0, 12) + '...'
                                : selectedPlan.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: Full Horizontal Timeline */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="flex items-center justify-between px-2">
                    {steps.map((step, stepIdx) => (
                      <div
                        key={step.id}
                        className={`flex flex-col items-center text-center relative ${
                          canNavigateTo(stepIdx)
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                        onClick={() => handleGoToStep(stepIdx)}
                        role="button"
                        aria-disabled={!canNavigateTo(stepIdx)}
                        title={
                          canNavigateTo(stepIdx)
                            ? "Go to this step"
                            : "You can only navigate to completed steps"
                        }
                        style={{
                          width: `${100 / steps.length}%`,
                          minWidth: "80px",
                        }}
                      >
                        {/* Step Circle */}
                        <div className="relative mb-2 sm:mb-3 z-10">
                          <div
                            className={`flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              currentStep >= stepIdx
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                : "bg-white border-gray-300 text-gray-400"
                            }`}
                          >
                            {currentStep > stepIdx ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 lg:h-6 lg:w-6"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-sm lg:text-base font-bold">
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
                        <div className="w-full">
                          <div
                            className={`text-xs lg:text-sm font-semibold transition-colors duration-300 mb-1 text-center ${
                              currentStep >= stepIdx
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </div>

                          {/* Show selected service for step 0 */}
                          {stepIdx === 0 && selectedService && (
                            <div className="text-xs text-blue-500 font-medium text-center">
                              {selectedService === ServiceTypes.COUNSELING
                                ? "Counseling"
                                : selectedService === ServiceTypes.TEST_PREP
                                ? "Test Prep"
                                : selectedService === ServiceTypes.IWGSP
                                ? "IWGSP"
                                : "Tutoring"}
                            </div>
                          )}

                          {/* Show selected plan name for step 1 */}
                          {stepIdx === 1 && selectedPlan && (
                            <div className="text-xs text-blue-500 font-medium text-center leading-tight">
                              {selectedPlan.name.length > 15 
                                ? selectedPlan.name.substring(0, 15) + '...'
                                : selectedPlan.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continuous horizontal line */}
                  <div className="absolute top-5 lg:top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 sm:mb-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800">Error</h3>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            {currentStep === 0 && renderServiceSelection()}
            {currentStep === 1 && renderPlanSelection()}
            {currentStep === 2 && (
              <SubjectPicker
                selectedSubject={bookingData.subject}
                onSelectSubject={(subjectData) =>
                  updateBookingData({
                    subject: subjectData.mainSubject,
                    gradeLevel: subjectData.gradeLevel,
                    topic: subjectData.topic,
                    fullSubject: subjectData.fullSubject,
                  })
                }
              />
            )}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Choose a{" "}
                    {selectedService === ServiceTypes.COUNSELING
                      ? "Counselor"
                      : selectedService === ServiceTypes.TEST_PREP
                      ? "Test Prep Tutor"
                      : selectedService === ServiceTypes.IWGSP
                      ? "IWGSP Advisor"
                      : "Tutor"}{" "}
                    for {bookingData.fullSubject || bookingData.subject}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Select a qualified{" "}
                    {selectedService === ServiceTypes.COUNSELING
                      ? "counselor"
                      : selectedService === ServiceTypes.TEST_PREP
                      ? "test prep tutor"
                      : selectedService === ServiceTypes.IWGSP
                      ? "IWGSP advisor"
                      : "tutor"}{" "}
                    who specializes in{" "}
                    {bookingData.fullSubject || bookingData.subject}
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading{" "}
                      {selectedService === ServiceTypes.COUNSELING
                        ? "counselors"
                        : selectedService === ServiceTypes.TEST_PREP
                        ? "test prep tutors"
                        : selectedService === ServiceTypes.IWGSP
                        ? "IWGSP advisors"
                        : "tutors"}
                      ...
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Please wait while we fetch the best{" "}
                      {selectedService === ServiceTypes.COUNSELING
                        ? "counselors"
                        : selectedService === ServiceTypes.TEST_PREP
                        ? "test prep tutors"
                        : selectedService === ServiceTypes.IWGSP
                        ? "IWGSP advisors"
                        : "tutors"}{" "}
                      for you
                    </p>
                  </div>
                ) : providers.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-yellow-600"
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
                      No{" "}
                      {selectedService === ServiceTypes.COUNSELING
                        ? "counselors"
                        : "tutors"}{" "}
                      available
                    </h3>
                    <p className="text-gray-500 mb-6">
                      No{" "}
                      {selectedService === ServiceTypes.COUNSELING
                        ? "counselors"
                        : "tutors"}{" "}
                      are currently available for{" "}
                      {bookingData.fullSubject || bookingData.subject}.
                    </p>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Choose Different Subject
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {providers.map((provider) => (
                      <TutorCard
                        key={provider.id}
                        tutor={{
                          id: provider.id,
                          name:
                            provider.fullName ||
                            provider.name ||
                            `${
                              selectedService === ServiceTypes.COUNSELING
                                ? "Counselor"
                                : "Tutor"
                            } #${provider.id}`,
                          image: getProfileImageUrl(
                            provider.profileImageUrl ||
                              provider.tutorProfile?.profileImageUrl ||
                              provider.counselorProfile?.profileImageUrl ||
                              provider.tutorProfile?.profileImage ||
                              provider.counselorProfile?.profileImage ||
                              provider.profileImage ||
                              provider.image
                          ),
                          subjects: provider.tutorProfile?.subjects ||
                            provider.counselorProfile?.subjects ||
                            provider.subjects || [bookingData.subject],
                          rating: provider.rating || 4.8,
                          reviews:
                            provider.reviewCount || provider.reviews || 24,
                          bio:
                            provider.tutorProfile?.bio ||
                            provider.counselorProfile?.bio ||
                            provider.bio ||
                            "",
                          experience:
                            provider.tutorProfile?.experience ||
                            provider.counselorProfile?.experience ||
                            provider.experience ||
                            1,
                        }}
                        isSelected={bookingData.providerId === provider.id}
                        onSelect={() =>
                          updateBookingData({
                            providerId: provider.id,
                            providerName:
                              provider.fullName ||
                              provider.name ||
                              `${
                                selectedService === ServiceTypes.COUNSELING
                                  ? "Counselor"
                                  : "Tutor"
                              } #${provider.id}`,
                            providerRole:
                              selectedService === ServiceTypes.COUNSELING
                                ? "counselor"
                                : "tutor",
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {currentStep === 4 && (
              <DateTimePicker
                tutorId={bookingData.providerId}
                selectedDate={bookingData.date}
                selectedTime={bookingData.startTime}
                duration={bookingData.duration}
                onSelect={(
                  date,
                  displayStartTime,
                  displayEndTime,
                  duration,
                  startTimeISO,
                  endTimeISO,
                  availabilityId
                ) =>
                  updateBookingData({
                    date,
                    startTime: displayStartTime,
                    endTime: displayEndTime,
                    duration,
                    startTimeISO,
                    endTimeISO,
                    availabilityId,
                  })
                }
              />
            )}
            {currentStep === 5 && (
              <SessionForm
                sessionDetails={bookingData}
                onChange={updateBookingData}
                onlineOnly
              />
            )}
            {currentStep === 6 && (
              <BookingSummary
                bookingData={bookingData}
                activePlan={selectedPlan}
                subscriptionBased={
                  selectedPlan?.id === "monthly_regular" ||
                  selectedPlan?.id === "monthly_advanced"
                }
              />
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 border-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer"
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={
                  currentStep === steps.length - 1 ? handleSubmit : handleNext
                }
                disabled={
                  (currentStep === 0 && !selectedService) ||
                  (currentStep === 1 && !selectedPlan) ||
                  (currentStep === 2 &&
                    (!bookingData.subject ||
                      !bookingData.topic ||
                      !bookingData.gradeLevel)) ||
                  (currentStep === 3 && !bookingData.providerId) ||
                  (currentStep === 4 && !bookingData.startTimeISO) ||
                  loading
                }
                className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold text-white transition-all ${
                  (currentStep === 0 && !selectedService) ||
                  (currentStep === 1 && !selectedPlan) ||
                  (currentStep === 2 &&
                    (!bookingData.subject ||
                      !bookingData.topic ||
                      !bookingData.gradeLevel)) ||
                  (currentStep === 3 && !bookingData.providerId) ||
                  (currentStep === 4 && !bookingData.startTimeISO) ||
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : currentStep === steps.length - 1
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg cursor-pointer"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span className="text-xs sm:text-sm">Processing...</span>
                  </div>
                ) : currentStep === 0 ? (
                  "Select Plan"
                ) : currentStep === steps.length - 1 ? (
                  "Confirm Booking"
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* Payment Modal */}
    {showPaymentModal && createdBooking && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            onClick={() => setShowPaymentModal(false)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-gray-700 z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pr-8">Complete Your Payment</h3>
          <PaymentForm
            bookingId={createdBooking.bookingId}
            amount={paymentAmountInCents || 0}
            currency={createdBooking.currency || "usd"}
            booking={{
              ...createdBooking,
              providerName: bookingData.providerName,
              subject: bookingData.subject,
              duration: bookingData.duration,
              startTime: bookingData.startTimeISO,
            }}
            onSuccess={() => {
              setShowPaymentModal(false);
              // Persist this slot as recently booked only after successful payment
              try {
                const raw = localStorage.getItem('recentlyBookedSlots');
                const list = raw ? JSON.parse(raw) : [];
                list.push({
                  tutorId: bookingData.providerId,
                  date: (bookingData.startTimeISO ? new Date(bookingData.startTimeISO) : new Date()).toISOString().slice(0,10),
                  value: bookingData.startTimeISO ? new Date(bookingData.startTimeISO).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) : null
                });
                localStorage.setItem('recentlyBookedSlots', JSON.stringify(list.filter(Boolean)));
              } catch (e) {}
              setShowSuccessPopup(true);
              setSuccessCountdown(5);
              const interval = setInterval(() => {
                setSuccessCountdown((s) => {
                  if (s <= 1) {
                    clearInterval(interval);
                    // Use setTimeout to avoid calling router.push during render
                    setTimeout(() => {
                      router.push('/student/my-sessions');
                    }, 0);
                    return 0;
                  }
                  return s - 1;
                });
              }, 1000);
            }}
            onError={(e) => {
              console.error(e);
            }}
            onCancel={async () => {
              // Cancel the unpaid booking on modal close
              try {
                if (createdBooking?.bookingId) {
                  await apiClient.put(`/bookings/${createdBooking.bookingId}/cancel`, {
                    cancellationReason: 'Payment canceled by user',
                  });
                }
              } catch (e) {
                console.warn('Failed to cancel unpaid booking', e);
              } finally {
                setShowPaymentModal(false);
                setCreatedBooking(null);
              }
            }}
          />
        </div>
      </div>
    )}

    {/* Success Popup */}
    {showSuccessPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 text-center">
          <div className="mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-green-600"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42l2.29 2.29 6.54-6.54a1 1 0 011.42 0z" clipRule="evenodd"/></svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Payment successful</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Redirecting to your sessions in {successCountdown}s</p>
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 cursor-pointer"
              onClick={() => router.push('/student/book-session')}
            >
              Book another session
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 cursor-pointer"
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
