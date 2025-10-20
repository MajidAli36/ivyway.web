import apiClient from "./client";

// Teacher-specific notification service
export const teacherNotifications = {
  // Get all notifications with teacher-specific filtering
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.type) queryParams.append('type', params.type);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    return apiClient.get(`/notifications?${queryParams.toString()}`);
  },

  // Get unread count
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),

  // Mark single notification as read
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => apiClient.patch("/notifications/mark-all-read"),

  // Delete notification
  delete: (id) => apiClient.delete(`/notifications/${id}`),

  // Get notification by ID
  getById: (id) => apiClient.get(`/notifications/${id}`),

  // Get notification statistics
  getStats: () => apiClient.get("/notifications/stats"),

  // Update notification preferences
  updatePreferences: (preferences) => 
    apiClient.put("/notifications/preferences", preferences),

  // Get notification preferences
  getPreferences: () => apiClient.get("/notifications/preferences"),
};

// Mock data for development/testing
export const mockTeacherNotifications = [
  {
    id: "notif_001",
    type: "teacher_profile_approved",
    title: "Teacher Profile Approved! 🎉",
    content: "Congratulations! Your teacher profile has been approved. You can now start referring students and creating assignments.",
    metadata: {
      teacherProfileId: "profile_123",
      schoolName: "Lincoln High School",
      verificationNotes: "All documents verified successfully"
    },
    isRead: false,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: "notif_002",
    type: "student_referral_approved",
    title: "Student Referral Approved! ✅",
    content: "Your student referral for {studentName} has been approved. You can now create assignments for this student.",
    metadata: {
      studentReferralId: "ref_456",
      studentName: "Sarah Johnson",
      studentEmail: "sarah.johnson@email.com",
      adminNotes: "Student meets all requirements"
    },
    isRead: false,
    createdAt: "2024-01-19T15:45:00Z",
    updatedAt: "2024-01-19T15:45:00Z"
  },
  {
    id: "notif_003",
    type: "teacher_assignment_approved",
    title: "Assignment Approved! 🎯",
    content: "Your assignment for {assignmentType} has been approved and is now active.",
    metadata: {
      assignmentId: "assign_789",
      assignmentType: "Math Tutoring",
      frequency: "Weekly",
      startDate: "2024-01-22",
      adminNotes: "Great assignment structure"
    },
    isRead: true,
    createdAt: "2024-01-18T09:20:00Z",
    updatedAt: "2024-01-18T09:20:00Z"
  },
  {
    id: "notif_004",
    type: "teacher_profile_rejected",
    title: "Teacher Profile Rejected",
    content: "Your teacher profile has been rejected. Please review the feedback and resubmit your application.",
    metadata: {
      teacherProfileId: "profile_124",
      schoolName: "Roosevelt Elementary",
      verificationNotes: "Missing required documents: Teaching certificate"
    },
    isRead: true,
    createdAt: "2024-01-17T14:15:00Z",
    updatedAt: "2024-01-17T14:15:00Z"
  },
  {
    id: "notif_005",
    type: "student_referral_rejected",
    title: "Student Referral Rejected",
    content: "Your student referral for {studentName} has been rejected. Please review the feedback and contact support if needed.",
    metadata: {
      studentReferralId: "ref_457",
      studentName: "Michael Davis",
      studentEmail: "michael.davis@email.com",
      adminNotes: "Student does not meet age requirements"
    },
    isRead: true,
    createdAt: "2024-01-16T11:30:00Z",
    updatedAt: "2024-01-16T11:30:00Z"
  },
  {
    id: "notif_006",
    type: "teacher_assignment_rejected",
    title: "Assignment Rejected",
    content: "Your assignment for {assignmentType} has been rejected. Please review the feedback and create a new assignment if needed.",
    metadata: {
      assignmentId: "assign_790",
      assignmentType: "Science Tutoring",
      frequency: "Daily",
      adminNotes: "Assignment frequency too high for student capacity"
    },
    isRead: true,
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-15T16:45:00Z"
  },
  {
    id: "notif_007",
    type: "teacher_assignment_updated",
    title: "Assignment Updated",
    content: "Your assignment for {assignmentType} has been updated successfully.",
    metadata: {
      assignmentId: "assign_791",
      assignmentType: "English Literature",
      frequency: "Bi-weekly"
    },
    isRead: false,
    createdAt: "2024-01-14T08:30:00Z",
    updatedAt: "2024-01-14T08:30:00Z"
  },
  {
    id: "notif_008",
    type: "teacher_assignment_cancelled",
    title: "Assignment Cancelled",
    content: "Your assignment for {assignmentType} has been cancelled.",
    metadata: {
      assignmentId: "assign_792",
      assignmentType: "History Tutoring",
      frequency: "Weekly"
    },
    isRead: true,
    createdAt: "2024-01-13T12:00:00Z",
    updatedAt: "2024-01-13T12:00:00Z"
  }
];

// Helper function to format notification content with metadata
export const formatNotificationContent = (notification) => {
  let content = notification.content;
  
  if (notification.metadata) {
    Object.keys(notification.metadata).forEach(key => {
      const placeholder = `{${key}}`;
      if (content.includes(placeholder)) {
        content = content.replace(
          new RegExp(placeholder, 'g'), 
          notification.metadata[key] || ''
        );
      }
    });
  }
  
  return content;
};

// Helper function to get notification priority
export const getNotificationPriority = (type) => {
  const highPriority = [
    'teacher_profile_approved',
    'teacher_profile_rejected',
    'student_referral_approved',
    'student_referral_rejected'
  ];
  
  const mediumPriority = [
    'teacher_assignment_approved',
    'teacher_assignment_rejected',
    'teacher_assignment_cancelled'
  ];
  
  if (highPriority.includes(type)) return 'high';
  if (mediumPriority.includes(type)) return 'medium';
  return 'low';
};

// Helper function to get notification category
export const getNotificationCategory = (type) => {
  if (type.startsWith('teacher_profile')) return 'profile';
  if (type.startsWith('student_referral')) return 'referral';
  if (type.startsWith('teacher_assignment')) return 'assignment';
  return 'general';
};
