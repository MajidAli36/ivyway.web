import { NextResponse } from "next/server";

// Mock conversations data for admin view - replace with actual database queries
const mockAdminConversations = [
  {
    id: "conv-1",
    user: {
      id: "user-1",
      fullName: "John Doe",
      email: "john@example.com",
      role: "student",
    },
    status: "active",
    priority: "medium",
    category: "booking",
    tags: ["booking", "help"],
    sentiment: "positive",
    messageCount: 5,
    escalationReason: null,
    escalatedAt: null,
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "conv-2",
    user: {
      id: "user-2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      role: "student",
    },
    status: "escalated",
    priority: "high",
    category: "payment",
    tags: ["payment", "urgent"],
    sentiment: "negative",
    messageCount: 8,
    escalationReason: "Payment processing issue",
    escalatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "conv-3",
    user: {
      id: "user-3",
      fullName: "Mike Johnson",
      email: "mike@example.com",
      role: "student",
    },
    status: "resolved",
    priority: "low",
    category: "general",
    tags: ["general", "tutor"],
    sentiment: "positive",
    messageCount: 3,
    escalationReason: null,
    escalatedAt: null,
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    id: "conv-4",
    user: {
      id: "user-4",
      fullName: "Sarah Wilson",
      email: "sarah@example.com",
      role: "student",
    },
    status: "escalated",
    priority: "urgent",
    category: "technical",
    tags: ["technical", "urgent", "bug"],
    sentiment: "negative",
    messageCount: 12,
    escalationReason: "Technical issue with platform access",
    escalatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    lastInteractionAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const sentiment = searchParams.get("sentiment");

    // Filter conversations based on query parameters
    let filteredConversations = [...mockAdminConversations];

    if (status) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.status === status
      );
    }

    if (priority) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.priority === priority
      );
    }

    if (category) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.category === category
      );
    }

    if (sentiment) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.sentiment === sentiment
      );
    }

    // Sort by last interaction time (most recent first) and escalated conversations first
    filteredConversations.sort((a, b) => {
      // Escalated conversations first
      if (a.status === "escalated" && b.status !== "escalated") return -1;
      if (b.status === "escalated" && a.status !== "escalated") return 1;

      // Then by priority
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally by last interaction time
      return new Date(b.lastInteractionAt) - new Date(a.lastInteractionAt);
    });

    // Calculate stats
    const stats = {
      total: mockAdminConversations.length,
      active: mockAdminConversations.filter((c) => c.status === "active")
        .length,
      escalated: mockAdminConversations.filter((c) => c.status === "escalated")
        .length,
      resolved: mockAdminConversations.filter((c) => c.status === "resolved")
        .length,
      urgent: mockAdminConversations.filter((c) => c.priority === "urgent")
        .length,
    };

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
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin conversations:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
