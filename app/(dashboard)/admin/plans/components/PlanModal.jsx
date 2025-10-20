"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { PlanTypes } from "../../../../lib/api/plans";

export default function PlanModal({ plan, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "monthly",
    price: "",
    sessionCount: "",
    duration: "",
    discount: "",
    stripeProductId: "",
    stripePriceId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!plan;

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        type: plan.type || "monthly",
        price: plan.price?.toString() || "",
        sessionCount: plan.sessionCount?.toString() || "",
        duration: plan.duration?.toString() || "",
        discount: plan.discount?.toString() || "",
        stripeProductId: plan.stripeProductId || "",
        stripePriceId: plan.stripePriceId || "",
      });
    }
  }, [plan]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Plan name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Plan name must be less than 100 characters";
    }

    if (!formData.type) {
      newErrors.type = "Plan type is required";
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (formData.duration && parseInt(formData.duration) <= 0) {
      newErrors.duration = "Duration must be a positive number";
    }

    if (formData.sessionCount && parseInt(formData.sessionCount) <= 0) {
      newErrors.sessionCount = "Session count must be a positive number";
    }

    if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const planData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        sessionCount: formData.sessionCount ? parseInt(formData.sessionCount) : null,
        duration: parseInt(formData.duration),
        discount: formData.discount ? parseFloat(formData.discount) : null,
      };

      await onSave(planData);
    } catch (error) {
      console.error("Error saving plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const getPlanTypeDescription = (type) => {
    switch (type) {
      case "monthly":
        return "Recurring monthly subscription with a set number of sessions";
      case "multi_hour":
        return "Package of multiple hours that can be used over time";
      case "single":
        return "One-time session purchase";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred background overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centered modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full md:w-3/4 lg:w-1/2 max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-100 shadow-2xl rounded-xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Plan" : "Create New Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., Premium Monthly Plan"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Plan Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Plan Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly Subscription</option>
                <option value="multi_hour">Multi-Hour Package</option>
                <option value="single">Single Session</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {getPlanTypeDescription(formData.type)}
              </p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="15"
                step="15"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.duration ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="60"
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.discount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
            </div>
          </div>

          {/* Monthly Plan Specific Fields */}
          {formData.type === "monthly" && (
            <div>
              <label htmlFor="sessionCount" className="block text-sm font-medium text-gray-700 mb-2">
                Sessions per Month *
              </label>
              <input
                type="number"
                id="sessionCount"
                name="sessionCount"
                value={formData.sessionCount}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sessionCount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="4"
              />
              {errors.sessionCount && <p className="mt-1 text-sm text-red-600">{errors.sessionCount}</p>}
            </div>
          )}

          {/* Description removed as requested */}

          {/* Stripe Integration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stripe Integration (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stripeProductId" className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Product ID
                </label>
                <input
                  type="text"
                  id="stripeProductId"
                  name="stripeProductId"
                  value={formData.stripeProductId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="prod_..."
                />
              </div>
              <div>
                <label htmlFor="stripePriceId" className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Price ID
                </label>
                <input
                  type="text"
                  id="stripePriceId"
                  name="stripePriceId"
                  value={formData.stripePriceId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="price_..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
