import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { conversationId } = params;
    const { resolutionNotes, customerSatisfaction } = await request.json();

    if (!resolutionNotes?.trim()) {
      return NextResponse.json(
        { success: false, message: "Resolution notes are required" },
        { status: 400 }
      );
    }

    // Validate customer satisfaction rating
    if (
      customerSatisfaction &&
      (customerSatisfaction < 1 || customerSatisfaction > 5)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer satisfaction must be between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Update conversation
    const conversation = {
      id: conversationId,
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      resolutionNotes,
      customerSatisfaction,
      resolvedBy: "admin-uuid", // Should come from auth token
    };

    // In a real implementation, you would:
    // 1. Update conversation in database
    // 2. Send notification to user about resolution
    // 3. Update analytics/metrics
    // 4. Close any related support tickets

    return NextResponse.json({
      success: true,
      conversation,
      message: "Conversation has been resolved successfully",
    });
  } catch (error) {
    console.error("Error resolving conversation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
