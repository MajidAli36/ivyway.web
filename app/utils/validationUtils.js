// Validation utilities for teacher dashboard forms

export const validationRules = {
  // Teacher Profile Validation
  teacherProfile: {
    schoolName: { required: true, minLength: 2, maxLength: 100 },
    subjects: { required: true, minItems: 1 },
    gradeLevels: { required: true, minItems: 1 },
    degree: { maxLength: 100 },
    institution: { maxLength: 100 },
    bio: { maxLength: 1000 },
  },

  // Student Referral Validation
  studentReferral: {
    studentName: { required: true, minLength: 2, maxLength: 100 },
    studentEmail: { email: true, maxLength: 255 },
    studentPhone: { phone: true },
    gradeLevel: { required: true },
    subjects: { required: true, minItems: 1 },
    parentEmail: { email: true, maxLength: 255 },
    parentPhone: { phone: true },
  },

  // Teacher Assignment Validation
  teacherAssignment: {
    studentReferralId: { required: true, uuid: true },
    providerId: { required: true, uuid: true },
    assignmentType: { required: true, enum: ["tutoring", "counseling"] },
    frequency: {
      required: true,
      enum: ["daily", "weekly", "biweekly", "monthly", "as-needed"],
    },
    startDate: { required: true },
    sessionDuration: { required: true, min: 15, max: 480 },
  },

  // Progress Report Validation
  progressReport: {
    studentReferralId: { required: true, uuid: true },
    reportType: {
      required: true,
      enum: ["academic", "behavioral", "attendance", "general"],
    },
    title: { required: true, minLength: 2, maxLength: 200 },
    content: { required: true, minLength: 10 },
  },
};

// Validation functions
export const validateField = (value, rules) => {
  const errors = [];

  // Required validation
  if (
    rules.required &&
    (!value || (Array.isArray(value) && value.length === 0))
  ) {
    errors.push("This field is required");
    return errors;
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return errors;
  }

  // String validations
  if (typeof value === "string") {
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters long`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters long`);
    }

    // Email validation
    if (rules.email && !isValidEmail(value)) {
      errors.push("Please enter a valid email address");
    }

    // Phone validation
    if (rules.phone && !isValidPhone(value)) {
      errors.push("Please enter a valid phone number");
    }

    // UUID validation
    if (rules.uuid && !isValidUUID(value)) {
      errors.push("Please enter a valid ID");
    }
  }

  // Number validations
  if (typeof value === "number") {
    // Min value validation
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`Must be at least ${rules.min}`);
    }

    // Max value validation
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`Must be no more than ${rules.max}`);
    }
  }

  // Array validations
  if (Array.isArray(value)) {
    // Min items validation
    if (rules.minItems && value.length < rules.minItems) {
      errors.push(`Must select at least ${rules.minItems} item(s)`);
    }
  }

  // Enum validation
  if (rules.enum && !rules.enum.includes(value)) {
    errors.push(`Must be one of: ${rules.enum.join(", ")}`);
  }

  return errors;
};

export const validateForm = (formData, formType) => {
  const rules = validationRules[formType];
  if (!rules) {
    throw new Error(`No validation rules found for form type: ${formType}`);
  }

  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const fieldValue = formData[field];
    const fieldErrors = validateField(fieldValue, fieldRules);

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });

  return {
    isValid,
    errors,
  };
};

// Individual validation functions
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Check if it's a valid US phone number (10 digits)
  return cleaned.length === 10;
};

export const isValidUUID = (uuid) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Form-specific validation functions
export const validateTeacherProfile = (formData) => {
  return validateForm(formData, "teacherProfile");
};

export const validateStudentReferral = (formData) => {
  return validateForm(formData, "studentReferral");
};

export const validateTeacherAssignment = (formData) => {
  return validateForm(formData, "teacherAssignment");
};

export const validateProgressReport = (formData) => {
  return validateForm(formData, "progressReport");
};

