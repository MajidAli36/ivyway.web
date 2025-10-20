// Student Profile Constants

// File upload constants
export const FILE_UPLOAD_CONSTANTS = {
  PROFILE_IMAGE: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
  },
  INTRO_VIDEO: {
    MAX_SIZE_MB: 50,
    ALLOWED_TYPES: [
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/webm",
      "video/mkv",
    ],
    ALLOWED_EXTENSIONS: [".mp4", ".mov", ".avi", ".webm", ".mkv"],
  },
};

// Form validation constants
export const VALIDATION_CONSTANTS = {
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

// Program options
export const PROGRAM_OPTIONS = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "phd", label: "PhD" },
  { value: "other", label: "Other" },
];

// Preferred format options
export const PREFERRED_FORMAT_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
  { value: "hybrid", label: "Hybrid" },
];

// Profile completion colors
export const COMPLETION_COLORS = {
  LOW: "#ef4444", // Red (0-25%)
  MEDIUM: "#f97316", // Orange (26-50%)
  HIGH: "#eab308", // Yellow (51-75%)
  COMPLETE: "#22c55e", // Green (76-100%)
};

// API endpoints
export const API_ENDPOINTS = {
  GET_MY_PROFILE: "/student-profiles/profile/me",
  CREATE_UPDATE_PROFILE: "/student-profiles/profile",
  UPLOAD_INTRO_VIDEO: "/student-profiles/profile/intro-video",
  DELETE_PROFILE: "/student-profiles/profile",
  GET_ALL_STUDENTS: "/student-profiles",
  GET_STUDENT_BY_ID: "/student-profiles/:id",
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_PROFILE: "Failed to load student profile",
  UPDATE_PROFILE: "Failed to update student profile",
  UPLOAD_VIDEO: "Failed to upload intro video",
  DELETE_PROFILE: "Failed to delete student profile",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size too large",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Student profile not found",
  SERVER_ERROR: "Server error. Please try again later.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully",
  VIDEO_UPLOADED: "Intro video uploaded successfully",
  PROFILE_DELETED: "Profile deleted successfully",
};

// Loading states
export const LOADING_STATES = {
  FETCHING: "fetching",
  SAVING: "saving",
  UPLOADING: "uploading",
  DELETING: "deleting",
};

// Form field names
export const FORM_FIELDS = {
  PHONE_NUMBER: "phoneNumber",
  DATE_OF_BIRTH: "dateOfBirth",
  BIO: "bio",
  PROGRAM: "program",
  MAJOR: "major",
  GPA: "gpa",
  EXPECTED_GRADUATION: "expectedGraduation",
  ACADEMIC_STANDING: "academicStanding",
  ENROLLMENT_DATE: "enrollmentDate",
  SUBJECTS: "subjects",
  AVAILABILITY: "availability",
  PREFERRED_FORMAT: "preferredFormat",
  ADDITIONAL_NOTES: "additionalNotes",
  PROFILE_IMAGE: "profileImage",
  INTRO_VIDEO: "introVideo",
};

// Profile sections
export const PROFILE_SECTIONS = {
  PERSONAL_INFO: "personalInfo",
  ACADEMIC_INFO: "academicInfo",
  TUTORING_PREFERENCES: "tutoringPreferences",
};

// Default profile values
export const DEFAULT_PROFILE_VALUES = {
  phoneNumber: "",
  dateOfBirth: "",
  bio: "",
  program: "",
  major: "",
  gpa: "",
  expectedGraduation: "",
  academicStanding: "",
  enrollmentDate: "",
  subjects: [],
  availability: [],
  preferredFormat: "",
  additionalNotes: "",
  profileImage: "",
  introVideoUrl: "",
};
