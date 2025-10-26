import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get payment information from x402 middleware
    const headersList = await headers();
    const paymentResponse = headersList.get('x-payment-response');
    const originalPayment = headersList.get('x-payment');

    // Verify payment was made
    if (!paymentResponse || !originalPayment) {
      return NextResponse.json(
        { error: 'Payment required' },
        { status: 402 }
      );
    }

    // Get parameters from URL
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');
    const model = searchParams.get('model') || 'veo-3.1-fast-generate-preview';
    const aspectRatio = '16:9';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Starting paid video generation with prompt:', prompt);

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
    console.log('Paid video generation operation started:', result);

    // Parse payment details
    let paymentDetails = null;
    try {
      if (paymentResponse) {
        paymentDetails = JSON.parse(paymentResponse);
      }
    } catch (e) {
      console.error('Failed to parse payment response:', e);
    }

    // Redirect back to video generator with success data
    const successUrl = new URL('/video-generator', request.url);
    successUrl.searchParams.set('payment_success', 'true');
    successUrl.searchParams.set('operation_name', result.name);
    successUrl.searchParams.set('prompt', prompt);
    successUrl.searchParams.set('model', model);
    if (paymentDetails?.transactionHash) {
      successUrl.searchParams.set('tx_hash', paymentDetails.transactionHash);
    }

    return NextResponse.redirect(successUrl.toString());

  } catch (error: any) {
    console.error('Paid video generation error:', error);

    // Redirect back with error
    const errorUrl = new URL('/video-generator', request.url);
    errorUrl.searchParams.set('payment_error', encodeURIComponent(error.message));

    return NextResponse.redirect(errorUrl.toString());
  }
}

export async function POST(request: NextRequest) {
  // Keep POST handler for backward compatibility
  return GET(request);
}