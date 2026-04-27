import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * CORS Middleware for vibe-coding-platform
 * 
 * Validates request origins and adds appropriate CORS headers
 */

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ...(process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ]
    : []),
].filter(Boolean) as string[]

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    if (!isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 403 })
    }
    
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin!,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // For non-preflight API requests, validate origin
  const response = NextResponse.next()
  
  if (isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Apply middleware only to API routes
export const config = {
  matcher: '/api/:path*',
}
