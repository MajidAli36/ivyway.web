# Zoom Meeting Integration - Frontend Implementation

## Overview

This document describes the complete frontend implementation of Zoom meeting integration for counselor scheduling. The implementation provides a seamless experience for both students and counselors to create, manage, and join Zoom meetings for counseling sessions.

## Architecture

### API Service Layer
- **File**: `app/lib/api/zoomService.js`
- **Purpose**: Centralized service for all Zoom meeting operations
- **Features**:
  - Create, read, update, delete meetings
  - Get meetings by counselor/student
  - Send meeting reminders
  - Helper functions for meeting status and time formatting

### Components

#### 1. MeetingCard Component
- **File**: `app/components/meetings/MeetingCard.jsx`
- **Purpose**: Display individual meeting information
- **Features**:
  - Meeting status indicators
  - Join/Start meeting buttons
  - Action menu (edit, cancel, send reminder)
  - Responsive design

#### 2. MeetingList Component
- **File**: `app/components/meetings/MeetingList.jsx`
- **Purpose**: Display paginated list of meetings
- **Features**:
  - Search and filtering
  - Sorting options
  - Pagination
  - Error handling and loading states

#### 3. MeetingDetails Component
- **File**: `app/components/meetings/MeetingDetails.jsx`
- **Purpose**: Modal for detailed meeting information
- **Features**:
  - Full meeting details
  - Edit meeting settings (counselor only)
  - Join/Start meeting functionality
  - Meeting management actions

#### 4. MeetingNotificationHandler Component
- **File**: `app/components/meetings/MeetingNotificationHandler.jsx`
- **Purpose**: Handle real-time meeting notifications
- **Features**:
  - Meeting reminders (10 minutes before)
  - Status change notifications
  - Automatic notification management

#### 5. MeetingNotificationToast Component
- **File**: `app/components/meetings/MeetingNotificationToast.jsx`
- **Purpose**: Display meeting notifications as toasts
- **Features**:
  - Visual notification display
  - Action buttons
  - Auto-dismiss functionality

#### 6. MeetingNotificationProvider Component
- **File**: `app/components/meetings/MeetingNotificationProvider.jsx`
- **Purpose**: Context provider for meeting notifications
- **Features**:
  - Centralized notification state
  - Notification management functions

#### 7. MeetingErrorBoundary Component
- **File**: `app/components/meetings/MeetingErrorBoundary.jsx`
- **Purpose**: Error boundary for meeting operations
- **Features**:
  - Graceful error handling
  - Retry functionality
  - Development error details

#### 8. MeetingLoadingState Component
- **File**: `app/components/meetings/MeetingLoadingState.jsx`
- **Purpose**: Loading states for meeting operations
- **Features**:
  - Skeleton loaders
  - Different loading types
  - Responsive design

## Integration Points

### Counselor Dashboard
- **File**: `app/(dashboard)/counselor/page.js`
- **Features**:
  - Upcoming meetings section
  - Meeting statistics
  - Quick access to meetings

### Counselor Meetings Page
- **File**: `app/(dashboard)/counselor/meetings/page.js`
- **Features**:
  - Full meeting management
  - Meeting statistics
  - Meeting list with filters

### Student Dashboard
- **File**: `app/(dashboard)/student/page.js`
- **Features**:
  - Upcoming meetings section
  - Quick join functionality

### Student Meetings Page
- **File**: `app/(dashboard)/student/meetings/page.js`
- **Features**:
  - View all meetings
  - Join meeting functionality
  - Meeting history

## API Endpoints

The implementation uses the following API endpoints:

### Base URL: `/api/counselor/zoom`

1. **Create Meeting**
   - `POST /meetings`
   - Creates a new Zoom meeting for a booking

2. **Get Meeting**
   - `GET /meetings/:meetingId`
   - Retrieves meeting details

3. **Update Meeting**
   - `PATCH /meetings/:meetingId`
   - Updates meeting settings (counselor only)

4. **Delete Meeting**
   - `DELETE /meetings/:meetingId`
   - Cancels and deletes a meeting (counselor only)

5. **Get Counselor Meetings**
   - `GET /counselor/:counselorId/meetings`
   - Gets all meetings for a counselor

