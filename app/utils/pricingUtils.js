/**
 * Pricing Utilities for Tutor Type System
 * Handles dynamic rate calculations and pricing logic
 */

/**
 * Calculate tutor rate based on type and performance
 * @param {string} tutorType - 'regular' or 'advanced'
 * @param {number} baseRate - Base hourly rate
 * @param {number} completedSessions - Number of completed sessions
 * @param {number} averageRating - Average rating (1-5)
 * @returns {number} Calculated hourly rate
 */
export const calculateTutorRate = (
  tutorType,
  baseRate,
  completedSessions,
  averageRating = 4.0
) => {
  if (tutorType === "advanced") {
    // Advanced tutors start at $35/hour
    let rate = 35.0;

    // Apply session-based bonuses
    if (completedSessions >= 100) {
      rate += 5.0; // +$5 for 100+ sessions
    } else if (completedSessions >= 50) {
      rate += 3.0; // +$3 for 50+ sessions
    } else if (completedSessions >= 25) {
      rate += 1.0; // +$1 for 25+ sessions
    }

    // Apply rating-based bonuses
    if (averageRating >= 4.8) {
      rate += 2.0; // +$2 for excellent ratings
    } else if (averageRating >= 4.5) {
      rate += 1.0; // +$1 for good ratings
    }

    // Cap at $40/hour
    return Math.min(rate, 40.0);
  } else {
    // Regular tutors start at $25/hour
    let rate = baseRate || 25.0;

    // Apply session-based bonuses
    if (completedSessions >= 50) {
      rate += 3.0; // +$3 for 50+ sessions
    } else if (completedSessions >= 25) {
      rate += 1.5; // +$1.50 for 25+ sessions
    } else if (completedSessions >= 10) {
      rate += 0.5; // +$0.50 for 10+ sessions
    }

    // Apply rating-based bonuses
    if (averageRating >= 4.8) {
      rate += 1.5; // +$1.50 for excellent ratings
    } else if (averageRating >= 4.5) {
      rate += 0.75; // +$0.75 for good ratings
    }

    // Cap at $30/hour for regular tutors
    return Math.min(rate, 30.0);
  }
};

/**
 * Calculate potential advanced rate for regular tutors
 * @param {number} completedSessions - Number of completed sessions
 * @param {number} averageRating - Average rating (1-5)
 * @returns {number} Potential advanced rate
 */
export const calculatePotentialAdvancedRate = (
  completedSessions,
  averageRating = 4.0
) => {
  return calculateTutorRate("advanced", 35.0, completedSessions, averageRating);
};

/**
 * Get rate increase amount when upgrading to advanced
 * @param {number} currentRate - Current hourly rate
 * @param {number} potentialRate - Potential advanced rate
 * @returns {number} Rate increase amount
 */
export const getRateIncrease = (currentRate, potentialRate) => {
  return potentialRate - currentRate;
};

/**
 * Get rate increase percentage when upgrading to advanced
 * @param {number} currentRate - Current hourly rate
 * @param {number} potentialRate - Potential advanced rate
 * @returns {number} Rate increase percentage
 */
