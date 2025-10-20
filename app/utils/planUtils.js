import { PlanTypes, PlanStatus } from "../lib/api/plans";

/**
 * Format price to USD currency
 * @param {number} price - Price in USD
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Format duration from minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} finalPrice - Final price after discount
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, finalPrice) => {
  if (originalPrice <= finalPrice) return 0;
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
};

/**
 * Get plan type display name
 * @param {string} type - Plan type
 * @returns {string} Display name
 */
export const getPlanTypeDisplayName = (type) => {
  const typeNames = {
    [PlanTypes.MONTHLY]: "Monthly Plan",
    [PlanTypes.MULTI_HOUR]: "Multi-Hour Package",
    [PlanTypes.SINGLE]: "Single Session",
  };
  return typeNames[type] || type;
};

/**
 * Get plan status display name and color
 * @param {string} status - Plan status
 * @returns {Object} Status display info
 */
export const getPlanStatusInfo = (status) => {
  const statusInfo = {
    [PlanStatus.ACTIVE]: {
      name: "Active",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    [PlanStatus.EXPIRED]: {
      name: "Expired",
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
    },
    [PlanStatus.CANCELLED]: {
      name: "Cancelled",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-200",
    },
    [PlanStatus.PENDING]: {
      name: "Pending",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
    },
  };
  return statusInfo[status] || statusInfo[PlanStatus.PENDING];
};

/**
 * Calculate remaining sessions for monthly plans
 * @param {number} totalSessions - Total sessions in plan
 * @param {number} sessionsUsed - Sessions used
 * @returns {number} Remaining sessions
 */
export const calculateRemainingSessions = (totalSessions, sessionsUsed) => {
  return Math.max(0, totalSessions - sessionsUsed);
};

/**
 * Get session usage percentage
 * @param {number} sessionsUsed - Sessions used
 * @param {number} totalSessions - Total sessions
 * @returns {number} Usage percentage (0-100)
 */
export const getSessionUsagePercentage = (sessionsUsed, totalSessions) => {
  if (totalSessions === 0) return 0;
  return Math.round((sessionsUsed / totalSessions) * 100);
};

/**
 * Calculate days until renewal
 * @param {string} endDate - Plan end date (ISO string)
 * @returns {number} Days until renewal
 */
export const calculateDaysUntilRenewal = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Check if plan is expiring soon (within 7 days)
 * @param {string} endDate - Plan end date
 * @returns {boolean} True if expiring soon
 */
export const isPlanExpiringSoon = (endDate) => {
  const daysUntilRenewal = calculateDaysUntilRenewal(endDate);
  return daysUntilRenewal <= 7 && daysUntilRenewal > 0;
};

/**
 * Check if plan is expired
 * @param {string} endDate - Plan end date
 * @returns {boolean} True if expired
 */
export const isPlanExpired = (endDate) => {
  const daysUntilRenewal = calculateDaysUntilRenewal(endDate);
  return daysUntilRenewal === 0;
};

/**
 * Get plan features based on type
 * @param {string} type - Plan type
 * @param {number} sessionCount - Number of sessions (for monthly plans)
 * @returns {string[]} Array of features
 */
export const getPlanFeatures = (type, sessionCount = null) => {
  const baseFeatures = [
    "Qualified tutors",
    "Flexible scheduling",
    "Progress tracking",
    "24/7 support",
  ];

  const typeFeatures = {
    [PlanTypes.MONTHLY]: [
      `${sessionCount} sessions per month`,
      "Rollover sessions (up to 2)",
      "Priority booking",
      "Monthly progress reports",
    ],
    [PlanTypes.MULTI_HOUR]: [
      "Bulk session discount",
      "Flexible scheduling",
      "Session credits valid for 6 months",
      "No monthly commitment",
    ],
    [PlanTypes.SINGLE]: [
      "One-time session",
      "No commitment required",
      "Pay as you go",
      "Immediate booking",
    ],
  };

  return [...baseFeatures, ...(typeFeatures[type] || [])];
};

/**
 * Sort plans by price (ascending)
 * @param {Array} plans - Array of plans
 * @returns {Array} Sorted plans
 */
export const sortPlansByPrice = (plans) => {
  return [...plans].sort((a, b) => a.calculatedPrice - b.calculatedPrice);
};

/**
 * Filter plans by type
 * @param {Array} plans - Array of plans
 * @param {string} type - Plan type to filter by
 * @returns {Array} Filtered plans
 */
export const filterPlansByType = (plans, type) => {
  if (!type) return plans;
  return plans.filter((plan) => plan.type === type);
};

/**
 * Search plans by name
 * @param {Array} plans - Array of plans
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered plans
 */
export const searchPlans = (plans, searchTerm) => {
  if (!searchTerm) return plans;
  const term = searchTerm.toLowerCase();
  return plans.filter((plan) => plan.name.toLowerCase().includes(term));
};

/**
 * Get recommended plans based on user preferences
 * @param {Array} plans - Array of plans
 * @param {Object} preferences - User preferences
 * @returns {Array} Recommended plans
 */
export const getRecommendedPlans = (plans, preferences = {}) => {
  const { frequency, budget, commitment } = preferences;

  let recommendations = [...plans];

  // Filter by budget if specified
  if (budget) {
    recommendations = recommendations.filter(
      (plan) => plan.calculatedPrice <= budget
    );
  }

  // Sort by frequency preference
  if (frequency === "monthly") {
    recommendations = recommendations.filter(
      (plan) => plan.type === PlanTypes.MONTHLY
    );
  } else if (frequency === "flexible") {
    recommendations = recommendations.filter(
      (plan) => plan.type !== PlanTypes.MONTHLY
    );
  }

  // Sort by commitment preference
  if (commitment === "low") {
    recommendations = recommendations.filter(
      (plan) => plan.type === PlanTypes.SINGLE
    );
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
};
