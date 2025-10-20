/**
 * Fetch performance data for the admin dashboard
 */
export const fetchPerformanceData = async (timeRange, dateRange) => {
  // In a real app, this would be an API call with the timeRange and dateRange parameters
  // For demo purposes, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockPerformanceData(timeRange, dateRange));
    }, 800);
  });
};

/**
 * Generate mock data for demonstration purposes
 */
const generateMockPerformanceData = (timeRange, dateRange) => {
  // Overview stats
  const overview = {
    totalUsers: {
      value: 3750,
      change: 12.5,
    },
    activeSessions: {
      value: 368,
      change: 7.2,
    },
    completionRate: {
      value: 92.8,
      change: 3.5,
    },
    averageRating: {
      value: 4.7,
      change: 0.2,
    },
  };

  // Generate user activity data based on time range
  const userActivity = generateActivityData(timeRange);

  // Role-specific metrics
  const roleMetrics = {
    students: {
      totalCount: 2800,
      activeCount: 1850,
      completedSessions: 12500,
      averageSessionsPerUser: 4.5,
      averageRating: 4.6,
      sessionCompletionRate: 89,
      avgTimePerSession: 45,
      returningStudents: 78,
      topSubjects: [
        { name: "Mathematics", count: 523 },
        { name: "Computer Science", count: 412 },
        { name: "Physics", count: 287 },
        { name: "English Literature", count: 254 },
        { name: "Chemistry", count: 198 },
      ],
    },
    tutors: {
      totalCount: 920,
      activeCount: 845,
      sessionsCount: 12500,
      averageSessionsPerTutor: 14.8,
      averageRating: 4.8,
      responseTime: 2.5,
      successRate: 97,
      availableTutors: 82,
      topPerformers: [
        { name: "Sarah Johnson", rating: 4.98 },
        { name: "Michael Chen", rating: 4.97 },
        { name: "Aisha Patel", rating: 4.95 },
        { name: "David Rodriguez", rating: 4.93 },
        { name: "Emma Williams", rating: 4.92 },
      ],
    },
    admins: {
      totalCount: 30,
      activeCount: 28,
      actionsTaken: 1240,
      usersManaged: 3750,
      averageResponseTime: 1.2,
      actionsBreakdown: [
        { type: "User Management", count: 450 },
        { type: "Content Moderation", count: 320 },
        { type: "Payment Processing", count: 280 },
        { type: "Support Tickets", count: 190 },
      ],
    },
  };

  // Platform usage statistics
  const platformUsage = {
    deviceStats: {
      Desktop: 42,
      Mobile: 38,
      Tablet: 15,
      Other: 5,
    },
    pageViews: [
      { path: "/dashboard", views: 15240 },
      { path: "/sessions/schedule", views: 12850 },
      { path: "/profile", views: 9320 },
      { path: "/tutors", views: 7650 },
      { path: "/courses", views: 5430 },
    ],
    featureUsage: {
      "Session Booking": 35,
      Chat: 25,
      "Resource Library": 18,
      "Progress Tracking": 12,
      Reviews: 7,
      Payments: 3,
    },
    sessionStats: {
      avgDuration: 52,
      today: 187,
      upcoming: 254,
      completionRate: 94,
    },
    systemPerformance: {
      apiResponseTime: 128,
      errorRate: 0.4,
      serverLoad: 62,
    },
  };

  return {
    overview,
    userActivity,
    roleMetrics,
    platformUsage,
  };
};

/**
 * Generate activity data based on time range
 */
const generateActivityData = (timeRange) => {
  const hourly = Array(24)
    .fill()
    .map((_, i) => {
      return {
        hour: `${i}:00`,
        students: Math.floor(Math.random() * 100) + 50,
        tutors: Math.floor(Math.random() * 50) + 20,
        admins: Math.floor(Math.random() * 5) + 1,
      };
    });

  const daily = Array(30)
    .fill()
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        day: `${date.getMonth() + 1}/${date.getDate()}`,
        students: Math.floor(Math.random() * 500) + 200,
        tutors: Math.floor(Math.random() * 200) + 50,
        admins: Math.floor(Math.random() * 15) + 5,
      };
    });

  const weekly = Array(12)
    .fill()
    .map((_, i) => {
      return {
        week: `Week ${i + 1}`,
        students: Math.floor(Math.random() * 2000) + 1000,
        tutors: Math.floor(Math.random() * 800) + 300,
        admins: Math.floor(Math.random() * 50) + 20,
      };
    });

  const monthly = Array(12)
    .fill()
    .map((_, i) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return {
        month: months[i],
        students: Math.floor(Math.random() * 5000) + 2000,
        tutors: Math.floor(Math.random() * 2000) + 800,
        admins: Math.floor(Math.random() * 100) + 50,
      };
    });

  return {
    hourly,
    daily,
    weekly,
    monthly,
  };
};

/**
 * Export user data to CSV
 */
export const exportUserData = async (filters) => {
  // In a real app, this would call an API to generate a CSV export
  console.log("Exporting user data with filters:", filters);
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real scenario, this would return a download URL or blob
      resolve({ success: true, message: "Export complete" });
    }, 1500);
  });
};

/**
 * Get system alerts and notifications
 */
export const getSystemAlerts = async () => {
  // In a real app, this would fetch real system alerts
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          type: "warning",
          message: "High server load detected",
          timestamp: new Date(),
        },
        {
          id: 2,
          type: "info",
          message: "System update scheduled for tonight",
          timestamp: new Date(),
        },
        {
          id: 3,
          type: "error",
          message: "3 failed login attempts for user admin@example.com",
          timestamp: new Date(),
        },
      ]);
    }, 600);
  });
};
