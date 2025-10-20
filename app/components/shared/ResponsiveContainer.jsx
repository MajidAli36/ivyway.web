"use client";

import React from "react";

// Responsive container component
export const ResponsiveContainer = ({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "default",
  ...props
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-2 sm:px-4",
    default: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12",
  };

  const baseClasses = "mx-auto w-full";
  const maxWidthClass = maxWidthClasses[maxWidth] || maxWidthClasses["7xl"];
  const paddingClass = paddingClasses[padding] || paddingClasses.default;

  return (
    <div
      className={`${baseClasses} ${maxWidthClass} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive grid component
export const ResponsiveGrid = ({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = "default",
  className = "",
  ...props
}) => {
  const gapClasses = {
    none: "",
    sm: "gap-2",
    default: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8",
  };

  const getGridCols = () => {
    const colClasses = [];

    if (cols.default) colClasses.push(`grid-cols-${cols.default}`);
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);
    if (cols["2xl"]) colClasses.push(`2xl:grid-cols-${cols["2xl"]}`);

    return colClasses.join(" ");
  };

  const gapClass = gapClasses[gap] || gapClasses.default;
  const gridColsClass = getGridCols();

  return (
    <div
      className={`grid ${gridColsClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive card component
export const ResponsiveCard = ({
  children,
  padding = "default",
  shadow = "default",
  rounded = "default",
  className = "",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3 sm:p-4",
    default: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    default: "shadow",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    default: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };

  const paddingClass = paddingClasses[padding] || paddingClasses.default;
  const shadowClass = shadowClasses[shadow] || shadowClasses.default;
  const roundedClass = roundedClasses[rounded] || roundedClasses.default;

  return (
    <div
      className={`bg-white ${paddingClass} ${shadowClass} ${roundedClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive table component
export const ResponsiveTable = ({ children, className = "", ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

// Responsive form component
export const ResponsiveForm = ({ children, className = "", ...props }) => {
  return (
    <form className={`space-y-4 sm:space-y-6 ${className}`} {...props}>
      {children}
    </form>
  );
};

// Responsive form group component
export const ResponsiveFormGroup = ({
  children,
  cols = { default: 1, sm: 2 },
  gap = "default",
  className = "",
  ...props
}) => {
  const gapClasses = {
    none: "",
    sm: "gap-2",
    default: "gap-4",
    lg: "gap-6",
  };

  const getGridCols = () => {
    const colClasses = [];

    if (cols.default) colClasses.push(`grid-cols-${cols.default}`);
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);

    return colClasses.join(" ");
  };

  const gapClass = gapClasses[gap] || gapClasses.default;
  const gridColsClass = getGridCols();

  return (
    <div
      className={`grid ${gridColsClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive button group component
export const ResponsiveButtonGroup = ({
  children,
  direction = "horizontal",
  spacing = "default",
  className = "",
  ...props
}) => {
  const directionClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  const spacingClasses = {
    none: "",
    sm: "space-x-2 sm:space-x-3",
    default: "space-x-3 sm:space-x-4",
    lg: "space-x-4 sm:space-x-6",
  };

  const verticalSpacingClasses = {
    none: "",
    sm: "space-y-2 sm:space-y-3",
    default: "space-y-3 sm:space-y-4",
    lg: "space-y-4 sm:space-y-6",
  };

  const directionClass =
    directionClasses[direction] || directionClasses.horizontal;
  const spacingClass =
    direction === "vertical"
      ? verticalSpacingClasses[spacing] || verticalSpacingClasses.default
      : spacingClasses[spacing] || spacingClasses.default;

  return (
    <div
      className={`flex ${directionClass} ${spacingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Responsive text component
export const ResponsiveText = ({
  children,
  size = "default",
  weight = "default",
  color = "default",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    default: "text-sm sm:text-base",
    lg: "text-base sm:text-lg",
    xl: "text-lg sm:text-xl",
    "2xl": "text-xl sm:text-2xl",
    "3xl": "text-2xl sm:text-3xl",
  };

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    default: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    default: "text-gray-900",
    muted: "text-gray-600",
    light: "text-gray-500",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.default;
  const weightClass = weightClasses[weight] || weightClasses.default;
  const colorClass = colorClasses[color] || colorClasses.default;

  return (
    <span
      className={`${sizeClass} ${weightClass} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Responsive modal component
export const ResponsiveModal = ({
  children,
  isOpen,
  onClose,
  size = "default",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "w-11/12 sm:w-1/2 md:w-1/3",
    default: "w-11/12 md:w-3/4 lg:w-1/2",
    lg: "w-11/12 md:w-4/5 lg:w-3/4",
    xl: "w-11/12 md:w-5/6 lg:w-4/5",
    full: "w-full h-full",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.default;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border shadow-lg rounded-md bg-white">
        <div className={`${sizeClass} ${className}`} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Responsive navigation component
export const ResponsiveNav = ({ children, className = "", ...props }) => {
  return (
    <nav
      className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 ${className}`}
      {...props}
    >
      {children}
    </nav>
  );
};

// Responsive sidebar component
export const ResponsiveSidebar = ({
  children,
  isOpen,
  onClose,
  className = "",
  ...props
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

// Responsive stats component
export const ResponsiveStats = ({
  stats,
  cols = { default: 1, sm: 2, lg: 4 },
  className = "",
  ...props
}) => {
  return (
    <ResponsiveGrid cols={cols} className={className} {...props}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ResponsiveGrid>
  );
};

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveTable,
  ResponsiveForm,
  ResponsiveFormGroup,
  ResponsiveButtonGroup,
  ResponsiveText,
  ResponsiveModal,
  ResponsiveNav,
  ResponsiveSidebar,
  ResponsiveStats,
};
