"use client";

import { useState, useEffect } from "react";
import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function MultiHourDurationSelector({
  plan,
  selectedHours,
  onHoursChange,
  onPriceUpdate,
}) {
  const [hours, setHours] = useState(selectedHours || plan.minHours || 2);

  useEffect(() => {
    if (selectedHours !== hours) {
      setHours(selectedHours || plan.minHours || 2);
    }
  }, [selectedHours, plan.minHours]);

  const calculatePrice = (hoursCount) => {
    const basePrice = plan.price * hoursCount;
    let discountPercentage = 0;

    if (hoursCount >= 11) {
      discountPercentage = 20;
    } else if (hoursCount >= 6) {
      discountPercentage = 10;
    } else if (hoursCount >= 2) {
      discountPercentage = 5;
    }

    const discount = (basePrice * discountPercentage) / 100;
    const finalPrice = basePrice - discount;

    return {
      basePrice,
      discount,
      discountPercentage,
      finalPrice,
    };
  };

  const handleHoursChange = (newHours) => {
    setHours(newHours);
    onHoursChange(newHours);
    
    const pricing = calculatePrice(newHours);
    onPriceUpdate(pricing);
  };

  const pricing = calculatePrice(hours);
  const minHours = plan.minHours || 2;
  const maxHours = plan.maxHours || 20;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Number of Hours
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: maxHours - minHours + 1 }, (_, i) => {
            const hourValue = minHours + i;
            return (
              <button
                key={hourValue}
                onClick={() => handleHoursChange(hourValue)}
                className={`px-3 py-2 rounded-lg border text-center transition-all duration-200 ${
                  hours === hourValue
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {hourValue}h
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Base Price ({hours} hours × ${plan.price})</span>
          <span className="text-sm font-medium">${pricing.basePrice.toFixed(2)}</span>
        </div>
        
        {pricing.discountPercentage > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">
              Discount ({pricing.discountPercentage}%)
            </span>
            <span className="text-sm font-medium text-green-600">
              -${pricing.discount.toFixed(2)}
            </span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Price</span>
            <span className="text-xl font-bold text-blue-600">
              ${pricing.finalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Package Info */}
      <div className="text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{hours} hour{hours > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            <span>${(pricing.finalPrice / hours).toFixed(2)}/hour</span>
          </div>
        </div>
      </div>
    </div>
  );
}
