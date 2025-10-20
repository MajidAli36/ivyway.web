"use client";

import { useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

/**
 * Overview Cards Component
 * Displays key metrics in card format with visual indicators and trends
 */
export default function OverviewCards({
  stats,
  loading = false,
  error = null,
  onCardClick = null,
  className = "",
}) {
  const [hoveredCard, setHoveredCard] = useState(null);

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow-md rounded-xl animate-pulse"
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-full bg-gray-200 p-2">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Error loading stats
            </h3>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div
        className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${className}`}
      >
        <div className="flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-gray-800">
              No stats available
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              No data to display at the moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getTrendColor = (trend) => {
    if (trend === undefined || trend === null || isNaN(trend)) return "text-gray-500";
    return trend > 0
      ? "text-green-600"
      : trend < 0
      ? "text-red-600"
      : "text-gray-500";
  };

  const getTrendIcon = (trend) => {
    if (trend === undefined || trend === null || isNaN(trend)) return null;
    return trend > 0 ? (
      <ArrowUpIcon className="h-4 w-4" />
    ) : trend < 0 ? (
      <ArrowDownIcon className="h-4 w-4" />
    ) : null;
  };

  const getCardBackground = (index) => {
    const backgrounds = [
      "bg-gradient-to-br from-blue-50 to-blue-100",
      "bg-gradient-to-br from-green-50 to-green-100",
      "bg-gradient-to-br from-purple-50 to-purple-100",
      "bg-gradient-to-br from-orange-50 to-orange-100",
      "bg-gradient-to-br from-pink-50 to-pink-100",
      "bg-gradient-to-br from-indigo-50 to-indigo-100",
    ];
    return backgrounds[index % backgrounds.length];
  };

  const getIconBackground = (index) => {
    const backgrounds = [
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-orange-100",
      "bg-pink-100",
      "bg-indigo-100",
    ];
    return backgrounds[index % backgrounds.length];
  };

  const getIconColor = (index) => {
    const colors = [
      "text-blue-600",
      "text-green-600",
      "text-purple-600",
      "text-orange-600",
      "text-pink-600",
      "text-indigo-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isClickable = onCardClick && stat.clickable !== false;

        return (
          <div
            key={stat.name}
            className={`
              bg-white overflow-hidden shadow-md rounded-xl transition-all duration-200
              ${isClickable ? "cursor-pointer hover:shadow-lg" : ""}
              ${
                hoveredCard === index
                  ? "transform scale-105"
                  : "transform hover:scale-[1.02]"
              }
              ${getCardBackground(index)}
            `}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => isClickable && onCardClick(stat)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-full p-2 ${getIconBackground(
                      index
                    )}`}
                  >
                    {Icon && (
                      <Icon className={`h-5 w-5 ${getIconColor(index)}`} />
                    )}
                  </div>
                  <div className="ml-2 flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-600 truncate">
                      {stat.name}
                    </div>
                    <div className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                      {stat.value}
                    </div>
                  </div>
                </div>

                {/* Trend indicator */}
                {stat.trend !== undefined && stat.trend !== null && !isNaN(stat.trend) && (
                  <div
                    className={`flex items-center ${getTrendColor(stat.trend)}`}
                  >
                    {getTrendIcon(stat.trend)}
                    {stat.trend !== 0 && (
                      <span className="text-xs font-medium ml-1">
                        {Math.abs(stat.trend)}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Additional info */}
              {stat.description && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 leading-tight">
                    {stat.description}
                  </p>
                </div>
              )}

              {/* Progress bar for progress-type stats */}
              {stat.progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        stat.progress >= 80
                          ? "bg-green-500"
                          : stat.progress >= 60
                          ? "bg-blue-500"
                          : stat.progress >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(stat.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Status indicator */}
              {stat.status && (
                <div className="mt-2">
                  <span
                    className={`
                    inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      stat.status === "good"
                        ? "bg-green-100 text-green-800"
                        : stat.status === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : stat.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  `}
                  >
                    {stat.statusText || stat.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Specialized card components for different metric types
 */
export const MetricCard = ({
  title,
  value,
  icon,
  trend,
  description,
  onClick,
}) => (
  <OverviewCards
    stats={[
      {
        name: title,
        value,
        icon,
        trend,
        description,
        clickable: !!onClick,
      },
    ]}
    onCardClick={onClick ? () => onClick() : null}
  />
);

export const ProgressCard = ({ title, value, progress, icon, onClick }) => (
  <OverviewCards
    stats={[
      {
        name: title,
        value,
        progress,
        icon,
        clickable: !!onClick,
      },
    ]}
    onCardClick={onClick ? () => onClick() : null}
  />
);

export const StatusCard = ({
  title,
  value,
  status,
  statusText,
  icon,
  onClick,
}) => (
  <OverviewCards
    stats={[
      {
        name: title,
        value,
        status,
        statusText,
        icon,
        clickable: !!onClick,
      },
    ]}
    onCardClick={onClick ? () => onClick() : null}
  />
);
