import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in production, this would come from a database
const mockTutorProfile = {
  id: "tutor-1",
  fullName: "John Smith",
  email: "john.smith@example.com",
  role: "tutor",
  isActive: true,
  profilePicture: null,
  phoneNumber: "+1234567890",
  dateOfBirth: "1990-05-15",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  hourlyRate: 25.0,
  tutorType: "regular", // regular or advanced
  profileCompletion: 100, // Updated to match backend data
  completedSessions: 15,
  averageRating: 4.2,
  totalEarnings: 375.0,
  totalReviews: 12,
  joinedDate: "2023-06-01T00:00:00Z",
  lastActiveDate: "2024-01-15T10:00:00Z",
  bio: "Experienced tutor with 5+ years of teaching experience",
  education: [
    {
      degree: "Master of Science",
      field: "Mathematics",
      institution: "University of California",
      graduationYear: 2015
    }
  ],
  experience: [
    {
      position: "Math Tutor",
      company: "ABC Tutoring Center",
      duration: "2018-2023",
      description: "Provided one-on-one tutoring for high school students"
    }
  ],
  certifications: [
    {
      name: "Certified Math Teacher",
      issuer: "State Board of Education",
      issueDate: "2018-03-15",
      expiryDate: "2025-03-15"
    }
  ],
  availability: {
    timezone: "America/New_York",
    schedule: {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
      saturday: [{ start: "10:00", end: "15:00" }],
      sunday: []
    }
  },
  introVideoUrl: null,
  hasActiveApplication: false,
  lastRejectionDate: null,
  canReapply: true
};

export async function GET(request) {
  try {
    // In a real application, you would:
    // 1. Get the tutor ID from the JWT token or session
    // 2. Fetch the tutor's profile from the database
    // 3. Calculate eligibility based on real data
    
    // For now, we'll use mock data
    const tutorProfile = mockTutorProfile;
    
    // Calculate eligibility requirements
    const requirements = {
      completedSessions: tutorProfile.completedSessions,
      requiredSessions: 20,
      profileCompletion: tutorProfile.profileCompletion || 0,
      requiredProfileCompletion: 80,
      averageRating: tutorProfile.averageRating,
      requiredRating: 4.0,
      hasActiveApplication: tutorProfile.hasActiveApplication,
      lastRejectionDate: tutorProfile.lastRejectionDate,
      canReapply: tutorProfile.canReapply
    };

    // Check if tutor meets all requirements
    // Note: Profile completion is now calculated with only subjects as required
    const isEligible = 
      requirements.completedSessions >= requirements.requiredSessions &&
      requirements.profileCompletion >= requirements.requiredProfileCompletion &&
      requirements.averageRating >= requirements.requiredRating &&
      !requirements.hasActiveApplication &&
      tutorProfile.tutorType === "regular" &&
      tutorProfile.subjects && tutorProfile.subjects.length > 0; // Ensure subjects are present

    // Generate missing requirements list
    const missingRequirements = [];
    if (requirements.completedSessions < requirements.requiredSessions) {
      missingRequirements.push(
        `Complete ${requirements.requiredSessions - requirements.completedSessions} more sessions`
      );
    }
    if (requirements.profileCompletion < requirements.requiredProfileCompletion) {
      missingRequirements.push(
        `Complete profile to ${requirements.requiredProfileCompletion}% (current: ${requirements.profileCompletion}%)`
      );
    }
    if (requirements.averageRating < requirements.requiredRating) {
      missingRequirements.push(
        `Improve rating to ${requirements.requiredRating} (current: ${requirements.averageRating.toFixed(2)})`
      );
    }
    if (requirements.hasActiveApplication) {
      missingRequirements.push("Wait for current application to be reviewed");
    }
    if (tutorProfile.tutorType === "advanced") {
      missingRequirements.push("Already an advanced tutor");
    }
    if (!tutorProfile.subjects || tutorProfile.subjects.length === 0) {
      missingRequirements.push("Add at least one subject you teach");
    }

    const eligibilityData = {
      isEligible,
      requirements,
      missingRequirements,
      tutorType: tutorProfile.tutorType,
      currentHourlyRate: tutorProfile.hourlyRate,
      potentialAdvancedRate: 35.0,
      upgradeBenefits: [
        "Higher hourly rate ($35 vs $25)",
        "Priority in student matching",
        "Access to advanced teaching tools",
        "Premium support",
        "Advanced analytics dashboard"
      ]
    };

    return NextResponse.json({
      success: true,
      message: "Eligibility checked successfully",
      data: eligibilityData
    });

  } catch (error) {
    console.error("Error checking tutor upgrade eligibility:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check eligibility",
        error: error.message
      },
      { status: 500 }
    );
  }
}
