"use client";

import React, { useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ENHANCED_SUBJECTS, getAllSubjects } from "@/app/constants/enhancedSubjects";

/**
 * SubjectSelector Component
 * A reusable dropdown component for selecting subjects
 * 
 * @param {Object} props
 * @param {Array} props.selectedSubjects - Array of currently selected subjects
 * @param {Function} props.onSubjectsChange - Callback function when subjects change
 * @param {boolean} props.isEditing - Whether the component is in edit mode
 * @param {string} props.label - Label for the subject selector
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text for the dropdown
 * @param {number} props.maxSubjects - Maximum number of subjects that can be selected
 */
export default function SubjectSelector({
  selectedSubjects = [],
  onSubjectsChange,
  isEditing = true,
  label = "Subjects",
  required = false,
  placeholder = "Select a subject to add...",
  maxSubjects = null,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter subjects based on search term
  const filteredSubjects = getAllSubjects().filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter out already selected subjects
  const availableSubjects = filteredSubjects.filter(subject =>
    !selectedSubjects.includes(subject)
  );

  const handleSubjectAdd = (subject) => {
    if (!selectedSubjects.includes(subject)) {
      if (maxSubjects && selectedSubjects.length >= maxSubjects) {
        return; // Don't add if max limit reached
      }
      onSubjectsChange([...selectedSubjects, subject]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleInputBlur = () => {
    // Small delay to allow for click events on dropdown items
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleSubjectRemove = (subjectToRemove) => {
    const newSubjects = selectedSubjects.filter(subject => subject !== subjectToRemove);
    onSubjectsChange(newSubjects);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (availableSubjects.length > 0) {
        handleSubjectAdd(availableSubjects[0]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setSearchTerm("");
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.subject-selector-container')) {
      setIsDropdownOpen(false);
    }
  };

  // Add click outside listener
  React.useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <div className="space-y-3 subject-selector-container">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isEditing ? (
        <div className="space-y-3">
          {/* Dropdown */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
              />
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Close button */}
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">Select a subject</span>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {availableSubjects.length > 0 ? (
                  availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => handleSubjectAdd(subject)}
                    >
                      {subject}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    {searchTerm ? "No subjects found" : "All subjects selected"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Subjects */}
          <div className="space-y-2">
            {selectedSubjects.map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                  {subject}
                </span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 p-1"
                  onClick={() => handleSubjectRemove(subject)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Helper Text */}
          {selectedSubjects.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No subjects selected. Use the search above to add subjects.
            </p>
          )}

          {maxSubjects && (
            <p className="text-gray-500 text-sm">
              {selectedSubjects.length}/{maxSubjects} subjects selected
            </p>
          )}
        </div>
      ) : (
        /* View Mode */
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.length > 0 ? (
            selectedSubjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {subject}
              </span>
            ))
          ) : (
            <p className="text-gray-500 italic">No subjects selected</p>
          )}
        </div>
      )}
    </div>
  );
}
