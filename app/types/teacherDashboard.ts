// Teacher Dashboard TypeScript Interfaces

export interface TeacherProfile {
  id: string;
  userId: string;
  schoolName: string;
  schoolAddress?: string;
  subjects: string[];
  gradeLevels: string[];
  degree?: string;
  institution?: string;
  certifications: string[];
  bio?: string;
  referralCode: string;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  verificationNotes?: string;
  totalReferrals: number;
  activeStudents: number;
  completedReports: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfileForm {
  schoolName: string;
  schoolAddress?: string;
  subjects: string[];
  gradeLevels: string[];
  degree?: string;
  institution?: string;
  certifications: string[];
  bio?: string;
}

export interface StudentReferral {
  id: string;
  teacherId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  gradeLevel: string;
  subjects: string[];
  academicGoals?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  parentRelationship?: string;
  status: "pending" | "approved" | "rejected" | "enrolled";
  adminNotes?: string;
  assignedTutorId?: string;
  assignedCounselorId?: string;
  enrollmentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  teacher?: TeacherProfile;
}

export interface StudentReferralForm {
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  gradeLevel: string;
  subjects: string[];
  academicGoals?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  parentRelationship?: string;
  notes?: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  studentReferralId: string;
  providerId: string;
  assignmentType: "tutoring" | "counseling";
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "as-needed";
  startDate: string;
  endDate?: string;
  sessionDuration: number; // in minutes
  goals?: string;
  specialInstructions?: string;
  status: "pending" | "active" | "completed" | "cancelled";
  adminApprovalStatus: "pending" | "approved" | "rejected";
  adminNotes?: string;
  teacherNotes?: string;
  providerNotes?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  studentReferral?: StudentReferral;
  provider?: Provider;
}

export interface TeacherAssignmentForm {
  studentReferralId: string;
  providerId: string;
  assignmentType: "tutoring" | "counseling";
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "as-needed";
  startDate: string;
  endDate?: string;
  sessionDuration: number;
  goals?: string;
  specialInstructions?: string;
}

export interface ProgressReport {
  id: string;
  teacherId: string;
  studentReferralId: string;
  assignmentId?: string;
  reportType: "academic" | "behavioral" | "attendance" | "general";
  title: string;
  content: string;
  academicProgress?: {
    subjects: string[];
    grades: Record<string, string>;
    improvements: string[];
    challenges: string[];
  };
  behavioralNotes?: string;
  attendanceData?: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    tardyDays: number;
    notes?: string;
  };
  recommendations?: string;
  nextSteps?: string;
  status: "draft" | "submitted" | "reviewed";
  attachments: string[]; // File URLs
  createdAt: string;
  updatedAt: string;
  // Relations
  studentReferral?: StudentReferral;
  assignment?: TeacherAssignment;
}

export interface ProgressReportForm {
  studentReferralId: string;
  assignmentId?: string;
  reportType: "academic" | "behavioral" | "attendance" | "general";
  title: string;
  content: string;
  academicProgress?: {
    subjects: string[];
    grades: Record<string, string>;
    improvements: string[];
    challenges: string[];
  };
  behavioralNotes?: string;
  attendanceData?: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    tardyDays: number;
    notes?: string;
  };
  recommendations?: string;
  nextSteps?: string;
  attachments?: File[];
}

