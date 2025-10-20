/**
 * Format data for charts based on time range and view mode
 */
export const formatChartData = (data, viewMode, timeRange) => {
  if (!data) return null;

  let labels = [];
  let datasets = [];

  // Create appropriate labels based on time range
  switch (timeRange) {
    case "day":
      labels = data.hourly.map((item) => item.hour);
      break;
    case "week":
      labels = data.daily.map((item) => item.day);
      break;
    case "month":
      labels = data.daily.map((item) => item.day);
      break;
    case "quarter":
      labels = data.weekly.map((item) => item.week);
      break;
    case "year":
      labels = data.monthly.map((item) => item.month);
      break;
    default:
      labels = data.daily.map((item) => item.day);
  }

  // Create datasets based on view mode
  if (viewMode === "all" || viewMode === "students") {
    datasets.push({
      label: "Student Activity",
      data: getDataByTimeRange(data, timeRange, "students"),
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      tension: 0.1,
    });
  }

  if (viewMode === "all" || viewMode === "tutors") {
    datasets.push({
      label: "Tutor Activity",
      data: getDataByTimeRange(data, timeRange, "tutors"),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.1,
    });
  }

  if (viewMode === "all" || viewMode === "admins") {
    datasets.push({
      label: "Admin Activity",
      data: getDataByTimeRange(data, timeRange, "admins"),
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.5)",
      tension: 0.1,
    });
  }

  return {
    labels,
    datasets,
  };
};

/**
 * Get data array based on time range and user role
 */
const getDataByTimeRange = (data, timeRange, role) => {
  switch (timeRange) {
    case "day":
      return data.hourly.map((item) => item[role]);
    case "week":
    case "month":
      return data.daily.map((item) => item[role]);
    case "quarter":
      return data.weekly.map((item) => item[role]);
    case "year":
      return data.monthly.map((item) => item[role]);
    default:
      return data.daily.map((item) => item[role]);
  }
};

/**
 * Format dates for chart labels
 */
export const formatDate = (date, format = "short") => {
  if (!date) return "";

  const d = new Date(date);

  if (format === "short") {
    return d.toLocaleDateString();
  }

  if (format === "long") {
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (format === "time") {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return d.toLocaleDateString();
};
