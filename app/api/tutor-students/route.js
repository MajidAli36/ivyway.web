import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in production, this would come from a database
const mockStudents = [
  {
    studentId: "student-1",
    student: {
      id: "student-1",
      fullName: "John Doe",
      email: "john.doe@example.com",
      role: "student",
      isActive: true,
      profilePicture: null,
      phoneNumber: "+1234567890",
      dateOfBirth: "2005-03-15",
      gradeLevel: "11th Grade",
      school: "Lincoln High School",
      subjects: ["Mathematics", "Physics"],
      goals: ["Improve calculus skills", "Prepare for SAT"],
      learningStyle: "Visual",
      availability: "Weekdays after 3 PM",
      parentInfo: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1234567891"
      }
    },
    totalSessions: 8,
    completedSessions: 6,
    upcomingSessions: 1,
    cancelledSessions: 1,
    lastSessionDate: "2024-01-15T10:00:00Z",
    firstSessionDate: "2024-01-01T10:00:00Z",
    subjects: ["Mathematics", "Physics"],
    totalEarnings: 240.00,
    averageRating: 4.8,
    sessions: [
      {
        id: "session-1",
        startTime: "2024-01-15T10:00:00Z",
        endTime: "2024-01-15T11:00:00Z",
        status: "completed",
        subject: "Mathematics",
        topic: "Calculus - Derivatives",
        sessionType: "virtual",
        duration: 60,
        price: 30.00,
        rating: 5,
        notes: "Great progress on derivative concepts",
        createdAt: "2024-01-10T08:00:00Z"
      },
      {
        id: "session-2",
        startTime: "2024-01-20T14:00:00Z",
        endTime: "2024-01-20T15:00:00Z",
        status: "upcoming",
        subject: "Physics",
        topic: "Mechanics - Newton's Laws",
        sessionType: "virtual",
        duration: 60,
        price: 30.00,
        rating: null,
        notes: "Review homework from last session",
        createdAt: "2024-01-15T09:00:00Z"
      }
    ]
  },
  {
    studentId: "student-2",
    student: {
      id: "student-2",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "student",
      isActive: true,
      profilePicture: null,
      phoneNumber: "+1234567892",
      dateOfBirth: "2006-07-22",
      gradeLevel: "10th Grade",
      school: "Roosevelt High School",
      subjects: ["Chemistry", "Biology"],
      goals: ["Master organic chemistry", "Prepare for AP Biology"],
      learningStyle: "Kinesthetic",
      availability: "Weekends",
      parentInfo: {
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        phone: "+1234567893"
      }
    },
    totalSessions: 5,
    completedSessions: 4,
    upcomingSessions: 1,
    cancelledSessions: 0,
    lastSessionDate: "2024-01-12T16:00:00Z",
    firstSessionDate: "2024-01-05T16:00:00Z",
    subjects: ["Chemistry", "Biology"],
    totalEarnings: 150.00,
    averageRating: 4.6,
    sessions: [
      {
        id: "session-3",
        startTime: "2024-01-12T16:00:00Z",
        endTime: "2024-01-12T17:00:00Z",
        status: "completed",
        subject: "Chemistry",
        topic: "Organic Chemistry - Alkanes",
        sessionType: "virtual",
        duration: 60,
        price: 30.00,
        rating: 4,
        notes: "Needs more practice with naming conventions",
        createdAt: "2024-01-08T10:00:00Z"
      }
    ]
  },
  {
    studentId: "student-3",
    student: {
      id: "student-3",
      fullName: "Alex Chen",
      email: "alex.chen@example.com",
      role: "student",
      isActive: true,
      profilePicture: null,
      phoneNumber: "+1234567894",
      dateOfBirth: "2004-11-08",
      gradeLevel: "12th Grade",
      school: "Washington High School",
      subjects: ["Mathematics", "Computer Science"],
      goals: ["Prepare for college calculus", "Learn programming basics"],
      learningStyle: "Auditory",
      availability: "Evenings",
      parentInfo: {
        name: "Lisa Chen",
        email: "lisa.chen@example.com",
        phone: "+1234567895"
      }
    },
    totalSessions: 3,
    completedSessions: 2,
    upcomingSessions: 1,
    cancelledSessions: 0,
    lastSessionDate: "2024-01-14T19:00:00Z",
    firstSessionDate: "2024-01-08T19:00:00Z",
    subjects: ["Mathematics", "Computer Science"],
    totalEarnings: 90.00,
    averageRating: 4.9,
    sessions: [
      {
        id: "session-4",
        startTime: "2024-01-14T19:00:00Z",
        endTime: "2024-01-14T20:00:00Z",
        status: "completed",
        subject: "Mathematics",
        topic: "Pre-Calculus - Trigonometry",
        sessionType: "virtual",
        duration: 60,
        price: 30.00,
        rating: 5,
        notes: "Excellent understanding of trigonometric identities",
        createdAt: "2024-01-10T14:00:00Z"
      }
    ]
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    // Filter students based on search query
    let filteredStudents = mockStudents;
    
    if (search) {
      filteredStudents = mockStudents.filter(student => 
        student.student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.student.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by session status if provided
    if (status) {
      filteredStudents = filteredStudents.filter(student => 
        student.sessions.some(session => session.status === status)
      );
    }

    // Calculate pagination
    const totalStudents = filteredStudents.length;
    const totalPages = Math.ceil(totalStudents / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const pagination = {
      currentPage: page,
      totalPages,
      totalStudents,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    };

    return NextResponse.json({
      success: true,
      message: "Tutor students retrieved successfully",
      data: {
        students: paginatedStudents,
        pagination
      }
    });

  } catch (error) {
    console.error("Error fetching tutor students:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch students",
        error: error.message
      },
      { status: 500 }
    );
  }
}
