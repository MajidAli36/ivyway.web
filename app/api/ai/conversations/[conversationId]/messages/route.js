import { NextResponse } from "next/server";

// Mock messages data - replace with actual database queries
const mockMessages = {
  "conv-1": [
    {
      id: "msg-1",
      content: "I need help booking a session",
      senderType: "user",
      intent: "book_session",
      sentiment: "neutral",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      sender: {
        id: "user-1",
        fullName: "John Doe",
        role: "student",
      },
    },
    {
      id: "msg-2",
      content:
        "I'd be happy to help you book a tutoring session! What subject are you looking for help with?",
      senderType: "ai",
      confidence: 0.85,
      model: "gpt-3.5-turbo",
      responseTime: 1200,
      metadata: {
        suggestedActions: [
          { text: "Find Tutors", action: "search_tutors" },
          { text: "View My Bookings", action: "view_bookings" },
        ],
        followUpQuestions: [
          "What subject are you looking for help with?",
          "Do you have a preferred time for your session?",
        ],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000).toISOString(),
    },
    {
      id: "msg-3",
      content: "I need help with Mathematics",
      senderType: "user",
      intent: "book_session",
      sentiment: "neutral",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 + 30000).toISOString(),
      sender: {
        id: "user-1",
        fullName: "John Doe",
        role: "student",
      },
    },
    {
      id: "msg-4",
      content:
        "Great choice! Mathematics is one of our most popular subjects. I can help you find qualified math tutors. Would you prefer algebra, calculus, geometry, or a specific area of math?",
      senderType: "ai",
      confidence: 0.92,
      model: "gpt-3.5-turbo",
      responseTime: 800,
      metadata: {
        suggestedActions: [
          { text: "Browse Math Tutors", action: "browse_tutors?subject=math" },
          { text: "Book Math Session", action: "book_session?subject=math" },
        ],
        followUpQuestions: [
          "What specific area of math do you need help with?",
          "Do you have a preferred time for your session?",
        ],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 + 35000).toISOString(),
    },
    {
      id: "msg-5",
      content: "Thank you for your help with booking!",
      senderType: "user",
      intent: "general_inquiry",
      sentiment: "positive",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      sender: {
        id: "user-1",
        fullName: "John Doe",
        role: "student",
      },
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      content: "I'm having trouble with a payment",
      senderType: "user",
      intent: "payment_inquiry",
      sentiment: "negative",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      sender: {
        id: "user-2",
        fullName: "Jane Smith",
        role: "student",
      },
    },
    {
      id: "msg-7",
      content:
        "I can help you with payment-related questions. Are you looking to update your payment method, check your billing history, or do you have a specific payment concern?",
      senderType: "ai",
      confidence: 0.78,
      model: "gpt-3.5-turbo",
      responseTime: 950,
      metadata: {
        suggestedActions: [
          { text: "View Billing", action: "view_billing" },
          { text: "Payment Methods", action: "payment_methods" },
        ],
        followUpQuestions: [
          "What specific payment issue are you experiencing?",
          "Would you like me to connect you with our billing team?",
        ],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3 + 5000).toISOString(),
    },
    {
      id: "msg-8",
      content: "I need immediate help with this payment issue",
      senderType: "user",
      intent: "payment_inquiry",
      sentiment: "negative",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      sender: {
        id: "user-2",
        fullName: "Jane Smith",
        role: "student",
      },
    },
  ],
  // Add mock data for additional conversations
  "conv-3": [
    {
      id: "msg-9",
      content: "I need help with technical issues on the platform",
      senderType: "user",
      intent: "technical_support",
      sentiment: "neutral",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      sender: {
        id: "user-3",
        fullName: "Mike Johnson",
        role: "student",
      },
    },
    {
      id: "msg-10",
      content:
        "I understand you're experiencing technical difficulties. Could you please describe the specific issue you're encountering?",
      senderType: "ai",
      confidence: 0.88,
      model: "gpt-3.5-turbo",
      responseTime: 1100,
      metadata: {
        suggestedActions: [
          { text: "Technical Support", action: "contact_support" },
          { text: "System Status", action: "system_status" },
        ],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4 + 3000).toISOString(),
    },
  ],
  // Default conversation for any unmapped IDs
  default: [
    {
      id: "msg-default-1",
      content: "Hello! How can I help you today?",
      senderType: "ai",
      confidence: 0.95,
      model: "gpt-3.5-turbo",
      responseTime: 800,
      metadata: {
        suggestedActions: [
          { text: "Get Started", action: "get_started" },
          { text: "Contact Support", action: "contact_support" },
        ],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
};

export async function GET(request, { params }) {
  try {
    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;

    console.log(`Fetching messages for conversation: ${conversationId}`);

    // Validate conversationId
    if (!conversationId) {
      console.error("No conversation ID provided");
      return NextResponse.json(
        { success: false, message: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Get messages for the conversation, fallback to default if not found
    let conversationMessages = mockMessages[conversationId];

    if (!conversationMessages) {
      console.log(
        `No specific messages found for ${conversationId}, using default messages`
      );
      conversationMessages = mockMessages.default;
    }

    console.log(
      `Found ${conversationMessages.length} messages for conversation ${conversationId}`
    );

    // Sort messages by creation time (oldest first for chat display)
    const sortedMessages = [...conversationMessages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = sortedMessages.slice(startIndex, endIndex);

    const response = {
      success: true,
      messages: paginatedMessages,
      total: sortedMessages.length,
      page,
      limit,
      conversationId, // Include for debugging
    };

    console.log(
      `Returning ${paginatedMessages.length} messages for conversation ${conversationId}`
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
