# Zoom Meeting Integration - Testing Guide

## Overview
This guide provides comprehensive testing instructions for the Zoom meeting integration, including unit tests, integration tests, and manual testing procedures.

## Prerequisites
- Node.js and npm installed
- Backend API running with Zoom integration
- Valid JWT tokens for testing
- Test user accounts (counselor and student)

## 1. Manual Testing

### 1.1 Counselor Testing

#### Test Counselor Login and Navigation
1. **Login as Counselor**
   ```bash
   # Navigate to counselor login
   http://localhost:3000/login
   # Use counselor credentials
   ```

2. **Verify Navigation**
   - Check that "Meetings" appears in the sidebar
   - Click on "Meetings" to access `/counselor/meetings`

3. **Test Dashboard Integration**
   - Go to `/counselor` (dashboard)
   - Verify "Upcoming Meetings" section appears
   - Check that meeting cards display properly

#### Test Meeting Management
1. **Create a Test Meeting**
   ```javascript
   // In browser console, test API call
   const testBookingId = "test-booking-123";
   fetch('/api/counselor/zoom/meetings', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer YOUR_JWT_TOKEN'
     },
     body: JSON.stringify({ bookingId: testBookingId })
   })
   .then(res => res.json())
   .then(data => console.log('Meeting created:', data));
   ```

2. **Test Meeting List**
   - Navigate to `/counselor/meetings`
   - Verify meetings load (or mock data displays)
   - Test search and filter functionality
   - Test pagination if multiple meetings exist

3. **Test Meeting Actions**
   - Click on a meeting card
   - Test "Start Meeting" button
   - Test "Send Reminder" button
   - Test "Cancel Meeting" button (if applicable)

### 1.2 Student Testing

#### Test Student Login and Navigation
1. **Login as Student**
   ```bash
   # Navigate to student login
   http://localhost:3000/login
   # Use student credentials
   ```

2. **Verify Navigation**
   - Check that "Meetings" appears in the sidebar
   - Click on "Meetings" to access `/student/meetings`

3. **Test Dashboard Integration**
   - Go to `/student` (dashboard)
   - Verify "Upcoming Meetings" section appears
   - Check that meeting cards display properly

#### Test Meeting Participation
1. **Test Join Meeting**
   - Click on a meeting card
   - Test "Join Meeting" button
   - Verify Zoom meeting opens in new tab

2. **Test Meeting List**
   - Navigate to `/student/meetings`
   - Verify meetings load
   - Test search and filter functionality

### 1.3 Notification Testing

#### Test Meeting Reminders
1. **Create a Meeting with Future Time**
   ```javascript
   // Create a meeting 5 minutes in the future
   const futureTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
   ```

2. **Test Notification Display**
   - Wait for notification to appear
   - Verify notification content
   - Test notification actions

## 2. API Testing

### 2.1 Test API Endpoints

#### Create Meeting
```bash
curl -X POST http://localhost:3000/api/counselor/zoom/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"bookingId": "test-booking-123"}'
```

#### Get Counselor Meetings
```bash
curl -X GET "http://localhost:3000/api/counselor/zoom/counselor/COUNSELOR_ID/meetings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Student Meetings
```bash
curl -X GET "http://localhost:3000/api/counselor/zoom/student/STUDENT_ID/meetings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Send Meeting Reminder
```bash
curl -X POST "http://localhost:3000/api/counselor/zoom/meetings/BOOKING_ID/remind" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2.2 Test Error Scenarios

#### Test Invalid Booking ID
```bash
curl -X POST http://localhost:3000/api/counselor/zoom/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"bookingId": "invalid-booking-id"}'
```

#### Test Unauthorized Access
```bash
curl -X GET "http://localhost:3000/api/counselor/zoom/counselor/COUNSELOR_ID/meetings"
# Should return 401 Unauthorized
```

## 3. Component Testing

### 3.1 Test MeetingCard Component

```javascript
// Test in browser console
const testMeeting = {
  id: "test-1",
  meetingId: "zoom-123",
  topic: "Test Meeting",
  status: "scheduled",
  startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  duration: 60,
  joinUrl: "https://zoom.us/j/123456789",
  startUrl: "https://zoom.us/s/123456789",
  counselor: { name: "Dr. Test" },
  student: { name: "Test Student" }
};

// Test rendering
const meetingCard = document.createElement('div');
// Render MeetingCard component with testMeeting
```

### 3.2 Test MeetingList Component

```javascript
// Test with mock data
const mockMeetings = [
  {
    id: "1",
    topic: "Academic Counseling",
    status: "scheduled",
    startTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    joinUrl: "https://zoom.us/j/123456789",
    counselor: { name: "Dr. Smith" }
  },
  {
    id: "2", 
    topic: "Career Guidance",
    status: "ended",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    joinUrl: "https://zoom.us/j/123456790",
    counselor: { name: "Dr. Johnson" }
  }
];
```

## 4. Unit Testing Setup

### 4.1 Install Testing Dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### 4.2 Create Test Files

#### Test Zoom Service
```javascript
// __tests__/zoomService.test.js
import { zoomService } from '../app/lib/api/zoomService';

describe('Zoom Service', () => {
  test('should create meeting', async () => {
    const mockResponse = {
      success: true,
      data: {
        id: 'test-meeting-1',
        joinUrl: 'https://zoom.us/j/123456789',
        startUrl: 'https://zoom.us/s/123456789'
      }
    };
    
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse)
      })
    );
    
    const result = await zoomService.createMeeting('test-booking-123');
    expect(result).toEqual(mockResponse.data);
  });
});
```

#### Test MeetingCard Component
```javascript
// __tests__/MeetingCard.test.jsx
import { render, screen } from '@testing-library/react';
import MeetingCard from '../app/components/meetings/MeetingCard';

