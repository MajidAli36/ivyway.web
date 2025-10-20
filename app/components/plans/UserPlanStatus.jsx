"use client";
import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  formatPrice,
  formatDuration,
  getPlanStatusInfo,
  calculateRemainingSessions,
  getSessionUsagePercentage,
  calculateDaysUntilRenewal,
  isPlanExpiringSoon,
  isPlanExpired,
} from "../../utils/planUtils";
import { PlanTypes, PlanStatus } from "../../lib/api/plans";

export default function UserPlanStatus({
  userPlan,
  onBrowsePlans,
  onRenewPlan,
  isLoading = false,
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!userPlan) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Plan
          </h3>
          <p className="text-gray-600 mb-4">
            You don't have an active tutoring plan. Browse our plans to get
            started.
          </p>
          <button
            onClick={onBrowsePlans}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Plans
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const { status, startDate, endDate, sessionsUsed, totalSessions, plan } =
    userPlan;

  const statusInfo = getPlanStatusInfo(status);
  const remainingSessions = calculateRemainingSessions(
    totalSessions,
    sessionsUsed
  );
  const usagePercentage = getSessionUsagePercentage(
    sessionsUsed,
    totalSessions
  );
  const daysUntilRenewal = calculateDaysUntilRenewal(endDate);
  const expiringSoon = isPlanExpiringSoon(endDate);
  const expired = isPlanExpired(endDate);

  const getStatusIcon = () => {
    switch (status) {
      case PlanStatus.ACTIVE:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case PlanStatus.EXPIRED:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case PlanStatus.CANCELLED:
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getProgressBarColor = () => {
    if (usagePercentage >= 90) return "bg-red-500";
    if (usagePercentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon()}
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <div className="flex items-center mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  {statusInfo.name}
                </span>
                {expiringSoon && !expired && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    Expiring Soon
                  </span>
                )}
                {expired && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="h-3 w-3 mr-1" />
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Price */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(plan.calculatedPrice)}
            </div>
            <div className="text-sm text-gray-600">
              {plan.type === PlanTypes.MONTHLY ? "per month" : "total"}
            </div>
          </div>

          {/* Sessions (for monthly plans) */}
          {plan.type === PlanTypes.MONTHLY && totalSessions && (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {remainingSessions}/{totalSessions}
              </div>
              <div className="text-sm text-gray-600">sessions remaining</div>
            </div>
          )}

          {/* Duration */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatDuration(plan.duration)}
            </div>
            <div className="text-sm text-gray-600">per session</div>
          </div>
        </div>

        {/* Session Progress Bar (for monthly plans) */}
        {plan.type === PlanTypes.MONTHLY && totalSessions && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sessions Used</span>
              <span>
                {sessionsUsed} of {totalSessions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Renewal Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {expired ? "Plan expired" : "Renews in"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {expired
                ? "Expired"
                : daysUntilRenewal === 0
                ? "Today"
                : daysUntilRenewal === 1
                ? "Tomorrow"
                : `${daysUntilRenewal} days`}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {expired
              ? `Expired on ${new Date(endDate).toLocaleDateString()}`
              : `Next renewal: ${new Date(endDate).toLocaleDateString()}`}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {expired ? (
            <button
              onClick={onRenewPlan}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Renew Plan
            </button>
          ) : (
            <button
              onClick={onBrowsePlans}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Browse Plans
            </button>
          )}

          {plan.type === PlanTypes.MONTHLY && remainingSessions > 0 && (
            <button
              onClick={() => (window.location.href = "/student/book-session")}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Book Session
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-4">Plan Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan Type:</span>
              <span className="ml-2 font-medium">{plan.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Original Price:</span>
              <span className="ml-2 font-medium">
                {formatPrice(plan.price)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Start Date:</span>
              <span className="ml-2 font-medium">
                {new Date(startDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">End Date:</span>
              <span className="ml-2 font-medium">
                {new Date(endDate).toLocaleDateString()}
              </span>
            </div>
            {plan.discount > 0 && (
              <div>
                <span className="text-gray-600">Discount Applied:</span>
                <span className="ml-2 font-medium text-green-600">
                  -{formatPrice(plan.discount)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
