"use client";

import { useState, useEffect } from "react";
import {
  CurrencyDollarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import ratingService from "../../lib/api/ratingService";

export default function TutorBonusStats() {
  const [bonusStats, setBonusStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBonusStats();
  }, []);

  const fetchBonusStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ratingService.getTutorBonusStats();
      setBonusStats(response.data);
    } catch (err) {
      // Check if it's a new tutor with no bonus stats (expected behavior)
      if (
        err.isNewTutor ||
        err.status === 404 ||
        err.status === 204 ||
        err.message?.includes("not found") ||
        err.message?.includes("no data") ||
        err.message?.includes("empty") ||
        err.message?.includes("No bonus data available for new tutor") ||
        (err && Object.keys(err).length === 0) ||
        !err.data ||
        (err.response && err.response.status === 404) ||
        (err.response && err.response.data && Object.keys(err.response.data).length === 0) ||
        (err.response && err.response.data && JSON.stringify(err.response.data) === '{}') ||
        (err.response && err.response.data && typeof err.response.data === 'object' && Object.keys(err.response.data).length === 0)
      ) {
        setBonusStats(null);
        setError(
          "No bonus statistics available yet. Start teaching sessions to see your performance metrics here!"
        );
      } else {
        setError("Failed to load bonus statistics");
        // Only log meaningful errors that are not related to new tutors
        if (err && Object.keys(err).length > 0 && err.status !== 404 && !err.isNewTutor) {
          console.error("Error fetching bonus stats:", err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Bonus Performance
          </h3>
        </div>

        <div className="text-center py-8">
          <TrophyIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No Bonus Statistics Yet
          </h4>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {error.includes("No bonus statistics available yet")
              ? "You haven't completed any sessions yet. Start teaching to see your performance metrics and bonus opportunities here!"
              : error}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h5 className="font-medium text-blue-900 mb-2">
              How to earn bonuses:
            </h5>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Complete your first tutoring session</li>
              <li>• Maintain high ratings from students</li>
              <li>• Be consistent and professional</li>
              <li>• Build consecutive high ratings</li>
            </ul>
          </div>
          <button
            onClick={fetchBonusStats}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (!bonusStats) return null;

  const progressPercentage =
    Number(bonusStats.monthlyBonusCap) > 0
      ? (Number(bonusStats.monthlyBonusEarned) /
          Number(bonusStats.monthlyBonusCap)) *
        100
      : 0;

  const getWarningLevel = () => {
    if (bonusStats.lowRatingWarnings >= 3) return "critical";
    if (bonusStats.lowRatingWarnings >= 1) return "warning";
    return "good";
  };

  const warningLevel = getWarningLevel();
  const warningColors = {
    good: "text-green-600 bg-green-50 border-green-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    critical: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
          Bonus Performance
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBonusStats}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Monthly Bonus Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Monthly Bonus Progress
          </span>
          <span className="text-sm text-gray-600">
            ${Number(bonusStats.monthlyBonusEarned).toFixed(2)} / $
            {Number(bonusStats.monthlyBonusCap).toFixed(2)}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {progressPercentage.toFixed(1)}% of monthly cap
          </span>
          <span className="text-xs font-medium text-green-600">
            ${Number(bonusStats.remainingBonusCap).toFixed(2)} remaining
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Consecutive High Ratings */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <FireIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {bonusStats.consecutiveHighRatings}
          </div>
          <div className="text-xs text-gray-600">Consecutive High Ratings</div>
        </div>

        {/* Monthly Earnings */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${Number(bonusStats.actualMonthlyBonusEarnings).toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Total Bonus Earned</div>
        </div>
      </div>

      {/* Warning Status */}
      <div className={`p-4 rounded-lg border ${warningColors[warningLevel]}`}>
        <div className="flex items-center space-x-2">
          {warningLevel === "critical" && (
            <ExclamationTriangleIcon className="h-5 w-5" />
          )}
          {warningLevel === "warning" && (
            <ExclamationTriangleIcon className="h-5 w-5" />
          )}
          {warningLevel === "good" && <TrophyIcon className="h-5 w-5" />}

          <div className="flex-1">
            <div className="font-medium">
              {warningLevel === "critical" && "Critical Performance Alert"}
              {warningLevel === "warning" && "Performance Warning"}
              {warningLevel === "good" && "Excellent Performance"}
            </div>
            <div className="text-sm">
              {warningLevel === "critical" && (
                <>
                  You have {bonusStats.lowRatingWarnings} low rating warnings.
                  Immediate improvement needed to maintain bonus eligibility.
                </>
              )}
              {warningLevel === "warning" && (
                <>
                  You have {bonusStats.lowRatingWarnings} low rating warning(s).
                  Focus on improving session quality to avoid bonus reduction.
                </>
              )}
              {warningLevel === "good" && (
                <>
                  Great job! No warnings. Keep up the excellent work to maximize
                  your bonus earnings.
                </>
              )}
            </div>
          </div>
        </div>

        {bonusStats.lastLowRatingDate && (
          <div className="mt-2 text-xs">
            Last low rating:{" "}
            {new Date(bonusStats.lastLowRatingDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Performance Tips */}
      {warningLevel !== "good" && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Tips to Improve Performance:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Prepare thoroughly for each session</li>
            <li>• Actively engage with students and check understanding</li>
            <li>• Be punctual and professional</li>
            <li>• Follow up with students after sessions</li>
            <li>• Ask for feedback and implement improvements</li>
          </ul>
        </div>
      )}
    </div>
  );
}
