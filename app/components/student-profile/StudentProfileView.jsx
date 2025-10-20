import React from "react";
import {
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
// Temporarily hardcoded functions to isolate import issues
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

const StudentProfileView = ({ profile, onEdit }) => {
  const getProgramLabel = (value) => {
    const PROGRAM_OPTIONS = [
      { value: "undergraduate", label: "Undergraduate" },
      { value: "graduate", label: "Graduate" },
      { value: "phd", label: "PhD" },
      { value: "other", label: "Other" },
    ];
    const option = PROGRAM_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getFormatLabel = (value) => {
    const PREFERRED_FORMAT_OPTIONS = [
      { value: "online", label: "Online" },
      { value: "in-person", label: "In-Person" },
      { value: "hybrid", label: "Hybrid" },
    ];
    const option = PREFERRED_FORMAT_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAgeDisplay = () => {
    if (!profile.dateOfBirth) return null;
    const age = calculateAge(profile.dateOfBirth);
    return age ? `(${age} years old)` : null;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Personal Information</h3>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Phone Number */}
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Phone Number
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.phoneNumber
                  ? formatPhoneNumber(profile.phoneNumber)
                  : "—"}
              </dd>
            </div>

            {/* Date of Birth */}
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date of Birth
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.dateOfBirth ? (
                  <div>
                    {formatDate(profile.dateOfBirth)}
                    {getAgeDisplay() && (
                      <span className="text-gray-500 ml-2">
                        {getAgeDisplay()}
                      </span>
                    )}
                  </div>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.bio || "No bio provided"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-green-600 text-white">
          <div className="flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Academic Information</h3>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Edit
          </button>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Program */}
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                Program
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.program ? getProgramLabel(profile.program) : "—"}
              </dd>
            </div>

            {/* Major */}
            <div>
              <dt className="text-sm font-medium text-gray-500">Major</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.major || "—"}
              </dd>
            </div>

            {/* GPA */}
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <StarIcon className="h-4 w-4 mr-2" />
                Current GPA
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.gpa ? `${profile.gpa}/4.0` : "—"}
              </dd>
            </div>

            {/* Expected Graduation */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Expected Graduation
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.expectedGraduation || "—"}
              </dd>
            </div>

            {/* Academic Standing */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Academic Standing
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.academicStanding || "—"}
              </dd>
            </div>

            {/* Enrollment Date */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Enrollment Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.enrollmentDate
                  ? formatDate(profile.enrollmentDate)
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tutoring Preferences Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-purple-600 text-white">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2" />
            <h3 className="text-lg font-medium">Tutoring Preferences</h3>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Edit
          </button>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Subjects */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Subjects You Need Help With
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.subjects && profile.subjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            {/* Availability */}
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                Availability Preferences
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.availability && profile.availability.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.availability.map((time, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </dd>
            </div>

            {/* Preferred Format */}
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Preferred Format
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.preferredFormat
                  ? getFormatLabel(profile.preferredFormat)
                  : "—"}
              </dd>
            </div>

            {/* Additional Notes */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Additional Notes
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.additionalNotes || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {profile.subjects?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {profile.availability?.length || 0}
            </div>
            <div className="text-sm text-gray-500">Availability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {profile.gpa ? parseFloat(profile.gpa).toFixed(2) : "—"}
            </div>
            <div className="text-sm text-gray-500">GPA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {profile.expectedGraduation || "—"}
            </div>
            <div className="text-sm text-gray-500">Graduation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
