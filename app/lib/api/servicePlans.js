import { ServiceTypes, getServicePlans } from "../../constants/serviceTypes";

/**
 * Service-aware plan management
 * This extends the existing PlansAPI to handle service-specific plans
 */
class ServicePlansAPI {
  /**
   * Get plans for a specific service type
   * @param {string} serviceType - The service type (tutoring, counseling, etc.)
   * @returns {Promise<Array>} Array of plans for the service
   */
  async getPlansForService(serviceType) {
    try {
      // Get service-specific plans from our constants
      const servicePlans = getServicePlans(serviceType);

      // If you have a backend API for service-specific plans, use it here:
      // const response = await apiClient.get(`/plans?service=${serviceType}`);
      // return response.data;

      return servicePlans;
    } catch (error) {
      console.error(`Error fetching plans for ${serviceType}:`, error);
      // Fallback to default tutoring plans
      return getServicePlans(ServiceTypes.TUTORING);
    }
  }

  /**
   * Get all available service types with their plans
   * @returns {Promise<Object>} Object with service types as keys and plans as values
   */
  async getAllServicePlans() {
    const allPlans = {};

    for (const serviceType of Object.values(ServiceTypes)) {
      allPlans[serviceType] = await this.getPlansForService(serviceType);
    }

    return allPlans;
  }

  /**
   * Get plan by ID and service type
   * @param {string} planId - Plan ID
   * @param {string} serviceType - Service type
   * @returns {Promise<Object>} Plan details
   */
  async getPlanById(planId, serviceType) {
    const servicePlans = await this.getPlansForService(serviceType);
    return servicePlans.find((plan) => plan.id === planId);
  }

  /**
   * Calculate pricing for a service plan
   * @param {string} planId - Plan ID
   * @param {string} serviceType - Service type
   * @param {Object} options - Additional options (hours, duration, etc.)
   * @returns {Promise<Object>} Calculated pricing
   */
  async calculateServicePlanPrice(planId, serviceType, options = {}) {
    const plan = await this.getPlanById(planId, serviceType);

    if (!plan) {
      throw new Error(`Plan ${planId} not found for service ${serviceType}`);
    }

    let calculatedPrice = plan.price;
    let discount = 0;
    let discountPercentage = 0;

    // Apply service-specific pricing logic
    if (serviceType === ServiceTypes.COUNSELING) {
      // Counseling might have different pricing structure
      if (plan.type === "multi_hour" && options.hours) {
        if (options.hours >= 10) {
          discountPercentage = 10;
        } else if (options.hours >= 5) {
          discountPercentage = 5;
        }
        discount = (plan.price * options.hours * discountPercentage) / 100;
        calculatedPrice = plan.price * options.hours - discount;
      }
    } else if (serviceType === ServiceTypes.TUTORING) {
      // Updated tutoring pricing logic with new discount structure
      if (plan.type === "multi_hour" && options.hours) {
        if (options.hours >= 11) {
          discountPercentage = 20; // 20% off for 11+ hours
        } else if (options.hours >= 6) {
          discountPercentage = 10; // 10% off for 6-10 hours
        } else if (options.hours >= 2) {
          discountPercentage = 5; // 5% off for 2-5 hours
        } else {
          discountPercentage = 0; // No discount for single hour
        }
        discount = (plan.price * options.hours * discountPercentage) / 100;
        calculatedPrice = plan.price * options.hours - discount;
      }
    }

    return {
      calculatedPrice,
      discount,
      discountPercentage,
      originalPrice: plan.price,
      plan,
    };
  }

  /**
   * Get recommended plans for a service type based on user preferences
   * @param {string} serviceType - Service type
   * @param {Object} preferences - User preferences
   * @returns {Promise<Array>} Recommended plans
   */
  async getRecommendedPlans(serviceType, preferences = {}) {
    const servicePlans = await this.getPlansForService(serviceType);
    const { frequency, budget, commitment } = preferences;

    let recommendations = [...servicePlans];

    // Filter by budget if specified
    if (budget) {
      recommendations = recommendations.filter(
        (plan) => plan.calculatedPrice <= budget
      );
    }

    // Filter by frequency preference
    if (frequency === "monthly") {
      recommendations = recommendations.filter(
        (plan) => plan.type === "monthly"
      );
    } else if (frequency === "flexible") {
      recommendations = recommendations.filter(
        (plan) => plan.type !== "monthly"
      );
    }

    // Filter by commitment preference
    if (commitment === "low") {
      recommendations = recommendations.filter(
        (plan) => plan.type === "single"
      );
    }

    // Sort by popularity and price
    return recommendations
      .sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return a.calculatedPrice - b.calculatedPrice;
      })
      .slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Compare plans across different service types
   * @param {Array} planIds - Array of plan IDs with service types
   * @returns {Promise<Object>} Comparison data
   */
  async compareServicePlans(planIds) {
    const comparison = {};

    for (const { planId, serviceType } of planIds) {
      const plan = await this.getPlanById(planId, serviceType);
      if (plan) {
        comparison[`${serviceType}_${planId}`] = {
          ...plan,
          serviceType,
        };
      }
    }

    return comparison;
  }
}

export default new ServicePlansAPI();
