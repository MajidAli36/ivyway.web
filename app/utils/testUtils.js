// Test utilities for Zoom meeting integration

/**
 * Generate mock meeting data for testing
 */
export const generateMockMeeting = (overrides = {}) => {
  const baseMeeting = {
    id: `meeting-${Date.now()}`,
    meetingId: `zoom-${Math.random().toString(36).substr(2, 9)}`,
    topic: "Test Counseling Session",
    status: "scheduled",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 60,
    serviceType: "counseling",
    joinUrl: "https://zoom.us/j/123456789",
    startUrl: "https://zoom.us/s/123456789",
    password: "test123",
    counselor: {
      id: "counselor-123",
      name: "Dr. Jane Smith",
      email: "jane.smith@example.com"
    },
    student: {
      id: "student-123", 
      name: "John Doe",
      email: "john.doe@example.com"
    },
    settings: {
      host_video: true,
      participant_video: true,
      waiting_room: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...baseMeeting, ...overrides };
};

/**
 * Generate multiple mock meetings
 */
export const generateMockMeetings = (count = 5, overrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    generateMockMeeting({
      id: `meeting-${index + 1}`,
      topic: `Test Meeting ${index + 1}`,
      startTime: new Date(Date.now() + (index + 1) * 60 * 60 * 1000).toISOString(),
      status: index % 3 === 0 ? "ended" : index % 3 === 1 ? "started" : "scheduled",
      ...overrides
    })
  );
};

/**
 * Generate mock user data
 */
export const generateMockUser = (role = "counselor", overrides = {}) => {
  const baseUser = {
    id: `${role}-${Date.now()}`,
    name: role === "counselor" ? "Dr. Test Counselor" : "Test Student",
    email: `${role}@test.com`,
    role: role,
    isAuthenticated: true
  };

  return { ...baseUser, ...overrides };
};

/**
 * Generate mock booking data
 */
export const generateMockBooking = (overrides = {}) => {
  const baseBooking = {
    id: `booking-${Date.now()}`,
    counselorId: "counselor-123",
    studentId: "student-123",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: "confirmed",
    serviceType: "counseling",
    meetingLink: "https://zoom.us/j/123456789",
    zoomMeetingId: "zoom-123456789"
  };

  return { ...baseBooking, ...overrides };
};

/**
 * Mock API responses
 */
export const mockApiResponses = {
  createMeeting: {
    success: true,
    message: "Counselor Zoom meeting created successfully",
    data: generateMockMeeting()
  },
  
  getMeetings: {
    success: true,
    message: "Meetings retrieved successfully",
    data: {
      meetings: generateMockMeetings(5),
      totalCount: 5,
      currentPage: 1,
      totalPages: 1
    }
  },
  
  updateMeeting: {
    success: true,
    message: "Meeting updated successfully",
    data: generateMockMeeting({ topic: "Updated Meeting Title" })
  },
  
  deleteMeeting: {
    success: true,
    message: "Meeting deleted successfully",
    data: null
  },
  
  sendReminder: {
    success: true,
    message: "Meeting reminder sent successfully",
    data: null
  }
};

/**
 * Test API service with mock data
 */
export const testZoomService = {
  async createMeeting(bookingId) {
    console.log(`[TEST] Creating meeting for booking: ${bookingId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.createMeeting);
      }, 1000); // Simulate API delay
    });
  },
  
  async getMeeting(meetingId) {
    console.log(`[TEST] Getting meeting: ${meetingId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.createMeeting);
      }, 500);
    });
  },
  
  async getCounselorMeetings(counselorId, params = {}) {
    console.log(`[TEST] Getting counselor meetings for: ${counselorId}`, params);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.getMeetings);
      }, 800);
    });
  },
  
  async getStudentMeetings(studentId, params = {}) {
    console.log(`[TEST] Getting student meetings for: ${studentId}`, params);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.getMeetings);
      }, 800);
    });
  },
  
  async updateMeeting(meetingId, updates) {
    console.log(`[TEST] Updating meeting: ${meetingId}`, updates);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.updateMeeting);
      }, 600);
    });
  },
  
  async deleteMeeting(meetingId) {
    console.log(`[TEST] Deleting meeting: ${meetingId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.deleteMeeting);
      }, 400);
    });
  },
  
  async sendReminder(bookingId) {
    console.log(`[TEST] Sending reminder for booking: ${bookingId}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApiResponses.sendReminder);
      }, 300);
    });
  }
};

