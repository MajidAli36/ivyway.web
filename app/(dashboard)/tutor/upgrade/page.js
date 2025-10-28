"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UpgradeEligibility from "@/app/components/tutor-upgrade/UpgradeEligibility";
import UpgradeApplicationForm from "@/app/components/tutor-upgrade/UpgradeApplicationForm";
import ApplicationStatus from "@/app/components/tutor-upgrade/ApplicationStatus";
import TutorStats from "@/app/components/tutor-upgrade/TutorStats";
import TutorBonusStats from "@/app/components/tutor-upgrade/TutorBonusStats";
import DevelopmentNotice from "@/app/components/tutor-upgrade/DevelopmentNotice";
import ErrorBoundary from "@/app/components/shared/ErrorBoundary";
import ApiTestComponent from "@/app/components/tutor-upgrade/ApiTestComponent";
import MockDataDisplay from "@/app/components/tutor-upgrade/MockDataDisplay";

export default function TutorUpgradePage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("eligibility");
  const [eligibility, setEligibility] = useState(null);
  const [stats, setStats] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    // Check if user has an active application
    checkApplicationStatus();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      // This would check if user has an active application
      // For now, we'll start with eligibility check
      setCurrentView("eligibility");
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleEligible = (eligibilityData) => {
    setEligibility(eligibilityData);
    setCurrentView("application");
  };

  const handleIneligible = (eligibilityData) => {
    setEligibility(eligibilityData);
    setCurrentView("eligibility");
  };

  // Fallback mock data for UI display
  const mockEligibility = {
    isEligible: false,
    requirements: {
      completedSessions: 0,
      requiredSessions: 20,
      averageRating: 0,
      requiredRating: 4.0,
      profileCompletion: 67,
      requiredProfileCompletion: 80,
      hasActiveApplication: false,
      lastRejectionDate: null,
      canReapply: true,
    },
    missingRequirements: [
      "Complete 20 more sessions",
      "Improve rating to 4.0 (current: 0.00)",
      "Complete profile to 80% (current: 67%)",
    ],
  };

  const handleApplicationSuccess = (applicationData) => {
    setCurrentView("status");
    // Refresh application status
    checkApplicationStatus();
  };

  const handleApplicationCancel = () => {
    setCurrentView("eligibility");
  };

  const handleStatusChange = (statusData) => {
    setApplicationStatus(statusData);
  };

  const handleStatsChange = (statsData) => {
    setStats(statsData);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "eligibility":
        return (
          <ErrorBoundary>
            <UpgradeEligibility
              onEligible={handleEligible}
              onIneligible={handleIneligible}
            />
          </ErrorBoundary>
        );
      case "application":
        return (
          <ErrorBoundary>
            <UpgradeApplicationForm
              onSuccess={handleApplicationSuccess}
              onCancel={handleApplicationCancel}
            />
          </ErrorBoundary>
        );
      case "status":
        return (
          <ErrorBoundary>
            <ApplicationStatus onStatusChange={handleStatusChange} />
          </ErrorBoundary>
        );
      case "bonus":
        return (
          <ErrorBoundary>
            <TutorBonusStats />
          </ErrorBoundary>
        );
      case "test":
        return (
          <ErrorBoundary>
            <ApiTestComponent />
          </ErrorBoundary>
        );
      case "mock":
        return (
          <ErrorBoundary>
            <MockDataDisplay />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <UpgradeEligibility
              onEligible={handleEligible}
              onIneligible={handleIneligible}
            />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tutor Upgrade
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upgrade to Advanced Tutor status for increased rates and
              benefits
            </p>
          </div>
        </div>

        {/* Development Notice */}
        {/* <div className="px-4 py-6 sm:px-0">
          <DevelopmentNotice />
        </div> */}

        {/* Navigation Tabs */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setCurrentView("eligibility")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "eligibility"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Eligibility
                </button>
                <button
                  onClick={() => setCurrentView("status")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "status"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Application Status
                </button>
                <button
                  onClick={() => setCurrentView("stats")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "stats"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Statistics
                </button>
                <button
                  onClick={() => setCurrentView("bonus")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "bonus"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Bonus Stats
                </button>
                {/* <button
                  onClick={() => setCurrentView("test")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "test"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  API Test
                </button>
                <button
                  onClick={() => setCurrentView("mock")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "mock"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mock Data
                </button> */}
              </nav>
            </div>

            <div className="p-6">
              {currentView === "stats" ? (
                <ErrorBoundary>
                  <TutorStats onStatsChange={handleStatsChange} />
                </ErrorBoundary>
              ) : (
                renderCurrentView()
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Advanced Tutor Benefits
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">
                      $35
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Higher Base Rate
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Start at $35/hour vs $25/hour for regular tutors
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      $40
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Maximum Rate
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Earn up to $40/hour with good reviews and 100+ sessions
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      AP
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Advanced Subjects
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Teach AP/IB courses and advanced level subjects
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">
                      ★
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Premium Students
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Access to students seeking advanced tutoring
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      📈
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Priority Matching
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Get priority in student matching algorithms
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-600">🎓</span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium text-gray-900">
                    Professional Development
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Access to advanced training and resources
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Upgrade Requirements
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Basic Requirements
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Complete at least 20 tutoring sessions
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Maintain 80%+ profile completion
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Have a college degree or equivalent
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Demonstrate teaching experience
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Preferred Qualifications
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      AP/IB subject expertise
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Standardized test preparation experience
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Teaching certifications
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      Advanced degree in relevant subject
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
