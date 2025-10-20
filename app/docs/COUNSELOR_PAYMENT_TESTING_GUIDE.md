# Counselor Payment & Earnings Testing Guide

## Overview
This guide provides comprehensive testing instructions for the counselor payment and earnings system, including Stripe integration, payout functionality, and error handling.

## Test Environment Setup

### 1. Environment Variables
```env
# Stripe Test Keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_STRIPE_CURRENCY=usd

# Test Configuration
REACT_APP_TEST_MODE=true
REACT_APP_DEBUG_PAYMENTS=true
```

### 2. Stripe Test Cards
```javascript
const TEST_CARDS = {
  // Successful payments
  success: '4242424242424242',
  success_debit: '4000056655665556',
  success_3d_secure: '4000002500003155',
  
  // Declined payments
  declined: '4000000000000002',
  insufficient_funds: '4000000000009995',
  lost_card: '4000000000009987',
  stolen_card: '4000000000009979',
  
  // Processing errors
  processing_error: '4000000000000119',
  incorrect_cvc: '4000000000000127',
  expired_card: '4000000000000069',
  
  // Authentication required
  requires_authentication: '4000002500003155',
  requires_payment_method: '4000000000003220',
  
  // International cards
  international: '4000000000000002',
  international_debit: '4000000000000010'
};
```

## Payment Flow Testing

### 1. Successful Payment Flow
```javascript
// Test Case: Complete successful payment
const testSuccessfulPayment = async () => {
  const paymentData = {
    counselorId: 'test-counselor-id',
    sessionType: '30min',
    amount: 3000, // $30.00
    currency: 'usd'
  };

  try {
    // Step 1: Create payment intent
    const paymentIntent = await counselorPaymentService.createPaymentIntent(paymentData);
    expect(paymentIntent.clientSecret).toBeDefined();
    expect(paymentIntent.amount).toBe(3000);

    // Step 2: Process payment with test card
    const paymentResult = await stripe.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: { number: '4242424242424242' },
          billing_details: {
            name: 'Test Student',
            email: 'test@example.com'
          }
        }
      }
    );

    expect(paymentResult.error).toBeUndefined();
    expect(paymentResult.paymentIntent.status).toBe('succeeded');

    // Step 3: Confirm payment and create booking
    const bookingData = {
      paymentIntentId: paymentResult.paymentIntent.id,
      counselorId: 'test-counselor-id',
      startTime: '2024-01-15T10:00:00.000Z',
      endTime: '2024-01-15T10:30:00.000Z',
      sessionType: '30min',
      subject: 'Math',
      topic: 'Algebra',
      notes: 'Test session'
    };

    const booking = await counselorPaymentService.confirmPayment(bookingData);
    expect(booking.bookingId).toBeDefined();
    expect(booking.status).toBe('pending');

  } catch (error) {
    console.error('Payment test failed:', error);
    throw error;
  }
};
```

### 2. Payment Error Testing
```javascript
// Test Case: Card declined
const testCardDeclined = async () => {
  const paymentData = {
    counselorId: 'test-counselor-id',
    sessionType: '30min',
    amount: 3000
  };

  try {
    const paymentIntent = await counselorPaymentService.createPaymentIntent(paymentData);
    
    const paymentResult = await stripe.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: { number: '4000000000000002' }, // Declined card
          billing_details: {
            name: 'Test Student',
            email: 'test@example.com'
          }
        }
      }
    );

    expect(paymentResult.error).toBeDefined();
    expect(paymentResult.error.type).toBe('card_error');
    expect(paymentResult.error.code).toBe('card_declined');

  } catch (error) {
    console.error('Card declined test failed:', error);
    throw error;
  }
};

// Test Case: Insufficient funds
const testInsufficientFunds = async () => {
  const paymentData = {
    counselorId: 'test-counselor-id',
    sessionType: '60min',
    amount: 4000
  };

  try {
    const paymentIntent = await counselorPaymentService.createPaymentIntent(paymentData);
    
    const paymentResult = await stripe.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: { number: '4000000000009995' }, // Insufficient funds
          billing_details: {
            name: 'Test Student',
            email: 'test@example.com'
          }
        }
      }
    );

    expect(paymentResult.error).toBeDefined();
    expect(paymentResult.error.code).toBe('insufficient_funds');

  } catch (error) {
    console.error('Insufficient funds test failed:', error);
    throw error;
  }
};
```

## Earnings System Testing

### 1. Balance Retrieval
```javascript
// Test Case: Get counselor balance
const testGetBalance = async () => {
  try {
    const balance = await counselorEarningsService.getBalance();
    
    expect(balance).toBeDefined();
    expect(balance.balance).toBeGreaterThanOrEqual(0);
    expect(balance.currency).toBe('USD');
    expect(balance.counselorId).toBeDefined();

  } catch (error) {
    console.error('Balance retrieval test failed:', error);
    throw error;
  }
};
```

