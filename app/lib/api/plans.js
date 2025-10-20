import apiClient from "./client";

// Plan data structure interface
export const PlanTypes = {
  MONTHLY: "monthly",
  MULTI_HOUR: "multi_hour",
  SINGLE: "single",
};

export const PlanStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  PENDING: "pending",
};

/**
 * Plan object structure
 * @typedef {Object} Plan
 * @property {string} id - Unique plan identifier
 * @property {string} name - Plan display name
 * @property {string} type - Plan type (monthly/multi_hour/single)
 * @property {number} price - Original price in USD
 * @property {number} calculatedPrice - Final price after discounts
 * @property {number|null} sessionCount - Number of sessions (null for single/multi-hour)
 * @property {number} duration - Session duration in minutes
 * @property {number} discount - Discount amount in USD
 * @property {number} discountPercentage - Discount percentage
 * @property {string} stripeProductId - Stripe product ID
 * @property {string} stripePriceId - Stripe price ID
 */

/**
 * User plan status structure
 * @typedef {Object} UserPlan
 * @property {string} id - Plan ID
 * @property {string} status - Plan status
 * @property {string} startDate - Plan start date
 * @property {string} endDate - Plan end date
 * @property {number} sessionsUsed - Number of sessions used
 * @property {number} totalSessions - Total sessions in plan
 * @property {Plan} plan - Plan details
 */

/**
 * Price calculation request structure
 * @typedef {Object} PriceCalculationRequest
 * @property {string} planId - Plan ID
 * @property {number} [hours] - Number of hours (for multi-hour plans)
 * @property {number} [duration] - Custom duration in minutes (for single sessions)
 */

// Mock plan data as fallback if backend is not available
const MOCK_PLANS = [
  {
    id: "monthly_regular",
    name: "Regular Tutoring Monthly",
    type: PlanTypes.MONTHLY,
    price: 375.0,
    calculatedPrice: 375.0,
    sessionCount: 4,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_monthly_regular",
    stripePriceId: "price_monthly_regular",
    isPopular: false,
    tutorType: "regular",
    hourlyRate: 93.75, // $375 / 4 sessions = $93.75 per hour
    features: [
      "4 one-hour sessions per month",
      "Regular tutor expertise",
      "All subjects covered",
      "Flexible scheduling",
      "Monthly progress reports",
    ],
  },
  {
    id: "monthly_advanced",
    name: "Advanced Tutoring Monthly",
    type: PlanTypes.MONTHLY,
    price: 520.0,
    calculatedPrice: 520.0,
    sessionCount: 4,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_monthly_advanced",
    stripePriceId: "price_monthly_advanced",
    isPopular: true,
    tutorType: "advanced",
    hourlyRate: 130.0, // $520 / 4 sessions = $130 per hour
    features: [
      "4 one-hour sessions per month",
      "Advanced tutor expertise",
      "Premium subject knowledge",
      "Priority scheduling",
      "Enhanced progress tracking",
    ],
  },
  {
    id: "multi_hour_2_5",
    name: "2-5 Hour Package",
    type: PlanTypes.MULTI_HOUR,
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 142.48, // 2 hours * $74.99 - 5% discount = $142.48
    sessionCount: null,
    duration: 120, // 2 hours default
    discount: 7.50, // 5% of $149.98 = $7.50
    discountPercentage: 5, // 5% off for 2-5 hours
    stripeProductId: "prod_multi_hour_2_5",
    stripePriceId: "price_multi_hour_2_5",
    isPopular: false,
    minHours: 2,
    maxHours: 5,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "2-5 hours of tutoring",
      "5% discount applied",
      "Flexible scheduling",
      "6-month validity",
      "All subjects included",
    ],
  },
  {
    id: "multi_hour_6_10",
    name: "6-10 Hour Package",
    type: PlanTypes.MULTI_HOUR,
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 404.95, // 6 hours * $74.99 - 10% discount = $404.95
    sessionCount: null,
    duration: 360, // 6 hours default
    discount: 44.99, // 10% of $449.94 = $44.99
    discountPercentage: 10, // 10% off for 6-10 hours
    stripeProductId: "prod_multi_hour_6_10",
    stripePriceId: "price_multi_hour_6_10",
    isPopular: true,
    minHours: 6,
    maxHours: 10,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "6-10 hours of tutoring",
      "10% discount applied",
      "Priority scheduling",
      "9-month validity",
      "All subjects included",
    ],
  },
  {
    id: "multi_hour_11_plus",
    name: "11+ Hour Package",
    type: PlanTypes.MULTI_HOUR,
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 659.91, // 11 hours * $74.99 - 20% discount = $659.91
    sessionCount: null,
    duration: 660, // 11 hours default
    discount: 164.98, // 20% of $824.89 = $164.98
    discountPercentage: 20, // 20% off for 11+ hours
    stripeProductId: "prod_multi_hour_11_plus",
    stripePriceId: "price_multi_hour_11_plus",
    isPopular: false,
    minHours: 11,
    maxHours: null, // No upper limit
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "11+ hours of tutoring",
      "20% discount applied",
      "Maximum flexibility",
      "12-month validity",
      "Best value option",
    ],
  },
  {
    id: "single_session",
    name: "Single Tutoring Session",
    type: PlanTypes.SINGLE,
    price: 74.99, // Correct base hourly rate
    calculatedPrice: 74.99,
    sessionCount: null,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_single_session",
    stripePriceId: "price_single_session",
    isPopular: false,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "One-hour tutoring session",
      "Regular tutor expertise",
      "All subjects covered",
      "Flexible scheduling",
      "Immediate booking",
    ],
  },
  {
    id: "single_advanced_session",
    name: "Single Advanced Tutoring Session",
    type: PlanTypes.SINGLE,
    price: 99.99, // Advanced hourly rate
    calculatedPrice: 99.99,
    sessionCount: null,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_single_advanced_session",
    stripePriceId: "price_single_advanced_session",
    isPopular: true,
    tutorType: "advanced",
    hourlyRate: 99.99,
    features: [
      "One-hour advanced tutoring session",
      "Advanced tutor expertise",
      "Premium subject knowledge",
      "Priority scheduling",
      "Enhanced learning experience",
    ],
  },
];

