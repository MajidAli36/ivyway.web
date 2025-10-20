import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic GET handler for bookings
    return NextResponse.json({ 
      message: 'Bookings API endpoint',
      data: [] 
    });
  } catch (error) {
    console.error('Error in bookings GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Basic POST handler for bookings
    return NextResponse.json({ 
      message: 'Booking created successfully',
      data: body 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in bookings POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
