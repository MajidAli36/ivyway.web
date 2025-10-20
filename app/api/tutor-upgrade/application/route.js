import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in production, this would come from a database
const mockApplications = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      motivation, 
      teachingPhilosophy, 
      additionalQualifications,
      expectedOutcomes 
    } = body;

    // Validate required fields
    if (!motivation || !teachingPhilosophy) {
      return NextResponse.json(
        {
          success: false,
          message: "Motivation and teaching philosophy are required"
        },
        { status: 400 }
      );
    }

    // Create new application
    const applicationId = `app-${Date.now()}`;
    const newApplication = {
      id: applicationId,
      tutorId: "tutor-1", // In real app, get from JWT token
      status: "pending",
      applicationDate: new Date().toISOString(),
      motivation,
      teachingPhilosophy,
      additionalQualifications: additionalQualifications || "",
      expectedOutcomes: expectedOutcomes || "",
      estimatedReviewTime: "3-5 business days",
      reviewNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store application (in real app, save to database)
    mockApplications.push(newApplication);

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: newApplication.id,
        status: newApplication.status,
        applicationDate: newApplication.applicationDate,
        estimatedReviewTime: newApplication.estimatedReviewTime
      }
    });

  } catch (error) {
    console.error("Error submitting tutor upgrade application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit application",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // In a real application, you would:
    // 1. Get the tutor ID from the JWT token or session
    // 2. Fetch applications from the database
    
    const tutorId = "tutor-1"; // Mock tutor ID
    
    // Find applications for this tutor
    const tutorApplications = mockApplications.filter(app => app.tutorId === tutorId);
    
    // Get the most recent application
    const latestApplication = tutorApplications.length > 0 
      ? tutorApplications[tutorApplications.length - 1]
      : null;

    return NextResponse.json({
      success: true,
      message: "Application status retrieved successfully",
      data: latestApplication
    });

  } catch (error) {
    console.error("Error fetching application status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch application status",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const tutorId = "tutor-1"; // Mock tutor ID
    
    // Find and remove the latest application
    const applicationIndex = mockApplications.findIndex(app => 
      app.tutorId === tutorId && app.status === "pending"
    );
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "No pending application found to cancel"
        },
        { status: 404 }
      );
    }

    // Remove the application
    mockApplications.splice(applicationIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Application cancelled successfully",
      data: null
    });

  } catch (error) {
    console.error("Error cancelling application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel application",
        error: error.message
      },
      { status: 500 }
    );
  }
}
