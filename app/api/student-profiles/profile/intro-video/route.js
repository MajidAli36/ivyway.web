import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const introVideo = formData.get('introVideo');

    if (!introVideo) {
      return NextResponse.json(
        { error: 'No intro video file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!introVideo.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (introVideo.size > maxSize) {
      return NextResponse.json(
        { error: 'Video file size must be less than 100MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'intro-videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = introVideo.name.split('.').pop();
    const filename = `intro-video-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadsDir, filename);

    // Convert File to Buffer and save
    const bytes = await introVideo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return success response with file URL
    const fileUrl = `/uploads/intro-videos/${filename}`;
    
    return NextResponse.json({
      success: true,
      message: 'Intro video uploaded successfully',
      data: {
        introVideoUrl: fileUrl,
        filename: filename,
        size: introVideo.size,
        type: introVideo.type
      }
    });

  } catch (error) {
    console.error('Error uploading intro video:', error);
    return NextResponse.json(
      { error: 'Failed to upload intro video', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Extract filename from query params or request body
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required for deletion' },
        { status: 400 }
      );
    }

    // Delete file logic here
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Intro video deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting intro video:', error);
    return NextResponse.json(
      { error: 'Failed to delete intro video', details: error.message },
      { status: 500 }
    );
  }
}
