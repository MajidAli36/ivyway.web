"use client";

import { useState, useEffect } from "react";
import { ExclamationTriangleIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

const TwoWeekRestriction = ({ availabilityData, onAvailabilityChange }) => {
  const [currentWeek, setCurrentWeek] = useState(null);
  const [secondWeek, setSecondWeek] = useState(null);
  const [isCurrentWeekLocked, setIsCurrentWeekLocked] = useState(true);

  useEffect(() => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    
    const secondWeekStart = new Date(currentWeekStart);
    secondWeekStart.setDate(currentWeekStart.getDate() + 7);
    
    setCurrentWeek(currentWeekStart);
    setSecondWeek(secondWeekStart);
  }, []);

  const isDateInCurrentWeek = (date) => {
    if (!currentWeek) return false;
    const checkDate = new Date(date);
    const weekEnd = new Date(currentWeek);
    weekEnd.setDate(currentWeek.getDate() + 6);
    
    return checkDate >= currentWeek && checkDate <= weekEnd;
  };

  const isDateInSecondWeek = (date) => {
    if (!secondWeek) return false;
    const checkDate = new Date(date);
    const weekEnd = new Date(secondWeek);
    weekEnd.setDate(secondWeek.getDate() + 6);
    
    return checkDate >= secondWeek && checkDate <= weekEnd;
  };

  const canEditAvailability = (date) => {
    return isDateInSecondWeek(date) || !isDateInCurrentWeek(date);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Two-Week Availability Rule</h3>
      </div>
      
      <div className="space-y-4">
        {/* Current Week - Locked */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Current Week (Locked)</h4>
          </div>
          <p className="text-sm text-red-700 mb-2">
            {currentWeek && `Week of ${formatDate(currentWeek)}`}
          </p>
          <p className="text-xs text-red-600">
            You cannot modify availability for the current week to prevent last-minute changes.
          </p>
        </div>

        {/* Second Week - Editable */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-green-800">Second Week (Editable)</h4>
          </div>
          <p className="text-sm text-green-700 mb-2">
            {secondWeek && `Week of ${formatDate(secondWeek)}`}
          </p>
          <p className="text-xs text-green-600">
            You can modify availability for next week and beyond.
          </p>
        </div>

        {/* Availability Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Availability Status</h4>
          <div className="space-y-2">
            {availabilityData?.map((slot, index) => {
              const slotDate = new Date(slot.date || slot.startDate);
              const isEditable = canEditAvailability(slotDate);
              
              return (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    isEditable 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-red-100 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDate(slotDate)}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {isEditable ? (
                      <span className="text-xs text-green-600 font-medium">Editable</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This restriction ensures students can rely on your posted availability and prevents 
                last-minute schedule changes that could impact their learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoWeekRestriction;

