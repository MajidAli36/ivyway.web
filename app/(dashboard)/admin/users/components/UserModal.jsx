"use client";

import { useState, useEffect } from "react";
import { 
  XMarkIcon, 
  UserIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftIcon,
  ShieldCheckIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  StarIcon
} from "@heroicons/react/24/outline";

export default function UserModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student",
    // Tutor specific fields
    tutorProfile: {
      phoneNumber: "",
      location: "",
      bio: "",
      education: "",
      degree: "",
      certifications: [],
      graduationYear: new Date().getFullYear(),
      subjects: [],
      experience: 0,
      hourlyRate: 0,
      availability: [],
    },
    // Student specific fields
    studentProfile: {
      phoneNumber: "",
      bio: "",
      program: "",
      major: "",
      gpa: "",
      expectedGraduation: "",
      academicStanding: "",
      enrollmentDate: "",
      preferredFormat: "",
      additionalNotes: "",
    },
    // Counselor specific fields
    counselorProfile: {
      phoneNumber: "",
      location: "",
      bio: "",
      specialization: "",
      experience: 0,
      education: "",
      certifications: [],
      languages: [],
      availability: [],
      hourlyRate: 0,
    },
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        role: user.role || "student",
        tutorProfile: user.tutorProfile || {
          phoneNumber: user?.tutorProfile?.phoneNumber || "",
          location: user?.tutorProfile?.location || "",
          bio: user?.tutorProfile?.bio || "",
          education: user?.tutorProfile?.education || "",
          degree: user?.tutorProfile?.degree || "",
          certifications: user?.tutorProfile?.certifications || [],
          graduationYear:
            user?.tutorProfile?.graduationYear || new Date().getFullYear(),
          subjects: user?.tutorProfile?.subjects || [],
          experience: user?.tutorProfile?.experience || 0,
          hourlyRate: user?.tutorProfile?.hourlyRate || 0,
          availability: user?.tutorProfile?.availability || [],
        },
        studentProfile: user.studentProfile || {
          phoneNumber: user?.studentProfile?.phoneNumber || "",
          bio: user?.studentProfile?.bio || "",
          program: user?.studentProfile?.program || "",
          major: user?.studentProfile?.major || "",
          gpa: user?.studentProfile?.gpa || "",
          expectedGraduation: user?.studentProfile?.expectedGraduation || "",
          academicStanding: user?.studentProfile?.academicStanding || "",
          enrollmentDate: user?.studentProfile?.enrollmentDate || "",
          preferredFormat: user?.studentProfile?.preferredFormat || "",
          additionalNotes: user?.studentProfile?.additionalNotes || "",
        },
        counselorProfile: user.counselorProfile || {
          phoneNumber: user?.counselorProfile?.phoneNumber || "",
          location: user?.counselorProfile?.location || "",
          bio: user?.counselorProfile?.bio || "",
          experience: user?.counselorProfile?.experience || 0,
          education: user?.counselorProfile?.education || "",
          certifications: user?.counselorProfile?.certifications || [],
          languages: user?.counselorProfile?.languages || [],
          availability: user?.counselorProfile?.availability || [],
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("tutorProfile.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        tutorProfile: {
          ...prev.tutorProfile,
          [field]: value,
        },
      }));
    } else if (name.startsWith("studentProfile.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          [field]: value,
        },
      }));
    } else if (name.startsWith("counselorProfile.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        counselorProfile: {
          ...prev.counselorProfile,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleArrayInput = (e, field, profileType = "tutorProfile") => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [field]: values,
      },
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    // Role-specific validation
    if (formData.role === "tutor") {
      if (!formData.tutorProfile.education.trim()) newErrors.tutorEducation = "Education is required for tutors";
      if (!formData.tutorProfile.degree.trim()) newErrors.tutorDegree = "Degree is required for tutors";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const userData = {
        id: user?.id,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        tutorProfile: formData.role === "tutor" ? formData.tutorProfile : null,
        studentProfile: formData.role === "student" ? formData.studentProfile : null,
        counselorProfile: formData.role === "counselor" ? formData.counselorProfile : null,
      };

      await onSave(userData);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrors({
        submit: error.message || "Failed to save user. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const getRoleIcon = (role) => {
    switch (role) {
      case "tutor":
        return <AcademicCapIcon className="h-5 w-5" />;
      case "student":
        return <UserIcon className="h-5 w-5" />;
      case "counselor":
        return <ChatBubbleLeftIcon className="h-5 w-5" />;
      case "admin":
        return <ShieldCheckIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "tutor":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "student":
        return "text-green-600 bg-green-50 border-green-200";
      case "counselor":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "admin":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Clean overlay without blur effects */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-gray-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg border ${getRoleColor(formData.role)}`}>
                {getRoleIcon(formData.role)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.id ? "Edit User" : "Add New User"}
                </h2>
                <p className="text-sm text-gray-500 capitalize">
                  {formData.role} Profile
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.fullName ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="counselor">Counselor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {/* Role-specific fields rendered below */}
                  </div>
                </div>

                {/* Tutor Profile Section */}
                {formData.role === "tutor" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">Tutor Profile</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="tutorPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="tutorProfile.phoneNumber"
                            id="tutorPhone"
                            value={formData.tutorProfile.phoneNumber}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.phoneNumber ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="tutorLocation" className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="tutorProfile.location"
                            id="tutorLocation"
                            value={formData.tutorProfile.location}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter location"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="tutorBio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="tutorProfile.bio"
                          id="tutorBio"
                          value={formData.tutorProfile.bio}
                          onChange={handleChange}
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div>
                        <label htmlFor="tutorEducation" className="block text-sm font-medium text-gray-700 mb-2">
                          Education *
                        </label>
                        <input
                          type="text"
                          name="tutorProfile.education"
                          id="tutorEducation"
                          value={formData.tutorProfile.education}
                          onChange={handleChange}
                          className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.tutorEducation ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="e.g., Stanford University"
                        />
                        {errors.tutorEducation && (
                          <p className="mt-1 text-sm text-red-600">{errors.tutorEducation}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="tutorDegree" className="block text-sm font-medium text-gray-700 mb-2">
                          Degree *
                        </label>
                        <input
                          type="text"
                          name="tutorProfile.degree"
                          id="tutorDegree"
                          value={formData.tutorProfile.degree}
                          onChange={handleChange}
                          className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.tutorDegree ? "border-red-300" : "border-gray-300"
                          }`}
                          placeholder="e.g., Bachelor of Science"
                        />
                        {errors.tutorDegree && (
                          <p className="mt-1 text-sm text-red-600">{errors.tutorDegree}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                          Graduation Year
                        </label>
                        <input
                          type="number"
                          name="tutorProfile.graduationYear"
                          id="graduationYear"
                          value={formData.tutorProfile.graduationYear}
                          onChange={handleChange}
                          min="1900"
                          max="2100"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="tutorProfile.experience"
                          id="experience"
                          value={formData.tutorProfile.experience}
                          onChange={handleChange}
                          min="0"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          name="tutorProfile.hourlyRate"
                          id="hourlyRate"
                          value={formData.tutorProfile.hourlyRate}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          id="certifications"
                          value={formData.tutorProfile.certifications.join(", ")}
                          onChange={(e) => handleArrayInput(e, "certifications", "tutorProfile")}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter certifications separated by commas"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-2">
                          Subjects
                        </label>
                        <input
                          type="text"
                          id="subjects"
                          value={formData.tutorProfile.subjects.join(", ")}
                          onChange={(e) => handleArrayInput(e, "subjects", "tutorProfile")}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter subjects separated by commas"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Student Profile Section */}
                {formData.role === "student" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <UserIcon className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-medium text-gray-900">Student Profile</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="studentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="studentProfile.phoneNumber"
                            id="studentPhone"
                            value={formData.studentProfile.phoneNumber}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.phoneNumber ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                          Program
                        </label>
                        <select
                          name="studentProfile.program"
                          id="program"
                          value={formData.studentProfile.program}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Program</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="graduate">Graduate</option>
                          <option value="phd">PhD</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                          Major
                        </label>
                        <input
                          type="text"
                          name="studentProfile.major"
                          id="major"
                          value={formData.studentProfile.major}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter major field of study"
                        />
                      </div>

                      <div>
                        <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-2">
                          GPA
                        </label>
                        <input
                          type="number"
                          name="studentProfile.gpa"
                          id="gpa"
                          value={formData.studentProfile.gpa}
                          onChange={handleChange}
                          min="0"
                          max="4"
                          step="0.01"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00 - 4.00"
                        />
                      </div>

                      <div>
                        <label htmlFor="expectedGraduation" className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Graduation
                        </label>
                        <input
                          type="number"
                          name="studentProfile.expectedGraduation"
                          id="expectedGraduation"
                          value={formData.studentProfile.expectedGraduation}
                          onChange={handleChange}
                          min="2024"
                          max="2030"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2024"
                        />
                      </div>

                      <div>
                        <label htmlFor="academicStanding" className="block text-sm font-medium text-gray-700 mb-2">
                          Academic Standing
                        </label>
                        <input
                          type="text"
                          name="studentProfile.academicStanding"
                          id="academicStanding"
                          value={formData.studentProfile.academicStanding}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Good Standing"
                        />
                      </div>

                      <div>
                        <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Enrollment Date
                        </label>
                        <input
                          type="date"
                          name="studentProfile.enrollmentDate"
                          id="enrollmentDate"
                          value={formData.studentProfile.enrollmentDate}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="preferredFormat" className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Format
                        </label>
                        <select
                          name="studentProfile.preferredFormat"
                          id="preferredFormat"
                          value={formData.studentProfile.preferredFormat}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Format</option>
                          <option value="online">Online</option>
                          <option value="in-person">In-Person</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          name="studentProfile.additionalNotes"
                          id="additionalNotes"
                          value={formData.studentProfile.additionalNotes}
                          onChange={handleChange}
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Any additional information..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="studentBio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="studentProfile.bio"
                          id="studentBio"
                          value={formData.studentProfile.bio}
                          onChange={handleChange}
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Counselor Profile Section */}
                {formData.role === "counselor" && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <ChatBubbleLeftIcon className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-medium text-gray-900">Counselor Profile</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="counselorPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            name="counselorProfile.phoneNumber"
                            id="counselorPhone"
                            value={formData.counselorProfile.phoneNumber}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.phoneNumber ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="counselorLocation" className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            name="counselorProfile.location"
                            id="counselorLocation"
                            value={formData.counselorProfile.location}
                            onChange={handleChange}
                            className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter location"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="counselorExperience" className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="counselorProfile.experience"
                          id="counselorExperience"
                          value={formData.counselorProfile.experience}
                          onChange={handleChange}
                          min="0"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="counselorEducation" className="block text-sm font-medium text-gray-700 mb-2">
                          Education
                        </label>
                        <input
                          type="text"
                          name="counselorProfile.education"
                          id="counselorEducation"
                          value={formData.counselorProfile.education}
                          onChange={handleChange}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Master's in Counseling"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="counselorCertifications" className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <input
                          type="text"
                          id="counselorCertifications"
                          value={formData.counselorProfile.certifications.join(", ")}
                          onChange={(e) => handleArrayInput(e, "certifications", "counselorProfile")}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter certifications separated by commas"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-2">
                          Languages
                        </label>
                        <input
                          type="text"
                          id="languages"
                          value={formData.counselorProfile.languages.join(", ")}
                          onChange={(e) => handleArrayInput(e, "languages", "counselorProfile")}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter languages separated by commas"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="counselorBio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="counselorProfile.bio"
                          id="counselorBio"
                          value={formData.counselorProfile.bio}
                          onChange={handleChange}
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
