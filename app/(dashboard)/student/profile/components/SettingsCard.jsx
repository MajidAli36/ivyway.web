import React, { useState } from "react";

const SettingsCard = ({ settings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications:
      settings?.emailNotifications ?? settings?.emailUpdates ?? true,
    textNotifications:
      settings?.textNotifications ?? settings?.smsAlerts ?? false,
    calendarIntegration: settings?.calendarIntegration ?? true,
    language: settings?.language ?? "English",
    theme: settings?.theme ?? settings?.darkMode ? "dark" : "light",
    accessibility: settings?.accessibility ?? {},
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const success = await onUpdate(formData);

      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-blue-600 text-white">
        <h3 className="text-lg font-medium">Account Settings</h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Email Notifications
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings?.emailNotifications || settings?.emailUpdates
                  ? "Enabled"
                  : "Disabled"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Text Notifications
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings?.textNotifications || settings?.smsAlerts
                  ? "Enabled"
                  : "Disabled"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Calendar Integration
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings?.calendarIntegration ? "Enabled" : "Disabled"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Language</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {settings?.language || "English"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Theme</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {settings?.theme || (settings?.darkMode ? "Dark" : "Light")}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900">
              Security Options
            </h4>

            <div className="mt-4 flex items-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </button>

              <button
                type="button"
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">
                Notifications
              </legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="emailNotifications"
                      className="font-medium text-gray-700"
                    >
                      Email notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for important updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="textNotifications"
                      name="textNotifications"
                      type="checkbox"
                      checked={formData.textNotifications}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="textNotifications"
                      className="font-medium text-gray-700"
                    >
                      Text message notifications
                    </label>
                    <p className="text-gray-500">
                      Receive text notifications for appointment reminders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="calendarIntegration"
                      name="calendarIntegration"
                      type="checkbox"
                      checked={formData.calendarIntegration}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="calendarIntegration"
                      className="font-medium text-gray-700"
                    >
                      Calendar Integration
                    </label>
                    <p className="text-gray-500">
                      Automatically add tutoring sessions to your calendar.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Language
                </label>
                <select
                  name="language"
                  id="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-gray-700"
                >
                  Theme
                </label>
                <select
                  name="theme"
                  id="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsCard;
