// Calculate profile completion percentage based on filled fields
export const calculateProfileCompletion = (profile) => {
  // If we have a backend-calculated profileCompletion, use it
  if (profile.profileCompletion && profile.profileCompletion > 0) {
    return profile.profileCompletion;
  }

  // All fields are optional except subjects - subjects is required
  const optionalFields = [
    { key: "bio", weight: 20 },
    { key: "education", weight: 25 },
    { key: "experience", weight: 15 },
    { key: "certifications", weight: 10 },
    { key: "profileImage", weight: 10 },
  ];

  // Required field
  const requiredFields = [
    { key: "subjects", weight: 20 },
  ];

  let completion = 0;

  // Check required fields first - subjects is mandatory
  requiredFields.forEach(({ key, weight }) => {
    const value = profile[key];
    if (key === "subjects") {
      if (value && Array.isArray(value) && value.length > 0) {
        completion += weight;
      }
    }
  });

  // Add optional fields
  optionalFields.forEach(({ key, weight }) => {
    const value = profile[key];

    if (key === "certifications") {
      if (value && Array.isArray(value) && value.length > 0) {
        completion += weight;
      }
    } else if (key === "profileImage") {
      if (value && value.trim() !== "") {
        completion += weight;
      }
    } else {
      if (value && value.toString().trim() !== "") {
        completion += weight;
      }
    }
  });

  return Math.min(100, Math.round(completion));
};

// Get missing fields for profile completion (only required fields)
export const getMissingFields = (profile) => {
  const missingFields = [];
  
  // Only subjects is required - all other fields are optional
  if (
    !profile.subjects ||
    !Array.isArray(profile.subjects) ||
    profile.subjects.length === 0
  ) {
    missingFields.push("Subjects");
  }

  return missingFields;
};

// Transform education string to array format
export const transformEducationToArray = (educationString) => {
  if (!educationString) return [];

  // If it's already an array, return as is
  if (Array.isArray(educationString)) return educationString;

  // If it's a string, try to parse it or create a default structure
  try {
    const parsed = JSON.parse(educationString);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // If parsing fails, create a default structure from the string
    return [
      {
        degree: educationString,
        institution: "",
        year: new Date().getFullYear(),
      },
    ];
  }

  return [];
};

// Transform education array to string format for display
export const transformEducationToString = (educationArray) => {
  if (!educationArray || !Array.isArray(educationArray)) return "";

  return educationArray
    .map((edu) => {
      const parts = [];
      if (edu.degree) parts.push(edu.degree);
      if (edu.institution) parts.push(edu.institution);
      if (edu.year) parts.push(edu.year.toString());
      return parts.join(", ");
    })
    .join("; ");
};

// Validate file upload
export const validateFileUpload = (file, allowedTypes, maxSizeMB) => {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return errors;
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  return errors;
};

// Format profile data for API submission
export const formatProfileForSubmission = (profile) => {
  return {
    bio: profile.bio || "",
    specialization: profile.specialization || "",
    experience: parseInt(profile.experience) || 0,
    hourlyRate: parseFloat(profile.hourlyRate) || 0,
    education: Array.isArray(profile.education) ? profile.education : [],
    certifications: Array.isArray(profile.certifications)
      ? profile.certifications
      : [],
    languages: Array.isArray(profile.languages) ? profile.languages : [],
    availability: profile.availability || {},
    profileImage: profile.profileImage || null,
  };
};
