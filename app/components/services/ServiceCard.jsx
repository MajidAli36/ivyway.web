"use client";
import { useState } from "react";
import {
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ServiceTypes, getServiceCategory } from "../../constants/serviceTypes";

const iconMap = {
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  DocumentTextIcon,
  GlobeAltIcon,
};

export default function ServiceCard({
  serviceType,
  onSelect,
  isSelected = false,
  variant = "default", // default, compact, featured
  showPricing = true,
  showFeatures = true,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const category = getServiceCategory(serviceType);
  const IconComponent = iconMap[category.icon];

  const handleSelect = () => {
    if (onSelect) {
      onSelect(serviceType);
    }
  };

  const getCardClasses = () => {
    const baseClasses =
      "relative rounded-xl border transition-all duration-200 cursor-pointer h-full flex flex-col";

    if (variant === "compact") {
      return `${baseClasses} p-4 ${
        isSelected
          ? `${category.borderColor} ${category.bgColor} border-2`
          : "border-gray-200 hover:border-gray-300"
      }`;
    }

    if (variant === "featured") {
      return `${baseClasses} p-8 ${
        isSelected
          ? `${category.borderColor} ${category.bgColor} border-2 shadow-lg scale-105`
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`;
    }

    // default variant
    return `${baseClasses} p-6 ${
      isSelected
        ? `${category.borderColor} ${category.bgColor} border-2 shadow-lg scale-105`
        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
    }`;
  };

  const getPricingDisplay = () => {
    if (!showPricing) return null;

    const { pricing } = category;

    // Handle different pricing structures
    if (pricing.hourly && pricing.monthly) {
      // Standard pricing structure (tutoring, mentoring, test prep)
      return (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900">
            From ${pricing.hourly}/hour
          </div>
          <div className="text-sm text-gray-600">
            Monthly plans from ${pricing.monthly}
          </div>
        </div>
      );
    } else if (pricing["60min"] && pricing["30min"]) {
      // Counseling pricing structure (30min and 60min sessions)
      return (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900">
            From ${pricing["30min"]}/hour
          </div>
          <div className="text-sm text-gray-600">
            ${pricing["60min"]} for 60-minute sessions
          </div>
        </div>
      );
    } else {
      // Fallback for any other pricing structure
      const firstPrice = Object.values(pricing)[0];
      return (
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gray-900">
            From ${firstPrice}/session
          </div>
        </div>
      );
    }
  };

  const getFeaturesDisplay = () => {
    if (!showFeatures) return null;

    const maxFeatures = variant === "compact" ? 3 : 5;
    const featuresToShow = category.features.slice(0, maxFeatures);

    return (
      <div className="space-y-2 mb-6">
        {featuresToShow.map((feature, index) => (
          <div key={index} className="flex items-start">
            <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
        {category.features.length > maxFeatures && (
          <div className="text-sm text-blue-600 font-medium">
            +{category.features.length - maxFeatures} more features
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={getCardClasses()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select ${category.name} service`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Header (icon removed) */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>

      {/* Pricing Display */}
      {getPricingDisplay()}

      {/* Features List */}
      {getFeaturesDisplay()}

      {/* Action Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
          isSelected
            ? `bg-${category.color}-600 text-white`
            : `bg-${category.color}-50 text-${category.color}-600 hover:bg-${category.color}-100`
        } mt-auto`}
      >
        {isSelected ? (
          <>
            <CheckIcon className="h-5 w-5 mr-2" />
            Selected
          </>
        ) : (
          <>
            Select
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </>
        )}
      </button>

      {/* Popular Badge */}
      {serviceType === ServiceTypes.TUTORING && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
    </div>
  );
}
