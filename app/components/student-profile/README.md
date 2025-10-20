# Student Profile Module

This module provides a comprehensive student profile management system for the IvyWay application, following the same design patterns as the existing tutor and counselor profile screens.

## Components

### Core Components

- **StudentProfilePage**: Main page component that orchestrates all other components
- **StudentProfileView**: Displays the student profile information in read-only mode
- **StudentProfileForm**: Comprehensive form for editing student profile information
- **ProfileCompletionIndicator**: Shows profile completion progress with visual indicators
- **IntroVideoUpload**: Handles intro video upload with drag-and-drop functionality
- **StudentProfileSkeleton**: Loading skeleton for better UX during data fetching

## Features

### Profile Management

- Complete CRUD operations for student profiles
- Real-time form validation
- Profile completion tracking
- File upload support (profile images and intro videos)

### Form Sections

1. **Personal Information**

   - Phone number with validation
   - Date of birth with age calculation
   - Bio with character limits

2. **Academic Information**

   - Program selection (Undergraduate, Graduate, PhD, Other)
   - Major field
   - GPA with validation (0.0-4.0)
   - Expected graduation year
   - Academic standing
   - Enrollment date

3. **Tutoring Preferences**
   - Subjects (tag-based input, max 10)
   - Availability preferences (tag-based input, max 10)
   - Preferred format (Online, In-Person, Hybrid)
   - Additional notes

### File Upload

- **Profile Images**: JPG, JPEG, PNG, GIF (max 5MB)
- **Intro Videos**: MP4, MOV, AVI, WebM, MKV (max 50MB)
- Drag-and-drop support
- Progress indicators
- Preview functionality

### Validation

- Client-side validation for all form fields
- Real-time error display
- Character count limits
- File type and size validation

## API Integration

### Endpoints

- `GET /student-profiles/profile/me` - Get current student profile
- `PUT /student-profiles/profile` - Create/update student profile
- `POST /student-profiles/profile/intro-video` - Upload intro video
- `DELETE /student-profiles/profile` - Delete student profile

### Data Structure

```javascript
{
  id: "uuid",
  userId: "uuid",
  phoneNumber: "555-123-4567",
  dateOfBirth: "2000-05-15",
  bio: "Computer Science student...",
  profileImage: "https://example.com/profile.jpg",
  program: "undergraduate",
  major: "Computer Science",
  gpa: 3.85,
  expectedGraduation: 2025,
  academicStanding: "Dean's List",
  enrollmentDate: "2021-09-01",
  subjects: ["Programming", "Data Structures"],
  availability: ["Monday afternoons", "Weekends"],
  preferredFormat: "online",
  additionalNotes: "Prefer practical applications",
  profileCompletion: 87,
  introVideoUrl: "https://cloudinary.com/video.mp4",
  status: "active",
  createdAt: "2024-01-20T10:00:00Z",
  updatedAt: "2024-01-20T10:00:00Z"
}
```

## Usage

### Basic Usage

```jsx
import { StudentProfilePage } from "./components/student-profile";

function App() {
  return <StudentProfilePage />;
}
```

### With Custom Configuration

```jsx
import { StudentProfileForm } from "./components/student-profile";

function CustomProfileEditor() {
  const handleSubmit = async (formData) => {
    // Custom submission logic
  };

  return (
    <StudentProfileForm
      profile={profileData}
      onSubmit={handleSubmit}
      onCancel={() => setEditing(false)}
      isSubmitting={isSaving}
    />
  );
}
```

## Hooks

### useStudentProfile

Custom hook for managing student profile state:

```jsx
import useStudentProfile from "../hooks/useStudentProfile";

const {
  profile,
  loading,
  error,
  isSaving,
  uploadProgress,
  updateProfile,
  uploadIntroVideo,
  clearError,
  refreshProfile,
} = useStudentProfile();
```

## Utilities

### studentProfileHelpers

Utility functions for profile operations:

- `calculateStudentProfileCompletion(profile)` - Calculate completion percentage
- `getStudentMissingFields(profile)` - Get list of missing fields
- `validateStudentProfile(formData)` - Validate form data
- `validateStudentFileUpload(file, types, maxSize)` - Validate file uploads
- `formatPhoneNumber(phoneNumber)` - Format phone number for display
- `calculateAge(dateOfBirth)` - Calculate age from date of birth

## Constants

### studentProfileConstants

Configuration constants:

- `FILE_UPLOAD_CONSTANTS` - File upload limits and allowed types
- `VALIDATION_CONSTANTS` - Form validation rules
- `PROGRAM_OPTIONS` - Available program options
- `PREFERRED_FORMAT_OPTIONS` - Available format options
- `COMPLETION_COLORS` - Color scheme for completion indicators

## Styling

The components use Tailwind CSS classes and follow the existing design system:

- Color scheme: Blue for personal info, Green for academic info, Purple for preferences
- Responsive design with mobile-first approach
- Consistent spacing and typography
- Loading states and error handling

## Error Handling

- Network error handling with retry functionality
- Form validation errors with field-specific messages
- File upload error handling
- Graceful degradation for missing data

## Performance

- Lazy loading of components
- Optimized re-renders with React.memo
- Debounced form validation
- Efficient state management with custom hooks

## Accessibility

- ARIA labels for form elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Testing

The components are designed to be easily testable:

- Pure functions for utilities
- Separated business logic from UI
- Mockable API calls
- Isolated component testing

## Future Enhancements

- Profile image cropping and editing
- Advanced video editing capabilities
- Profile templates for different student types
- Integration with external academic databases
- Advanced search and filtering for tutors
- Profile analytics and insights
