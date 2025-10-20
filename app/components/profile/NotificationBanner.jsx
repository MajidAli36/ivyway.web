import React from "react";

export default function NotificationBanner({
  message,
  type = "info",
  onClose,
}) {
  const getColorClasses = (type) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-400",
          text: "text-yellow-800",
          button: "text-yellow-700",
        };
      case "success":
        return {
          bg: "bg-blue-50",
          border: "border-blue-400",
          text: "text-blue-800",
          button: "text-blue-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-400",
          text: "text-blue-800",
          button: "text-blue-700",
        };
    }
  };

  const colors = getColorClasses(type);

  return (
    <div
      className={`mb-4 p-4 ${colors.bg} border-l-4 ${colors.border} ${colors.text} rounded flex items-center justify-between`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-4 ${colors.button} hover:underline text-sm`}
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
