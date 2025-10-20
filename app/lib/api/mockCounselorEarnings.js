/**
 * Mock Counselor Earnings Service
 * Provides demo data when backend API endpoints are not available
 */

// Mock data for testing
const mockEarningsSummary = {
  availableBalance: 1250.50, // $12.50 in cents
  totalEarnings: 5000.00, // $50.00 in cents
  thisMonthEarnings: 2000.00, // $20.00 in cents
  pendingEarnings: 500.00, // $5.00 in cents
  paidEarnings: 3000.00, // $30.00 in cents
  monthlyEarnings: [
    { month: "2024-01-01T00:00:00.000Z", total: 2000.00 },
    { month: "2023-12-01T00:00:00.000Z", total: 1500.00 },
    { month: "2023-11-01T00:00:00.000Z", total: 1000.00 },
    { month: "2023-10-01T00:00:00.000Z", total: 500.00 }
  ],
  earningsByService: [
    { service: "Academic Guidance", total: 2000.00 },
    { service: "Career Counseling", total: 1500.00 },
    { service: "College Prep", total: 1000.00 },
    { service: "Study Skills", total: 500.00 }
  ],
  recentEarnings: [
    {
      id: "earning-1",
      amount: 20.00,
      status: "available",
      source: "counseling_session",
      createdAt: "2024-01-15T10:30:00.000Z",
      booking: {
        id: "booking-1",
        sessionType: "30min",
        subject: "Math",
        topic: "Algebra",
        startTime: "2024-01-15T10:00:00.000Z",
        endTime: "2024-01-15T10:30:00.000Z",
        student: {
          id: "student-1",
          name: "John Doe",
          email: "john@example.com"
        }
      }
    },
    {
      id: "earning-2",
      amount: 30.00,
      status: "pending",
      source: "counseling_session",
      createdAt: "2024-01-14T15:30:00.000Z",
      booking: {
        id: "booking-2",
        sessionType: "60min",
        subject: "Science",
        topic: "Physics",
        startTime: "2024-01-14T15:00:00.000Z",
        endTime: "2024-01-14T16:00:00.000Z",
        student: {
          id: "student-2",
          name: "Jane Smith",
          email: "jane@example.com"
        }
      }
    }
  ]
};

const mockEarningsHistory = {
  data: [
    {
      id: "earning-1",
      amount: 20.00,
      status: "available",
      source: "counseling_session",
      createdAt: "2024-01-15T10:30:00.000Z",
      booking: {
        id: "booking-1",
        sessionType: "30min",
        subject: "Math",
        topic: "Algebra",
        startTime: "2024-01-15T10:00:00.000Z",
        endTime: "2024-01-15T10:30:00.000Z",
        student: {
          id: "student-1",
          name: "John Doe",
          email: "john@example.com"
        }
      }
    },
    {
      id: "earning-2",
      amount: 30.00,
      status: "pending",
      source: "counseling_session",
      createdAt: "2024-01-14T15:30:00.000Z",
      booking: {
        id: "booking-2",
        sessionType: "60min",
        subject: "Science",
        topic: "Physics",
        startTime: "2024-01-14T15:00:00.000Z",
        endTime: "2024-01-14T16:00:00.000Z",
        student: {
          id: "student-2",
          name: "Jane Smith",
          email: "jane@example.com"
        }
      }
    },
    {
      id: "earning-3",
      amount: 20.00,
      status: "paid",
      source: "counseling_session",
      createdAt: "2024-01-13T09:30:00.000Z",
      booking: {
        id: "booking-3",
        sessionType: "30min",
        subject: "English",
        topic: "Literature",
        startTime: "2024-01-13T09:00:00.000Z",
        endTime: "2024-01-13T09:30:00.000Z",
        student: {
          id: "student-3",
          name: "Bob Johnson",
          email: "bob@example.com"
        }
      }
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1
  }
};

const mockPayoutHistory = [
  {
    id: "payout-1",
    amount: 100.00,
    type: "weekly",
    fee: 0,
    status: "paid",
    requestedAt: "2024-01-10T10:00:00.000Z",
    processedAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: "payout-2",
    amount: 50.00,
    type: "instant",
    fee: 1.99,
    status: "pending",
    requestedAt: "2024-01-14T15:00:00.000Z",
    processedAt: null
  }
];

const mockBalance = {
  balance: 1250.50, // $12.50 in cents
  currency: "USD",
  counselorId: "counselor-123"
};

/**
 * Mock API responses for counselor earnings
 */
export const mockCounselorEarningsAPI = {
  getEarningsSummary: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Mock earnings summary retrieved successfully",
          data: mockEarningsSummary
        });
      }, 500); // Simulate network delay
    });
  },

  getEarningsHistory: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Mock earnings history retrieved successfully",
          data: mockEarningsHistory
        });
      }, 300);
    });
  },

  getPayoutHistory: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Mock payout history retrieved successfully",
          data: mockPayoutHistory
        });
      }, 200);
    });
  },

  getBalance: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Mock balance retrieved successfully",
          data: mockBalance
        });
      }, 100);
    });
  },

  requestPayout: (payoutData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPayout = {
          id: `payout-${Date.now()}`,
          amount: payoutData.amount || mockBalance.balance,
          type: payoutData.type,
          fee: payoutData.type === "instant" ? 1.99 : 0,
          status: "pending",
          requestedAt: new Date().toISOString(),
          processedAt: null
        };
        
        resolve({
          success: true,
          message: "Mock payout request created successfully",
          data: newPayout
        });
      }, 500);
    });
  }
};

export default mockCounselorEarningsAPI;
