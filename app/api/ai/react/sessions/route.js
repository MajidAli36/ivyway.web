import { NextResponse } from "next/server";

// Mock session data - replace with actual database queries
const mockSessions = [
  {
    id: "session-1",
    userMessage: "I want to book a math tutoring session",
    finalResponse:
      "I can help you book a tutoring session! Based on your request, I found 5 excellent math tutors available this week...",
    status: "completed",
    executionTime: 3200,
    totalSteps: 3,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:03Z",
  },
  {
    id: "session-2",
    userMessage: "What's my current billing status?",
    finalResponse:
      "I've checked your billing status and everything looks good! Your next payment of $99.99 is due in 15 days...",
    status: "completed",
    executionTime: 2800,
    totalSteps: 2,
    createdAt: "2024-01-19T15:45:00Z",
    updatedAt: "2024-01-19T15:45:02Z",
  },
  {
    id: "session-3",
    userMessage: "How am I doing with my progress?",
    finalResponse:
      "Great news about your progress! In the last 30 days, you've completed 12 sessions and shown an average improvement of 15%...",
    status: "completed",
    executionTime: 3500,
    totalSteps: 2,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:03Z",
  },
  {
    id: "session-4",
    userMessage: "Can you help me find a science tutor?",
    finalResponse:
      "I'd be happy to help you find a science tutor! Let me search for available tutors in your area...",
    status: "failed",
    executionTime: 1500,
    totalSteps: 1,
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:01Z",
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");

    // Filter sessions by status if provided
    let filteredSessions = mockSessions;
    if (status) {
      filteredSessions = mockSessions.filter(
        (session) => session.status === status
      );
    }

    // Calculate pagination
    const total = filteredSessions.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      message: "Sessions retrieved successfully",
      data: {
        sessions: paginatedSessions,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error("Error in ReAct sessions endpoint:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
