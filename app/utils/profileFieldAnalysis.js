/**
 * Profile Field Analysis Utilities
 * Provides comprehensive field analysis for different user types
 */

// Field configurations for different user types
export const FIELD_CONFIGS = {
  tutor: {
    required: [
      { key: "subjects", label: "Subjects You Teach", weight: 20, isRequired: true }
    ],
    optional: [
      { key: "bio", label: "Bio", weight: 20, isRequired: false },
      { key: "education", label: "Highest Education Level", weight: 15, isRequired: false },
      { key: "degree", label: "Degree", weight: 10, isRequired: false },
      { key: "graduationYear", label: "Graduation Year", weight: 5, isRequired: false },
      { key: "experience", label: "Experience (Years)", weight: 15, isRequired: false },
      { key: "certifications", label: "Certifications", weight: 10, isRequired: false },
      { key: "profileImageUrl", label: "Profile Photo", weight: 10, isRequired: false },
      { key: "introVideoUrl", label: "Intro Video", weight: 5, isRequired: false }
    ]
  },
  student: {
    required: [
      { key: "subjects", label: "Preferred Subjects", weight: 10, isRequired: true }
    ],
    optional: [
      { key: "phoneNumber", label: "Phone Number", weight: 10, isRequired: false },
      { key: "dateOfBirth", label: "Date of Birth", weight: 10, isRequired: false },
      { key: "bio", label: "Bio/About Me", weight: 15, isRequired: false },
      { key: "profileImageUrl", label: "Profile Photo", weight: 10, isRequired: false },
      { key: "program", label: "Academic Program", weight: 10, isRequired: false },
      { key: "major", label: "Major/Field of Study", weight: 10, isRequired: false },
      { key: "gpa", label: "GPA", weight: 10, isRequired: false },
      { key: "expectedGraduation", label: "Expected Graduation", weight: 10, isRequired: false },
      { key: "academicStanding", label: "Academic Standing", weight: 5, isRequired: false },
      { key: "enrollmentDate", label: "Enrollment Date", weight: 5, isRequired: false },
      { key: "availability", label: "Availability", weight: 10, isRequired: false },
      { key: "preferredFormat", label: "Preferred Format", weight: 5, isRequired: false },
      { key: "introVideoUrl", label: "Intro Video", weight: 5, isRequired: false }
    ]
  },
  counselor: {
    required: [
      { key: "specialization", label: "Specialization", weight: 15, isRequired: true }
    ],
    optional: [
      { key: "bio", label: "Bio/About Me", weight: 15, isRequired: false },
      { key: "education", label: "Education Background", weight: 20, isRequired: false },
      { key: "experience", label: "Counseling Experience", weight: 10, isRequired: false },
      { key: "certifications", label: "Certifications", weight: 15, isRequired: false },
      { key: "languages", label: "Languages Spoken", weight: 10, isRequired: false },
      { key: "profileImageUrl", label: "Profile Photo", weight: 10, isRequired: false },
      { key: "introVideoUrl", label: "Intro Video", weight: 5, isRequired: false }
    ]
  }
};

/**
 * Check if a field value is considered "filled"
 */
export const isFieldFilled = (field, value) => {
  console.log(`Checking field ${field.key}:`, { value, type: typeof value, isArray: Array.isArray(value) });
  
  if (!value) return false;

  // Handle array fields
  if (field.key === "subjects" || field.key === "certifications" || 
      field.key === "languages" || field.key === "availability") {
    const result = Array.isArray(value) && value.length > 0;
    console.log(`Array field ${field.key} result:`, result);
    return result;
  }

  // Handle string fields
  if (typeof value === "string") {
    const result = value.trim() !== "";
    console.log(`String field ${field.key} result:`, result, `"${value.trim()}"`);
    return result;
  }

  // Handle number fields
  if (typeof value === "number") {
    const result = value > 0;
    console.log(`Number field ${field.key} result:`, result, value);
    return result;
  }

  // Handle boolean fields
  if (typeof value === "boolean") {
    const result = value === true;
    console.log(`Boolean field ${field.key} result:`, result);
    return result;
  }

  console.log(`Unknown field type ${field.key}:`, typeof value);
  return false;
};

/**
 * Analyze profile fields and return completion data
 */
