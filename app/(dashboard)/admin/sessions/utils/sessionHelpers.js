export const formatSessions = (sessions) => {
  return sessions.map((session) => {
    // Any data transformations here
    return {
      ...session,
      // Example transformation: Format date if needed
      // formattedDate: new Date(session.date).toLocaleDateString()
    };
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Scheduled":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      };
    case "Completed":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      };
    case "Canceled":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
      };
  }
};
