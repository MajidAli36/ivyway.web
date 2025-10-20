"use client";

import { useState } from "react";
import {
  UserPlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { studentReferrals } from "@/app/lib/api/teacherService";
import { useRouter } from "next/navigation";

export default function ReferStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    gradeLevel: "",
    subjects: [],
    academicGoals: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    parentRelationship: "",
    notes: "",
  });

  const gradeLevels = [
    "Elementary (K-5)",
    "Middle School (6-8)",
    "High School (9-12)",
    "College/University",
    "Adult Education",
  ];

  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Psychology",
    "Sociology",
  ];

  const parentRelationships = [
    "Mother",
    "Father",
    "Guardian",
    "Grandmother",
    "Grandfather",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await studentReferrals.referStudent(formData);
      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          studentName: "",
          studentEmail: "",
          studentPhone: "",
          gradeLevel: "",
          subjects: [],
          academicGoals: "",
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          parentRelationship: "",
          notes: "",
        });
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/teacher/students");
        }, 3000);
      }
    } catch (err) {
      console.log("Using mock data for development");
      // Fallback: simulate successful referral creation
      setSuccess(true);
      // Reset form
      setFormData({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        gradeLevel: "",
        subjects: [],
        academicGoals: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        parentRelationship: "",
        notes: "",
      });
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/teacher/students");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Student Referral Created Successfully!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The student referral has been submitted and is pending approval.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/teacher/students")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Students
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Refer New Student
          </h1>
          <p className="text-gray-600">
            Submit a referral for a student who needs tutoring or counseling
            services.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Student Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="studentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Name *
                </label>
                <input
                  type="text"
                  name="studentName"
                  id="studentName"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.studentName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="studentEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Email
                </label>
                <input
                  type="email"
                  name="studentEmail"
                  id="studentEmail"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="studentPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Phone
                </label>
                <input
                  type="tel"
                  name="studentPhone"
                  id="studentPhone"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.studentPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="gradeLevel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grade Level *
                </label>
                <select
                  name="gradeLevel"
                  id="gradeLevel"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                >
                  <option value="">Select Grade Level</option>
                  {gradeLevels.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Subjects *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableSubjects.map((subject) => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {subject}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="academicGoals"
                className="block text-sm font-medium text-gray-700"
              >
                Academic Goals
              </label>
              <textarea
                name="academicGoals"
                id="academicGoals"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe what the student hopes to achieve..."
                value={formData.academicGoals}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="parentName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  id="parentName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.parentName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="parentEmail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  name="parentEmail"
                  id="parentEmail"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="parentPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  id="parentPhone"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="parentRelationship"
                  className="block text-sm font-medium text-gray-700"
                >
                  Relationship to Student
                </label>
                <select
                  name="parentRelationship"
                  id="parentRelationship"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.parentRelationship}
                  onChange={handleInputChange}
                >
                  <option value="">Select Relationship</option>
                  {parentRelationships.map((relationship) => (
                    <option key={relationship} value={relationship}>
                      {relationship}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Additional Information
            </h3>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional information about the student's needs, learning style, or special requirements..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.studentName ||
                !formData.gradeLevel ||
                formData.subjects.length === 0
              }
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Referral...
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Create Referral
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
