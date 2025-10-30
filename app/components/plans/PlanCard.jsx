"use client";
import { useState } from "react";
import {
  formatPrice,
  formatDuration,
  getPlanTypeDisplayName,
  getPlanFeatures,
} from "../../utils/planUtils";
import { PlanTypes } from "../../lib/api/plans";
import MultiHourDurationSelector from "./MultiHourDurationSelector";

export default function PlanCard({
  plan,
  onSelect,
  isSelected = false,
  isLoading = false,
  showFeatures = true,
  variant = "default", // default, compact, comparison
  disableHourSelection = false,
  fixedHoursLabel = "10 sessions",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedHours, setSelectedHours] = useState(plan.minHours || 2);
  const [currentPricing, setCurrentPricing] = useState({
    finalPrice: plan.calculatedPrice,
    discount: plan.discount,
    discountPercentage: plan.discountPercentage,
  });

  const {
    id,
    name,
    type,
    price,
    calculatedPrice,
    sessionCount,
    duration,
    discount,
    discountPercentage,
  } = plan;

  const hasDiscount =
    currentPricing.discount > 0 || currentPricing.discountPercentage > 0;
  const features = getPlanFeatures(type, sessionCount);

  const handleSelect = () => {
    if (!isLoading && onSelect) {
      onSelect(plan);
    }
  };

  // Icons removed for a cleaner card design

  const getCardClasses = () => {
    const baseClasses =
      "relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col h-full";

    if (variant === "compact") {
      return `${baseClasses} p-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`;
    }

    if (variant === "comparison") {
      return `${baseClasses} p-5 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`;
    }

    // default variant
    return `${baseClasses} p-5 ${
      isSelected
        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
    }`;
  };

  const getPriceDisplay = () => {
    if (variant === "compact") {
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">
            {formatPrice(currentPricing.finalPrice)}
          </div>
          {hasDiscount && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(price * selectedHours)}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-slate-800">
          {formatPrice(currentPricing.finalPrice)}
        </div>
        {hasDiscount && (
          <div className="text-base text-gray-500 line-through">
            {formatPrice(price * selectedHours)}
          </div>
        )}
        <div className="text-sm text-gray-600 mt-0.5">
          {type === PlanTypes.MONTHLY && sessionCount && (
            <span>per month • {sessionCount} sessions</span>
          )}
          {type === PlanTypes.MULTI_HOUR && (
            <span>
              {disableHourSelection
                ? `${fixedHoursLabel}`
                : `package • ${selectedHours} hour${
                    selectedHours > 1 ? "s" : ""
                  }`}
            </span>
          )}
          {type === PlanTypes.SINGLE && (
            <span>per session • {formatDuration(duration)}</span>
          )}
        </div>
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
      aria-label={`Select ${name} plan`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {discountPercentage > 0 ? `${discountPercentage}% OFF` : "SAVE"}
        </div>
      )}

      {/* Plan Type Badge */}
      <div className="absolute -top-3 -left-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        {getPlanTypeDisplayName(type)}
      </div>

      {/* Plan Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-800">{name}</h3>
        <p className="text-sm text-gray-600">{getPlanTypeDisplayName(type)}</p>
      </div>

      {/* Price Display */}
      {getPriceDisplay()}

      {/* Duration Selector for Multi-Hour Packages */}
      {type === PlanTypes.MULTI_HOUR &&
        variant !== "compact" &&
        !disableHourSelection && (
          <div className="mb-4">
            <MultiHourDurationSelector
              plan={plan}
              selectedHours={selectedHours}
              onHoursChange={(hours) => {
                setSelectedHours(hours);
              }}
              onPriceUpdate={(pricing) => {
                setCurrentPricing(pricing);
              }}
            />
          </div>
        )}

      {/* Features List */}
      {showFeatures && variant !== "compact" && (
        <div className="space-y-2.5 mb-4">
          {features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start">
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
          {features.length > 4 && (
            <div className="text-sm text-blue-600 font-medium">
              +{features.length - 4} more features
            </div>
          )}
        </div>
      )}

      {/* Compact Features */}
      {showFeatures && variant === "compact" && (
        <div className="space-y-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start">
              <span className="text-xs text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Select Button */}
      <button
        className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          handleSelect();
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Loading...
          </div>
        ) : isSelected ? (
          <div className="flex items-center justify-center">Selected</div>
        ) : (
          "Select Plan"
        )}
      </button>

      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
    </div>
  );
}
