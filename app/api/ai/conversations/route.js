import { NextResponse } from "next/server";

// Mock data - replace with actual database queries
const mockConversations = [
  {
    id: "conv-1",
    status: "active",
    priority: "medium",
    tags: ["booking", "help"],
    sentiment: "positive",
    category: "booking",
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    messageCount: 5,
    lastMessage: {
      content: "Thank you for your help with booking!",
      senderType: "user",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
  {
    id: "conv-2",
    status: "escalated",
    priority: "high",
    tags: ["payment", "urgent"],
    sentiment: "negative",
    category: "payment",
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    messageCount: 8,
    lastMessage: {
      content: "I need immediate help with this payment issue",
      senderType: "user",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  },
  {
    id: "conv-3",
    status: "resolved",
    priority: "low",
    tags: ["general", "tutor"],
    sentiment: "positive",
    category: "general",
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
    messageCount: 3,
    lastMessage: {
      content: "Perfect, that answered my question!",
      senderType: "user",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Filter conversations based on query parameters
    let filteredConversations = [...mockConversations];

    if (status) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.status === status
      );
    }

    if (category) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.category === category
      );
    }

    // Sort by last interaction time (most recent first)
    filteredConversations.sort(
      (a, b) => new Date(b.lastInteractionAt) - new Date(a.lastInteractionAt)
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedConversations = filteredConversations.slice(
      startIndex,
      endIndex
    );

    return NextResponse.json({
      success: true,
      conversations: paginatedConversations,
      total: filteredConversations.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
