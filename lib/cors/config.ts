/**
 * CORS Configuration
 * 
 * This file defines the allowed origins and CORS headers for all applications
 * in the monorepo. Update the ALLOWED_ORIGINS array to include your trusted domains.
 */

// Define environment-specific allowed origins
export const ALLOWED_ORIGINS = [
  // Production domains
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

// Add Vercel preview deployments if in preview environment
if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
  ALLOWED_ORIGINS.push(`https://${process.env.VERCEL_URL}`)
}

export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
} as const

/**
 * Check if an origin is allowed based on the configured allowed origins
 */
export function isOriginAllowed(origin: string | null | undefined): boolean {
  if (!origin) return false
  
  // Exact match
  if (ALLOWED_ORIGINS.includes(origin)) return true
  
  // Check for wildcard patterns (e.g., *.vercel.app)
  return ALLOWED_ORIGINS.some((allowed) => {
    if (allowed.includes('*')) {
      const pattern = new RegExp(
        '^' + allowed.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$'
      )
      return pattern.test(origin)
    }
    return false
  })
}

/**
 * Get CORS headers for a specific origin
 */
export function getCorsHeaders(origin: string | null | undefined): Record<string, string> {
  if (!isOriginAllowed(origin)) {
    // Return minimal headers for disallowed origins
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin!,
    ...CORS_HEADERS,
  }
}
