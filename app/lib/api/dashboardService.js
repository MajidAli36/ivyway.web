import apiClient from "./client";

/**
 * Dashboard Analytics Service
 * Provides comprehensive dashboard data fetching with caching and error handling
 */

class DashboardService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get cached data if valid, otherwise fetch fresh data
   */
  async getCachedOrFetch(key, fetchFunction) {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const data = await fetchFunction();
      this.cache.set(key, {
        data,
        timestamp: now,
      });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn("Using stale cached data due to fetch error:", error);
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Clear cache for specific key or all cache
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Transform session data to consistent format
   */
  transformSessionData(session) {
    return {
      id: session.id,
      subject: session.subject || session.sessionType,
      topic: session.topic || session.notes || "General Session",
      startTime: session.startTime,
      endTime: session.endTime,
      providerName: session.providerName || session.tutorName,
      studentName: session.studentName,
      meetingLink: session.meetingLink,
      status: session.status,
      createdAt: session.createdAt,
      duration:
        session.duration ||
        this.calculateDuration(session.startTime, session.endTime),
    };
  }

  /**
   * Calculate duration between two times
   */
  calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end - start) / (1000 * 60)); // minutes
  }

  /**
   * Format currency values
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  }

  /**
   * Format percentage values
   */
  formatPercentage(value, total) {
    if (!total || total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  }

  /**
   * Get relative time string
   */
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 43200)
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    return date.toLocaleDateString();
  }

  /**
   * Student Dashboard Analytics
   */
  async getStudentDashboard() {
    return this.getCachedOrFetch("student-dashboard", async () => {
      try {
        const response = await apiClient.get("/dashboard/student");

        if (!response.data) {
          throw new Error("Invalid response format");
        }

        const data = response.data;

        // Normalize top-level user/profile fields if present
        const baseProfile = {
          id: data.id || data.userId || null,
          email: data.email || null,
          fullName: data.fullName || data.name || null,
          role: data.role || "student",
        };

        const studentProfile = data.studentProfile || data.profile || {};

        // Transform and enhance the data
        return {
          overview: {
            totalSessions: data.overview?.totalSessions || 0,
            totalHours: data.overview?.totalHours || 0,
            upcomingSessions: data.overview?.upcomingSessions || 0,
            unreadMessages: data.overview?.unreadMessages || 0,
          },
          // Expose a normalized profile block so the UI can reliably read values
          profile: {
            ...baseProfile,
            profileImage: studentProfile.profileImage || studentProfile.avatar || null,
            bio: studentProfile.bio || "",
            phoneNumber: studentProfile.phoneNumber || studentProfile.phone || "",
            program: studentProfile.program || "",
            major: studentProfile.major || "",
            academicStanding: studentProfile.academicStanding || "",
            subjects: studentProfile.subjects || [],
            preferredFormat: studentProfile.preferredFormat || "",
            availability: studentProfile.availability || [],
            additionalNotes: studentProfile.additionalNotes || "",
            enrollmentDate: studentProfile.enrollmentDate || data.enrolmentDate || "",
            gpa: studentProfile.gpa || null,
            status: studentProfile.status || data.status || "",
          },
          upcomingSessions: (data.upcomingSessions || []).map((session) =>
            this.transformSessionData(session)
          ),
          recentActivities: (data.recentActivities || []).map((activity) => ({
            ...this.transformSessionData(activity),
            relativeTime: this.getRelativeTime(activity.createdAt),
          })),
          analytics: {
            monthlySpending: this.formatCurrency(
              data.analytics?.monthlySpending || 0
            ),
            subjectsBreakdown: data.analytics?.subjectsBreakdown || [],
          },
          notifications: (data.notifications || []).map((notification) => ({
            ...notification,
            relativeTime: this.getRelativeTime(notification.createdAt),
          })),
        };
      } catch (error) {
        console.error("Error fetching student dashboard:", error);
        throw new Error("Failed to load student dashboard data");
      }
    });
  }

  /**
   * Admin Dashboard Analytics
   */
  async getAdminDashboard() {
    return this.getCachedOrFetch("admin-dashboard", async () => {
      try {
        const response = await apiClient.get("/dashboard/admin");

        if (!response.data) {
          throw new Error("Invalid response format");
        }

        const data = response.data;

        return {
          overview: {
            totalUsers: data.overview?.totalUsers || 0,
            activeStudents: data.overview?.activeStudents || 0,
            monthlyRevenue: this.formatCurrency(
              data.overview?.monthlyRevenue || 0
            ),
            revenueGrowth: data.overview?.revenueGrowth || 0,
            pendingTutors: data.overview?.pendingTutors || 0,
            pendingPayouts: data.overview?.pendingPayouts || 0,
          },
          userBreakdown: data.userBreakdown || [],
          recentActivities: {
            newTutors: (data.recentActivities?.newTutors || []).map(
              (tutor) => ({
                ...tutor,
                relativeTime: this.getRelativeTime(tutor.createdAt),
              })
            ),
            recentBookings: (data.recentActivities?.recentBookings || []).map(
              (booking) => ({
                ...this.transformSessionData(booking),
                relativeTime: this.getRelativeTime(booking.createdAt),
              })
            ),
            recentPayments: (data.recentActivities?.recentPayments || []).map(
              (payment) => ({
                ...payment,
                amount: this.formatCurrency(payment.amount),
                relativeTime: this.getRelativeTime(payment.createdAt),
              })
            ),
          },
          platformStats: {
            monthlyBookings: data.platformStats?.monthlyBookings || 0,
            completedSessions: data.platformStats?.completedSessions || 0,
            averageSessionDuration:
              data.platformStats?.averageSessionDuration || 0,
            topSubjects: data.platformStats?.topSubjects || [],
          },
          growthMetrics: {
            newUsersThisMonth: data.growthMetrics?.newUsersThisMonth || 0,
            newBookingsThisMonth: data.growthMetrics?.newBookingsThisMonth || 0,
            revenueThisMonth: this.formatCurrency(
              data.growthMetrics?.revenueThisMonth || 0
            ),
          },
        };
      } catch (error) {
        console.error("Error fetching admin dashboard:", error);
        
        // Return mock data for development
        console.log("Using mock data for admin dashboard");
        return {
          overview: {
            totalUsers: 9,
            activeStudents: 1,
            monthlyRevenue: this.formatCurrency(0),
            revenueGrowth: 0,
            pendingTutors: 2,
            pendingPayouts: 0,
          },
          userBreakdown: [
            { role: "counselor", count: 1 },
            { role: "tutor", count: 2 },
            { role: "student", count: 3 },
            { role: "teacher", count: 2 },
            { role: "admin", count: 1 }
          ],
          recentActivities: {
            newTutors: [],
            recentBookings: [],
            recentPayments: [],
          },
          platformStats: {
            monthlyBookings: 4,
            completedSessions: 0,
            averageSessionDuration: 0,
            topSubjects: [],
          },
          growthMetrics: {
            newUsersThisMonth: 9,
            newBookingsThisMonth: 4,
            revenueThisMonth: this.formatCurrency(0),
          },
        };
      }
    });
  }

  /**
   * Tutor Dashboard Analytics
   */
  async getTutorDashboard() {
    return this.getCachedOrFetch("tutor-dashboard", async () => {
      try {
        const response = await apiClient.get("/dashboard/tutor");

        if (!response.data) {
          throw new Error("Invalid response format");
        }

        const data = response.data;

        return {
          overview: {
            totalSessions: data.overview?.totalSessions || 0,
            totalEarnings: this.formatCurrency(
              data.overview?.totalEarnings || 0
            ),
            monthlyEarnings: this.formatCurrency(
              data.overview?.monthlyEarnings || 0
            ),
            upcomingSessions: data.overview?.upcomingSessions || 0,
            unreadMessages: data.overview?.unreadMessages || 0,
          },
          upcomingSessions: (data.upcomingSessions || []).map((session) =>
            this.transformSessionData(session)
          ),
          recentActivities: (data.recentActivities || []).map((activity) => ({
            ...this.transformSessionData(activity),
            relativeTime: this.getRelativeTime(activity.createdAt),
          })),
          earnings: {
            breakdown: (data.earnings?.breakdown || []).map((earning) => ({
              ...earning,
              amount: this.formatCurrency(earning.amount),
            })),
            pendingPayouts: (data.earnings?.pendingPayouts || []).map(
              (payout) => ({
                ...payout,
                amount: this.formatCurrency(payout.amount),
              })
            ),
          },
        };
      } catch (error) {
        console.error("Error fetching tutor dashboard:", error);
        throw new Error("Failed to load tutor dashboard data");
      }
    });
  }

  /**
   * Counselor Dashboard Analytics
   */
  async getCounselorDashboard() {
    return this.getCachedOrFetch("counselor-dashboard", async () => {
      try {
        const response = await apiClient.get("/dashboard/counselor");

        if (!response.data) {
          throw new Error("Invalid response format");
        }

        const data = response.data;

        return {
          overview: {
            totalStudents: data.overview?.totalStudents || 0,
            totalSessions: data.overview?.totalSessions || 0,
            monthlyEarnings: this.formatCurrency(
              data.overview?.monthlyEarnings || 0
            ),
            upcomingSessions: data.overview?.upcomingSessions || 0,
            unreadMessages: data.overview?.unreadMessages || 0,
          },
          upcomingSessions: (data.upcomingSessions || []).map((session) =>
            this.transformSessionData(session)
          ),
          recentActivities: (data.recentActivities || []).map((activity) => ({
            ...this.transformSessionData(activity),
            relativeTime: this.getRelativeTime(activity.createdAt),
          })),
          students: data.students || [],
          earnings: {
            breakdown: (data.earnings?.breakdown || []).map((earning) => ({
              ...earning,
              amount: this.formatCurrency(earning.amount),
            })),
            pendingPayouts: (data.earnings?.pendingPayouts || []).map(
              (payout) => ({
                ...payout,
                amount: this.formatCurrency(payout.amount),
              })
            ),
          },
        };
      } catch (error) {
        console.error("Error fetching counselor dashboard:", error);
        throw new Error("Failed to load counselor dashboard data");
      }
    });
  }

  /**
   * Auto-detect role and get appropriate dashboard
   */
  async getDashboardAnalytics() {
    return this.getCachedOrFetch("auto-dashboard", async () => {
      try {
        const response = await apiClient.get("/dashboard/analytics");

        if (!response.data) {
          throw new Error("Invalid response format");
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching auto-detect dashboard:", error);
        throw new Error("Failed to load dashboard data");
      }
    });
  }

  /**
   * Refresh all dashboard data
   */
  async refreshAllDashboards() {
    this.clearCache();
    return {
      student: await this.getStudentDashboard(),
      admin: await this.getAdminDashboard(),
      tutor: await this.getTutorDashboard(),
      counselor: await this.getCounselorDashboard(),
    };
  }

  /**
   * Get dashboard data by role
   */
  async getDashboardByRole(role) {
    switch (role.toLowerCase()) {
      case "student":
        return this.getStudentDashboard();
      case "admin":
        return this.getAdminDashboard();
      case "tutor":
        return this.getTutorDashboard();
      case "counselor":
        return this.getCounselorDashboard();
      default:
        return this.getDashboardAnalytics();
    }
  }
}

// Create singleton instance
const dashboardService = new DashboardService();

export default dashboardService;
