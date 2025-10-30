"use client";
import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { ServiceTypes } from "../../constants/serviceTypes";

export default function ServiceSelection({
  onSelectService,
  selectedService = null,
  variant = "default", // default, compact, featured
  showTitle = true,
  showDescription = true,
  className = "",
}) {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    ServiceTypes.TUTORING,
    // ServiceTypes.COUNSELING,
    ServiceTypes.TEST_PREP,
    ServiceTypes.IWGSP,
  ];

  const getGridClasses = () => {
    if (variant === "compact") {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";
    }
    if (variant === "featured") {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Service
          </h2>
          {showDescription && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select the type of academic support that best fits your needs. Our
              expert providers are ready to help you succeed.
            </p>
          )}
        </div>
      )}

      <div className={getGridClasses()}>
        {services.map((serviceType) => (
          <ServiceCard
            key={serviceType}
            serviceType={serviceType}
            onSelect={onSelectService}
            isSelected={selectedService === serviceType}
            variant={variant}
            showPricing={variant !== "compact"}
            showFeatures={variant !== "compact"}
          />
        ))}
      </div>

   
    </div>
  );
}
