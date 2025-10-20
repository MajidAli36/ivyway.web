import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export default function BookingSummary({
  bookingData,
  subscriptionBased,
  activePlan,
}) {
  // Calculate the correct price based on duration for single sessions
  const calculateSessionPrice = () => {
    if (!activePlan || !bookingData.duration) return activePlan?.price || 0;
    
    if (activePlan.type === "single") {
      const basePricePerHour = activePlan.price; // $74.99 per hour
      const durationInHours = bookingData.duration / 60; // Convert minutes to hours
      return basePricePerHour * durationInHours;
    }
    
    return activePlan.calculatedPrice || activePlan.price;
  };

  const sessionPrice = calculateSessionPrice();
  const formatDate = (dateString) => {
    if (!dateString) return "No date selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Booking Summary
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Please review your session details before confirming
        </p>
      </div>

      {/* Plan Information */}
      {activePlan && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Selected Plan: {activePlan.name}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>{activePlan.description}</p>
                {activePlan.price && (
                  <p className="font-medium mt-1">
                    {activePlan.id === "monthly_regular" ||
                    activePlan.id === "monthly_advanced"
                      ? `Monthly Price: $${activePlan.price}/month`
                      : activePlan.id === "multi_hour"
                      ? "Flexible pricing with bulk discounts"
                      : activePlan.type === "single"
                      ? `Session Price: $${sessionPrice.toFixed(2)} (${bookingData.duration} minutes)`
                      : `Session Price: $${activePlan.price}/session`}
                  </p>
                )}
                {activePlan.sessions && (
                  <p className="text-xs text-blue-600 mt-1">
                    {activePlan.sessions} session
                    {activePlan.sessions > 1 ? "s" : ""} • {activePlan.duration}
                  </p>
                )}
                {/* Show calculated price for this session */}
                {bookingData.duration && (
                  <div className="text-xs text-blue-600 mt-1">
                    <p>This session: {bookingData.duration} minutes</p>
                    {activePlan.type === "single" && (
                      <p className="mt-1">
                        Rate: ${activePlan.price}/hour × {bookingData.duration} minutes = ${sessionPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Included with subscription message */}
      {subscriptionBased && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Included with your subscription
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>This session is covered by your active subscription plan.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex items-center">
          <BookOpenIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {bookingData.subject || "No subject selected"}
            </p>
            {bookingData.topic && (
              <p className="text-xs text-gray-500">{bookingData.topic}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-900">
            {formatDate(bookingData.date)}
          </p>
        </div>

        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-900">
            {bookingData.startTime || "No time selected"} -{" "}
            {bookingData.endTime || "--"} ({bookingData.duration || 60} minutes)
          </p>
        </div>

        <div className="flex items-center">
          <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-2" />
          <p className="text-sm text-gray-900">Online Zoom Session</p>
        </div>

        {/* Tutor information */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Tutor</h4>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {bookingData.providerName ||
                  bookingData.tutorName ||
                  bookingData.counselorName ||
                  `Tutor #${bookingData.providerId || bookingData.tutorId || ""}`}
              </p>
            </div>
          </div>
        </div>

        {/* Additional notes */}
        {bookingData.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Your Notes
            </h4>
            <p className="text-sm text-gray-600">{bookingData.notes}</p>
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="bg-blue-50 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          What happens next?
        </h4>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>You'll receive a confirmation email with session details</li>
          <li>A Zoom link will be sent 30 minutes before your session</li>
          <li>Your tutor may contact you to discuss specific requirements</li>
          <li>
            You can reschedule or cancel this session up to 4 hours before the
            start time
          </li>
        </ul>
      </div>
    </div>
  );
}
