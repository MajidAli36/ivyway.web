"use client";

import { CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

export default function MockDataDisplay() {
  const mockEligibility = {
    isEligible: false,
    requirements: {
      completedSessions: 0,
      requiredSessions: 20,
      averageRating: 0,
      requiredRating: 4.0,
      profileCompletion: 67,
      requiredProfileCompletion: 80,
      hasActiveApplication: false,
      lastRejectionDate: null,
      canReapply: true
    },
    missingRequirements: [
      "Complete 20 more sessions",
      "Improve rating to 4.0 (current: 0.00)",
      "Complete profile to 80% (current: 67%)"
    ]
  };

  const mockStats = {
    completedSessions: 15,
    totalEarnings: 375.00,
    averageRating: 4.2,
    profileCompletion: 67,
    upgradeApplicationStatus: "none",
    tutorType: "regular",
    currentHourlyRate: 25.00,
    potentialAdvancedRate: 35.00,
    totalReviews: 8,
    recentSessions: 3
  };

  const mockBonusStats = {
    totalBonus: 125.50,
    monthlyBonus: 45.00,
    ratingBonus: 60.00,
    sessionBonus: 20.50
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Upgrade Eligibility</h3>
          <div className="flex items-center">
            {mockEligibility.isEligible ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              mockEligibility.isEligible ? 'text-green-600' : 'text-red-600'
            }`}>
              {mockEligibility.isEligible ? 'Eligible' : 'Not Eligible'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <ClockIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {mockEligibility.requirements.completedSessions} / {mockEligibility.requirements.requiredSessions}
              </div>
              <div className="text-xs text-gray-500">Sessions Completed</div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <AcademicCapIcon className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {mockEligibility.requirements.averageRating} / {mockEligibility.requirements.requiredRating}
              </div>
              <div className="text-xs text-gray-500">Average Rating</div>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <UserIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {mockEligibility.requirements.profileCompletion}% / {mockEligibility.requirements.requiredProfileCompletion}%
              </div>
              <div className="text-xs text-gray-500">Profile Completion</div>
            </div>
          </div>
        </div>

        {mockEligibility.missingRequirements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Requirements to Meet:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {mockEligibility.missingRequirements.map((requirement, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Statistics Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tutor Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{mockStats.completedSessions}</div>
            <div className="text-sm text-blue-800">Sessions Completed</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(mockStats.totalEarnings)}</div>
            <div className="text-sm text-green-800">Total Earnings</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{mockStats.averageRating}</div>
            <div className="text-sm text-purple-800">Average Rating</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{mockStats.profileCompletion}%</div>
            <div className="text-sm text-orange-800">Profile Complete</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Current Rate</div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(mockStats.currentHourlyRate)}/hour</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Potential Advanced Rate</div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(mockStats.potentialAdvancedRate)}/hour</div>
          </div>
        </div>
      </div>

      {/* Bonus Statistics Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bonus Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(mockBonusStats.totalBonus)}</div>
            <div className="text-sm text-blue-800">Total Bonus</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(mockBonusStats.monthlyBonus)}</div>
            <div className="text-sm text-green-800">This Month</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(mockBonusStats.ratingBonus)}</div>
            <div className="text-sm text-purple-800">Rating Bonus</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(mockBonusStats.sessionBonus)}</div>
            <div className="text-sm text-orange-800">Session Bonus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
