import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    console.log('Downloading video from:', videoUrl);

    // Fetch the video with the correct API key
    const response = await fetch(videoUrl, {
      headers: {
        'x-goog-api-key': GEMINI_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Video download failed:', errorText);
      throw new Error(`Failed to download video: ${response.status} - ${errorText}`);
    }

    // Get the video data
    const videoBuffer = await response.arrayBuffer();

    // Return the video with proper headers
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="generated-video.mp4"',
        'Content-Length': videoBuffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('Video download error:', error);

    return NextResponse.json(
      {
        error: 'Failed to download video',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}