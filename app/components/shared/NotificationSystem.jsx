"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [...state, { ...action.payload, id: Date.now() + Math.random() }];
    case "REMOVE_NOTIFICATION":
      return state.filter((notification) => notification.id !== action.payload);
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
};

// Notification context
const NotificationContext = createContext();

// Notification provider
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = (notification) => {
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        ...notification,
        duration: notification.duration || 5000,
      },
    });
  };

  const removeNotification = (id) => {
    dispatch({
      type: "REMOVE_NOTIFICATION",
      payload: id,
    });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  // Auto-remove notifications after duration
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Individual notification component
const Notification = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case NOTIFICATION_TYPES.ERROR:
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case NOTIFICATION_TYPES.WARNING:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case NOTIFICATION_TYPES.INFO:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return "bg-green-50 border-green-200";
      case NOTIFICATION_TYPES.ERROR:
        return "bg-red-50 border-red-200";
      case NOTIFICATION_TYPES.WARNING:
        return "bg-yellow-50 border-yellow-200";
      case NOTIFICATION_TYPES.INFO:
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return "text-green-800";
      case NOTIFICATION_TYPES.ERROR:
        return "text-red-800";
      case NOTIFICATION_TYPES.WARNING:
        return "text-yellow-800";
      case NOTIFICATION_TYPES.INFO:
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div
      className={`max-w-sm w-full ${getBackgroundColor()} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
                {notification.message}
              </p>
            )}
            {notification.details && (
              <div className={`mt-2 text-xs ${getTextColor()} opacity-75`}>
                {notification.details}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex ${getTextColor()} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => onRemove(notification.id)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification container
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

// Convenience functions for different notification types
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  const showSuccess = (title, message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      ...options,
    });
  };

  const showError = (title, message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      duration: 0, // Don't auto-dismiss errors
      ...options,
    });
  };

  const showWarning = (title, message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message,
      ...options,
    });
  };

  const showInfo = (title, message, options = {}) => {
    addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message,
      ...options,
    });
  };

  const showApiError = (error, options = {}) => {
    let title = "Error";
    let message = "An unexpected error occurred";

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          title = "Invalid Request";
          message = data.message || "Please check your input and try again";
          break;
        case 401:
          title = "Unauthorized";
          message = "Please log in again";
          break;
        case 403:
          title = "Access Denied";
          message = "You don't have permission to perform this action";
          break;
        case 404:
          title = "Not Found";
          message = "The requested resource was not found";
          break;
        case 422:
          title = "Validation Error";
          message = data.message || "Please check your input";
          break;
        case 500:
          title = "Server Error";
          message = "Something went wrong on our end. Please try again later";
          break;
        default:
          title = "Error";
          message = data.message || "An error occurred";
      }
    } else if (error.request) {
      title = "Network Error";
      message = "Please check your internet connection and try again";
    } else {
      title = "Error";
      message = error.message || "An unexpected error occurred";
    }

    showError(title, message, options);
  };

  const showValidationErrors = (errors, options = {}) => {
    const errorMessages = Object.values(errors).flat();
    const message =
      errorMessages.length > 0
        ? errorMessages.join(", ")
        : "Please check your input";

    showError("Validation Error", message, options);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showApiError,
    showValidationErrors,
  };
};

// Higher-order component for error handling
export const withErrorHandling = (WrappedComponent) => {
  return function ErrorHandledComponent(props) {
    const { showApiError, showValidationErrors } = useNotificationHelpers();

    const handleError = (error) => {
      if (error.validationErrors) {
        showValidationErrors(error.validationErrors);
      } else {
        showApiError(error);
      }
    };

    return <WrappedComponent {...props} onError={handleError} />;
  };
};

export default NotificationProvider;