// Custom validation functions for complex fields
export const validateAcademicProgress = (academicProgress) => {
  const errors = {};

  if (!academicProgress.subjects || academicProgress.subjects.length === 0) {
    errors.subjects = ["At least one subject is required"];
  }

  if (academicProgress.grades) {
    Object.keys(academicProgress.grades).forEach((subject) => {
      const grade = academicProgress.grades[subject];
      if (grade && !isValidGrade(grade)) {
        errors[`grades.${subject}`] = ["Please enter a valid grade"];
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAttendanceData = (attendanceData) => {
  const errors = {};

  if (attendanceData.totalDays < 0) {
    errors.totalDays = ["Total days cannot be negative"];
  }

  if (attendanceData.presentDays < 0) {
    errors.presentDays = ["Present days cannot be negative"];
  }

  if (attendanceData.absentDays < 0) {
    errors.absentDays = ["Absent days cannot be negative"];
  }

  if (attendanceData.tardyDays < 0) {
    errors.tardyDays = ["Tardy days cannot be negative"];
  }

  if (
    attendanceData.presentDays +
      attendanceData.absentDays +
      attendanceData.tardyDays >
    attendanceData.totalDays
  ) {
    errors.totalDays = [
      "Sum of present, absent, and tardy days cannot exceed total days",
    ];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const isValidGrade = (grade) => {
  const validGrades = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
  ];
  return validGrades.includes(grade);
};

// Sanitization functions
export const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim();
};

export const sanitizeEmail = (email) => {
  if (typeof email !== "string") return email;
  return email.trim().toLowerCase();
};

export const sanitizePhone = (phone) => {
  if (typeof phone !== "string") return phone;
  return phone.replace(/\D/g, "");
};

export const sanitizeFormData = (formData, formType) => {
  const sanitized = { ...formData };

  // Sanitize string fields
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeString(sanitized[key]);
    }
  });

  // Form-specific sanitization
  if (formType === "studentReferral" || formType === "teacherProfile") {
    if (sanitized.studentEmail || sanitized.email) {
      const emailField = sanitized.studentEmail ? "studentEmail" : "email";
      sanitized[emailField] = sanitizeEmail(sanitized[emailField]);
    }
    if (sanitized.studentPhone || sanitized.phone) {
      const phoneField = sanitized.studentPhone ? "studentPhone" : "phone";
      sanitized[phoneField] = sanitizePhone(sanitized[phoneField]);
    }
  }

  return sanitized;
};

// Error message formatting
export const formatValidationErrors = (errors) => {
  const formatted = {};

  Object.keys(errors).forEach((field) => {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors)) {
      formatted[field] = fieldErrors[0]; // Take first error message
    } else {
      formatted[field] = fieldErrors;
    }
  });

  return formatted;
};

// Field display names for better error messages
export const fieldDisplayNames = {
  // Teacher Profile
  schoolName: "School Name",
  subjects: "Subjects",
  gradeLevels: "Grade Levels",
  degree: "Degree",
  institution: "Institution",
  bio: "Bio",

  // Student Referral
  studentName: "Student Name",
  studentEmail: "Student Email",
  studentPhone: "Student Phone",
  gradeLevel: "Grade Level",
  parentName: "Parent/Guardian Name",
  parentEmail: "Parent/Guardian Email",
  parentPhone: "Parent/Guardian Phone",
  parentRelationship: "Relationship",

  // Teacher Assignment
  studentReferralId: "Student",
  providerId: "Provider",
  assignmentType: "Assignment Type",
  frequency: "Frequency",
  startDate: "Start Date",
  sessionDuration: "Session Duration",

  // Progress Report
  reportType: "Report Type",
  title: "Title",
  content: "Content",
};

// Get user-friendly field name
export const getFieldDisplayName = (fieldName) => {
  return fieldDisplayNames[fieldName] || fieldName;
};

// Complete validation with user-friendly messages
export const validateFormWithMessages = (formData, formType) => {
  const validation = validateForm(formData, formType);

  if (!validation.isValid) {
    const formattedErrors = {};

    Object.keys(validation.errors).forEach((field) => {
      const fieldDisplayName = getFieldDisplayName(field);
      const errorMessage = validation.errors[field][0];
      formattedErrors[field] = `${fieldDisplayName}: ${errorMessage}`;
    });

    return {
      isValid: false,
      errors: formattedErrors,
    };
  }

  return {
    isValid: true,
    errors: {},
  };
};

export default {
  validateField,
  validateForm,
  validateTeacherProfile,
  validateStudentReferral,
  validateTeacherAssignment,
  validateProgressReport,
  validateAcademicProgress,
  validateAttendanceData,
  sanitizeFormData,
  formatValidationErrors,
  validateFormWithMessages,
  isValidEmail,
  isValidPhone,
  isValidUUID,
  isValidDate,
  isValidURL,
  isValidGrade,
  getFieldDisplayName,
};
