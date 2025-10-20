"use client";

import { Component } from "react";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

class MeetingErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error("Meeting Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-red-800">
                Meeting Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Something went wrong while loading meeting information. 
                  This might be due to a network issue or a temporary service problem.
                </p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">
                      Error Details (Development)
                    </summary>
                    <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              <div className="mt-4">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
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

export default MeetingErrorBoundary;
