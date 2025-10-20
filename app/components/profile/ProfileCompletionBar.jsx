import React, { useState } from "react";

export default function ProfileCompletionBar({
  percentage = 0,
  missingFields = [],
  onRemind,
  showDetails = true,
}) {
  const isComplete = percentage === 100;
  const [showTooltip, setShowTooltip] = useState(false);

  const getCompletionColor = (percentage) => {
    if (percentage === 100) return "bg-blue-500";
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100)
      return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600";
    if (percentage >= 90) return "bg-gradient-to-r from-green-400 to-green-600";
    if (percentage >= 70)
      return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700";
    if (percentage >= 50)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Profile Completion
        </span>
        <div className="relative flex items-center">
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow ${getCompletionColor(
              percentage
            )} text-white`}
            onMouseEnter={() =>
              showDetails && missingFields.length > 0 && setShowTooltip(true)
            }
            onMouseLeave={() => setShowTooltip(false)}
            style={{
              cursor:
                showDetails && missingFields.length > 0 ? "pointer" : "default",
            }}
          >
            {percentage}%
          </span>
          {showDetails &&
            !isComplete &&
            missingFields.length > 0 &&
            showTooltip && (
              <div className="absolute right-0 top-8 z-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700 animate-fade-in">
                <div className="font-semibold text-blue-700 mb-1">
                  Missing Fields:
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {missingFields.map((field, idx) => (
                    <li key={idx} className="text-gray-600">
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
      <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-sm">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-in-out ${getProgressColor(
            percentage
          )}`}
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center pointer-events-none">
          {isComplete && (
            <span className="text-xs text-white font-medium">
              🎉 Profile Complete!
            </span>
          )}
          {!isComplete && percentage < 40 && (
            <span className="text-xs text-gray-400 font-medium">
              Let's complete your profile!
            </span>
          )}
        </div>
      </div>
      {showDetails && !isComplete && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
            Complete your profile to unlock all features
          </span>
          {onRemind && (
            <button
              className="px-3 py-1 bg-yellow-400 text-white rounded text-xs font-semibold hover:bg-yellow-500 transition"
              onClick={onRemind}
            >
              Remind Me Later
            </button>
          )}
        </div>
      )}
      {showDetails && isComplete && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
            🎉 Profile Complete! You're all set to find your perfect tutor.
          </span>
        </div>
      )}
    </div>
  );
}