6. **Get Student Meetings**
   - `GET /student/:studentId/meetings`
   - Gets all meetings for a student

7. **Send Reminder**
   - `POST /meetings/:bookingId/remind`
   - Sends a meeting reminder

## Features

### For Students
- View upcoming meetings
- Join meetings using join URL
- Receive meeting reminders
- View meeting history
- Meeting status notifications

### For Counselors
- Create and manage meetings
- Start meetings using start URL
- Update meeting settings
- Cancel meetings
- Send reminders to students
- View all meetings with filters
- Meeting analytics

### Common Features
- Real-time notifications
- Responsive design
- Error handling
- Loading states
- Search and filtering
- Pagination

## Usage

### Basic Meeting Card
```jsx
import MeetingCard from '@/app/components/meetings/MeetingCard';

<MeetingCard
  meeting={meetingData}
  userRole="counselor"
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  showActions={true}
/>
```

### Meeting List
```jsx
import MeetingList from '@/app/components/meetings/MeetingList';

<MeetingList
  userId={userId}
  userRole="counselor"
  initialMeetings={meetings}
  onMeetingUpdate={handleUpdate}
  onMeetingDelete={handleDelete}
  showFilters={true}
  showSearch={true}
/>
```

### Meeting Details Modal
```jsx
import MeetingDetails from '@/app/components/meetings/MeetingDetails';

<MeetingDetails
  meeting={selectedMeeting}
  userRole="counselor"
  isOpen={showDetails}
  onClose={handleClose}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
/>
```

### Notification Provider
```jsx
import MeetingNotificationProvider from '@/app/components/meetings/MeetingNotificationProvider';

<MeetingNotificationProvider>
  <App />
</MeetingNotificationProvider>
```

## Error Handling

The implementation includes comprehensive error handling:

1. **API Errors**: Graceful fallback to mock data when API fails
2. **Network Errors**: Retry mechanisms and user-friendly messages
3. **Validation Errors**: Form validation and error display
4. **Permission Errors**: Role-based access control
5. **Error Boundaries**: React error boundaries for component errors

## Loading States

Multiple loading states are provided:

1. **Skeleton Loaders**: For list and card views
2. **Spinner Loaders**: For general loading
3. **Inline Loaders**: For button actions
4. **Progressive Loading**: For pagination

## Responsive Design

All components are fully responsive:

- **Mobile**: Single column layout, touch-friendly buttons
- **Tablet**: Two-column layout, optimized spacing
- **Desktop**: Multi-column layout, full feature set

## Testing

### Unit Tests
- Component rendering
- API service functions
- Error handling scenarios

### Integration Tests
- Complete booking flow
- Meeting creation and management
- Notification handling

### User Acceptance Tests
- Student booking and joining
- Counselor meeting management
- Cross-device compatibility

## Security Considerations

- JWT token authentication for all API calls
- Role-based access control
- Input validation and sanitization
- Secure meeting URL handling

## Performance Optimization

- Lazy loading for meeting lists
- Caching of meeting data
- Optimized API calls
- Pagination for large datasets

## Future Enhancements

1. **WebSocket Integration**: Real-time meeting status updates
2. **Calendar Integration**: Sync with external calendars
3. **Recording Management**: Handle meeting recordings
4. **Advanced Analytics**: Meeting performance metrics
5. **Mobile App**: Native mobile application

## Troubleshooting

### Common Issues

1. **Meeting Creation Fails**
   - Check API endpoint availability
   - Verify authentication token
   - Check booking ID validity

2. **Join URL Not Working**
   - Verify meeting status
   - Check URL format
   - Ensure meeting hasn't expired

3. **Notifications Not Showing**
   - Check notification provider setup
   - Verify user permissions
   - Check browser notification settings

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` to see:
- API request/response logs
- Error details in error boundaries
- Component state changes

## Support

For technical support or questions about the Zoom meeting integration:

1. Check the console for error messages
2. Verify API endpoint availability
3. Check authentication status
4. Review component props and state

## Changelog

### Version 1.0.0
- Initial implementation
- Basic meeting management
- Student and counselor dashboards
- Notification system
- Error handling and loading states
- Responsive design
