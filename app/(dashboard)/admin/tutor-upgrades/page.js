"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ApplicationsList from "@/app/components/admin/tutor-upgrades/ApplicationsList";
import ApplicationReview from "@/app/components/admin/tutor-upgrades/ApplicationReview";
import UpgradeStatistics from "@/app/components/admin/tutor-upgrades/UpgradeStatistics";

export default function AdminTutorUpgradesPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState("applications");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewApplication = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setCurrentView("review");
  };

  const handleBackToList = () => {
    setSelectedApplicationId(null);
    setCurrentView("applications");
  };

  const handleReviewComplete = (reviewData) => {
    // Refresh the applications list
    setRefreshKey(prev => prev + 1);
    setCurrentView("applications");
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "applications":
        return (
          <ApplicationsList
            key={refreshKey}
            onViewApplication={handleViewApplication}
            onRefresh={handleRefresh}
          />
        );
      case "review":
        return (
          <ApplicationReview
            applicationId={selectedApplicationId}
            onBack={handleBackToList}
            onReviewComplete={handleReviewComplete}
          />
        );
      case "statistics":
        return <UpgradeStatistics />;
      default:
        return (
          <ApplicationsList
            key={refreshKey}
            onViewApplication={handleViewApplication}
            onRefresh={handleRefresh}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tutor Upgrades
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage tutor upgrade applications and reviews
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setCurrentView("applications")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "applications"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Applications
                </button>
                <button
                  onClick={() => setCurrentView("statistics")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentView === "statistics"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Statistics
                </button>
              </nav>
            </div>

            <div className="p-6">
              {renderCurrentView()}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Review Guidelines
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Use these guidelines to ensure consistent and fair review of tutor upgrade applications
              </p>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </span>
                    Approval Criteria
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Complete at least <strong>100 tutoring sessions</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Maintain <strong>90%+ profile completion</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Have <strong>relevant college degree</strong> or equivalent</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Demonstrate <strong>teaching experience</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Show <strong>subject expertise</strong> in application</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-3 mt-0.5">•</span>
                      <span>Maintain <strong>4.5+ average rating</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-xs font-bold">1</span>
                    </span>
                    Review Process
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">1.</span>
                      <span>Review tutor's <strong>qualifications and experience</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">2.</span>
                      <span>Check <strong>subject expertise alignment</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">3.</span>
                      <span>Evaluate <strong>motivation and commitment</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">4.</span>
                      <span>Review <strong>recent sessions and feedback</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">5.</span>
                      <span>Provide <strong>detailed feedback</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5 font-bold">6.</span>
                      <span>Make <strong>approval/rejection decision</strong></span>
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
