"use client";

import { useState, useEffect } from "react";
import { 
  ClockIcon, 
  PlusIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

const TimeAddOns = ({ 
  sessionId, 
  sessionType, 
  currentDuration, 
  providerType, 
  onAddTime, 
  onCancel 
}) => {
  const [selectedIncrement, setSelectedIncrement] = useState(10);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  // Pricing configuration based on provider type
  const pricingConfig = {
    regular_tutor: {
      studentCostPer10Min: 11.50,
      providerEarningsPer10Min: 5.50,
      baseHourlyRate: 69.99
    },
    advanced_tutor: {
      studentCostPer10Min: 16.50,
      providerEarningsPer10Min: 7.50,
      baseHourlyRate: 99.99
    },
    counselor: {
      studentCostPer10Min: 10.00,
      providerEarningsPer10Min: 5.00,
      baseHourlyRate: 30.00 // for 30min session
    }
  };

  const incrementOptions = [10, 20, 30, 40, 50, 60]; // 10-minute increments up to 60 minutes
  const config = pricingConfig[providerType] || pricingConfig.regular_tutor;

  const calculateCosts = (increment) => {
    const multiplier = increment / 10;
    return {
      studentCost: (config.studentCostPer10Min * multiplier).toFixed(2),
      providerEarnings: (config.providerEarningsPer10Min * multiplier).toFixed(2),
      totalDuration: currentDuration + increment
    };
  };

  const handleRequestAddOn = async () => {
    setIsRequesting(true);
    setRequestStatus('pending');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const costs = calculateCosts(selectedIncrement);
      
      // In real implementation, this would call the API
      const addOnData = {
        sessionId,
        additionalMinutes: selectedIncrement,
        studentCost: parseFloat(costs.studentCost),
        providerEarnings: parseFloat(costs.providerEarnings),
        newTotalDuration: costs.totalDuration,
        status: 'pending_approval'
      };

      console.log('Add-on request:', addOnData);
      
      setRequestStatus('success');
      onAddTime(addOnData);
      
    } catch (error) {
      setRequestStatus('error');
      console.error('Error requesting add-on:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const costs = calculateCosts(selectedIncrement);

  if (requestStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-800">Add-On Request Sent</h3>
        </div>
        <p className="text-green-700 mb-4">
          Your request for {selectedIncrement} additional minutes has been sent to your {providerType === 'counselor' ? 'counselor' : 'tutor'}. 
          They will be notified and can approve or decline the request.
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-gray-800 mb-2">Request Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Additional Time:</span>
              <span className="font-medium">{selectedIncrement} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Your Cost:</span>
              <span className="font-medium">${costs.studentCost}</span>
            </div>
            <div className="flex justify-between">
              <span>New Total Duration:</span>
              <span className="font-medium">{costs.totalDuration} minutes</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Request Additional Time</h3>
      </div>

      <div className="space-y-6">
        {/* Current Session Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Current Session</h4>
          <div className="flex justify-between text-sm">
            <span>Duration:</span>
            <span className="font-medium">{currentDuration} minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Type:</span>
            <span className="font-medium capitalize">{providerType.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Time Increment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Additional Time (10-minute increments)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {incrementOptions.map((increment) => (
              <button
                key={increment}
                onClick={() => setSelectedIncrement(increment)}
                className={`p-3 text-sm font-medium rounded-lg border ${
                  selectedIncrement === increment
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                +{increment} min
              </button>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-3">Cost Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Additional Time:</span>
              <span className="font-medium">{selectedIncrement} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Your Cost:</span>
              <span className="font-medium text-green-600">${costs.studentCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>New Total Duration:</span>
              <span className="font-medium">{costs.totalDuration} minutes</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total Additional Cost:</span>
                <span className="text-green-600">${costs.studentCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Notification */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Provider Notification</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your {providerType === 'counselor' ? 'counselor' : 'tutor'} will be notified that they will earn 
                <span className="font-medium"> ${costs.providerEarnings}</span> for the additional time before they approve the request.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleRequestAddOn}
            disabled={isRequesting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRequesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Requesting...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Request Add-On
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeAddOns;
