import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { conversationId } = params;
    const { reason } = await request.json();

    if (!reason?.trim()) {
      return NextResponse.json(
        { success: false, message: "Escalation reason is required" },
        { status: 400 }
      );
    }

    // Generate ticket number
    const ticketNumber = `TICKET-${new Date().getFullYear()}-${String(
      Date.now()
    ).slice(-6)}`;

    // Create support ticket
    const ticket = {
      id: crypto.randomUUID(),
      ticketNumber,
      status: "open",
      priority: "high",
      category: "general", // Could be derived from conversation analysis
      title: `Manual Escalation: ${reason.substring(0, 50)}${
        reason.length > 50 ? "..." : ""
      }`,
      description: reason,
      escalationReason: reason,
      createdAt: new Date().toISOString(),
      conversationId,
      userId: "user-uuid", // Should come from auth token
    };

    // Update conversation status
    const conversation = {
      id: conversationId,
      status: "escalated",
      escalatedAt: new Date().toISOString(),
      escalationReason: reason,
    };

    return NextResponse.json({
      success: true,
      ticket,
      conversation,
      message:
        "Conversation has been escalated to our support team. You will receive a response shortly.",
    });
  } catch (error) {
    console.error("Error escalating conversation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