/**
 * Test notification system
 */
export const testNotifications = {
  addNotification: (notification) => {
    console.log('[TEST] Notification added:', notification);
    // Simulate notification display
    if (typeof window !== 'undefined') {
      const toast = document.createElement('div');
      toast.className = 'test-notification';
      toast.textContent = notification.message;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 5000);
    }
  }
};

/**
 * Test error scenarios
 */
export const testErrorScenarios = {
  networkError: () => {
    throw new Error('Network request failed');
  },
  
  apiError: () => {
    throw {
      status: 500,
      message: 'Internal server error',
      errors: ['Database connection failed']
    };
  },
  
  authError: () => {
    throw {
      status: 401,
      message: 'Unauthorized',
      errors: ['Invalid or expired token']
    };
  },
  
  validationError: () => {
    throw {
      status: 400,
      message: 'Validation failed',
      errors: ['Invalid booking ID format']
    };
  }
};

/**
 * Test data for different scenarios
 */
export const testScenarios = {
  // Scenario: New counselor with no meetings
  newCounselor: {
    user: generateMockUser("counselor"),
    meetings: []
  },
  
  // Scenario: Experienced counselor with many meetings
  experiencedCounselor: {
    user: generateMockUser("counselor"),
    meetings: generateMockMeetings(20)
  },
  
  // Scenario: Student with upcoming meetings
  studentWithMeetings: {
    user: generateMockUser("student"),
    meetings: generateMockMeetings(3, { status: "scheduled" })
  },
  
  // Scenario: Meeting starting soon (for reminder testing)
  meetingStartingSoon: {
    user: generateMockUser("counselor"),
    meetings: [generateMockMeeting({
      startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      status: "scheduled"
    })]
  },
  
  // Scenario: Active meeting
  activeMeeting: {
    user: generateMockUser("counselor"),
    meetings: [generateMockMeeting({
      status: "started",
      startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString() // Started 10 minutes ago
    })]
  }
};

/**
 * Browser testing utilities
 */
export const browserTestUtils = {
  // Simulate slow network
  simulateSlowNetwork: (delay = 2000) => {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(originalFetch(...args));
        }, delay);
      });
    };
  },
  
  // Simulate network error
  simulateNetworkError: () => {
    window.fetch = () => Promise.reject(new Error('Network error'));
  },
  
  // Restore original fetch
  restoreNetwork: () => {
    window.fetch = window.originalFetch;
  },
  
  // Test responsive design
  testResponsive: (width) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  }
};

/**
 * Console testing commands
 */
export const testCommands = {
  // Test meeting creation
  testCreateMeeting: () => {
    console.log('Testing meeting creation...');
    testZoomService.createMeeting('test-booking-123')
      .then(result => console.log('✅ Meeting created:', result))
      .catch(error => console.error('❌ Error:', error));
  },
  
  // Test meeting list
  testGetMeetings: (userRole = 'counselor') => {
    console.log(`Testing ${userRole} meetings...`);
    const userId = `${userRole}-123`;
    const service = userRole === 'counselor' ? 
      testZoomService.getCounselorMeetings : 
      testZoomService.getStudentMeetings;
    
    service(userId)
      .then(result => console.log(`✅ ${userRole} meetings:`, result))
      .catch(error => console.error('❌ Error:', error));
  },
  
  // Test notifications
  testNotifications: () => {
    console.log('Testing notifications...');
    testNotifications.addNotification({
      type: 'meeting_reminder',
      title: 'Meeting Starting Soon',
      message: 'Your meeting starts in 5 minutes',
      data: { meetingId: 'test-123' }
    });
  },
  
  // Test error handling
  testErrorHandling: () => {
    console.log('Testing error handling...');
    browserTestUtils.simulateNetworkError();
    testZoomService.createMeeting('test-booking-123')
      .then(result => console.log('Unexpected success:', result))
      .catch(error => console.log('✅ Error handled correctly:', error.message));
    
    // Restore network
    setTimeout(() => {
      browserTestUtils.restoreNetwork();
      console.log('Network restored');
    }, 2000);
  }
};

// Make test commands available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.testZoom = testCommands;
  window.testData = {
    generateMockMeeting,
    generateMockMeetings,
    generateMockUser,
    testScenarios
  };
  console.log('🧪 Test utilities loaded! Use window.testZoom.* to run tests');
}
