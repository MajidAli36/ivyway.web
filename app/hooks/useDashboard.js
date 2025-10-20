import { useState, useEffect, useCallback, useRef } from "react";
import dashboardService from "../lib/api/dashboardService";

/**
 * Custom hook for dashboard state management
 * Provides loading states, error handling, and data fetching logic
 */
export const useDashboard = (role = null) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sectionLoading, setSectionLoading] = useState({});
  const abortControllerRef = useRef(null);

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(
    async (userRole = role) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setError(null);
        let data;

        if (userRole) {
          data = await dashboardService.getDashboardByRole(userRole);
        } else {
          data = await dashboardService.getDashboardAnalytics();
        }

        setDashboardData(data);
        setLastUpdated(new Date());
        return data;
      } catch (err) {
        if (err.name === "AbortError") {
          return; // Request was cancelled
        }

        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
        throw err;
      }
    },
    [role]
  );

  // Function to refresh dashboard data
  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      // Clear cache before refreshing
      dashboardService.clearCache();
      await fetchDashboardData();
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [fetchDashboardData]);

  // Function to refresh specific section
  const refreshSection = useCallback(
    async (sectionName) => {
      setSectionLoading((prev) => ({ ...prev, [sectionName]: true }));
      try {
        // Clear cache for specific section
        dashboardService.clearCache(`${role}-dashboard`);
        await fetchDashboardData();
      } catch (err) {
        console.error(`Section refresh error (${sectionName}):`, err);
      } finally {
        setSectionLoading((prev) => ({ ...prev, [sectionName]: false }));
      }
    },
    [fetchDashboardData, role]
  );

  // Function to clear cache
  const clearCache = useCallback(() => {
    dashboardService.clearCache();
  }, []);

  // Function to get current dashboard data
  const getDashboardData = useCallback(() => {
    return dashboardData;
  }, [dashboardData]);

  // Function to get specific section data
  const getSectionData = useCallback(
    (sectionName) => {
      return dashboardData?.[sectionName] || null;
    },
    [dashboardData]
  );

  // Function to check if section is loading
  const isSectionLoading = useCallback(
    (sectionName) => {
      return sectionLoading[sectionName] || false;
    },
    [sectionLoading]
  );

  // Function to handle errors
  const handleError = useCallback((error) => {
    setError(error.message || "An error occurred");
  }, []);

  // Function to retry failed requests
  const retry = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fetchDashboardData();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardData]);

  // Initial data loading
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        await fetchDashboardData();
      } catch (err) {
        console.error("Initial dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Empty dependency array to prevent re-fetching

  // Auto-refresh functionality (disabled to prevent redundant calls)
  useEffect(() => {
    // Disabled auto-refresh to prevent redundant API calls
    // Users can manually refresh using the refresh button
    return;
  }, [dashboardData]);

  return {
    // Data
    dashboardData,
    getDashboardData,
    getSectionData,

    // Loading states
    loading,
    refreshing,
    isSectionLoading,

    // Error handling
    error,
    handleError,
    retry,

    // Actions
    refreshDashboard,
    refreshSection,
    clearCache,
    fetchDashboardData,

    // Metadata
    lastUpdated,

    // Utility functions
    hasData: !!dashboardData,
    isEmpty: !dashboardData || Object.keys(dashboardData).length === 0,
  };
};

/**
 * Hook for specific role dashboards
 */
export const useStudentDashboard = () => useDashboard("student");
export const useAdminDashboard = () => useDashboard("admin");
export const useTutorDashboard = () => useDashboard("tutor");
export const useCounselorDashboard = () => useDashboard("counselor");

/**
 * Hook for real-time dashboard updates
 */
export const useDashboardRealtime = (role = null) => {
  const dashboard = useDashboard(role);
  const [realTimeData, setRealTimeData] = useState(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // This would connect to your WebSocket service
    // For now, we'll simulate real-time updates with polling
    const realTimeInterval = setInterval(() => {
      // Update specific sections that need real-time data
      if (dashboard.dashboardData) {
        // Example: Update notifications, upcoming sessions, etc.
        setRealTimeData({
          timestamp: new Date(),
          notifications: dashboard.dashboardData.notifications || [],
          upcomingSessions: dashboard.dashboardData.upcomingSessions || [],
        });
      }
    }, 30 * 1000); // 30 seconds

    return () => clearInterval(realTimeInterval);
  }, [dashboard.dashboardData]);

  return {
    ...dashboard,
    realTimeData,
  };
};

/**
 * Hook for dashboard analytics and metrics
 */
export const useDashboardAnalytics = (role = null) => {
  const dashboard = useDashboard(role);
  const [analytics, setAnalytics] = useState(null);

  // Calculate additional analytics from dashboard data
  useEffect(() => {
    if (!dashboard.dashboardData) return;

    const data = dashboard.dashboardData;
    let calculatedAnalytics = {};

    switch (role) {
      case "student":
        calculatedAnalytics = {
          sessionCompletionRate:
            data.overview?.totalSessions > 0
              ? ((data.overview.totalSessions -
                  data.overview.upcomingSessions) /
                  data.overview.totalSessions) *
                100
              : 0,
          averageSessionDuration:
            data.analytics?.subjectsBreakdown?.reduce(
              (acc, subject) => acc + subject.totalHours,
              0
            ) / (data.analytics?.subjectsBreakdown?.length || 1),
          monthlySpendingTrend: data.analytics?.monthlySpending || 0,
        };
        break;

      case "admin":
        calculatedAnalytics = {
          userGrowthRate: data.growthMetrics?.newUsersThisMonth || 0,
          revenueGrowthRate: data.overview?.revenueGrowth || 0,
          sessionCompletionRate:
            data.platformStats?.completedSessions > 0
              ? (data.platformStats.completedSessions /
                  data.platformStats.monthlyBookings) *
                100
              : 0,
          averageSessionDuration:
            data.platformStats?.averageSessionDuration || 0,
        };
        break;

      case "tutor":
        calculatedAnalytics = {
          sessionCompletionRate:
            data.overview?.totalSessions > 0
              ? ((data.overview.totalSessions -
                  data.overview.upcomingSessions) /
                  data.overview.totalSessions) *
                100
              : 0,
          earningsPerSession:
            data.overview?.totalSessions > 0
              ? parseFloat(
                  data.overview.totalEarnings.replace(/[^0-9.-]+/g, "")
                ) / data.overview.totalSessions
              : 0,
          monthlyEarningsTrend: data.overview?.monthlyEarnings || 0,
        };
        break;

      case "counselor":
        calculatedAnalytics = {
          studentEngagementRate:
            data.overview?.totalStudents > 0
              ? data.overview.totalSessions / data.overview.totalStudents
              : 0,
          sessionCompletionRate:
            data.overview?.totalSessions > 0
              ? ((data.overview.totalSessions -
                  data.overview.upcomingSessions) /
                  data.overview.totalSessions) *
                100
              : 0,
          monthlyEarningsTrend: data.overview?.monthlyEarnings || 0,
        };
        break;

      default:
        calculatedAnalytics = {};
    }

    setAnalytics(calculatedAnalytics);
  }, [dashboard.dashboardData, role]);

  return {
    ...dashboard,
    analytics,
  };
};
