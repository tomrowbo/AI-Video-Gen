import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight middleware - we handle payments via autonomous agents now
export function middleware(request: NextRequest) {
  // Just pass through - autonomous agents handle payments directly
  return NextResponse.next();
}

// Only run on API routes that need minimal processing
export const config = {
  matcher: [
    '/api/generate-video-paid'
  ]
};