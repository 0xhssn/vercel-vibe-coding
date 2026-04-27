/**
 * CORS Middleware Template
 * 
 * Copy this to your application's middleware.ts file to add CORS validation
 * and headers to API routes.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configure allowed origins for your application
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  
  // Development origins
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
  
  // Exact match
  if (ALLOWED_ORIGINS.includes(origin)) return true
  
  // Add pattern matching if needed (e.g., for *.yourdomain.com)
  // return ALLOWED_ORIGINS.some(allowed => {
  //   if (allowed.includes('*')) {
  //     const pattern = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$')
  //     return pattern.test(origin)
  //   }
  //   return false
  // })
  
  return false
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Only apply CORS to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Handle preflight (OPTIONS) requests
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

  // For regular requests, validate origin and add CORS headers
  const response = NextResponse.next()
  
  if (isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

// Apply to API routes only
export const config = {
  matcher: '/api/:path*',
}
