/**
 * TypeScript interfaces for Counselor Payment and Earnings System
 */

// Payment Types
export interface PaymentIntentRequest {
  counselorId: string;
  sessionType: '30min' | '60min';
  amount: number; // in cents
  currency: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data: {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    counselorEarnings: number;
    platformFee: number;
    counselor: {
      id: string;
      name: string;
      title: string;
      avatar: string | null;
    };
  };
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  counselorId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  sessionType: '30min' | '60min';
  subject: string;
  topic: string;
  notes?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    bookingId: string;
    status: string;
    amount: number;
    counselorEarnings: number;
    platformFee: number;
    payment: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      stripePaymentIntentId: string;
    };
    counselor: {
      id: string;
      name: string;
      title: string;
      avatar: string | null;
    };
  };
}

// Earning Types
export interface EarningSummary {
  availableBalance: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  monthlyEarnings: Array<{
    month: string;
    total: number;
  }>;
  earningsBySubject: Array<{
    subject: string;
    total: number;
  }>;
  recentEarnings: Earning[];
}

export interface Earning {
  id: string;
  amount: number;
  status: 'available' | 'pending' | 'paid';
  source: string;
  createdAt: string;
  booking: {
    id: string;
    sessionType: string;
    subject: string;
    topic: string;
    startTime: string;
    endTime: string;
    student: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface PayoutRequest {
  type: 'weekly' | 'instant';
  amount?: number; // in cents, optional
}

export interface PayoutResponse {
  id: string;
  amount: number;
  type: string;
  fee: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
}

// Balance Types
export interface BalanceResponse {
  success: boolean;
  message: string;
  data: {
    balance: number; // in cents
    currency: string;
    counselorId: string;
  };
}

// Payment History Types
export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    data: PaymentRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  booking: {
    id: string;
    sessionType: string;
    subject: string;
    topic: string;
    startTime: string;
    endTime: string;
    counselor: {
      id: string;
      name: string;
      title: string;
      avatar: string | null;
    };
  };
}

// Payout History Types
export interface PayoutHistoryResponse {
  success: boolean;
  message: string;
  data: PayoutRecord[];
}

export interface PayoutRecord {
  id: string;
  amount: number;
  type: string;
  fee: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
  netAmount?: number;
}

// Service Configuration Types
export interface PricingConfig {
  [sessionType: string]: {
    totalAmount: number; // in cents
    counselorEarnings: number; // in cents
    platformFee: number; // in cents
    duration: number; // in minutes
  };
}

export interface PayoutFees {
  fee: number; // in cents
  feePercentage: number;
  netAmount: number; // in cents
}

export interface PayoutEligibility {
  isEligible: boolean;
  minimumAmount: number; // in cents
  currentBalance: number; // in cents
  shortfall: number; // in cents
}

export interface PayoutValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Component Props Types
export interface CounselingPaymentFormProps {
  counselor: {
    id: string;
    name: string;
    title: string;
    avatar?: string;
  };
  onSuccess?: (booking: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export interface CounselorEarningDashboardProps {
  className?: string;
}

export interface CounselorPayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentBalance?: number;
}

// Form State Types
export interface PaymentFormState {
  sessionType: '30min' | '60min';
  selectedDate: string;
  selectedTime: string;
  subject: string;
  topic: string;
  notes: string;
  loading: boolean;
  error: string;
  paymentStep: 'form' | 'processing' | 'success' | 'error';
}

export interface PayoutFormState {
  payoutType: 'weekly' | 'instant';
  customAmount: string;
  loading: boolean;
  error: string;
  success: boolean;
  validation: PayoutValidation;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderRadius?: number;
  }>;
}

export interface MonthlyEarningsData {
  month: string;
  total: number;
}

export interface EarningsBySubjectData {
  subject: string;
  total: number;
}

// Utility Types
export type SessionType = '30min' | '60min';
export type PayoutType = 'weekly' | 'instant';
export type EarningStatus = 'available' | 'pending' | 'paid';
export type PayoutStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Constants
export const SESSION_PRICING: PricingConfig = {
  '30min': {
    totalAmount: 3000, // $30.00
    counselorEarnings: 2000, // $20.00
    platformFee: 1000, // $10.00
    duration: 30
  },
  '60min': {
    totalAmount: 4000, // $40.00
    counselorEarnings: 3000, // $30.00
    platformFee: 1000, // $10.00
    duration: 60
  }
};

export const PAYOUT_FEES = {
  weekly: {
    fee: 0,
    feePercentage: 0
  },
  instant: {
    fee: 199, // $1.99
    feePercentage: 0
  }
};

export const MINIMUM_PAYOUT_AMOUNT = 1000; // $10.00 in cents

export const CURRENCY_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} as const;
