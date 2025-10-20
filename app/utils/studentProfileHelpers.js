// Calculate student profile completion percentage based on filled fields
export const calculateStudentProfileCompletion = (profile) => {
  const fields = [
    { key: "phoneNumber", weight: 10 },
    { key: "dateOfBirth", weight: 10 },
    { key: "bio", weight: 15 },
    { key: "profileImage", weight: 10 },
    { key: "program", weight: 10 },
    { key: "major", weight: 10 },
    { key: "gpa", weight: 10 },
    { key: "expectedGraduation", weight: 10 },
    { key: "academicStanding", weight: 5 },
    { key: "enrollmentDate", weight: 5 },
    { key: "subjects", weight: 10 },
    { key: "availability", weight: 10 },
    { key: "preferredFormat", weight: 5 },
    { key: "introVideoUrl", weight: 5 },
  ];

  let completion = 0;

  fields.forEach(({ key, weight }) => {
    const value = profile[key];

    if (key === "subjects" || key === "availability") {
      if (value && Array.isArray(value) && value.length > 0) {
        completion += weight;
      }
    } else if (key === "profileImage" || key === "introVideoUrl") {
      if (value && value.trim() !== "") {
        completion += weight;
      }
    } else {
      if (value && value.toString().trim() !== "") {
        completion += weight;
      }
    }
  });

  return Math.min(100, Math.round(completion));
};

// Get missing fields for student profile completion
export const getStudentMissingFields = (profile) => {
  const missingFields = [];

  if (!profile.phoneNumber || profile.phoneNumber.trim() === "") {
    missingFields.push("Phone Number");
  }

  if (!profile.dateOfBirth || profile.dateOfBirth.trim() === "") {
    missingFields.push("Date of Birth");
  }

  if (!profile.bio || profile.bio.trim() === "") {
    missingFields.push("Bio");
  }

  if (!profile.profileImage || profile.profileImage.trim() === "") {
    missingFields.push("Profile Image");
  }

  if (!profile.program || profile.program.trim() === "") {
    missingFields.push("Program");
  }

  if (!profile.major || profile.major.trim() === "") {
    missingFields.push("Major");
  }

  if (!profile.gpa || profile.gpa.toString().trim() === "") {
    missingFields.push("GPA");
  }

  if (
    !profile.expectedGraduation ||
    profile.expectedGraduation.toString().trim() === ""
  ) {
    missingFields.push("Expected Graduation");
  }

  if (!profile.academicStanding || profile.academicStanding.trim() === "") {
    missingFields.push("Academic Standing");
  }

  if (!profile.enrollmentDate || profile.enrollmentDate.trim() === "") {
    missingFields.push("Enrollment Date");
  }

  if (
    !profile.subjects ||
    !Array.isArray(profile.subjects) ||
    profile.subjects.length === 0
  ) {
    missingFields.push("Subjects");
  }

  if (
    !profile.availability ||
    !Array.isArray(profile.availability) ||
    profile.availability.length === 0
  ) {
    missingFields.push("Availability");
  }

  if (!profile.preferredFormat || profile.preferredFormat.trim() === "") {
    missingFields.push("Preferred Format");
  }

  if (!profile.introVideoUrl || profile.introVideoUrl.trim() === "") {
    missingFields.push("Intro Video");
  }

  return missingFields;
};

// Validate student profile form data
export const validateStudentProfile = (formData) => {
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

// Validate file upload
export const validateStudentFileUpload = (file, allowedTypes, maxSizeMB) => {
  const errors = [];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size too large. Maximum size: ${maxSizeMB}MB`);
  }

  return errors;
};

// Format student profile for submission
export const formatStudentProfileForSubmission = (profile) => {
  return {
    phoneNumber: profile.phoneNumber || "",
    dateOfBirth: profile.dateOfBirth || "",
    bio: profile.bio || "",
    program: profile.program || "",
    major: profile.major || "",
    gpa: profile.gpa || "",
    expectedGraduation: profile.expectedGraduation || "",
    academicStanding: profile.academicStanding || "",
    enrollmentDate: profile.enrollmentDate || "",
    subjects: Array.isArray(profile.subjects) ? profile.subjects : [],
    availability: Array.isArray(profile.availability)
      ? profile.availability
      : [],
    preferredFormat: profile.preferredFormat || "",
    additionalNotes: profile.additionalNotes || "",
    profileImage: profile.profileImage || null,
  };
};

// Get program options
export const getProgramOptions = () => [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

// Get preferred format options
export const getPreferredFormatOptions = () => [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" },
];

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
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

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
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
