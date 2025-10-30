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
      onSelect({
        ...plan,
        selectedHours,
        calculatedPrice: currentPricing?.finalPrice ?? plan.calculatedPrice,
        discount: currentPricing?.discount ?? plan.discount,
        discountPercentage:
          currentPricing?.discountPercentage ?? plan.discountPercentage,
      });
    }
  };

  // Icons removed for a cleaner card design

  const getCardClasses = () => {
    const baseClasses =
      "relative rounded-xl border transition-all duration-200 cursor-pointer flex flex-col h-full overflow-visible";

    if (variant === "compact") {
      return `${baseClasses} pt-8 px-4 pb-4 ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 z-10"
          : "border-gray-200 hover:border-blue-300"
      }`;
    }

    if (variant === "comparison") {
      return `${baseClasses} pt-8 px-5 pb-5 ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 z-10"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`;
    }

    // default variant
    return `${baseClasses} pt-8 px-5 pb-5 ${
      isSelected
        ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200 z-10"
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

  // Horizontal layout for multi-hour with hour selection
  const showHorizontal = type === PlanTypes.MULTI_HOUR && !disableHourSelection;

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
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm">
          {discountPercentage > 0 ? `${discountPercentage}% OFF` : "SAVE"}
        </div>
      )}

      {/* Plan Type Badge */}
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm">
        {getPlanTypeDisplayName(type)}
      </div>

      {showHorizontal ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: price and hours */}
          <div>
            <div className="mb-3">
              <h3 className="text-xl font-bold text-slate-800 text-left">{name}</h3>
              <p className="text-sm text-gray-600 text-left">{getPlanTypeDisplayName(type)}</p>
            </div>
            {getPriceDisplay()}
            <MultiHourDurationSelector
              plan={plan}
              selectedHours={selectedHours}
              onHoursChange={(hours) => {
                setSelectedHours(hours);
              }}
              onPriceUpdate={(pricing) => {
                setCurrentPricing(pricing);
              }}
              showBreakdown={false}
            />
          </div>
          {/* Right: calculation + features + select */}
          <div className="flex flex-col h-full">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Price ({selectedHours} hours × ${Number(currentPricing.unitPrice || price).toFixed(2)})</span>
                <span className="text-sm font-medium">${Number(currentPricing.basePrice || (Number(currentPricing.unitPrice || price) * selectedHours)).toFixed(2)}</span>
              </div>
              {((currentPricing.discountPercentage || 0) > 0 || (currentPricing.discount || 0) > 0) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">Discount ({currentPricing.discountPercentage || 0}%)</span>
                  <span className="text-sm font-medium text-green-600">-${Number(currentPricing.discount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">${Number(currentPricing.finalPrice || calculatedPrice || price).toFixed(2)}</span>
                </div>
              </div>
            </div>
            {showFeatures && (
              <div className="space-y-2 mb-3">
                {features.slice(0, 8).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
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
          </div>
        </div>
      ) : (
        <>
          {/* Plan Header */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-slate-800 text-left">{name}</h3>
            <p className="text-sm text-gray-600 text-left">{getPlanTypeDisplayName(type)}</p>
          </div>
          {/* Price Display */}
          {getPriceDisplay()}
          {/* Duration Selector when allowed (non-compact) */}
          {type === PlanTypes.MULTI_HOUR && variant !== "compact" && !disableHourSelection && (
            <div className="mb-4">
              <MultiHourDurationSelector
                plan={plan}
                selectedHours={selectedHours}
                onHoursChange={(hours) => setSelectedHours(hours)}
                onPriceUpdate={(pricing) => setCurrentPricing(pricing)}
              />
            </div>
          )}
          {/* Features */}
          {showFeatures && variant !== "compact" && (
            <div className="space-y-2.5 mb-4">
              {features.slice(0, 8).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
              {features.length > 8 && (
                <div className="text-sm text-blue-600 font-medium">+{features.length - 8} more features</div>
              )}
            </div>
          )}
          {/* Compact Features */}
          {showFeatures && variant === "compact" && (
            <div className="space-y-2 mb-4">
              {features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-xs text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          )}
          {/* Select Button */}
          <button
            className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
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
        </>
      )}

      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
    </div>
  );
}
