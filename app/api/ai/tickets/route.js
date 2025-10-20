import { NextResponse } from "next/server";

// Mock support tickets data - replace with actual database queries
const mockTickets = [
  {
    id: "ticket-1",
    ticketNumber: "TICKET-2024-001",
    status: "open",
    priority: "high",
    category: "payment",
    title: "Payment processing issue",
    description: "Unable to process payment for tutoring session",
    tags: ["payment", "urgent"],
    escalationReason: "AI couldn't resolve payment issue",
    assignedAdmin: {
      id: "admin-1",
      fullName: "Admin User",
      email: "admin@ivyway.com",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    firstResponseAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "ticket-2",
    ticketNumber: "TICKET-2024-002",
    status: "in_progress",
    priority: "medium",
    category: "technical",
    title: "Login issues",
    description: "Cannot access my account after password reset",
    tags: ["technical", "account"],
    escalationReason: "Complex technical issue requiring manual intervention",
    assignedAdmin: {
      id: "admin-2",
      fullName: "Tech Support",
      email: "tech@ivyway.com",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    firstResponseAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "ticket-3",
    ticketNumber: "TICKET-2024-003",
    status: "resolved",
    priority: "low",
    category: "general",
    title: "Question about tutor qualifications",
    description: "Need information about tutor background verification process",
    tags: ["general", "inquiry"],
    escalationReason: "User requested human verification of information",
    assignedAdmin: {
      id: "admin-1",
      fullName: "Admin User",
      email: "admin@ivyway.com",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    firstResponseAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
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

    // Filter tickets based on query parameters
    let filteredTickets = [...mockTickets];

    if (status) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.status === status
      );
    }

    if (priority) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.priority === priority
      );
    }

    if (category) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.category === category
      );
    }

    // Sort by last activity time (most recent first) and open tickets first
    filteredTickets.sort((a, b) => {
      // Open/in_progress tickets first
      const statusPriority = {
        open: 0,
        in_progress: 1,
        assigned: 2,
        resolved: 3,
        closed: 4,
      };
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];
      if (statusDiff !== 0) return statusDiff;

      // Then by priority
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally by last activity time
      return new Date(b.lastActivityAt) - new Date(a.lastActivityAt);
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      tickets: paginatedTickets,
      total: filteredTickets.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