### 2. Earning History
```javascript
// Test Case: Get earning history
const testGetEarningHistory = async () => {
  try {
    const history = await counselorEarningsService.getEarningHistory({
      page: 1,
      limit: 10,
      status: 'available'
    });

    expect(history).toBeDefined();
    expect(Array.isArray(history.data)).toBe(true);
    expect(history.pagination).toBeDefined();
    expect(history.pagination.page).toBe(1);
    expect(history.pagination.limit).toBe(10);

    // Test individual earning record
    if (history.data.length > 0) {
      const earning = history.data[0];
      expect(earning.id).toBeDefined();
      expect(earning.amount).toBeGreaterThan(0);
      expect(['available', 'pending', 'paid']).toContain(earning.status);
      expect(earning.booking).toBeDefined();
    }

  } catch (error) {
    console.error('Earning history test failed:', error);
    throw error;
  }
};
```

### 3. Payout Request Testing
```javascript
// Test Case: Weekly payout request
const testWeeklyPayoutRequest = async () => {
  try {
    const payoutData = {
      type: 'weekly'
    };

    const payout = await counselorEarningsService.requestPayout(payoutData);
    
    expect(payout).toBeDefined();
    expect(payout.id).toBeDefined();
    expect(payout.type).toBe('weekly');
    expect(payout.fee).toBe(0); // No fee for weekly
    expect(payout.status).toBe('pending');
    expect(payout.requestedAt).toBeDefined();

  } catch (error) {
    console.error('Weekly payout test failed:', error);
    throw error;
  }
};

// Test Case: Instant payout request
const testInstantPayoutRequest = async () => {
  try {
    const payoutData = {
      type: 'instant',
      amount: 2000 // $20.00
    };

    const payout = await counselorEarningsService.requestPayout(payoutData);
    
    expect(payout).toBeDefined();
    expect(payout.id).toBeDefined();
    expect(payout.type).toBe('instant');
    expect(payout.fee).toBe(199); // $1.99 fee
    expect(payout.status).toBe('pending');
    expect(payout.amount).toBe(2000);

  } catch (error) {
    console.error('Instant payout test failed:', error);
    throw error;
  }
};
```

## Error Handling Testing

### 1. Network Error Testing
```javascript
// Test Case: Network timeout
const testNetworkTimeout = async () => {
  // Mock network timeout
  const originalFetch = global.fetch;
  global.fetch = jest.fn(() => 
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout')), 100)
    )
  );

  try {
    await counselorEarningsService.getBalance();
    fail('Expected network error');
  } catch (error) {
    expect(error.message).toContain('Network error');
  } finally {
    global.fetch = originalFetch;
  }
};
```

### 2. API Error Testing
```javascript
// Test Case: Unauthorized error
const testUnauthorizedError = async () => {
  // Mock 401 response
  const mockResponse = {
    status: 401,
    data: { message: 'Unauthorized' }
  };

  const originalFetch = global.fetch;
  global.fetch = jest.fn(() => 
    Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve(mockResponse.data)
    })
  );

  try {
    await counselorEarningsService.getBalance();
    fail('Expected unauthorized error');
  } catch (error) {
    expect(error.message).toContain('Please log in to continue');
  } finally {
    global.fetch = originalFetch;
  }
};
```

## Component Testing

### 1. Payment Form Testing
```javascript
// Test Case: Payment form validation
const testPaymentFormValidation = () => {
  const { getByLabelText, getByText } = render(
    <CounselingPaymentForm 
      counselor={mockCounselor}
      onSuccess={jest.fn()}
      onError={jest.fn()}
    />
  );

  // Test required field validation
  const submitButton = getByText(/Pay/);
  fireEvent.click(submitButton);

  expect(getByText('Please fill in all required fields.')).toBeInTheDocument();
};

// Test Case: Session type selection
const testSessionTypeSelection = () => {
  const { getByText } = render(
    <CounselingPaymentForm 
      counselor={mockCounselor}
      onSuccess={jest.fn()}
      onError={jest.fn()}
    />
  );

  const sixtyMinOption = getByText('60 minutes');
  fireEvent.click(sixtyMinOption);

  expect(getByText('$40.00')).toBeInTheDocument();
};
```

