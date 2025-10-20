/**
 * Dashboard Utilities
 * Common utility functions for dashboard data processing and formatting
 */

/**
 * Format currency values
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return "0%";
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format numbers with appropriate suffixes (K, M, B)
 */
export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return "0";

  const absNum = Math.abs(num);
  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(decimals) + "B";
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(decimals) + "M";
  }
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(decimals) + "K";
  }
  return num.toString();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440)
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  if (diffInMinutes < 43200)
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  if (diffInMinutes < 525600)
    return `${Math.floor(diffInMinutes / 43200)} months ago`;
  return `${Math.floor(diffInMinutes / 525600)} years ago`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString, format = "short") => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  switch (format) {
    case "short":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "datetime":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    default:
      return date.toLocaleDateString();
  }
};

/**
 * Calculate duration between two times
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMinutes = Math.round((end - start) / (1000 * 60));

  return diffInMinutes;
};

/**
 * Format duration in human readable format
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return "0 min";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }
  return `${remainingMinutes}m`;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculate trend percentage
 */
export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return 0;

  return ((current - previous) / previous) * 100;
};

/**
 * Get trend color class
 */
export const getTrendColor = (trend) => {
  if (!trend) return "text-gray-500";
  return trend > 0
    ? "text-green-600"
    : trend < 0
    ? "text-red-600"
    : "text-gray-500";
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "active":
    case "completed":
    case "success":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
    case "waiting":
    case "processing":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "cancelled":
    case "failed":
    case "error":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

/**
 * Get progress color class
 */
export const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 60) return "bg-blue-500";
  if (progress >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Group data by date
 */
export const groupByDate = (data, dateField = "createdAt") => {
  const groups = {};

  data.forEach((item) => {
    const date = new Date(item[dateField]).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });

  return groups;
};

/**
 * Sort data by date
 */
export const sortByDate = (
  data,
  dateField = "createdAt",
  ascending = false
) => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filter data by date range
 */
export const filterByDateRange = (
  data,
  startDate,
  endDate,
  dateField = "createdAt"
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return data.filter((item) => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Calculate average
 */
export const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

/**
 * Calculate sum
 */
export const calculateSum = (values) => {
  if (!values || values.length === 0) return 0;
  return values.reduce((acc, val) => acc + val, 0);
};

/**
 * Get top N items from array
 */
export const getTopItems = (data, key, n = 5) => {
  return data.sort((a, b) => b[key] - a[key]).slice(0, n);
};

/**
 * Generate mock data for testing
 */
export const generateMockData = (type, count = 10) => {
  const mockData = [];

  for (let i = 0; i < count; i++) {
    switch (type) {
      case "sessions":
        mockData.push({
          id: `session-${i + 1}`,
          subject: ["Mathematics", "Physics", "Chemistry", "Biology"][i % 4],
          studentName: `Student ${i + 1}`,
          startTime: new Date(
            Date.now() + i * 24 * 60 * 60 * 1000
          ).toISOString(),
          endTime: new Date(
            Date.now() + i * 24 * 60 * 60 * 1000 + 60 * 60 * 1000
          ).toISOString(),
          status: ["Confirmed", "Pending", "Completed"][i % 3],
          amount: Math.floor(Math.random() * 100) + 50,
        });
        break;
      case "activities":
        mockData.push({
          id: `activity-${i + 1}`,
          type: ["Session", "Payment", "Registration"][i % 3],
          user: `User ${i + 1}`,
          createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
          amount: Math.floor(Math.random() * 1000) + 100,
        });
        break;
      default:
        mockData.push({
          id: `item-${i + 1}`,
          name: `Item ${i + 1}`,
          value: Math.floor(Math.random() * 100),
        });
    }
  }

  return mockData;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
