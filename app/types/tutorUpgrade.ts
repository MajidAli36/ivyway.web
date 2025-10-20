// Tutor Upgrade Types

export interface TutorProfile {
  id: string;
  userId: string;
  tutorType: 'regular' | 'advanced';
  hourlyRate: number;
  completedSessions: number;
  profileCompletion: number;
  upgradeApplicationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  lastUpgradeDate?: Date;
  advancedSubjects?: string[];
  standardizedTestExpertise?: string[];
  apIbExpertise?: string[];
}

export interface UpgradeApplication {
  id: string;
  tutorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applicationDate: Date;
  reviewedDate?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  customRejectionReason?: string;
  subjectExpertise: string[];
  qualifications: {
    standardizedTests: string[];
    apIbSubjects: string[];
    collegeDegree: string;
    teachingExperience: string;
    certifications: string[];
  };
  motivation: string;
  additionalInfo?: string;
  tutor?: {
    id: string;
    fullName: string;
    email: string;
  };
  reviewer?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface UpgradeEligibility {
  isEligible: boolean;
  requirements: {
    completedSessions: number;
    requiredSessions: number;
    profileCompletion: number;
    requiredProfileCompletion: number;
    hasActiveApplication: boolean;
    lastRejectionDate: Date | null;
    canReapply: boolean;
  };
  missingRequirements: string[];
}

export interface TutorStats {
  completedSessions: number;
  totalEarnings: number;
  averageRating: number;
  profileCompletion: number;
  upgradeApplicationStatus: string;
  tutorType: 'regular' | 'advanced';
  currentHourlyRate: number;
  potentialAdvancedRate: number;
}

export interface UpgradeStatistics {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  approvalRate: number;
  averageReviewTime: string;
  monthlyApplications: Array<{
    month: string;
    count: number;
  }>;
}

export interface ApplicationFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface ApplicationsResponse {
  applications: UpgradeApplication[];
  pagination: PaginationInfo;
}

export interface ReviewData {
  status: 'approved' | 'rejected';
  reviewNotes: string;
  rejectionReason?: string;
  customRejectionReason?: string;
}

export interface BulkReviewData {
  applicationIds: string[];
  status: 'approved' | 'rejected';
  reviewNotes: string;
}

export interface EligibleTutor {
  id: string;
  fullName: string;
  email: string;
  completedSessions: number;
  profileCompletion: number;
  averageRating: number;
  currentRate: number;
  potentialRate: number;
}

export interface EligibleTutorsResponse {
  tutors: EligibleTutor[];
  pagination: PaginationInfo;
}

// Rejection reasons enum
export enum RejectionReason {
  INSUFFICIENT_SESSIONS = 'insufficient_sessions',
  INSUFFICIENT_EXPERIENCE = 'insufficient_experience',
  INCOMPLETE_PROFILE = 'incomplete_profile',
  POOR_PERFORMANCE = 'poor_performance',
  INSUFFICIENT_QUALIFICATIONS = 'insufficient_qualifications',
  OTHER = 'other'
}

// Subject expertise options
export const SUBJECT_EXPERTISE_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Computer Science',
  'Economics',
  'Psychology',
  'Statistics',
  'Calculus',
  'Algebra',
  'Geometry',
  'Trigonometry',
  'Pre-Calculus',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C',
  'AP Chemistry',
  'AP Biology',
  'AP English Language',
  'AP English Literature',
  'AP US History',
  'AP World History',
  'AP Computer Science A',
  'AP Computer Science Principles',
  'AP Economics',
  'AP Psychology',
  'AP Statistics'
];

// Standardized test options
export const STANDARDIZED_TEST_OPTIONS = [
  'SAT',
  'ACT',
  'GRE',
  'GMAT',
  'LSAT',
  'MCAT',
  'AP Exams',
  'IB Exams',
  'TOEFL',
  'IELTS'
];

// AP/IB subject options
export const AP_IB_SUBJECT_OPTIONS = [
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C: Mechanics',
  'AP Physics C: Electricity and Magnetism',
  'AP Chemistry',
  'AP Biology',
  'AP English Language and Composition',
  'AP English Literature and Composition',
  'AP US History',
  'AP World History',
  'AP Computer Science A',
  'AP Computer Science Principles',
  'AP Macroeconomics',
  'AP Microeconomics',
  'AP Psychology',
  'AP Statistics',
  'IB Mathematics HL',
  'IB Mathematics SL',
  'IB Physics HL',
  'IB Physics SL',
  'IB Chemistry HL',
  'IB Chemistry SL',
  'IB Biology HL',
  'IB Biology SL',
  'IB English A HL',
  'IB English A SL',
  'IB History HL',
  'IB History SL'
];

// Certification options
export const CERTIFICATION_OPTIONS = [
  'Teaching Certificate',
  'Subject Matter Expert Certification',
  'Online Teaching Certification',
  'Special Education Certification',
  'ESL/TESOL Certification',
  'Advanced Placement Certification',
  'International Baccalaureate Certification',
  'Professional Development Certificate',
  'Continuing Education Certificate',
  'Other Professional Certification'
];
