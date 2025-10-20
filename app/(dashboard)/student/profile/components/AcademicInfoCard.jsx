import React, { useState } from "react";

const AcademicInfoCard = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    program: profile.program,
    major: profile.major || "",
    gpa: profile.gpa || "",
    graduationYear: profile.graduationYear || "",
    enrollmentDate: profile.enrollmentDate || "",
    academicStanding: profile.academicStanding || "",
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

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-blue-600 text-white">
        <h3 className="text-lg font-medium">Academic Information</h3>
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
              <dt className="text-sm font-medium text-gray-500">Program</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.program}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Major</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.major || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Current GPA</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.gpa || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Expected Graduation
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.graduationYear || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Enrollment Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.enrollmentDate || "—"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">
                Academic Standing
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.academicStanding || "—"}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="program"
                className="block text-sm font-medium text-gray-700"
              >
                Program
              </label>
              <select
                name="program"
                id="program"
                value={formData.program}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="">Select Program</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="PhD">PhD</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="major"
                className="block text-sm font-medium text-gray-700"
              >
                Major
              </label>
              <input
                type="text"
                name="major"
                id="major"
                value={formData.major}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="gpa"
                className="block text-sm font-medium text-gray-700"
              >
                Current GPA
              </label>
              <input
                type="text"
                name="gpa"
                id="gpa"
                value={formData.gpa}
                onChange={handleChange}
                placeholder="e.g., 3.75"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700"
              >
                Expected Graduation
              </label>
              <input
                type="text"
                name="graduationYear"
                id="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g., 2025"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="enrollmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Enrollment Date
              </label>
              <input
                type="date"
                name="enrollmentDate"
                id="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="academicStanding"
                className="block text-sm font-medium text-gray-700"
              >
                Academic Standing
              </label>
              <select
                name="academicStanding"
                id="academicStanding"
                value={formData.academicStanding}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Standing</option>
                <option value="Good Standing">Good Standing</option>
                <option value="Academic Probation">Academic Probation</option>
                <option value="Dean's List">Dean's List</option>
                <option value="Honors">Honors</option>
              </select>
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

export default AcademicInfoCard;
