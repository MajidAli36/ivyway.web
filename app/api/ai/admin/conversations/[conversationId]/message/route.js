import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { conversationId } = params;
    const { content, internal = false } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    // Create admin message
    const message = {
      id: crypto.randomUUID(),
      content,
      senderType: "admin",
      internal, // Internal messages are only visible to admins
      createdAt: new Date().toISOString(),
      sender: {
        id: "admin-uuid", // Should come from auth token
        fullName: "Admin User",
        role: "admin",
      },
    };

    // In a real implementation, you would:
    // 1. Save message to database
    // 2. Update conversation status if needed
    // 3. Send real-time notification to user (if not internal)
    // 4. Send socket event to user

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error sending admin message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
