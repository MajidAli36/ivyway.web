"use client";

import React, { useEffect, useRef } from "react";

// Focus management utilities
export const useFocusManagement = () => {
  const focusableElements = [
    "button",
    "input",
    "select",
    "textarea",
    "a[href]",
    "area[href]",
    '[tabindex]:not([tabindex="-1"])',
  ].join(",");

  const trapFocus = (containerRef) => {
    const focusableNodes =
      containerRef.current?.querySelectorAll(focusableElements);
    const firstFocusable = focusableNodes?.[0];
    const lastFocusable = focusableNodes?.[focusableNodes.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus();
          e.preventDefault();
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        // Handle escape key
        return;
      }
      handleTabKey(e);
    };

    return { handleKeyDown };
  };

  const focusFirstElement = (containerRef) => {
    const focusableNodes =
      containerRef.current?.querySelectorAll(focusableElements);
    focusableNodes?.[0]?.focus();
  };

  const focusLastElement = (containerRef) => {
    const focusableNodes =
      containerRef.current?.querySelectorAll(focusableElements);
    const lastElement = focusableNodes?.[focusableNodes.length - 1];
    lastElement?.focus();
  };

  return {
    trapFocus,
    focusFirstElement,
    focusLastElement,
  };
};

// ARIA utilities
export const useAriaAttributes = () => {
  const generateId = (prefix = "element") => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getAriaDescribedBy = (id) => {
    return `${id}-description`;
  };

  const getAriaLabelledBy = (id) => {
    return `${id}-label`;
  };

  const getAriaErrorMessage = (id) => {
    return `${id}-error`;
  };

  return {
    generateId,
    getAriaDescribedBy,
    getAriaLabelledBy,
    getAriaErrorMessage,
  };
};

// Screen reader utilities
export const useScreenReader = () => {
  const announceToScreenReader = (message, priority = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const announceError = (message) => {
    announceToScreenReader(message, "assertive");
  };

  const announceSuccess = (message) => {
    announceToScreenReader(message, "polite");
  };

  return {
    announceToScreenReader,
    announceError,
    announceSuccess,
  };
};

// Keyboard navigation utilities
export const useKeyboardNavigation = () => {
  const handleArrowKeys = (e, items, currentIndex, onSelect) => {
    if (!items || items.length === 0) return;

    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect?.(currentIndex);
        break;
      default:
        return;
    }

    return newIndex;
  };

  const handleEscapeKey = (e, onEscape) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onEscape?.();
    }
  };

  return {
    handleArrowKeys,
    handleEscapeKey,
  };
};

// Accessible form utilities
export const useAccessibleForm = () => {
  const { generateId, getAriaDescribedBy, getAriaErrorMessage } =
    useAriaAttributes();
  const { announceError } = useScreenReader();

  const createFieldProps = (fieldName, error, required = false) => {
    const fieldId = generateId(fieldName);
    const errorId = getAriaErrorMessage(fieldId);
    const describedBy = getAriaDescribedBy(fieldId);

    return {
      id: fieldId,
      name: fieldName,
      required,
      "aria-invalid": !!error,
      "aria-describedby": error ? errorId : describedBy,
      "aria-required": required,
    };
  };

  const createErrorProps = (fieldId) => {
    const errorId = getAriaErrorMessage(fieldId);
    return {
      id: errorId,
      role: "alert",
      "aria-live": "polite",
    };
  };

  const announceFieldError = (fieldName, error) => {
    if (error) {
      announceError(`${fieldName}: ${error}`);
    }
  };

  return {
    createFieldProps,
    createErrorProps,
    announceFieldError,
  };
};

// Accessible button component
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "default",
  className = "",
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const { announceToScreenReader } = useScreenReader();

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    onClick?.(e);

    if (ariaLabel) {
      announceToScreenReader(`Button clicked: ${ariaLabel}`);
    }
  };

  const getVariantClasses = () => {
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      default: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };
    return sizes[size] || sizes.default;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// Accessible input component
export const AccessibleInput = ({
  label,
  error,
  required = false,
  type = "text",
  className = "",
  ...props
}) => {
  const { createFieldProps, createErrorProps } = useAccessibleForm();
  const fieldProps = createFieldProps(props.name || "input", error, required);
  const errorProps = createErrorProps(fieldProps.id);

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={fieldProps.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          block w-full border rounded-md shadow-sm
          focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-300" : "border-gray-300"}
          ${className}
        `}
        {...fieldProps}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600" {...errorProps}>
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible select component
export const AccessibleSelect = ({
  label,
  error,
  required = false,
  options = [],
  placeholder,
  className = "",
  ...props
}) => {
  const { createFieldProps, createErrorProps } = useAccessibleForm();
  const fieldProps = createFieldProps(props.name || "select", error, required);
  const errorProps = createErrorProps(fieldProps.id);

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={fieldProps.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          block w-full border rounded-md shadow-sm
          focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-300" : "border-gray-300"}
          ${className}
        `}
        {...fieldProps}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600" {...errorProps}>
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible textarea component
export const AccessibleTextarea = ({
  label,
  error,
  required = false,
  rows = 3,
  className = "",
  ...props
}) => {
  const { createFieldProps, createErrorProps } = useAccessibleForm();
  const fieldProps = createFieldProps(
    props.name || "textarea",
    error,
    required
  );
  const errorProps = createErrorProps(fieldProps.id);

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={fieldProps.id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`
          block w-full border rounded-md shadow-sm
          focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-300" : "border-gray-300"}
          ${className}
        `}
        {...fieldProps}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600" {...errorProps}>
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible modal component
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  ...props
}) => {
  const modalRef = useRef(null);
  const { trapFocus, focusFirstElement } = useFocusManagement();
  const { announceToScreenReader } = useScreenReader();

  useEffect(() => {
    if (isOpen) {
      focusFirstElement(modalRef);
      announceToScreenReader(`Modal opened: ${title}`);
    }
  }, [isOpen, title, announceToScreenReader]);

  const { handleKeyDown } = trapFocus(modalRef);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div
          ref={modalRef}
          onKeyDown={handleKeyDown}
          className={className}
          {...props}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Skip to content link
export const SkipToContent = ({ targetId = "main-content" }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
    >
      Skip to main content
    </a>
  );
};

// Screen reader only text
export const ScreenReaderOnly = ({ children }) => {
  return <span className="sr-only">{children}</span>;
};

export default {
  useFocusManagement,
  useAriaAttributes,
  useScreenReader,
  useKeyboardNavigation,
  useAccessibleForm,
  AccessibleButton,
  AccessibleInput,
  AccessibleSelect,
  AccessibleTextarea,
  AccessibleModal,
  SkipToContent,
  ScreenReaderOnly,
};
