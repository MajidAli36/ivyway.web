"use client";

import { useState, useEffect } from "react";
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import tutorUpgradeService from "@/app/lib/api/tutorUpgradeService";
import {
  SUBJECT_EXPERTISE_OPTIONS,
  STANDARDIZED_TEST_OPTIONS,
  AP_IB_SUBJECT_OPTIONS,
  CERTIFICATION_OPTIONS,
} from "@/app/types/tutorUpgrade";

export default function UpgradeApplicationForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    subjectExpertise: [],
    qualifications: {
      standardizedTests: [],
      apIbSubjects: [],
      collegeDegree: "",
      teachingExperience: "",
      certifications: [],
    },
    motivation: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    { id: 1, name: "Subject Expertise", description: "Select your areas of expertise" },
    { id: 2, name: "Qualifications", description: "Provide your educational background" },
    { id: 3, name: "Motivation", description: "Tell us why you want to upgrade" },
    { id: 4, name: "Review", description: "Review your application" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleQualificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: {
        ...prev.qualifications,
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    if (errors[`qualifications.${field}`]) {
      setErrors((prev) => ({
        ...prev,
        [`qualifications.${field}`]: null,
      }));
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    switch (stepNumber) {
      case 1:
        if (formData.subjectExpertise.length === 0) {
          newErrors.subjectExpertise = "Please select at least one subject expertise";
        }
        break;
      case 2:
        if (!formData.qualifications.collegeDegree.trim()) {
          newErrors["qualifications.collegeDegree"] = "College degree is required";
        }
        if (!formData.qualifications.teachingExperience.trim()) {
          newErrors["qualifications.teachingExperience"] = "Teaching experience is required";
        }
        break;
      case 3:
        if (!formData.motivation.trim()) {
          newErrors.motivation = "Please explain your motivation for upgrading";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      return;
    }

    setLoading(true);
    try {
      const response = await tutorUpgradeService.submitApplication(formData);
      
      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess?.(response.data);
        }, 2000);
      } else {
        setErrors({ submit: response.message || "Failed to submit application" });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors({ submit: error.message || "An error occurred while submitting" });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your subject expertise areas *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SUBJECT_EXPERTISE_OPTIONS.map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjectExpertise.includes(subject)}
                      onChange={(e) =>
                        handleArrayChange("subjectExpertise", subject, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
              {errors.subjectExpertise && (
                <p className="mt-2 text-sm text-red-600">{errors.subjectExpertise}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Standardized Tests (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {STANDARDIZED_TEST_OPTIONS.map((test) => (
                  <label
                    key={test}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.qualifications.standardizedTests.includes(test)}
                      onChange={(e) =>
                        handleArrayChange(
                          "qualifications.standardizedTests",
                          test,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{test}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                AP/IB Subjects (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AP_IB_SUBJECT_OPTIONS.map((subject) => (
                  <label
                    key={subject}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.qualifications.apIbSubjects.includes(subject)}
                      onChange={(e) =>
                        handleArrayChange(
                          "qualifications.apIbSubjects",
                          subject,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Degree *
              </label>
              <input
                type="text"
                value={formData.qualifications.collegeDegree}
                onChange={(e) => handleQualificationChange("collegeDegree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor of Science in Mathematics"
              />
              {errors["qualifications.collegeDegree"] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors["qualifications.collegeDegree"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Experience *
              </label>
              <input
                type="text"
                value={formData.qualifications.teachingExperience}
                onChange={(e) => handleQualificationChange("teachingExperience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3 years of tutoring experience"
              />
              {errors["qualifications.teachingExperience"] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors["qualifications.teachingExperience"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Certifications (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CERTIFICATION_OPTIONS.map((cert) => (
                  <label
                    key={cert}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.qualifications.certifications.includes(cert)}
                      onChange={(e) =>
                        handleArrayChange(
                          "qualifications.certifications",
                          cert,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to become an Advanced Tutor? *
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain your motivation for upgrading to Advanced Tutor status..."
              />
              {errors.motivation && (
                <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Subject Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {formData.subjectExpertise.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Qualifications</h4>
              <div className="space-y-2 text-sm">
                <p><strong>College Degree:</strong> {formData.qualifications.collegeDegree}</p>
                <p><strong>Teaching Experience:</strong> {formData.qualifications.teachingExperience}</p>
                {formData.qualifications.standardizedTests.length > 0 && (
                  <p><strong>Standardized Tests:</strong> {formData.qualifications.standardizedTests.join(", ")}</p>
                )}
                {formData.qualifications.apIbSubjects.length > 0 && (
                  <p><strong>AP/IB Subjects:</strong> {formData.qualifications.apIbSubjects.join(", ")}</p>
                )}
                {formData.qualifications.certifications.length > 0 && (
                  <p><strong>Certifications:</strong> {formData.qualifications.certifications.join(", ")}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Motivation</h4>
              <p className="text-sm text-gray-700">{formData.motivation}</p>
            </div>

            {formData.additionalInfo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
                <p className="text-sm text-gray-700">{formData.additionalInfo}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Application Submitted!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your upgrade application has been submitted successfully. You will be notified once it's reviewed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upgrade Application</h3>
            <p className="text-sm text-gray-500">
              Step {step} of {steps.length}: {steps[step - 1].description}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    stepItem.id <= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepItem.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      stepItem.id < step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderStepContent()}

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={handlePrevious}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
          </div>

          <div>
            {step < steps.length ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
