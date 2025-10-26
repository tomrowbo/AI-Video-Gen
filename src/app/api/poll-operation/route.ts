import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { operationName } = await request.json();

    if (!operationName) {
      return NextResponse.json(
        { error: 'Operation name is required' },
        { status: 400 }
      );
    }

    console.log('Polling operation:', operationName);

    // Poll the operation status
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}`, {
      method: 'GET',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Polling failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Operation status:', result);

    // Check if operation is complete
    const isComplete = result.done === true;
    const hasError = result.error;

    let videoUrl = null;
    if (isComplete && !hasError && result.response) {
      // Extract video URL from the response
      console.log('Full response object:', JSON.stringify(result.response, null, 2));

      // Check multiple possible paths for the video URL
      if (result.response.generateVideoResponse?.generatedSamples?.[0]?.uri) {
        videoUrl = result.response.generateVideoResponse.generatedSamples[0].uri;
      } else if (result.response.generateVideoResponse?.generatedSamples?.[0]?.video?.uri) {
        videoUrl = result.response.generateVideoResponse.generatedSamples[0].video.uri;
      } else if (result.response.generatedVideo?.uri) {
        videoUrl = result.response.generatedVideo.uri;
      } else if (result.response.candidates?.[0]?.video?.uri) {
        videoUrl = result.response.candidates[0].video.uri;
      }

      console.log('Extracted video URL:', videoUrl);
    }

    return NextResponse.json({
      success: true,
      operationName,
      done: isComplete,
      error: hasError,
      videoUrl,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error('Operation polling error:', error);

    return NextResponse.json(
      {
        error: 'Failed to poll operation',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}