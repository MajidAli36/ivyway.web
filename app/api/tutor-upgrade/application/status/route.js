import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in production, this would come from a database
const mockApplications = [];

export async function GET(request) {
  try {
    // In a real application, you would:
    // 1. Get the tutor ID from the JWT token or session
    // 2. Fetch the latest application from the database
    
    const tutorId = "tutor-1"; // Mock tutor ID
    
    // Find the most recent application for this tutor
    const latestApplication = mockApplications
      .filter(app => app.tutorId === tutorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!latestApplication) {
      return NextResponse.json({
        success: true,
        message: "No application found",
        data: null
      });
    }

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
