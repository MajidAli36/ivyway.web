"use client";

import React, { useState } from "react";
import SubjectSelector from "./SubjectSelector";

/**
 * SubjectSelectorDemo Component
 * Demonstrates the different features and configurations of SubjectSelector
 */
export default function SubjectSelectorDemo() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isEditing, setIsEditing] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Subject Selector Demo
      </h1>

      {/* Toggle Edit Mode */}
      <div className="mb-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Switch to View Mode" : "Switch to Edit Mode"}
        </button>
      </div>

      {/* Basic Usage */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Basic Usage
        </h2>
        <SubjectSelector
          selectedSubjects={selectedSubjects}
          onSubjectsChange={setSelectedSubjects}
          isEditing={isEditing}
          label="Select Your Subjects"
          placeholder="Type to search subjects..."
        />
      </div>

      {/* With Maximum Limit */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          With Maximum Limit (3 subjects)
        </h2>
        <SubjectSelector
          selectedSubjects={selectedSubjects.slice(0, 3)}
          onSubjectsChange={(subjects) => setSelectedSubjects(subjects)}
          isEditing={isEditing}
          label="Top 3 Subjects"
          placeholder="Select up to 3 subjects..."
          maxSubjects={3}
        />
      </div>

      {/* Required Field */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Required Field
        </h2>
        <SubjectSelector
          selectedSubjects={selectedSubjects}
          onSubjectsChange={setSelectedSubjects}
          isEditing={isEditing}
          label="Required Subjects"
          placeholder="At least one subject is required..."
          required={true}
        />
      </div>

      {/* Current Selection Display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Current Selection:
        </h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(selectedSubjects, null, 2)}
        </pre>
      </div>
    </div>
  );
}
