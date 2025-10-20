import { useState, useEffect, useCallback } from "react";
import API from "../lib/api/apiService";

export const useAdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch all plans with admin details
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await API.getAdminPlans();
      const plansData = response.data?.plans || response.plans || [];
      
      // Transform plans to include calculated fields
      const transformedPlans = plansData.map(plan => ({
        ...plan,
        calculatedPrice: plan.discount 
          ? plan.price * (1 - plan.discount / 100)
          : plan.price,
        discountPercentage: plan.discount || 0,
        totalSubscriptions: plan.totalSubscriptions || plan.userPlans?.length || 0,
        activeSubscriptions: plan.activeSubscriptions || plan.userPlans?.filter(up => up.status === 'active').length || 0,
      }));
      
      setPlans(transformedPlans);
      
      // Calculate stats from plans data as fallback
      calculateStats(transformedPlans);
      
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate plan statistics from plans data
  const calculateStats = useCallback((plansData) => {
    if (!plansData || plansData.length === 0) {
      setStats({
        totalPlans: 0,
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        planTypeBreakdown: { monthlyPlans: 0, multiHourPlans: 0, singlePlans: 0 },
        averagePlanPrice: 0,
        mostPopularPlan: null,
      });
      return;
    }

    const totalPlans = plansData.length;
    const totalSubscriptions = plansData.reduce((sum, plan) => sum + (plan.totalSubscriptions || 0), 0);
    const activeSubscriptions = plansData.reduce((sum, plan) => sum + (plan.activeSubscriptions || 0), 0);
    
    const totalRevenue = plansData.reduce((sum, plan) => {
      return sum + ((plan.price || 0) * (plan.activeSubscriptions || 0));
    }, 0);
    
    const averagePlanPrice = plansData.reduce((sum, plan) => sum + (plan.price || 0), 0) / totalPlans;
    
    const planTypeBreakdown = {
      monthlyPlans: plansData.filter(p => p.type === 'monthly').length,
      multiHourPlans: plansData.filter(p => p.type === 'multi_hour').length,
      singlePlans: plansData.filter(p => p.type === 'single').length,
    };
    
    // Find most popular plan
    const mostPopularPlan = plansData.reduce((mostPopular, plan) => {
      if (!mostPopular || (plan.totalSubscriptions || 0) > (mostPopular.totalSubscriptions || 0)) {
        return plan;
      }
      return mostPopular;
    }, null);

    setStats({
      totalPlans,
      totalSubscriptions,
      activeSubscriptions,
      totalRevenue,
      planTypeBreakdown,
      averagePlanPrice,
      mostPopularPlan: mostPopularPlan ? {
        name: mostPopularPlan.name,
        type: mostPopularPlan.type,
        price: mostPopularPlan.price,
        subscriptionCount: mostPopularPlan.totalSubscriptions || 0,
      } : null,
    });
  }, []);

  // Create new plan
  const createPlan = useCallback(async (planData) => {
    try {
      const response = await API.createAdminPlan(planData);
      return response.data;
    } catch (err) {
      console.error("Error creating plan:", err);
      throw new Error(err.response?.data?.message || err.message || "Failed to create plan");
    }
  }, []);

  // Update existing plan
  const updatePlan = useCallback(async (planId, planData) => {
    try {
      const response = await API.updateAdminPlan(planId, planData);
      return response.data;
    } catch (err) {
      console.error("Error updating plan:", err);
      throw new Error(err.response?.data?.message || err.message || "Failed to update plan");
    }
  }, []);

  // Delete plan
  const deletePlan = useCallback(async (planId) => {
    try {
      const response = await API.deleteAdminPlan(planId);
      return response.data;
    } catch (err) {
      console.error("Error deleting plan:", err);
      throw new Error(err.response?.data?.message || err.message || "Failed to delete plan");
    }
  }, []);

  // Refresh plans data
  const refreshPlans = useCallback(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Try to fetch plan statistics from backend, fallback to calculated stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await API.getAdminPlanStats();
      if (response.data || response) {
        setStats(response.data || response);
      }
    } catch (err) {
      // Silently ignore plan statistics errors - stats will be calculated from plans data
      // This prevents the plans page from breaking if the stats endpoint has issues
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Try to fetch stats separately (optional)
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    plans,
    loading,
    error,
    stats,
    refreshPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

export default useAdminPlans;
