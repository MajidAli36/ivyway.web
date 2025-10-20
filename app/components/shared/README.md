# SubjectSelector Component

A reusable React component for selecting subjects from a predefined list with search functionality and validation.

## Features

- 🔍 **Search Functionality**: Type to search and filter subjects
- ✅ **Duplicate Prevention**: Prevents adding the same subject twice
- 🎯 **Maximum Limit**: Optional limit on number of subjects
- 🎨 **Customizable**: Flexible styling and configuration options
- 📱 **Responsive**: Works well on all screen sizes
- ♿ **Accessible**: Keyboard navigation support (Enter, Escape)
- ❌ **Easy Close**: Multiple ways to close the dropdown

## Usage

### Basic Usage

```jsx
import SubjectSelector from "@/app/components/shared/SubjectSelector";

function MyComponent() {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  return (
    <SubjectSelector
      selectedSubjects={selectedSubjects}
      onSubjectsChange={setSelectedSubjects}
      isEditing={true}
      label="Select Subjects"
    />
  );
}
```

### Advanced Usage

```jsx
<SubjectSelector
  selectedSubjects={subjects}
  onSubjectsChange={handleSubjectsChange}
  isEditing={isEditing}
  label="Required Subjects"
  placeholder="Search and select subjects..."
  required={true}
  maxSubjects={5}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedSubjects` | `Array<string>` | `[]` | Array of currently selected subjects |
| `onSubjectsChange` | `Function` | - | Callback function when subjects change |
| `isEditing` | `boolean` | `true` | Whether the component is in edit mode |
| `label` | `string` | `"Subjects"` | Label for the subject selector |
| `required` | `boolean` | `false` | Whether the field is required |
| `placeholder` | `string` | `"Select a subject to add..."` | Placeholder text for the dropdown |
| `maxSubjects` | `number` | `null` | Maximum number of subjects that can be selected |

## Available Subjects

The component uses subjects from `@/app/constants/enhancedSubjects.js`:

- Mathematics
- Science
- English & Language Arts
- History & Social Studies
- Foreign Languages
- Computer Science
- Test Preparation

## Keyboard Shortcuts

- **Enter**: Add the first filtered subject
- **Escape**: Close the dropdown and clear search

## Closing the Dropdown

The dropdown can be closed in multiple ways:

1. **Click the X button** in the dropdown header
2. **Press Escape** on the keyboard
3. **Click outside** the dropdown area
4. **Select a subject** (automatically closes)
5. **Click away** from the input field (blur event)

## Examples

### Tutor Profile Integration

```jsx
// In tutor profile page
<SubjectSelector
  selectedSubjects={formData.subjects}
  onSubjectsChange={(subjects) =>
    setFormData((prev) => ({ ...prev, subjects }))
  }
  isEditing={isEditing}
  label="Subjects You Teach"
  placeholder="Search and select subjects..."
  maxSubjects={10}
/>
```

### Student Profile Integration

```jsx
// In student profile page
<SubjectSelector
  selectedSubjects={formData.preferredSubjects}
  onSubjectsChange={(subjects) =>
    setFormData((prev) => ({ ...prev, preferredSubjects: subjects }))
  }
  isEditing={isEditing}
  label="Preferred Subjects"
  placeholder="What subjects do you need help with?"
  maxSubjects={5}
/>
```

## Styling

The component uses Tailwind CSS classes and follows the existing design system:

- **Input Field**: `border-gray-300`, `focus:ring-blue-500`
- **Selected Items**: `bg-gray-50`, `border-gray-200`
- **Remove Button**: `text-red-500`, `hover:text-red-700`
- **View Mode Tags**: `bg-blue-100`, `text-blue-700`

## Dependencies

- `@heroicons/react/24/outline` - For icons (ChevronDownIcon, XMarkIcon)
- `@/app/constants/enhancedSubjects` - For subject data

## File Structure

```
app/
├── components/
│   └── shared/
│       ├── SubjectSelector.jsx          # Main component
│       └── SubjectSelectorDemo.jsx      # Demo component
└── constants/
    └── enhancedSubjects.js              # Subject data
```

## Migration Guide

### From Manual Input to SubjectSelector

**Before (Manual Input):**
```jsx
<input
  type="text"
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  placeholder="e.g., Mathematics, Physics"
/>
```

**After (SubjectSelector):**
```jsx
<SubjectSelector
  selectedSubjects={subjects}
  onSubjectsChange={setSubjects}
  isEditing={isEditing}
  label="Subjects"
/>
```

## Testing

To test the component, you can use the demo component:

```jsx
import SubjectSelectorDemo from "@/app/components/shared/SubjectSelectorDemo";

// Use in any page for testing
<SubjectSelectorDemo />
```
