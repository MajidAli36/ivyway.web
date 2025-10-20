import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Student profile API endpoint' });
}

export async function PUT() {
  return NextResponse.json({ message: 'Student profile update endpoint' });
}
