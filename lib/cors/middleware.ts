/**
 * CORS Middleware for Next.js
 * 
 * This middleware adds secure CORS headers to all responses
 * and handles preflight OPTIONS requests.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCorsHeaders, isOriginAllowed } from './config'

/**
 * CORS middleware to be used in Next.js middleware.ts files
 * 
 * @example
 * // middleware.ts
 * import { corsMiddleware } from '@/lib/cors/middleware'
 * 
 * export function middleware(request: NextRequest) {
 *   return corsMiddleware(request)
 * }
 */
export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    if (!isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 403 })
    }
    
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(origin),
    })
  }

  // For non-preflight requests, add CORS headers to the response
  const response = NextResponse.next()
  
  if (isOriginAllowed(origin)) {
    const corsHeaders = getCorsHeaders(origin)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  return response
}

/**
 * Wrapper for API route handlers to add CORS headers
 * 
 * @example
 * // app/api/example/route.ts
 * import { withCors } from '@/lib/cors/middleware'
 * 
 * export const POST = withCors(async (request: Request) => {
 *   const data = await request.json()
 *   return Response.json({ success: true })
 * })
 */
export function withCors<T extends (...args: any[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    const request = args[0] as Request
    const origin = request.headers.get('origin')

    // Handle preflight
    if (request.method === 'OPTIONS') {
      if (!isOriginAllowed(origin)) {
        return new Response(null, { status: 403 })
      }
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      })
    }

    // Call the actual handler
    try {
      const response = await handler(...args)
      
      // Add CORS headers to the response
      if (isOriginAllowed(origin)) {
        const corsHeaders = getCorsHeaders(origin)
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }
      
      return response
    } catch (error) {
      // Return error response with CORS headers if origin is allowed
      const errorResponse = new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
      
      if (isOriginAllowed(origin)) {
        const corsHeaders = getCorsHeaders(origin)
        Object.entries(corsHeaders).forEach(([key, value]) => {
          errorResponse.headers.set(key, value)
        })
      }
      
      return errorResponse
    }
  }) as T
}
