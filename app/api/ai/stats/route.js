import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "7d";

    // Mock statistics - replace with actual database queries
    const stats = {
      conversations: 45,
      messages: 230,
      escalations: 8,
      escalationRate: "17.78",
      timeframe,
      averageResponseTime: 1250, // milliseconds
      satisfactionScore: 4.2,
      categoriesBreakdown: {
        booking: 18,
        payment: 12,
        general: 10,
        technical: 3,
        account: 2,
      },
      sentimentBreakdown: {
        positive: 25,
        neutral: 15,
        negative: 5,
      },
      resolutionRate: "82.22",
      averageConversationLength: 5.1, // messages per conversation
      peakHours: [
        { hour: 9, count: 12 },
        { hour: 14, count: 18 },
        { hour: 19, count: 15 },
      ],
    };

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("Error fetching AI stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
