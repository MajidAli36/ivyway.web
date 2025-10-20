"use client";

import React from "react";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === "production") {
      // Here you would typically send the error to a logging service
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We're sorry, but something unexpected happened. Please try
                again.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Error Details
                </h3>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">
                        Error Message:
                      </h4>
                      <p className="mt-1 text-sm text-red-600 font-mono">
                        {this.state.error.message}
                      </p>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Stack Trace:
                        </h4>
                        <pre className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
