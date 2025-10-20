import React, { useState } from "react";

const TutoringPreferences = ({ preferences, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    subjects: preferences.subjects.join(", "),
    availability: preferences.availability.join(", "),
    preferredFormat: preferences.preferredFormat,
    notes: preferences.notes || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Format the data properly before submission
      const formattedData = {
        ...formData,
        subjects: formData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        availability: formData.availability
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      const success = await onUpdate(formattedData);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-green-600 text-white">
        <h3 className="text-lg font-medium">Tutoring Preferences</h3>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                Preferred Subjects
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {preferences.subjects.join(", ") || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Availability
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {preferences.availability.join(", ") || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Preferred Format
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {preferences.preferredFormat || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Additional Notes
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {preferences.notes || "—"}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="subjects"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred Subjects
              </label>
              <input
                type="text"
                name="subjects"
                id="subjects"
                value={formData.subjects}
                onChange={handleChange}
                placeholder="E.g., Math, Physics, Programming (comma separated)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-gray-700"
              >
                Availability
              </label>
              <input
                type="text"
                name="availability"
                id="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="E.g., Monday afternoons, Weekends (comma separated)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="preferredFormat"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred Format
              </label>
              <select
                name="preferredFormat"
                id="preferredFormat"
                value={formData.preferredFormat}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional requests or information for tutors..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TutoringPreferences;