export const getRateIncreasePercentage = (currentRate, potentialRate) => {
  return ((potentialRate - currentRate) / currentRate) * 100;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Get tutor type display information
 * @param {string} tutorType - 'regular' or 'advanced'
 * @returns {Object} Display information
 */
export const getTutorTypeInfo = (tutorType) => {
  const types = {
    regular: {
      name: "Regular Tutor",
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      baseRate: 25.0,
      maxRate: 30.0,
      description: "Standard tutoring services with competitive rates",
    },
    advanced: {
      name: "Advanced Tutor",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      baseRate: 35.0,
      maxRate: 40.0,
      description: "Premium tutoring services with advanced subject expertise",
    },
  };

  return types[tutorType] || types.regular;
};

/**
 * Check if tutor is eligible for upgrade
 * @param {Object} tutorData - Tutor data object
 * @returns {Object} Eligibility information
 */
export const checkUpgradeEligibility = (tutorData) => {
  const {
    completedSessions = 0,
    profileCompletion = 0,
    averageRating = 0,
    tutorType = "regular",
  } = tutorData;

  const requirements = {
    minSessions: 20,
    minProfileCompletion: 80,
    minRating: 4.0,
  };

  const isEligible =
    completedSessions >= requirements.minSessions &&
    profileCompletion >= requirements.minProfileCompletion &&
    averageRating >= requirements.minRating &&
    tutorType === "regular";

  const missingRequirements = [];

  if (completedSessions < requirements.minSessions) {
    missingRequirements.push(
      `Complete ${requirements.minSessions - completedSessions} more sessions`
    );
  }

  if (profileCompletion < requirements.minProfileCompletion) {
    missingRequirements.push(
      `Complete ${
        requirements.minProfileCompletion - profileCompletion
      }% more of your profile`
    );
  }

  if (averageRating < requirements.minRating) {
    missingRequirements.push(
      `Maintain a rating of at least ${requirements.minRating}`
    );
  }

  return {
    isEligible,
    missingRequirements,
    requirements: {
      completedSessions,
      requiredSessions: requirements.minSessions,
      profileCompletion,
      requiredProfileCompletion: requirements.minProfileCompletion,
      averageRating,
      requiredRating: requirements.minRating,
    },
  };
};

/**
 * Calculate monthly earnings potential
 * @param {number} hourlyRate - Hourly rate
 * @param {number} hoursPerWeek - Hours per week
 * @param {number} weeksPerMonth - Weeks per month (default 4.33)
 * @returns {number} Monthly earnings potential
 */
export const calculateMonthlyEarnings = (
  hourlyRate,
  hoursPerWeek,
  weeksPerMonth = 4.33
) => {
  return hourlyRate * hoursPerWeek * weeksPerMonth;
};

/**
 * Calculate annual earnings potential
 * @param {number} hourlyRate - Hourly rate
 * @param {number} hoursPerWeek - Hours per week
 * @param {number} weeksPerYear - Weeks per year (default 52)
 * @returns {number} Annual earnings potential
 */
export const calculateAnnualEarnings = (
  hourlyRate,
  hoursPerWeek,
  weeksPerYear = 52
) => {
  return hourlyRate * hoursPerWeek * weeksPerYear;
};

/**
 * Get rate tier information
 * @param {number} rate - Current rate
 * @returns {Object} Rate tier information
 */
export const getRateTier = (rate) => {
  if (rate >= 35) {
    return {
      tier: "Advanced",
      color: "green",
      description: "Premium tutoring services",
    };
  } else if (rate >= 30) {
    return {
      tier: "High Regular",
      color: "blue",
      description: "Experienced regular tutor",
    };
  } else if (rate >= 25) {
    return {
      tier: "Regular",
      color: "blue",
      description: "Standard tutoring services",
    };
  } else {
    return {
      tier: "Entry",
      color: "gray",
      description: "New tutor starting rate",
    };
  }
};

/**
 * Calculate multi-hour discount based on hours
 * @param {number} hours - Number of hours
 * @returns {Object} Discount information
 */
export const calculateMultiHourDiscount = (hours) => {
  let discountPercentage = 0;
  let discountTier = "none";

  if (hours >= 11) {
    discountPercentage = 20;
    discountTier = "premium";
  } else if (hours >= 6) {
    discountPercentage = 10;
    discountTier = "high";
  } else if (hours >= 2) {
    discountPercentage = 5;
    discountTier = "standard";
  }

  return {
    discountPercentage,
    discountTier,
    description: getDiscountDescription(discountTier),
  };
};

/**
 * Get discount description based on tier
 * @param {string} tier - Discount tier
 * @returns {string} Description
 */
export const getDiscountDescription = (tier) => {
  const descriptions = {
    none: "No discount",
    standard: "5% off for 2-5 hours",
    high: "10% off for 6-10 hours",
    premium: "20% off for 11+ hours",
  };
  return descriptions[tier] || descriptions.none;
};

/**
 * Calculate session pricing with new structure
 * @param {string} tutorType - 'regular' or 'advanced'
 * @param {number} hours - Number of hours
 * @param {number} baseRate - Base hourly rate (optional)
 * @returns {Object} Pricing breakdown
 */
export const calculateSessionPricing = (
  tutorType,
  hours = 1,
  baseRate = null
) => {
  // Determine base rate based on tutor type
  const hourlyRate = baseRate || (tutorType === "advanced" ? 130.0 : 93.75);

  // Calculate multi-hour discount
  const discountInfo = calculateMultiHourDiscount(hours);

  // Calculate pricing
  const subtotal = hourlyRate * hours;
  const discount = (subtotal * discountInfo.discountPercentage) / 100;
  const total = subtotal - discount;

  return {
    hourlyRate,
    hours,
    subtotal,
    discount,
    discountPercentage: discountInfo.discountPercentage,
    total,
    discountTier: discountInfo.discountTier,
    description: discountInfo.description,
  };
};

/**
 * Get monthly plan pricing
 * @param {string} tutorType - 'regular' or 'advanced'
 * @returns {Object} Monthly plan pricing
 */
export const getMonthlyPlanPricing = (tutorType) => {
  const plans = {
    regular: {
      price: 375,
      sessions: 4,
      hourlyRate: 93.75,
      savings: 0, // Compared to single session rate
      features: [
        "4 one-hour sessions per month",
        "Regular tutor expertise",
        "All subjects covered",
        "Flexible scheduling",
        "Monthly progress reports",
      ],
    },
    advanced: {
      price: 520,
      sessions: 4,
      hourlyRate: 130.0,
      savings: 0, // Compared to single session rate
      features: [
        "4 one-hour sessions per month",
        "Advanced tutor expertise",
        "Premium subject knowledge",
        "Priority scheduling",
        "Enhanced progress tracking",
      ],
    },
  };

  return plans[tutorType] || plans.regular;
};