describe('MeetingCard', () => {
  const mockMeeting = {
    id: '1',
    topic: 'Test Meeting',
    status: 'scheduled',
    startTime: new Date().toISOString(),
    duration: 60,
    joinUrl: 'https://zoom.us/j/123456789',
    counselor: { name: 'Dr. Test' }
  };

  test('renders meeting information', () => {
    render(<MeetingCard meeting={mockMeeting} userRole="counselor" />);
    
    expect(screen.getByText('Test Meeting')).toBeInTheDocument();
    expect(screen.getByText('Dr. Test')).toBeInTheDocument();
  });
});
```

## 5. Integration Testing

### 5.1 Test Complete Booking Flow

1. **Create a Booking**
   - Use existing booking creation flow
   - Note the booking ID

2. **Create Zoom Meeting**
   - Call the Zoom meeting creation API
   - Verify meeting is created successfully

3. **Test Meeting Display**
   - Check counselor dashboard shows the meeting
   - Check student dashboard shows the meeting

4. **Test Meeting Actions**
   - Test join/start meeting functionality
   - Test meeting management actions

### 5.2 Test Error Scenarios

1. **Network Errors**
   - Disconnect internet
   - Test error handling and fallback to mock data

2. **API Errors**
   - Test with invalid tokens
   - Test with malformed requests

3. **Permission Errors**
   - Test student trying to access counselor features
   - Test unauthorized meeting access

## 6. Performance Testing

### 6.1 Test Large Meeting Lists

```javascript
// Generate large dataset
const generateMockMeetings = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `meeting-${i}`,
    topic: `Meeting ${i}`,
    status: 'scheduled',
    startTime: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
    duration: 60,
    joinUrl: `https://zoom.us/j/${i}`,
    counselor: { name: `Dr. Counselor ${i}` }
  }));
};

// Test with 1000 meetings
const largeMeetingList = generateMockMeetings(1000);
```

### 6.2 Test Loading Performance

```javascript
// Test loading times
console.time('Meeting List Load');
// Load meeting list
console.timeEnd('Meeting List Load');
```

## 7. Browser Testing

### 7.1 Cross-Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 7.2 Mobile Testing

Test on:
- iOS Safari
- Android Chrome
- Responsive design breakpoints

## 8. Debugging Tools

### 8.1 Browser DevTools

```javascript
// Enable debug logging
localStorage.setItem('debug', 'zoom:*');

// Check auth state
console.log('Auth token:', localStorage.getItem('jwt_token'));
console.log('User data:', localStorage.getItem('user'));
```

### 8.2 Network Monitoring

1. Open DevTools → Network tab
2. Monitor API calls to `/api/counselor/zoom/*`
3. Check request/response data
4. Verify error handling

## 9. Test Data Setup

### 9.1 Create Test Users

```javascript
// Create test counselor
const testCounselor = {
  id: 'counselor-test-123',
  name: 'Dr. Test Counselor',
  email: 'counselor@test.com',
  role: 'counselor'
};

// Create test student
const testStudent = {
  id: 'student-test-123', 
  name: 'Test Student',
  email: 'student@test.com',
  role: 'student'
};
```

### 9.2 Create Test Bookings

```javascript
// Create test booking
const testBooking = {
  id: 'booking-test-123',
  counselorId: 'counselor-test-123',
  studentId: 'student-test-123',
  startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  duration: 60,
  status: 'confirmed'
};
```

## 10. Automated Testing

### 10.1 Cypress E2E Tests

```javascript
// cypress/integration/zoom-meetings.spec.js
describe('Zoom Meeting Integration', () => {
  beforeEach(() => {
    cy.login('counselor@test.com', 'password');
  });

  it('should create and display meetings', () => {
    cy.visit('/counselor/meetings');
    cy.get('[data-testid="meeting-card"]').should('be.visible');
  });

  it('should allow joining meetings', () => {
    cy.visit('/counselor/meetings');
    cy.get('[data-testid="join-meeting-btn"]').first().click();
    // Verify Zoom meeting opens
  });
});
```

## 11. Common Issues and Solutions

### 11.1 Authentication Issues

**Problem**: "Authentication required" errors
**Solution**: Check JWT token validity and refresh if needed

### 11.2 API Connection Issues

**Problem**: API calls failing
**Solution**: Verify backend is running and CORS is configured

### 11.3 Meeting Creation Issues

**Problem**: Meetings not creating
**Solution**: Check booking ID validity and Zoom API configuration

### 11.4 UI Rendering Issues

**Problem**: Components not rendering
**Solution**: Check console for JavaScript errors and component props

## 12. Testing Checklist

- [ ] Counselor can view meetings
- [ ] Student can view meetings  
- [ ] Meeting creation works
- [ ] Meeting joining works
- [ ] Notifications display properly
- [ ] Error handling works
- [ ] Loading states display
- [ ] Responsive design works
- [ ] API calls succeed
- [ ] Mock data fallback works
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Performance with large datasets

## 13. Production Testing

### 13.1 Staging Environment

1. Deploy to staging environment
2. Test with real Zoom API credentials
3. Test with real user accounts
4. Perform load testing

### 13.2 User Acceptance Testing

1. Create test scenarios
2. Have real users test the functionality
3. Collect feedback and iterate
4. Document any issues found

This comprehensive testing guide should help you thoroughly test the Zoom meeting integration and ensure it works correctly in all scenarios.
