"use client";

import { useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { formatPrice, formatDuration, getPlanTypeDisplayName } from "../../../../utils/planUtils";

export default function PlanCard({ plan, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  const getPlanTypeColor = (type) => {
    switch (type) {
      case "monthly":
        return "bg-blue-100 text-blue-800";
      case "multi_hour":
        return "bg-purple-100 text-purple-800";
      case "single":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanStatusColor = (plan) => {
    // Check if plan has active subscriptions
    if (plan.activeSubscriptions > 0) {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getPlanStatusText = (plan) => {
    if (plan.activeSubscriptions > 0) {
      return "Active";
    }
    return "Inactive";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Plan Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanTypeColor(plan.type)}`}>
                {getPlanTypeDisplayName(plan.type)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanStatusColor(plan)}`}>
                {getPlanStatusText(plan)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {plan.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {plan.description || "No description available"}
            </p>
          </div>
          
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Plan
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6 space-y-4">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">Price</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(plan.price)}
            </div>
            {plan.discount > 0 && (
              <div className="text-xs text-green-600">
                {plan.discountPercentage}% off
              </div>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">Duration</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatDuration(plan.duration)}
          </span>
        </div>

        {/* Sessions (for monthly plans) */}
        {plan.sessionCount && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <UserGroupIcon className="w-5 h-5 mr-2" />
              <span className="text-sm">Sessions</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {plan.sessionCount} per month
            </span>
          </div>
        )}

        {/* Stripe Integration */}
        {plan.stripeProductId && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <TagIcon className="w-5 h-5 mr-2" />
              <span className="text-sm">Stripe</span>
            </div>
            <span className="text-xs text-green-600 font-medium">
              Connected
            </span>
          </div>
        )}

        {/* Usage Statistics */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {plan.totalSubscriptions || 0}
              </div>
              <div className="text-xs text-gray-500">Total Subscriptions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {plan.activeSubscriptions || 0}
              </div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(plan.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
