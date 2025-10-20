import React, { useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PlanStatusCard from "./PlanStatusCard";

const ProfileHeader = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio || "",
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
      const success = await onUpdate(formData);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Simulate fetching plan from localStorage
  let plan = null;
  if (typeof window !== "undefined") {
    const planStr = localStorage.getItem("activePlan");
    if (planStr) plan = JSON.parse(planStr);
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <PlanStatusCard plan={plan} />
      {/* Blue background header - increased height and added relative positioning */}
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Profile header background */}
      </div>

      {/* Main content section - adjusted positioning and padding */}
      <div className="relative px-4 py-5 sm:px-6 -mt-20 flex flex-wrap">
        {/* Avatar image - increased ring size and adjusted position */}
        <div className="flex-shrink-0 mb-4 mr-6">
          <img
            src={profile.profileImage || "/images/default-avatar.png"}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="h-24 w-24 rounded-full ring-4 ring-white bg-white object-cover"
          />
        </div>

        {/* Content container with improved spacing */}
        <div className="flex-1 min-w-0 pt-2">
          {!isEditing ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                {profile.email} • Student ID: {profile.id}
              </p>
              <p className="mt-1 text-gray-600 text-sm max-w-2xl">
                {profile.bio || "No bio provided"}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Write a short bio..."
                />
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
