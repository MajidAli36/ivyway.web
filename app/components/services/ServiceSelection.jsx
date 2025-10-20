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
    ServiceTypes.COUNSELING,
    ServiceTypes.TEST_PREP,
    ServiceTypes.IWGSP,
  ];

  const getGridClasses = () => {
    if (variant === "compact") {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";
    }
    if (variant === "featured") {
      return "grid grid-cols-1 md:grid-cols-2 gap-8";
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

      {/* Service Comparison */}
      {variant === "featured" && (
        <div className="mt-12 bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Not sure which service is right for you?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Choose Tutoring if you need:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Help with specific subjects (Math, Science, English)</li>
                <li>• Homework assistance and exam preparation</li>
                <li>• Regular academic support and progress tracking</li>
                <li>• Subject-specific expertise and teaching</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">
                Choose Counseling if you need:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Career guidance and academic planning</li>
                <li>• Study strategies and goal setting</li>
                <li>• College preparation and application support</li>
                <li>• Long-term educational guidance</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
