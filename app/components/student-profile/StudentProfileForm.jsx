import React, { useState, useEffect } from "react";
import {
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
// Temporarily hardcoded functions to isolate import issues
const validateStudentProfile = (formData) => {
  const errors = {};

  // Phone number validation
  if (formData.phoneNumber) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ""))) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
  }

  // Date of birth validation
  if (formData.dateOfBirth) {
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 13 || age > 100) {
      errors.dateOfBirth = "Age must be between 13 and 100 years";
    }
  }

  // Bio validation
  if (formData.bio) {
    if (formData.bio.length < 10) {
      errors.bio = "Bio must be at least 10 characters long";
    } else if (formData.bio.length > 1000) {
      errors.bio = "Bio must be less than 1000 characters";
    }
  }

  // Program validation
  if (formData.program) {
    const validPrograms = ["undergraduate", "graduate", "phd", "other"];
    if (!validPrograms.includes(formData.program)) {
      errors.program = "Please select a valid program";
    }
  }

  // Major validation
  if (formData.major) {
    if (formData.major.length < 2) {
      errors.major = "Major must be at least 2 characters long";
    } else if (formData.major.length > 100) {
      errors.major = "Major must be less than 100 characters";
    }
  }

  // GPA validation
  if (formData.gpa) {
    const gpa = parseFloat(formData.gpa);
    if (isNaN(gpa) || gpa < 0 || gpa > 4) {
      errors.gpa = "GPA must be between 0.0 and 4.0";
    }
  }

  // Expected graduation validation
  if (formData.expectedGraduation) {
    const currentYear = new Date().getFullYear();
    const graduationYear = parseInt(formData.expectedGraduation);
    if (
      isNaN(graduationYear) ||
      graduationYear < currentYear ||
      graduationYear > currentYear + 10
    ) {
      errors.expectedGraduation = `Graduation year must be between ${currentYear} and ${
        currentYear + 10
      }`;
    }
  }

  // Academic standing validation
  if (formData.academicStanding) {
    if (formData.academicStanding.length < 2) {
      errors.academicStanding =
        "Academic standing must be at least 2 characters long";
    } else if (formData.academicStanding.length > 50) {
      errors.academicStanding =
        "Academic standing must be less than 50 characters";
    }
  }

  // Enrollment date validation
  if (formData.enrollmentDate) {
    const enrollmentDate = new Date(formData.enrollmentDate);
    const today = new Date();
    if (enrollmentDate > today) {
      errors.enrollmentDate = "Enrollment date cannot be in the future";
    }
  }

  // Subjects validation
  if (formData.subjects && Array.isArray(formData.subjects)) {
    if (formData.subjects.length > 10) {
      errors.subjects = "Maximum 10 subjects allowed";
    }
    formData.subjects.forEach((subject, index) => {
      if (subject.length < 2) {
        errors[`subjects.${index}`] =
          "Subject must be at least 2 characters long";
      } else if (subject.length > 50) {
        errors[`subjects.${index}`] = "Subject must be less than 50 characters";
      }
    });
  }

  // Availability validation
  if (formData.availability && Array.isArray(formData.availability)) {
    if (formData.availability.length > 10) {
      errors.availability = "Maximum 10 availability preferences allowed";
    }
    formData.availability.forEach((time, index) => {
      if (time.length < 2) {
        errors[`availability.${index}`] =
          "Availability must be at least 2 characters long";
      } else if (time.length > 100) {
        errors[`availability.${index}`] =
          "Availability must be less than 100 characters";
      }
    });
  }

  // Preferred format validation
  if (formData.preferredFormat) {
    const validFormats = ["online", "in-person", "hybrid"];
    if (!validFormats.includes(formData.preferredFormat)) {
      errors.preferredFormat = "Please select a valid format";
    }
  }

  // Additional notes validation
  if (formData.additionalNotes) {
    if (formData.additionalNotes.length > 500) {
      errors.additionalNotes =
        "Additional notes must be less than 500 characters";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phoneNumber;
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const PROGRAM_OPTIONS = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

const PREFERRED_FORMAT_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" },
];

const VALIDATION_CONSTANTS = {
  PHONE_NUMBER: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  BIO: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  MAJOR: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  GPA: {
    MIN: 0.0,
    MAX: 4.0,
    DECIMAL_PLACES: 2,
  },
  ACADEMIC_STANDING: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  SUBJECTS: {
    MAX_COUNT: 10,
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  AVAILABILITY: {
    MAX_COUNT: 10,
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  ADDITIONAL_NOTES: {
    MAX_LENGTH: 500,
  },
  AGE: {
    MIN: 13,
    MAX: 100,
  },
};

const StudentProfileForm = ({
  profile,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: profile?.phoneNumber || "",
    dateOfBirth: profile?.dateOfBirth || "",
    bio: profile?.bio || "",
    program: profile?.program || "",
    major: profile?.major || "",
    gpa: profile?.gpa || "",
    expectedGraduation: profile?.expectedGraduation || "",
    academicStanding: profile?.academicStanding || "",
    enrollmentDate: profile?.enrollmentDate || "",
    subjects: profile?.subjects || [],
    availability: profile?.availability || [],
    preferredFormat: profile?.preferredFormat || "",
    additionalNotes: profile?.additionalNotes || "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [newSubject, setNewSubject] = useState("");
  const [newAvailability, setNewAvailability] = useState("");

  // Validate form on data change
  useEffect(() => {
    const { errors } = validateStudentProfile(formData);
    setValidationErrors(errors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Allow only digits, spaces, parentheses, dashes, and plus
    const cleaned = value.replace(/[^\d\s\(\)\-\+]/g, "");
    setFormData((prev) => ({
      ...prev,
      phoneNumber: cleaned,
    }));
  };

  const handleGPAChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setFormData((prev) => ({
        ...prev,
        gpa: value,
      }));
    }
  };

  const handleExpectedGraduationChange = (e) => {
    const value = e.target.value;
    // Allow only 4-digit years
    if (/^\d{0,4}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        expectedGraduation: value,
      }));
    }
  };

  const addSubject = () => {
    if (
      newSubject.trim() &&
      formData.subjects.length < VALIDATION_CONSTANTS.SUBJECTS.MAX_COUNT
    ) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (index) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const addAvailability = () => {
    if (
      newAvailability.trim() &&
      formData.availability.length < VALIDATION_CONSTANTS.AVAILABILITY.MAX_COUNT
    ) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, newAvailability.trim()],
      }));
      setNewAvailability("");
    }
  };

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validateStudentProfile(formData);
    setValidationErrors(errors);

    if (isValid) {
      await onSubmit(formData);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName];
  };

  const getCharacterCount = (field, maxLength) => {
    return `${field.length}/${maxLength}`;
  };

  const getAgeDisplay = () => {
    if (!formData.dateOfBirth) return null;
    const age = calculateAge(formData.dateOfBirth);
    return age ? `(${age} years old)` : null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center bg-blue-600 text-white">
          <UserIcon className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Personal Information</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("phoneNumber")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="(555) 123-4567"
              />
              {getFieldError("phoneNumber") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("phoneNumber")}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("dateOfBirth")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {getFieldError("dateOfBirth") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("dateOfBirth")}
                </p>
              )}
              {getAgeDisplay() && (
                <p className="mt-1 text-sm text-gray-500">{getAgeDisplay()}</p>
              )}
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("bio") ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Tell us about yourself, your academic goals, and what you're looking for in a tutor..."
              />
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-gray-500">
                  {getCharacterCount(
                    formData.bio,
                    VALIDATION_CONSTANTS.BIO.MAX_LENGTH
                  )}
                </span>
                {getFieldError("bio") && (
                  <span className="text-red-600">{getFieldError("bio")}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center bg-green-600 text-white">
          <AcademicCapIcon className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Academic Information</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Program */}
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
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("program")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select a program</option>
                {PROGRAM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {getFieldError("program") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("program")}
                </p>
              )}
            </div>

            {/* Major */}
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
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("major") ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., Computer Science"
              />
              {getFieldError("major") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("major")}
                </p>
              )}
            </div>

            {/* GPA */}
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
                onChange={handleGPAChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("gpa") ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="3.85"
              />
              {getFieldError("gpa") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("gpa")}
                </p>
              )}
            </div>

            {/* Expected Graduation */}
            <div>
              <label
                htmlFor="expectedGraduation"
                className="block text-sm font-medium text-gray-700"
              >
                Expected Graduation Year
              </label>
              <input
                type="text"
                name="expectedGraduation"
                id="expectedGraduation"
                value={formData.expectedGraduation}
                onChange={handleExpectedGraduationChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("expectedGraduation")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="2025"
              />
              {getFieldError("expectedGraduation") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("expectedGraduation")}
                </p>
              )}
            </div>

            {/* Academic Standing */}
            <div>
              <label
                htmlFor="academicStanding"
                className="block text-sm font-medium text-gray-700"
              >
                Academic Standing
              </label>
              <input
                type="text"
                name="academicStanding"
                id="academicStanding"
                value={formData.academicStanding}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("academicStanding")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="e.g., Dean's List"
              />
              {getFieldError("academicStanding") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("academicStanding")}
                </p>
              )}
            </div>

            {/* Enrollment Date */}
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
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("enrollmentDate")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {getFieldError("enrollmentDate") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("enrollmentDate")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tutoring Preferences Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex items-center bg-purple-600 text-white">
          <ClockIcon className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Tutoring Preferences</h3>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects You Need Help With
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSubject())
                  }
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Add a subject..."
                  maxLength={VALIDATION_CONSTANTS.SUBJECTS.MAX_LENGTH}
                />
                <button
                  type="button"
                  onClick={addSubject}
                  disabled={
                    !newSubject.trim() ||
                    formData.subjects.length >=
                      VALIDATION_CONSTANTS.SUBJECTS.MAX_COUNT
                  }
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formData.subjects.length}/
                {VALIDATION_CONSTANTS.SUBJECTS.MAX_COUNT} subjects
              </p>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Preferences
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.availability.map((time, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => removeAvailability(index)}
                      className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAvailability())
                  }
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Monday afternoons, Wednesday evenings..."
                  maxLength={VALIDATION_CONSTANTS.AVAILABILITY.MAX_LENGTH}
                />
                <button
                  type="button"
                  onClick={addAvailability}
                  disabled={
                    !newAvailability.trim() ||
                    formData.availability.length >=
                      VALIDATION_CONSTANTS.AVAILABILITY.MAX_COUNT
                  }
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formData.availability.length}/
                {VALIDATION_CONSTANTS.AVAILABILITY.MAX_COUNT} preferences
              </p>
            </div>

            {/* Preferred Format */}
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
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("preferredFormat")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select preferred format</option>
                {PREFERRED_FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {getFieldError("preferredFormat") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("preferredFormat")}
                </p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label
                htmlFor="additionalNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                id="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  getFieldError("additionalNotes")
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Any additional preferences or information for tutors..."
              />
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-gray-500">
                  {getCharacterCount(
                    formData.additionalNotes,
                    VALIDATION_CONSTANTS.ADDITIONAL_NOTES.MAX_LENGTH
                  )}
                </span>
                {getFieldError("additionalNotes") && (
                  <span className="text-red-600">
                    {getFieldError("additionalNotes")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(validationErrors).length > 0}
          className="px-4 py-2 border border-transparent text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
};

export default StudentProfileForm;
