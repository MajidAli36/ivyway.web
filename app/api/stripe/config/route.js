import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if Stripe is configured
    const isConfigured = !!process.env.STRIPE_PUBLISHABLE_KEY;

    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        message: "Stripe is not configured",
        data: {
          isConfigured: false,
          publishableKey: null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Stripe configuration retrieved successfully",
      data: {
        isConfigured: true,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      },
    });
  } catch (error) {
    console.error("Error getting Stripe config:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get Stripe configuration",
        data: {
          isConfigured: false,
          publishableKey: null,
        },
      },
      { status: 500 }
    );
  }
}
