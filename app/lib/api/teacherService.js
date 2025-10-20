import apiClient from "./client";
import { teacherProfileService } from "./teacherProfileService";
import { providersService } from "./providersService";
import { studentReferralsService } from "./studentReferralsService";
import { teacherAssignmentsService } from "./teacherAssignmentsService";
import { progressReportsService } from "./progressReportsService";
import { adminTeacherService } from "./adminTeacherService";
import { messagesService } from "./messagesService";
import { notificationsService } from "./notificationsService";
import { aiConversationsService } from "./aiConversationsService";

// Teacher Profile Management
export const teacherProfile = {
  // Create teacher profile
  create: (profileData) => teacherProfileService.createProfile(profileData),

  // Get current teacher's profile
  getMyProfile: () => teacherProfileService.getProfile(),

  // Update teacher profile
  update: (profileData) => teacherProfileService.updateProfile(profileData),

  // Get teacher profile by ID (admin)
  getById: (id) => apiClient.get(`/admin/teachers/${id}`),

  // Verify teacher profile (admin)
  verify: (id, data) => apiClient.put(`/admin/teachers/${id}/verify`, data),

  // Update teacher profile (admin)
  updateAdmin: (id, profileData) =>
    apiClient.put(`/admin/teachers/${id}`, profileData),

  // Delete teacher profile (admin)
  delete: (id) => apiClient.delete(`/admin/teachers/${id}`),

  // Get all teacher profiles (admin)
  getAll: (params = {}) => apiClient.get("/admin/teachers", params),
};

// Student Referral Management
export const studentReferrals = {
  // Refer a new student
  referStudent: (referralData) =>
    studentReferralsService.createReferral(referralData),

  // Get referred students
  getReferredStudents: (params = {}) =>
    studentReferralsService.getReferrals(params),

  // Alias for UI: Get all referrals
  getAll: (params = {}) => studentReferralsService.getReferrals(params),

  // Get specific referral
  getReferralById: (referralId) =>
    studentReferralsService.getReferral(referralId),

  // Alias for UI: Get referral by id
  getById: (referralId) => studentReferralsService.getReferral(referralId),

  // Update referral status
  updateStatus: (referralId, data) =>
    studentReferralsService.updateReferral(referralId, data),

  // Alias for UI: Update referral
  update: (referralId, data) =>
    studentReferralsService.updateReferral(referralId, data),

  // Delete referral
  delete: (referralId) => studentReferralsService.deleteReferral(referralId),

  // Get teacher's referred students (admin)
  getTeacherStudents: (teacherId, params = {}) =>
    apiClient.get(`/admin/teachers/${teacherId}/students`, params),

  // Get referral statistics
  getStatistics: () => studentReferralsService.getStatistics(),
};

// Provider Assignment Management
export const teacherAssignments = {
  // Assign provider to student
  assignProvider: (assignmentData) =>
    teacherAssignmentsService.createAssignment(assignmentData),

  // Get teacher's assignments
  getTeacherAssignments: (params = {}) =>
    teacherAssignmentsService.getAssignments(params),

  // Get available providers
  getAvailableProviders: (params = {}) => providersService.getProviders(params),

  // Accept assignment (provider)
  accept: (assignmentId) =>
    apiClient.post(`/assignments/${assignmentId}/accept`),

  // Decline assignment (provider)
  decline: (assignmentId, data) =>
    apiClient.post(`/assignments/${assignmentId}/decline`, data),

  // Update assignment status (provider)
  updateStatus: (assignmentId, data) =>
    apiClient.put(`/assignments/${assignmentId}/status`, data),

  // Get provider's assignments
  getProviderAssignments: (params = {}) =>
    apiClient.get("/assignments", params),

  // Get assignment by ID
  getById: (assignmentId) =>
    teacherAssignmentsService.getAssignment(assignmentId),

  // Update assignment
  update: (assignmentId, data) =>
    teacherAssignmentsService.updateAssignment(assignmentId, data),

  // Delete assignment
  delete: (assignmentId) =>
    teacherAssignmentsService.deleteAssignment(assignmentId),

  // Get assignment statistics
  getStatistics: () => teacherAssignmentsService.getStatistics(),
};