const PlansAPI = {
  /**
   * Fetch all available plans
   * @returns {Promise<Plan[]>} Array of available plans
   */
  async getAllPlans() {
    try {
      const response = await apiClient.get("/plans");
      // Support all valid backend response shapes
      if (Array.isArray(response.data?.plans)) {
        return response.data.plans;
      }
      if (Array.isArray(response.plans)) {
        return response.plans;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch plans");
    }
  },

  /**
   * Get current user's active plan
   * @returns {Promise<UserPlan|null>} User's active plan or null
   */
  async getUserPlan() {
    try {
      const response = await apiClient.get("/plans/user");
      return response.data || response;
    } catch (error) {
      if (error.status === 404) {
        return null; // No active plan
      }
      console.error("Error fetching user plan:", error);
      throw new Error(error.message || "Failed to fetch user plan");
    }
  },

  /**
   * Calculate custom pricing for plans
   * @param {PriceCalculationRequest} request - Price calculation parameters
   * @returns {Promise<{calculatedPrice: number, discount: number, discountPercentage: number}>} Calculated pricing
   */
  async calculatePrice(request) {
    try {
      const response = await apiClient.post("/plans/calculate-price", request);
      return response.data || response;
    } catch (error) {
      console.warn(
        "Backend price calculation not available, using mock calculation:",
        error.message
      );
      // Mock price calculation
      const plan = MOCK_PLANS.find((p) => p.id === request.planId);
      if (!plan) throw new Error("Plan not found");

      let calculatedPrice = plan.price;
      let discount = 0;
      let discountPercentage = 0;

      if (plan.type === PlanTypes.MULTI_HOUR && request.hours) {
        // Apply new multi-hour discount structure
        if (request.hours >= 11) {
          discountPercentage = 20; // 20% off for 11+ hours
        } else if (request.hours >= 6) {
          discountPercentage = 10; // 10% off for 6-10 hours
        } else if (request.hours >= 2) {
          discountPercentage = 5; // 5% off for 2-5 hours
        } else {
          discountPercentage = 0; // No discount for single hour
        }
        discount = (plan.price * request.hours * discountPercentage) / 100;
        calculatedPrice = plan.price * request.hours - discount;
      }

      return { calculatedPrice, discount, discountPercentage };
    }
  },

  /**
   * Get plan by ID
   * @param {string} planId - Plan ID
   * @returns {Promise<Plan>} Plan details
   */
  async getPlanById(planId) {
    try {
      const response = await apiClient.get(`/plans/${planId}`);
      return response.data || response;
    } catch (error) {
      console.warn(
        "Backend plan API not available, using mock data:",
        error.message
      );
      // Return mock plan as fallback
      const plan = MOCK_PLANS.find((p) => p.id === planId);
      if (!plan) throw new Error("Plan not found");
      return plan;
    }
  },

  /**
   * Compare multiple plans
   * @param {string[]} planIds - Array of plan IDs to compare
   * @returns {Promise<Plan[]>} Array of plans for comparison
   */
  async comparePlans(planIds) {
    try {
      const response = await apiClient.post("/plans/compare", { planIds });
      return response.data || response;
    } catch (error) {
      console.warn(
        "Backend plan comparison not available, using mock data:",
        error.message
      );
      // Return mock plans as fallback
      return MOCK_PLANS.filter((p) => planIds.includes(p.id));
    }
  },
};

export default PlansAPI;
