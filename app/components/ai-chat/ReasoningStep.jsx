"use client";

import { useState } from "react";
import {
  LightBulbIcon,
  CogIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ReasoningStep({ step, isExpanded = true, onToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(!isExpanded);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) onToggle();
  };

  const getStatusIcon = (success) => {
    if (success === undefined)
      return <ClockIcon className="h-4 w-4 text-blue-500" />;
    if (success) return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (success) => {
    if (success === undefined) return "Executing";
    if (success) return "Completed";
    return "Failed";
  };

  const getStatusColor = (success) => {
    if (success === undefined)
      return "text-blue-600 bg-blue-50 border-blue-200";
    if (success) return "text-green-600 bg-green-50 border-green-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatExecutionTime = (time) => {
    if (!time) return "";
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  const formatTokens = (tokens) => {
    if (!tokens) return "";
    return `${tokens.input || 0} in, ${tokens.output || 0} out (${
      tokens.total || 0
    } total)`;
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-sm">
      {/* Step Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
            {step.stepNumber}
          </div>

          <div className="flex items-center space-x-2">
            {getStatusIcon(step.success)}
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                step.success
              )}`}
            >
              {getStatusText(step.success)}
            </span>
          </div>

          {step.executionTime && (
            <span className="text-xs text-gray-500">
              {formatExecutionTime(step.executionTime)}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {step.tokens && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {formatTokens(step.tokens)}
            </span>
          )}

          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Step Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Thought */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Thought
                </h4>
                <p className="text-sm text-blue-700">{step.thought}</p>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CogIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Action
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Name:</span>{" "}
                    {step.action.name}
                  </p>
                  {step.action.parameters &&
                    Object.keys(step.action.parameters).length > 0 && (
                      <div>
                        <p className="text-sm text-yellow-700 font-medium mb-1">
                          Parameters:
                        </p>
                        <div className="bg-white bg-opacity-50 rounded p-2">
                          <pre className="text-xs text-yellow-800 whitespace-pre-wrap">
                            {JSON.stringify(step.action.parameters, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Observation */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <EyeIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 mb-1">
                  Observation
                </h4>
                <p className="text-sm text-gray-700">{step.observation}</p>
              </div>
            </div>
          </div>

          {/* Error Details (if failed) */}
          {step.success === false && step.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Error
                  </h4>
                  <p className="text-sm text-red-700">{step.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