// Progress Reporting
export const progressReports = {
  // Create progress report
  create: (reportData) => progressReportsService.createReport(reportData),

  // Get student progress reports
  getStudentReports: (studentId, params = {}) =>
    apiClient.get(`/teachers/students/${studentId}/progress-reports`, params),

  // Get all progress reports
  getAll: (params = {}) => progressReportsService.getReports(params),

  // Get single progress report
  getById: (reportId) => progressReportsService.getReport(reportId),

  // Share progress report
  share: (reportId) => apiClient.post(`/progress-reports/${reportId}/share`),

  // Unshare progress report
  unshare: (reportId) =>
    apiClient.post(`/progress-reports/${reportId}/unshare`),

  // Update progress report
  update: (reportId, reportData) =>
    progressReportsService.updateReport(reportId, reportData),

  // Submit progress report
  submit: (reportId) => progressReportsService.submitReport(reportId),

  // Delete progress report
  delete: (reportId) => progressReportsService.deleteReport(reportId),

  // Get shared progress reports (student/parent)
  getSharedReports: (params = {}) =>
    apiClient.get("/progress-reports/shared", params),

  // Get shared report by ID (student/parent)
  getSharedById: (reportId) =>
    apiClient.get(`/progress-reports/shared/${reportId}`),

  // Get report statistics
  getStatistics: (params = {}) => progressReportsService.getStatistics(params),
};

// Dashboard & Statistics
export const teacherDashboard = {
  // Get teacher dashboard
  getDashboard: () => teacherProfileService.getDashboard(),

  // Get teacher statistics
  getStatistics: () => apiClient.get("/teachers/statistics"),

  // Get teacher statistics (admin)
  getAdminStatistics: (teacherId) =>
    apiClient.get(`/admin/teachers/${teacherId}/statistics`),
};

// Available Providers
export const providers = {
  // Get all providers
  getAll: (filters = {}) => providersService.getProviders(filters),

  // Get tutors only
  getTutors: (filters = {}) => providersService.getTutors(filters),

  // Get counselors only
  getCounselors: (filters = {}) => providersService.getCounselors(filters),
};

// Admin Teacher Management
export const adminTeachers = {
  // Get admin dashboard stats
  getDashboardStats: () => adminTeacherService.getDashboardStats(),

  // Get all teachers
  getAll: (filters = {}) => adminTeacherService.getTeachers(filters),

  // Approve teacher
  approve: (id, notes) => adminTeacherService.approveTeacher(id, notes),

  // Reject teacher
  reject: (id, notes) => adminTeacherService.rejectTeacher(id, notes),

  // Get all referrals (admin)
  getReferrals: (filters = {}) => adminTeacherService.getReferrals(filters),

  // Approve referral
  approveReferral: (id, notes) =>
    adminTeacherService.approveReferral(id, notes),

  // Reject referral
  rejectReferral: (id, notes) => adminTeacherService.rejectReferral(id, notes),

  // Get all assignments (admin)
  getAssignments: (filters = {}) => adminTeacherService.getAssignments(filters),

  // Approve assignment
  approveAssignment: (id, notes) =>
    adminTeacherService.approveAssignment(id, notes),

  // Reject assignment
  rejectAssignment: (id, notes) =>
    adminTeacherService.rejectAssignment(id, notes),
};

// Messages
export const messages = {
  // Get all messages
  getAll: (filters = {}) => messagesService.getMessages(filters),

  // Get conversation
  getConversation: (id) => messagesService.getConversation(id),

  // Send message
  sendMessage: (conversationId, data) =>
    messagesService.sendMessage(conversationId, data),

  // Mark as read
  markAsRead: (messageId) => messagesService.markAsRead(messageId),

  // Mark all as read
  markAllAsRead: () => messagesService.markAllAsRead(),

  // Get unread count
  getUnreadCount: () => messagesService.getUnreadCount(),
};

// Notifications
export const notifications = {
  // Get all notifications
  getAll: (filters = {}) => notificationsService.getNotifications(filters),

  // Get notification
  getById: (id) => notificationsService.getNotification(id),

  // Mark as read
  markAsRead: (id) => notificationsService.markAsRead(id),

  // Mark all as read
  markAllAsRead: () => notificationsService.markAllAsRead(),

  // Delete notification
  delete: (id) => notificationsService.deleteNotification(id),

  // Get unread count
  getUnreadCount: () => notificationsService.getUnreadCount(),

  // Get statistics
  getStatistics: () => notificationsService.getStatistics(),
};

