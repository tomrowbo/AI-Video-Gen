import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'veo-3.1-fast-generate-preview', aspectRatio = '16:9' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Starting video generation with prompt:', prompt);

    // Real Veo 3.1 API call
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning`;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        instances: [{
          prompt: prompt
        }],
        parameters: {
          aspectRatio: aspectRatio
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Video generation operation started:', result);

    return NextResponse.json({
      success: true,
      prompt,
      model,
      operation: result,
      status: 'generating',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Video generation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate video',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}