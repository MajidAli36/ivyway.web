import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("introVideo");

    if (!videoFile) {
      return NextResponse.json(
        { success: false, message: "No video file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!allowedTypes.includes(videoFile.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file type. Only video files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size too large. Maximum size is 50MB.",
        },
        { status: 413 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", "intro-videos");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = videoFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return success response with file URL
    const videoUrl = `/uploads/intro-videos/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Intro video uploaded successfully",
      data: {
        introVideoUrl: videoUrl,
        profileCompletion: 85, // Mock completion percentage
      },
    });
  } catch (error) {
    console.error("Error uploading intro video:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload intro video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Get the video URL from the request body or query params
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("videoUrl");

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, message: "Video URL is required" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const fileName = videoUrl.split("/").pop();
    const filePath = join(process.cwd(), "uploads", "intro-videos", fileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "Video file not found" },
        { status: 404 }
      );
    }

    // Delete the file
    const { unlink } = await import("fs/promises");
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "Intro video deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting intro video:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete intro video" },
      { status: 500 }
    );
  }
}
