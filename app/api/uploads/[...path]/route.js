import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const filePath = join(process.cwd(), 'uploads', ...path);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path[path.length - 1].split('.').pop().toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === 'mp4') contentType = 'video/mp4';
    else if (ext === 'mov') contentType = 'video/quicktime';
    else if (ext === 'avi') contentType = 'video/x-msvideo';
    else if (ext === 'webm') contentType = 'video/webm';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'gif') contentType = 'image/gif';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file', details: error.message },
      { status: 500 }
    );
  }
}