// AI Conversations
export const aiConversations = {
  // Get all conversations
  getAll: (filters = {}) => aiConversationsService.getConversations(filters),

  // Get conversation
  getById: (id) => aiConversationsService.getConversation(id),

  // Create conversation
  create: (title) => aiConversationsService.createConversation(title),

  // Send message
  sendMessage: (conversationId, message) =>
    aiConversationsService.sendMessage(conversationId, message),

  // Delete conversation
  delete: (id) => aiConversationsService.deleteConversation(id),

  // Get statistics
  getStatistics: () => aiConversationsService.getStatistics(),
};

// Mock data for development
export const mockTeacherData = {
  profile: {
    id: "teacher_123",
    userId: "user_456",
    schoolName: "Lincoln High School",
    schoolDistrict: "Metro School District",
    schoolAddress: "123 Education St, City, State 12345",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    gradeLevels: ["9", "10", "11", "12"],
    teachingExperience: 8,
    education: {
      degree: "Master of Education",
      institution: "State University",
      year: 2015,
    },
    certifications: ["Teaching License", "Advanced Mathematics Certification"],
    bio: "Passionate educator with 8 years of experience in STEM subjects.",
    referralCode: "T1A2B3C4",
    totalReferrals: 15,
    activeStudents: 8,
    isVerified: true,
    verificationStatus: "verified",
    preferences: {
      notifications: true,
      emailUpdates: true,
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },

  referrals: [
    {
      id: "ref_001",
      teacherId: "teacher_123",
      studentId: "student_789",
      referralCode: "T1A2B3C4",
      studentName: "John Smith",
      studentEmail: "john.smith@email.com",
      studentPhone: "+1234567890",
      gradeLevel: "11",
      subjects: ["Mathematics", "Physics"],
      academicGoals: "Improve calculus understanding and prepare for AP exams",
      specialNeeds: "Needs extra help with problem-solving techniques",
      parentContact: {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1234567891",
        relationship: "Mother",
      },
      status: "active",
      registrationDate: "2024-01-16T09:00:00Z",
      firstSessionDate: "2024-01-18T15:00:00Z",
      assignedTutorId: "tutor_456",
      assignedCounselorId: "counselor_789",
      notes: "Student shows great potential, very motivated",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T16:00:00Z",
    },
    {
      id: "ref_002",
      teacherId: "teacher_123",
      studentId: null,
      referralCode: "T1A2B3C4",
      studentName: "Sarah Johnson",
      studentEmail: "sarah.johnson@email.com",
      studentPhone: "+1234567892",
      gradeLevel: "10",
      subjects: ["Chemistry"],
      academicGoals: "Understand organic chemistry concepts",
      status: "pending",
      notes: "Waiting for student registration",
      createdAt: "2024-01-19T14:00:00Z",
      updatedAt: "2024-01-19T14:00:00Z",
    },
  ],

  assignments: [
    {
      id: "assign_001",
      teacherId: "teacher_123",
      studentId: "student_789",
      providerId: "tutor_456",
      providerRole: "tutor",
      referralId: "ref_001",
      assignmentType: "tutoring",
      subjects: ["Mathematics", "Physics"],
      goals: "Improve calculus understanding and prepare for AP exams",
      specialInstructions: "Focus on problem-solving techniques",
      status: "active",
      assignedAt: "2024-01-16T10:00:00Z",
      acceptedAt: "2024-01-16T11:30:00Z",
      startDate: "2024-01-18T00:00:00Z",
      endDate: "2024-06-15T00:00:00Z",
      frequency: "weekly",
      sessionDuration: 60,
      notes: "Student responds well to visual learning",
      createdAt: "2024-01-16T10:00:00Z",
      updatedAt: "2024-01-20T16:00:00Z",
    },
  ],

  progressReports: [
    {
      id: "report_001",
      teacherId: "teacher_123",
      studentId: "student_789",
      referralId: "ref_001",
      reportType: "monthly",
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      progressLevel: "good",
      academicPerformance: {
        homeworkCompletion: 85,
        testScores: 78,
        participation: 90,
      },
      skillsDeveloped: [
        "Problem-solving",
        "Critical thinking",
        "Mathematical reasoning",
      ],
      areasForImprovement: ["Time management", "Complex problem breakdown"],
      strengths: ["Strong conceptual understanding", "Good work ethic"],
      challenges: ["Rushing through problems", "Need for more practice"],
      recommendations:
        "Continue with current approach, add more practice problems",
      nextSteps: "Focus on integration techniques next month",
      parentNotes: "Student is making good progress, keep up the great work!",
      teacherNotes: "Student shows improvement in problem-solving approach",
      reportDate: "2024-01-20T00:00:00Z",
      isShared: true,
      sharedAt: "2024-01-20T10:00:00Z",
      createdAt: "2024-01-20T09:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
    },
  ],

  dashboard: {
    profile: {
      id: "teacher_123",
      schoolName: "Lincoln High School",
      referralCode: "T1A2B3C4",
      isVerified: true,
      verificationStatus: "verified",
    },
    statistics: {
      totalReferrals: 15,
      activeStudents: 8,
      pendingAssignments: 2,
      completedReports: 12,
    },
    recentActivity: {
      referrals: [
        {
          id: "ref_001",
          studentName: "John Smith",
          status: "active",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "ref_002",
          studentName: "Sarah Johnson",
          status: "pending",
          createdAt: "2024-01-19T14:00:00Z",
        },
      ],
      assignments: [
        {
          id: "assign_001",
          studentName: "John Smith",
          providerName: "Dr. Emily Chen",
          status: "active",
          assignedAt: "2024-01-16T10:00:00Z",
        },
      ],
    },
  },

  availableProviders: [
    {
      id: "tutor_456",
      firstName: "Dr. Emily",
      lastName: "Chen",
      email: "emily.chen@email.com",
      subjects: ["Mathematics", "Physics", "Chemistry"],
      gradeLevels: ["9", "10", "11", "12"],
      experience: 5,
      rating: 4.8,
      bio: "Experienced mathematics tutor with PhD in Physics",
      isAvailable: true,
    },
    {
      id: "counselor_789",
      firstName: "Michael",
      lastName: "Rodriguez",
      email: "michael.rodriguez@email.com",
      subjects: ["Academic Counseling", "Career Guidance"],
      gradeLevels: ["9", "10", "11", "12"],
      experience: 7,
      rating: 4.9,
      bio: "Licensed school counselor specializing in college preparation",
      isAvailable: true,
    },
  ],

  messages: [
    {
      id: "conv_001",
      type: "student",
      name: "John Smith",
      lastMessage: "Thank you for the progress report!",
      timestamp: "2024-01-20T10:30:00Z",
      unread: true,
      avatar: null,
    },
    {
      id: "conv_002",
      type: "parent",
      name: "Jane Smith",
      lastMessage: "When is the next tutoring session?",
      timestamp: "2024-01-20T09:15:00Z",
      unread: false,
      avatar: null,
    },
    {
      id: "conv_003",
      type: "tutor",
      name: "Dr. Emily Chen",
      lastMessage: "The student is making great progress in calculus.",
      timestamp: "2024-01-19T16:45:00Z",
      unread: true,
      avatar: null,
    },
  ],

  notifications: [
    {
      id: "notif_001",
      type: "referral",
      title: "New Student Referral",
      message: "John Smith has been referred for mathematics tutoring",
      timestamp: "2024-01-20T10:00:00Z",
      read: false,
      priority: "high",
    },
    {
      id: "notif_002",
      type: "assignment",
      title: "Assignment Approved",
      message: "Your assignment for Sarah Johnson has been approved",
      timestamp: "2024-01-20T09:30:00Z",
      read: false,
      priority: "medium",
    },
    {
      id: "notif_003",
      type: "report",
      title: "Progress Report Due",
      message: "Progress report for Alice Johnson is due tomorrow",
      timestamp: "2024-01-19T14:20:00Z",
      read: true,
      priority: "high",
    },
    {
      id: "notif_004",
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 2-4 AM",
      timestamp: "2024-01-19T10:00:00Z",
      read: true,
      priority: "low",
    },
  ],

  aiConversations: [
    {
      id: "conv_001",
      title: "Student Progress Analysis",
      lastMessage: "How can I improve John's calculus performance?",
      timestamp: "2024-01-20T10:30:00Z",
      messageCount: 5,
    },
    {
      id: "conv_002",
      title: "Teaching Strategies",
      lastMessage:
        "What are effective methods for teaching algebra to struggling students?",
      timestamp: "2024-01-19T15:45:00Z",
      messageCount: 3,
    },
    {
      id: "conv_003",
      title: "Parent Communication",
      lastMessage:
        "How should I address concerns about a student's homework completion?",
      timestamp: "2024-01-18T09:20:00Z",
      messageCount: 7,
    },
  ],
};

export default {
  teacherProfile,
  studentReferrals,
  teacherAssignments,
  progressReports,
  teacherDashboard,
  providers,
  adminTeachers,
  messages,
  notifications,
  aiConversations,
  mockTeacherData,
};
