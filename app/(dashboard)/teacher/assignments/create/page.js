"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  teacherAssignments,
  providers,
  studentReferrals,
  mockTeacherData,
} from "@/app/lib/api/teacherService";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    providerId: "",
    assignmentType: "tutoring",
    subjects: [],
    goals: "",
    specialInstructions: "",
    frequency: "weekly",
    sessionDuration: 60,
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);

  useEffect(() => {
    loadStudents();
    loadProviders();
  }, []);

  // Debug effect to log provider data changes
  useEffect(() => {
    console.log("Available providers updated:", availableProviders);
  }, [availableProviders]);

  useEffect(() => {
    console.log("Filtered providers updated:", filteredProviders);
  }, [filteredProviders]);

  useEffect(() => {
    // Filter providers based on assignment type
    if (formData.assignmentType) {
      const filtered = availableProviders.filter((provider) => {
        // Map assignment types to provider roles
        const roleMapping = {
          tutoring: "tutor",
          counseling: "counselor"
        };
        const expectedRole = roleMapping[formData.assignmentType] || formData.assignmentType;
        return provider.role === expectedRole;
      });
      console.log("Filtered providers for", formData.assignmentType, ":", filtered);
      setFilteredProviders(filtered);
    }
  }, [formData.assignmentType, availableProviders]);

  const loadStudents = async () => {
    try {
      const response = await studentReferrals.getReferredStudents();
      // Accept multiple response shapes
      const students = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.referrals)
        ? response.data.referrals
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];
      setAvailableStudents(students);
    } catch (err) {
      console.log("Using mock data for development");
      setAvailableStudents(mockTeacherData.referrals || []);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await providers.getAll();
      console.log("Provider API Response:", response);
      
      // Handle the specific API response structure with tutors and counselors arrays
      let providersList = [];
      
      if (Array.isArray(response.data)) {
        providersList = response.data;
      } else if (Array.isArray(response.data?.providers)) {
        providersList = response.data.providers;
      } else if (Array.isArray(response.data?.items)) {
        providersList = response.data.items;
      } else if (response.data?.tutors || response.data?.counselors) {
        // Handle the specific structure: { tutors: [...], counselors: [...] }
        const tutors = (response.data.tutors || []).map(tutor => ({
          ...tutor,
          role: tutor.role || "tutor",
          firstName: tutor.firstName || tutor.fullName?.split(' ')[0] || "Unknown",
          lastName: tutor.lastName || tutor.fullName?.split(' ').slice(1).join(' ') || "",
        }));
        const counselors = (response.data.counselors || []).map(counselor => ({
          ...counselor,
          role: counselor.role || "counselor",
          firstName: counselor.firstName || counselor.fullName?.split(' ')[0] || "Unknown",
          lastName: counselor.lastName || counselor.fullName?.split(' ').slice(1).join(' ') || "",
        }));
        providersList = [...tutors, ...counselors];
      }
      
      console.log("Processed providers list:", providersList);
      setAvailableProviders(providersList);
    } catch (err) {
      console.log("Using mock data for development");
      setAvailableProviders(mockTeacherData.availableProviders || []);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Find the selected student and provider details
      const selectedStudent = availableStudents.find(
        (student) => student.id === formData.studentId
      );
      const selectedProvider = availableProviders.find(
        (provider) => provider.id === formData.providerId
      );

      // Format dates properly for the backend
      const formatDateForAPI = (dateString) => {
        if (!dateString) return null;
        // Convert YYYY-MM-DD to ISO timestamp
        const date = new Date(dateString + 'T00:00:00.000Z');
        return date.toISOString();
      };

      const assignmentData = {
        ...formData,
        studentReferralId: selectedStudent?.id, // Use correct field name
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        studentName: selectedStudent?.studentName || "N/A",
        providerName: selectedProvider?.fullName || 
          `${selectedProvider?.firstName || ''} ${selectedProvider?.lastName || ''}`.trim() ||
          "N/A",
        providerRole: selectedProvider?.role || formData.assignmentType,
        gradeLevel: selectedStudent?.gradeLevel || "N/A",
        // Remove fields that might not be expected by the API
        studentId: undefined,
        referralId: undefined,
        notes: undefined,
      };

      console.log("Sending assignment data:", assignmentData);
      await teacherAssignments.assignProvider(assignmentData);
      router.push("/teacher/assignments");
    } catch (err) {
      console.error("Error creating assignment:", err);
      setError("Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = Array.isArray(availableStudents)
    ? availableStudents.find((student) => student.id === formData.studentId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Assignment
            </h1>
            <p className="text-gray-600">
              Assign a tutor or counselor to a student.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XCircleIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <XCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Student Selection */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose a student...</option>
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.studentName} - Grade {student.gradeLevel} -{" "}
                    {student.subjects?.join(", ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type *
              </label>
              <select
                name="assignmentType"
                value={formData.assignmentType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="tutoring">Tutoring</option>
                <option value="counseling">Counseling</option>
              </select>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider *
              </label>
              <select
                name="providerId"
                value={formData.providerId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Choose a provider...</option>
                {filteredProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.fullName || `${provider.firstName || ''} ${provider.lastName || ''}`.trim()} - {provider.role} -
                    Rating: {provider.rating || 'N/A'}
                  </option>
                ))}
              </select>
            </div>

            {/* Subjects */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects (comma-separated) *
              </label>
              <input
                type="text"
                name="subjects"
                value={formData.subjects.join(", ")}
                onChange={(e) =>
                  handleArrayInputChange("subjects", e.target.value)
                }
                placeholder="Mathematics, Physics, Chemistry"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Goals */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Goals *
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe the academic goals for this assignment..."
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Special Instructions */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any special instructions or requirements..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Duration (minutes) *
              </label>
              <input
                type="number"
                name="sessionDuration"
                value={formData.sessionDuration}
                onChange={handleInputChange}
                min="30"
                max="180"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional notes or comments..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Student Info Display */}
          {selectedStudent && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Selected Student Information
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-sm text-blue-700">Name:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Grade:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.gradeLevel}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Email:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.studentEmail}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Phone:</span>
                  <span className="ml-2 text-sm text-blue-900">
                    {selectedStudent.studentPhone}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
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
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Create Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
