import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { conversationId } = params;
    const { adminId } = await request.json();

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Admin ID is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Verify the admin exists and has permission
    // 2. Update the conversation in the database
    // 3. Send notifications to relevant parties

    const conversation = {
      id: conversationId,
      assignedAdminId: adminId,
      status: "assigned",
      assignedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      conversation,
      message: "Conversation has been assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning conversation:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