export const analyzeProfileFields = (profileData, userType = "tutor") => {
  const config = FIELD_CONFIGS[userType];
  if (!config) {
    throw new Error(`Unknown user type: ${userType}`);
  }

  const allFields = [...config.required, ...config.optional];
  const completedFields = [];
  const missingFields = [];

  allFields.forEach(field => {
    const isFilled = isFieldFilled(field, profileData[field.key]);
    
    if (isFilled) {
      completedFields.push(field);
    } else {
      missingFields.push(field);
    }
  });

  // Calculate completion percentage
  const totalWeight = allFields.reduce((sum, field) => sum + field.weight, 0);
  const completedWeight = completedFields.reduce((sum, field) => sum + field.weight, 0);
  const percentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

  return {
    percentage,
    completedFields,
    missingFields,
    totalFields: allFields.length,
    completedCount: completedFields.length,
    missingCount: missingFields.length,
    totalWeight,
    completedWeight,
    missingWeight: totalWeight - completedWeight
  };
};

/**
 * Get field priority for completion suggestions
 */
export const getFieldPriority = (field) => {
  if (field.isRequired) return 1; // Highest priority
  if (field.weight >= 20) return 2; // High priority
  if (field.weight >= 10) return 3; // Medium priority
  return 4; // Low priority
};

/**
 * Sort fields by priority (required first, then by weight)
 */
export const sortFieldsByPriority = (fields) => {
  return [...fields].sort((a, b) => {
    const priorityA = getFieldPriority(a);
    const priorityB = getFieldPriority(b);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return b.weight - a.weight; // Higher weight first within same priority
  });
};

/**
 * Get completion suggestions based on missing fields
 */
export const getCompletionSuggestions = (missingFields, limit = 3) => {
  const sortedFields = sortFieldsByPriority(missingFields);
  return sortedFields.slice(0, limit);
};

/**
 * Validate profile completeness for specific actions
 */
export const validateProfileForAction = (profileData, userType, action) => {
  const analysis = analyzeProfileFields(profileData, userType);
  
  switch (action) {
    case "publish":
      // Require at least 80% completion for publishing
      return {
        isValid: analysis.percentage >= 80,
        message: analysis.percentage >= 80 
          ? "Profile is ready to publish!" 
          : `Complete ${100 - analysis.percentage}% more to publish your profile`
      };
    
    case "featured":
      // Require 100% completion for featured status
      return {
        isValid: analysis.percentage === 100,
        message: analysis.percentage === 100 
          ? "Profile qualifies for featured status!" 
          : `Complete ${100 - analysis.percentage}% more to qualify for featured status`
      };
    
    case "basic":
      // Require only required fields for basic functionality
      const requiredFields = FIELD_CONFIGS[userType].required;
      const missingRequired = requiredFields.filter(field => 
        !isFieldFilled(field, profileData[field.key])
      );
      
      return {
        isValid: missingRequired.length === 0,
        message: missingRequired.length === 0 
          ? "Profile meets basic requirements" 
          : `Complete required fields: ${missingRequired.map(f => f.label).join(", ")}`
      };
    
    default:
      return {
        isValid: true,
        message: "Profile validation complete"
      };
  }
};

/**
 * Get field display information
 */
export const getFieldDisplayInfo = (fieldKey, userType) => {
  const config = FIELD_CONFIGS[userType];
  const allFields = [...config.required, ...config.optional];
  return allFields.find(field => field.key === fieldKey);
};

/**
 * Calculate estimated completion time
 */
export const estimateCompletionTime = (missingFields) => {
  const timeEstimates = {
    "bio": 5, // minutes
    "education": 3,
    "experience": 3,
    "certifications": 2,
    "profileImageUrl": 2,
    "phoneNumber": 1,
    "dateOfBirth": 1,
    "program": 1,
    "major": 1,
    "gpa": 1,
    "expectedGraduation": 1,
    "academicStanding": 1,
    "enrollmentDate": 1,
    "subjects": 2,
    "availability": 3,
    "preferredFormat": 1,
    "introVideoUrl": 5,
    "specialization": 2,
    "languages": 2
  };

  const totalMinutes = missingFields.reduce((sum, field) => {
    return sum + (timeEstimates[field.key] || 2);
  }, 0);

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
  }
};
