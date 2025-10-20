import React from "react";
import {
  XMarkIcon,
  PlusIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function EducationForm({ education, onChange, isEditing }) {
  // Ensure education is always an array
  const educationArray = Array.isArray(education) ? education : [];

  const addEducation = () => {
    const newEducation = [
      ...educationArray,
      { degree: "", institution: "", year: new Date().getFullYear() },
    ];
    onChange(newEducation);
  };

  const removeEducation = (index) => {
    const newEducation = educationArray.filter((_, i) => i !== index);
    onChange(newEducation);
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...educationArray];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange(newEducation);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-[#243b53]">Education</h3>
        </div>
        {educationArray.length > 0 ? (
          <div className="space-y-4">
            {educationArray.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900 text-lg">
                    {edu.degree || "Degree not specified"}
                  </div>
                  <div className="text-gray-600">
                    {edu.institution || "Institution not specified"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {edu.year || "Year not specified"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No education information added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add your educational background to build trust with students
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-[#243b53]">Education</h3>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Education
        </button>
      </div>

      {educationArray.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">
            No education information added yet
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Start by adding your highest degree or most relevant education
          </p>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Your First Education
          </button>
        </div>
      )}

      <div className="space-y-6">
        {educationArray.map((edu, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-semibold text-gray-900 text-lg">
                Education #{index + 1}
              </h4>
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                title="Remove this education entry"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree/Certification *
                </label>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Ph.D. in Psychology"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Examples: Ph.D., Master's, Bachelor's, Certificate
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Stanford University"
                />
                <p className="text-xs text-gray-500 mt-1">
                  University, College, or Institution name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  value={edu.year || ""}
                  onChange={(e) =>
                    updateEducation(
                      index,
                      "year",
                      parseInt(e.target.value) || ""
                    )
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Year of completion or expected completion
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {educationArray.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            💡 Tips for adding education:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Start with your highest degree or most relevant certification
            </li>
            <li>
              • Include the full degree name (e.g., "Master of Science in
              Counseling")
            </li>
            <li>• Use the official institution name</li>
            <li>
              • Add certifications that are relevant to your counseling practice
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
