import { NextResponse } from "next/server";

// Mock plan data - this should match your database structure
const PLANS_DATA = [
  {
    id: "monthly_regular",
    name: "Regular Tutoring Monthly",
    type: "monthly",
    price: 375.0,
    calculatedPrice: 375.0,
    sessionCount: 4,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_monthly_regular",
    stripePriceId: "price_monthly_regular",
    isPopular: false,
    tutorType: "regular",
    hourlyRate: 93.75, // $375 / 4 sessions = $93.75 per hour
    features: [
      "4 one-hour sessions per month",
      "Regular tutor expertise",
      "All subjects covered",
      "Flexible scheduling",
      "Monthly progress reports",
    ],
  },
  {
    id: "monthly_advanced",
    name: "Advanced Tutoring Monthly",
    type: "monthly",
    price: 520.0,
    calculatedPrice: 520.0,
    sessionCount: 4,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_monthly_advanced",
    stripePriceId: "price_monthly_advanced",
    isPopular: true,
    tutorType: "advanced",
    hourlyRate: 130.0, // $520 / 4 sessions = $130 per hour
    features: [
      "4 one-hour sessions per month",
      "Advanced tutor expertise",
      "Premium subject knowledge",
      "Priority scheduling",
      "Enhanced progress tracking",
    ],
  },
  {
    id: "multi_hour_2_5",
    name: "2-5 Hour Package",
    type: "multi_hour",
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 142.48, // 2 hours * $74.99 - 5% discount = $142.48
    sessionCount: null,
    duration: 120, // 2 hours default
    discount: 7.50, // 5% of $149.98 = $7.50
    discountPercentage: 5, // 5% off for 2-5 hours
    stripeProductId: "prod_multi_hour_2_5",
    stripePriceId: "price_multi_hour_2_5",
    isPopular: false,
    minHours: 2,
    maxHours: 5,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "2-5 hours of tutoring",
      "5% discount applied",
      "Flexible scheduling",
      "6-month validity",
      "All subjects included",
    ],
  },
  {
    id: "multi_hour_6_10",
    name: "6-10 Hour Package",
    type: "multi_hour",
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 404.95, // 6 hours * $74.99 - 10% discount = $404.95
    sessionCount: null,
    duration: 360, // 6 hours default
    discount: 44.99, // 10% of $449.94 = $44.99
    discountPercentage: 10, // 10% off for 6-10 hours
    stripeProductId: "prod_multi_hour_6_10",
    stripePriceId: "price_multi_hour_6_10",
    isPopular: true,
    minHours: 6,
    maxHours: 10,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "6-10 hours of tutoring",
      "10% discount applied",
      "Priority scheduling",
      "9-month validity",
      "All subjects included",
    ],
  },
  {
    id: "multi_hour_11_plus",
    name: "11+ Hour Package",
    type: "multi_hour",
    price: 74.99, // Base hourly rate for regular tutors
    calculatedPrice: 659.91, // 11 hours * $74.99 - 20% discount = $659.91
    sessionCount: null,
    duration: 660, // 11 hours default
    discount: 164.98, // 20% of $824.89 = $164.98
    discountPercentage: 20, // 20% off for 11+ hours
    stripeProductId: "prod_multi_hour_11_plus",
    stripePriceId: "price_multi_hour_11_plus",
    isPopular: false,
    minHours: 11,
    maxHours: null, // No upper limit
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "11+ hours of tutoring",
      "20% discount applied",
      "Maximum flexibility",
      "12-month validity",
      "Best value option",
    ],
  },
  {
    id: "single_session",
    name: "Single Tutoring Session",
    type: "single",
    price: 74.99, // Correct base hourly rate
    calculatedPrice: 74.99,
    sessionCount: null,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_single_session",
    stripePriceId: "price_single_session",
    isPopular: false,
    tutorType: "regular",
    hourlyRate: 74.99,
    features: [
      "One-hour tutoring session",
      "Regular tutor expertise",
      "All subjects covered",
      "Flexible scheduling",
      "Immediate booking",
    ],
  },
  {
    id: "single_advanced_session",
    name: "Single Advanced Tutoring Session",
    type: "single",
    price: 99.99, // Advanced hourly rate
    calculatedPrice: 99.99,
    sessionCount: null,
    duration: 60,
    discount: 0,
    discountPercentage: 0,
    stripeProductId: "prod_single_advanced_session",
    stripePriceId: "price_single_advanced_session",
    isPopular: true,
    tutorType: "advanced",
    hourlyRate: 99.99,
    features: [
      "One-hour advanced tutoring session",
      "Advanced tutor expertise",
      "Premium subject knowledge",
      "Priority scheduling",
      "Enhanced learning experience",
    ],
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const tutorType = searchParams.get("tutorType");

    let filteredPlans = PLANS_DATA;

    // Filter by type if specified
    if (type) {
      filteredPlans = filteredPlans.filter(plan => plan.type === type);
    }

    // Filter by tutor type if specified
    if (tutorType) {
      filteredPlans = filteredPlans.filter(plan => plan.tutorType === tutorType);
    }

    return NextResponse.json({
      success: true,
      data: filteredPlans,
      count: filteredPlans.length
    });

  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch plans",
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { planId, hours, duration } = body;

    // Find the plan
    const plan = PLANS_DATA.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found"
        },
        { status: 404 }
      );
    }

    let calculatedPrice = plan.price;
    let discount = 0;
    let discountPercentage = 0;

    // Calculate pricing based on plan type
    if (plan.type === "multi_hour" && hours) {
      // Apply multi-hour discount structure
      if (hours >= 11) {
        discountPercentage = 20; // 20% off for 11+ hours
      } else if (hours >= 6) {
        discountPercentage = 10; // 10% off for 6-10 hours
      } else if (hours >= 2) {
        discountPercentage = 5; // 5% off for 2-5 hours
      } else {
        discountPercentage = 0; // No discount for single hour
      }
      
      const subtotal = plan.price * hours;
      discount = (subtotal * discountPercentage) / 100;
      calculatedPrice = subtotal - discount;
    } else if (plan.type === "single" && duration) {
      // For single sessions, calculate based on duration
      const durationInHours = duration / 60; // Convert minutes to hours
      calculatedPrice = plan.price * durationInHours;
    }

    return NextResponse.json({
      success: true,
      data: {
        calculatedPrice: Math.round(calculatedPrice * 100) / 100, // Round to 2 decimal places
        discount: Math.round(discount * 100) / 100,
        discountPercentage,
        originalPrice: plan.price,
        hours: hours || 1,
        duration: duration || plan.duration
      }
    });

  } catch (error) {
    console.error("Error calculating plan price:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate plan price",
        error: error.message
      },
      { status: 500 }
    );
  }
}
