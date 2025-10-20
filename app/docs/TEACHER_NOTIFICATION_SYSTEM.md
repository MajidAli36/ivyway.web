# Teacher Notification System Implementation

## Overview

This document outlines the comprehensive notification system implemented for teachers in the IvyWay platform. The system provides real-time notifications for all teacher-related workflows including profile verification, student referrals, and assignment management.

## Features Implemented

### 1. Real-time Notifications
- WebSocket integration for instant notification delivery
- Automatic reconnection handling
- Connection status monitoring
- Real-time unread count updates

### 2. Notification Types
The system handles 11 different notification types:

#### Teacher Profile Notifications
- `teacher_profile_approved` - Profile verification successful
- `teacher_profile_rejected` - Profile verification failed
- `teacher_profile_created` - New profile created (admin only)

#### Student Referral Notifications
- `student_referral_approved` - Student referral approved
- `student_referral_rejected` - Student referral rejected
- `student_referral_created` - New referral created (admin only)

#### Teacher Assignment Notifications
- `teacher_assignment_approved` - Assignment approved
- `teacher_assignment_rejected` - Assignment rejected
- `teacher_assignment_created` - New assignment created (admin only)
- `teacher_assignment_updated` - Assignment updated
- `teacher_assignment_cancelled` - Assignment cancelled

### 3. UI Components

#### NotificationBell Component
- Displays unread count badge
- Shows notification dropdown with recent notifications
- Real-time updates for new notifications
- Click outside to close functionality

#### NotificationItem Component
- Displays individual notifications with proper styling
- Different icons/colors based on notification type
- Metadata display when relevant
- Click to mark as read functionality
- Relative time display

#### NotificationList Component
- Full notification management interface
- Search and filtering capabilities
- Pagination support
- Bulk actions (mark all as read)
- Category and status filtering

#### NotificationSettings Component
- User preference configuration
- Enable/disable specific notification types
- Email and push notification settings
- Quiet hours configuration
- Sound preferences

#### NotificationWidget Component
- Dashboard widget showing recent notifications
- Compact display for quick access
- Integration with main notification system

### 4. State Management

#### NotificationProvider
- Global notification state management
- WebSocket event handling
- API integration
- Error handling and loading states

#### useTeacherNotifications Hook
- Teacher-specific notification logic
- Filtering and search functionality
- Statistics and analytics
- Category-based organization

### 5. API Integration

#### Teacher Notification Service
- RESTful API endpoints for notification management
- Mock data for development
- Error handling and fallbacks
- Helper functions for content formatting

#### WebSocket Service
- Real-time notification delivery
- Connection management
- Event handling
- Reconnection logic

## File Structure

```
app/
├── components/
│   └── notifications/
│       ├── NotificationBell.jsx          # Bell icon with dropdown
│       ├── NotificationItem.jsx          # Individual notification display
│       ├── NotificationList.jsx          # Full notification management
│       ├── NotificationSettings.jsx      # User preferences
│       └── NotificationWidget.jsx        # Dashboard widget
├── hooks/
│   └── useTeacherNotifications.js        # Teacher-specific hook
├── lib/
│   ├── api/
│   │   └── teacherNotificationService.js # API service
│   └── websocket/
│       └── notificationSocket.js         # WebSocket service
├── providers/
│   ├── NotificationProvider.jsx          # Global state management
│   └── SocketProvider.jsx                # WebSocket provider
└── (dashboard)/
    └── teacher/
        ├── notifications/
        │   └── page.js                   # Notifications page
        └── page.js                       # Dashboard with widget
```

## Usage Examples

### Basic Notification Display
```jsx
import NotificationBell from '@/app/components/notifications/NotificationBell';

function Header() {
  return (
    <div className="header">
      <NotificationBell />
    </div>
  );
}
```

### Using the Teacher Notifications Hook
```jsx
import { useTeacherNotifications } from '@/app/hooks/useTeacherNotifications';

function TeacherDashboard() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    updateFilters
  } = useTeacherNotifications();

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.title}
        </div>
      ))}
    </div>
  );
}
```

### Notification Settings
```jsx
import NotificationSettings from '@/app/components/notifications/NotificationSettings';

function SettingsPage() {
  return (
    <div>
      <h1>Notification Settings</h1>
      <NotificationSettings />
    </div>
  );
}
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001
```

### Notification Preferences
Users can configure:
- In-app notifications (enabled by default)
- Email notifications (enabled by default)
- Push notifications (disabled by default)
- Quiet hours
- Email frequency
- Sound alerts

## API Endpoints

### Get Notifications
```
GET /api/notifications
Query Parameters:
- page: Page number
- limit: Items per page
- type: Notification type filter
- isRead: Read status filter
- search: Search term
```

### Get Unread Count
```
GET /api/notifications/unread-count
```

### Mark as Read
```
PATCH /api/notifications/:id/read
```

### Mark All as Read
```
PATCH /api/notifications/mark-all-read
```

### Update Preferences
```
PUT /api/notifications/preferences
Body: { inApp: boolean, email: boolean, push: boolean }
```

## WebSocket Events

### Client to Server
- `notification:mark_read` - Mark notification as read
- `notification:mark_all_read` - Mark all as read
- `notification:delete` - Delete notification

### Server to Client
- `notification:new` - New notification received
- `notification:updated` - Notification updated
- `notification:deleted` - Notification deleted
- `notification:read` - Notification marked as read

## Styling

The notification system uses Tailwind CSS with consistent color coding:

- **Green**: Approved/Success notifications
- **Red**: Rejected/Error notifications
- **Blue**: Information/Update notifications
- **Orange**: Warning/Cancelled notifications

## Accessibility

- Screen reader support with proper ARIA labels
- Keyboard navigation support
- High contrast mode compatibility
- Focus management for interactions

## Performance Considerations

- Virtual scrolling for large notification lists
- Lazy loading of notification content
- Efficient WebSocket message handling
- Caching of notification preferences
- Debounced search functionality

## Testing

### Unit Tests
- Component rendering tests
- Hook functionality tests
- API service tests
- WebSocket connection tests

### Integration Tests
- End-to-end notification workflows
- Real-time update testing
- Error handling scenarios
- User preference persistence

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- WebSocket support required
- Local storage for preferences

## Security Considerations

- JWT token authentication for WebSocket connections
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure storage of user preferences

## Future Enhancements

- Desktop push notifications
- Notification sound alerts
- Notification history/archive
- Export functionality
- Advanced filtering options
- Notification analytics
- Bulk operations
- Notification templates

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check WebSocket URL configuration
   - Verify authentication token
   - Check network connectivity

2. **Notifications Not Updating**
   - Verify WebSocket connection status
   - Check browser console for errors
   - Refresh the page

3. **Preferences Not Saving**
   - Check local storage permissions
   - Verify API endpoint availability
   - Check browser developer tools

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('notificationDebug', 'true');
```

## Support

For technical support or questions about the notification system, please contact the development team or refer to the main project documentation.