### 2. Earnings Dashboard Testing
```javascript
// Test Case: Dashboard data loading
const testDashboardDataLoading = async () => {
  const mockData = {
    balance: { balance: 5000, currency: 'USD' },
    summary: {
      totalEarnings: 10000,
      thisMonthEarnings: 5000,
      pendingEarnings: 2000,
      paidEarnings: 3000
    }
  };

  // Mock API responses
  counselorEarningsService.getBalance = jest.fn().mockResolvedValue(mockData.balance);
  counselorEarningsService.getEarningSummary = jest.fn().mockResolvedValue(mockData.summary);

  const { getByText } = render(<CounselorEarningDashboard />);

  await waitFor(() => {
    expect(getByText('$50.00')).toBeInTheDocument(); // Available balance
    expect(getByText('$100.00')).toBeInTheDocument(); // Total earnings
  });
};
```

## Integration Testing

### 1. Complete Payment Flow
```javascript
// Test Case: End-to-end payment flow
const testCompletePaymentFlow = async () => {
  const counselor = {
    id: 'test-counselor-id',
    name: 'Dr. Smith',
    title: 'Academic Counselor'
  };

  const onSuccess = jest.fn();
  const onError = jest.fn();

  const { getByLabelText, getByText, getByDisplayValue } = render(
    <CounselingPaymentForm 
      counselor={counselor}
      onSuccess={onSuccess}
      onError={onError}
    />
  );

  // Fill form
  fireEvent.change(getByLabelText('Date'), { target: { value: '2024-01-15' } });
  fireEvent.change(getByLabelText('Time'), { target: { value: '10:00' } });
  fireEvent.change(getByLabelText('Subject'), { target: { value: 'Math' } });
  fireEvent.change(getByLabelText('Topic'), { target: { value: 'Algebra' } });

  // Submit form
  const submitButton = getByText(/Pay/);
  fireEvent.click(submitButton);

  // Wait for payment processing
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
};
```

## Performance Testing

### 1. Load Testing
```javascript
// Test Case: Multiple concurrent payments
const testConcurrentPayments = async () => {
  const paymentPromises = Array.from({ length: 10 }, (_, index) => 
    counselorPaymentService.createPaymentIntent({
      counselorId: 'test-counselor-id',
      sessionType: '30min',
      amount: 3000
    })
  );

  const startTime = Date.now();
  const results = await Promise.allSettled(paymentPromises);
  const endTime = Date.now();

  const successfulPayments = results.filter(result => result.status === 'fulfilled');
  const failedPayments = results.filter(result => result.status === 'rejected');

  expect(successfulPayments.length).toBeGreaterThan(0);
  expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
};
```

## Security Testing

### 1. Input Validation
```javascript
// Test Case: Malicious input handling
const testMaliciousInput = async () => {
  const maliciousData = {
    counselorId: '<script>alert("xss")</script>',
    sessionType: '30min',
    amount: -1000, // Negative amount
    currency: 'USD'
  };

  try {
    await counselorPaymentService.createPaymentIntent(maliciousData);
    fail('Expected validation error');
  } catch (error) {
    expect(error.message).toContain('Invalid');
  }
};
```

## Test Data Setup

### 1. Mock Data
```javascript
const mockCounselor = {
  id: 'test-counselor-id',
  name: 'Dr. Smith',
  title: 'Academic Counselor',
  avatar: 'https://example.com/avatar.jpg'
};

const mockEarning = {
  id: 'earning-123',
  amount: 2000,
  status: 'available',
  source: 'counseling_session',
  createdAt: '2024-01-15T10:30:00.000Z',
  booking: {
    id: 'booking-123',
    sessionType: '30min',
    subject: 'Math',
    topic: 'Algebra',
    startTime: '2024-01-15T10:00:00.000Z',
    endTime: '2024-01-15T10:30:00.000Z',
    student: {
      id: 'student-123',
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
};
```

## Running Tests

### 1. Unit Tests
```bash
npm run test -- --testPathPattern=payment
npm run test -- --testPathPattern=earnings
```

### 2. Integration Tests
```bash
npm run test:integration -- --testPathPattern=counselor-payment
```

### 3. E2E Tests
```bash
npm run test:e2e -- --spec="counselor-payment.spec.js"
```

## Test Coverage

### 1. Coverage Requirements
- Payment flow: 95%+
- Earnings system: 90%+
- Error handling: 85%+
- Component rendering: 90%+

### 2. Coverage Commands
```bash
npm run test:coverage -- --testPathPattern=payment
npm run test:coverage -- --testPathPattern=earnings
```

## Debugging

### 1. Enable Debug Logging
```javascript
// In your test setup
localStorage.setItem('debug', 'payment,earnings');
```

### 2. Stripe Test Mode
```javascript
// Enable Stripe test mode logging
process.env.STRIPE_DEBUG = 'true';
```

### 3. API Debugging
```javascript
// Enable API request/response logging
process.env.REACT_APP_DEBUG_API = 'true';
```

This comprehensive testing guide ensures that all aspects of the counselor payment and earnings system are thoroughly tested and working correctly.
