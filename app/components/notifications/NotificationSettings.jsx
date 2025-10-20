"use client";

import { useState, useEffect } from "react";
import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";

const NOTIFICATION_TYPES = [
  {
    id: "teacher_profile_approved",
    name: "Profile Approved",
    description: "When your teacher profile is approved",
    defaultEnabled: true
  },
  {
    id: "teacher_profile_rejected", 
    name: "Profile Rejected",
    description: "When your teacher profile is rejected",
    defaultEnabled: true
  },
  {
    id: "student_referral_approved",
    name: "Student Referral Approved",
    description: "When your student referral is approved",
    defaultEnabled: true
  },
  {
    id: "student_referral_rejected",
    name: "Student Referral Rejected", 
    description: "When your student referral is rejected",
    defaultEnabled: true
  },
  {
    id: "teacher_assignment_approved",
    name: "Assignment Approved",
    description: "When your assignment is approved",
    defaultEnabled: true
  },
  {
    id: "teacher_assignment_rejected",
    name: "Assignment Rejected",
    description: "When your assignment is rejected", 
    defaultEnabled: true
  },
  {
    id: "teacher_assignment_updated",
    name: "Assignment Updated",
    description: "When your assignment is updated",
    defaultEnabled: true
  },
  {
    id: "teacher_assignment_cancelled",
    name: "Assignment Cancelled",
    description: "When your assignment is cancelled",
    defaultEnabled: true
  }
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Load from localStorage or API
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        // Set defaults
        const defaultSettings = {};
        NOTIFICATION_TYPES.forEach(type => {
          defaultSettings[type.id] = {
            inApp: type.defaultEnabled,
            email: type.defaultEnabled,
            push: false
          };
        });
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (typeId, channel, enabled) => {
    setSettings(prev => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        [channel]: enabled
      }
    }));
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Save to localStorage or API
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {};
    NOTIFICATION_TYPES.forEach(type => {
      defaultSettings[type.id] = {
        inApp: type.defaultEnabled,
        email: type.defaultEnabled,
        push: false
      };
    });
    setSettings(defaultSettings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
            <p className="text-gray-600">
              Choose how you want to be notified about different activities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={resetToDefaults}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset to defaults
            </button>
            <button
              onClick={saveSettings}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saved && <CheckIcon className="h-4 w-4 mr-2" />}
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Notification Types</h2>
          <p className="text-sm text-gray-600">
            Configure which notifications you want to receive and how
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {NOTIFICATION_TYPES.map((type) => (
            <div key={type.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </p>
                </div>
                
                <div className="ml-6 flex space-x-6">
                  {/* In-App Notifications */}
                  <div className="flex items-center">
                    <input
                      id={`${type.id}-inapp`}
                      type="checkbox"
                      checked={settings[type.id]?.inApp || false}
                      onChange={(e) => updateSetting(type.id, 'inApp', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${type.id}-inapp`} className="ml-2 text-sm text-gray-700">
                      In-app
                    </label>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center">
                    <input
                      id={`${type.id}-email`}
                      type="checkbox"
                      checked={settings[type.id]?.email || false}
                      onChange={(e) => updateSetting(type.id, 'email', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${type.id}-email`} className="ml-2 text-sm text-gray-700">
                      Email
                    </label>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center">
                    <input
                      id={`${type.id}-push`}
                      type="checkbox"
                      checked={settings[type.id]?.push || false}
                      onChange={(e) => updateSetting(type.id, 'push', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`${type.id}-push`} className="ml-2 text-sm text-gray-700">
                      Push
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Global Settings</h2>
        
        <div className="space-y-4">
          {/* Quiet Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiet Hours
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="time"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start time"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="End time"
              />
              <span className="text-sm text-gray-600">
                (No notifications during these hours)
              </span>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Frequency
            </label>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly digest</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly digest</option>
            </select>
          </div>

          {/* Sound */}
          <div className="flex items-center">
            <input
              id="notification-sound"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notification-sound" className="ml-2 text-sm text-gray-700">
              Play sound for new notifications
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saved && <CheckIcon className="h-5 w-5 mr-2" />}
          {saved ? "Settings Saved!" : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}
