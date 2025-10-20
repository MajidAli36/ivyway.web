import { useState } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

export default function SessionForm({ sessionDetails, onChange, onlineOnly }) {
  const [formData, setFormData] = useState({
    notes: sessionDetails.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    onChange({ [name]: value });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Session Details
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Add any additional information for your tutor
        </p>
      </div>

      {/* Online Mode Indicator - No toggle since it's online only */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <VideoCameraIcon
              className="h-5 w-5 text-blue-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              This will be an online Zoom session. A meeting link will be
              provided before your session.
            </p>
          </div>
        </div>
      </div>

      {/* Notes for tutor */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes for your tutor
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            name="notes"
            rows={5}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-xl px-4 py-3 transition-all duration-200 hover:border-blue-300"
            placeholder="Share what you'd like to focus on in this session..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Let your tutor know about specific topics or questions you want to
          cover.
        </p>
      </div>

      {/* Remove file upload option if it exists */}

      {/* Privacy and preparation notice */}
      <div className="rounded-md bg-gray-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Preparation tips:
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure you have a stable internet connection</li>
                <li>Find a quiet place for your session</li>
                <li>Have your study materials ready</li>
                <li>Test your microphone and camera before the session</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
