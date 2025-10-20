import { NextResponse } from "next/server";

// Mock session data with detailed reasoning chains
const mockSessionDetails = {
  "session-1": {
    id: "session-1",
    userMessage: "I want to book a math tutoring session",
    finalResponse:
      "I can help you book a tutoring session! Based on your request, I found 5 excellent math tutors available this week. You have 2 sessions remaining on your Basic plan. Would you like me to show you the available tutors and help you schedule a session? I can also check your preferred times and subjects to make the best match.",
    status: "completed",
    executionTime: 3200,
    totalSteps: 3,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:03Z",
    reasoningChain: [
      {
        stepNumber: 1,
        thought:
          "The user wants to book a tutoring session. I need to understand their requirements and find available tutors.",
        action: {
          name: "search_tutors",
          parameters: { subject: "math", availability: "this week" },
        },
        observation:
          "Found 5 available tutors for math this week. Prices range from $25-45 per hour.",
        success: true,
        executionTime: 1200,
        tokens: {
          input: 45,
          output: 120,
          total: 165,
        },
      },
      {
        stepNumber: 2,
        thought:
          "I should check the user's current plan and payment method to ensure they can book.",
        action: {
          name: "check_user_plan",
          parameters: { userId: "current" },
        },
        observation:
          "User has a Basic plan with 2 sessions remaining. Payment method is on file.",
        success: true,
        executionTime: 800,
        tokens: {
          input: 30,
          output: 85,
          total: 115,
        },
      },
      {
        stepNumber: 3,
        thought:
          "Now I can provide specific booking recommendations and guide them through the process.",
        action: {
          name: "generate_booking_suggestions",
          parameters: { tutors: "5 available", plan: "Basic" },
        },
        observation:
          "Generated personalized booking suggestions with tutor recommendations and scheduling options.",
        success: true,
        executionTime: 1200,
        tokens: {
          input: 25,
          output: 150,
          total: 175,
        },
      },
    ],
    tokens: {
      input: 100,
      output: 355,
      total: 455,
    },
  },
  "session-2": {
    id: "session-2",
    userMessage: "What's my current billing status?",
    finalResponse:
      "I've checked your billing status and everything looks good! Your next payment of $99.99 is due in 15 days. You have no outstanding charges, and your last payment on January 15th was successful. Your subscription is active and you have access to all your plan features. Is there anything specific about your billing you'd like me to help with?",
    status: "completed",
    executionTime: 2800,
    totalSteps: 2,
    createdAt: "2024-01-19T15:45:00Z",
    updatedAt: "2024-01-19T15:45:02Z",
    reasoningChain: [
      {
        stepNumber: 1,
        thought:
          "The user has a question about payments or billing. I need to check their current billing status.",
        action: {
          name: "check_billing_status",
          parameters: { userId: "current" },
        },
        observation:
          "User has an active subscription with next payment due in 15 days. No outstanding charges.",
        success: true,
        executionTime: 1500,
        tokens: {
          input: 35,
          output: 95,
          total: 130,
        },
      },
      {
        stepNumber: 2,
        thought:
          "I should also check their payment history and any recent transactions.",
        action: {
          name: "get_payment_history",
          parameters: { userId: "current", limit: 10 },
        },
        observation:
          "Found 8 recent transactions. Last payment was successful on 2024-01-15 for $99.99.",
        success: true,
        executionTime: 1300,
        tokens: {
          input: 40,
          output: 110,
          total: 150,
        },
      },
    ],
    tokens: {
      input: 75,
      output: 205,
      total: 280,
    },
  },
};

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    // Get session details from mock data
    const session = mockSessionDetails[sessionId];

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Session details retrieved successfully",
      data: {
        session,
      },
    });
  } catch (error) {
    console.error("Error in ReAct session detail endpoint:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