export interface Provider {
  id: string;
  fullName: string;
  email: string;
  role: "tutor" | "counselor";
  subjects?: string[]; // For tutors
  specializations?: string[]; // For counselors
  rating?: number;
  isAvailable: boolean;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherDashboard {
  profile: TeacherProfile;
  statistics: {
    totalReferrals: number;
    activeStudents: number;
    pendingAssignments: number;
    completedReports: number;
  };
  recentReferrals: StudentReferral[];
  recentAssignments: TeacherAssignment[];
}

export interface AdminDashboardStats {
  teachers: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  referrals: {
    total: number;
    pending: number;
    approved: number;
    enrolled: number;
  };
  assignments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export interface ErrorState {
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
  networkError: boolean;
}

// Filter interfaces
export interface TeacherFilters {
  verificationStatus: string;
  search: string;
}

export interface ReferralFilters {
  status: string;
  search: string;
}

export interface AssignmentFilters {
  status: string;
  assignmentType: string;
  search: string;
}

export interface ProviderFilters {
  role: string;
  subjects: string[];
  specializations: string[];
  search: string;
  availability: string;
}

export interface ReportFilters {
  status: string;
  reportType: string;
  search: string;
}

// Form validation rules
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  uuid?: boolean;
  enum?: string[];
  minItems?: number;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

// Constants
export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art",
  "Music",
  "Physical Education",
  "Foreign Languages",
  "Social Studies",
  "Economics",
  "Psychology",
  "Philosophy",
  "Literature",
  "Writing",
  "Reading",
] as const;

export const GRADE_LEVELS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "Middle School (7th & 8th)",
  "High School (9-12)",
  "College/University",
  "Adult Education",
] as const;

export const CERTIFICATIONS = [
  "Teaching License",
  "Special Education",
  "ESL/TESOL",
  "Gifted Education",
  "Reading Specialist",
  "Math Specialist",
  "Science Specialist",
  "Administrative License",
  "National Board Certification",
  "Master's Degree in Education",
  "Doctorate in Education",
  "Subject Matter Certification",
] as const;

export const PARENT_RELATIONSHIPS = [
  "Mother",
  "Father",
  "Guardian",
  "Grandparent",
  "Aunt/Uncle",
  "Other",
] as const;

export const ASSIGNMENT_TYPES = [
  { value: "tutoring", label: "Tutoring" },
  { value: "counseling", label: "Counseling" },
] as const;

export const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "as-needed", label: "As Needed" },
] as const;

export const REPORT_TYPES = [
  { value: "academic", label: "Academic Progress" },
  { value: "behavioral", label: "Behavioral" },
  { value: "attendance", label: "Attendance" },
  { value: "general", label: "General" },
] as const;

export const GRADE_OPTIONS = [
  "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"
] as const;

export const SPECIALIZATIONS = [
  "Academic Support",
  "Test Preparation",
  "Study Skills",
  "Time Management",
  "Motivation",
  "Career Guidance",
  "College Planning",
  "Mental Health Support",
  "Social Skills",
  "Learning Disabilities",
  "Gifted Education",
  "ESL Support",
  "Special Needs",
  "Behavioral Issues",
  "Crisis Intervention",
] as const;

// Validation rules
export const teacherProfileValidation: ValidationRules = {
  schoolName: { required: true, minLength: 2, maxLength: 100 },
  subjects: { required: true, minItems: 1 },
  gradeLevels: { required: true, minItems: 1 },
  degree: { maxLength: 100 },
  institution: { maxLength: 100 },
  bio: { maxLength: 1000 }
};

export const studentReferralValidation: ValidationRules = {
  studentName: { required: true, minLength: 2, maxLength: 100 },
  studentEmail: { email: true, maxLength: 255 },
  studentPhone: { phone: true },
  gradeLevel: { required: true },
  subjects: { required: true, minItems: 1 },
  parentEmail: { email: true, maxLength: 255 },
  parentPhone: { phone: true }
};

export const assignmentValidation: ValidationRules = {
  studentReferralId: { required: true, uuid: true },
  providerId: { required: true, uuid: true },
  assignmentType: { required: true, enum: ["tutoring", "counseling"] },
  frequency: { required: true, enum: ["daily", "weekly", "biweekly", "monthly", "as-needed"] },
  startDate: { required: true },
  sessionDuration: { required: true, min: 15, max: 480 }
};

export const progressReportValidation: ValidationRules = {
  studentReferralId: { required: true, uuid: true },
  reportType: { required: true, enum: ["academic", "behavioral", "attendance", "general"] },
  title: { required: true, minLength: 2, maxLength: 200 },
  content: { required: true, minLength: 10 }
};
