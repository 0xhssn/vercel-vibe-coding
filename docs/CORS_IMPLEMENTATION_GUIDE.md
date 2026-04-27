# CORS Implementation Guide

This guide provides step-by-step instructions for implementing secure CORS policies across all Next.js applications in the monorepo.

---

## 🎯 Overview

CORS (Cross-Origin Resource Sharing) is a security feature that restricts web pages from making requests to a different domain than the one serving the page. Proper CORS configuration is critical for:

- **Security**: Preventing unauthorized domains from accessing your APIs
- **Privacy**: Protecting user data from malicious websites
- **Compliance**: Meeting security standards and regulations

---

## 🚀 Quick Start

### For New Applications

1. **Copy the CORS library to your app:**
   ```bash
   mkdir -p your-app/lib
   cp -r lib/cors your-app/lib/
   ```

2. **Create middleware.ts:**
   ```bash
   cp .templates/cors/middleware.template.ts your-app/middleware.ts
   ```

3. **Update next.config.js:**
   ```bash
   # Add headers configuration from template
   ```

4. **Configure allowed origins:**
   - Edit `middleware.ts` or `lib/cors/config.ts`
   - Add your production domain(s)

5. **Test your configuration:**
   ```bash
   npm run dev
   # Test with curl or browser DevTools
   ```

### For Existing Applications

1. **Audit current CORS configuration:**
   ```bash
   grep -r "Access-Control-Allow-Origin" your-app/
   ```

2. **Remove any wildcard origins:**
   ```javascript
   // ❌ Remove this
   res.header('Access-Control-Allow-Origin', '*')
   ```

3. **Implement proper validation:**
   - Follow "New Applications" steps above
   - Update API routes with origin validation

4. **Test thoroughly:**
   - Verify allowed origins still work
   - Confirm unauthorized origins are blocked

---

## 📁 Architecture

### Three-Layer CORS Security

```
┌─────────────────────────────────────────┐
│  1. next.config.js Headers              │
│     - Sets static CORS headers          │
│     - Applies to all API routes         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. Middleware (middleware.ts)          │
│     - Validates request origin          │
│     - Handles preflight (OPTIONS)       │
│     - Adds dynamic Allow-Origin header  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. API Route Handlers                  │
│     - Additional validation if needed   │
│     - Business logic                    │
│     - Response with CORS headers        │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Options

### Option 1: Centralized Library (Recommended)

Use the shared `/lib/cors/` library for consistency across all apps.

**Pros:**
- Centralized configuration
- Easy to update across all apps
- Consistent security policy

**Implementation:**
```typescript
// your-app/middleware.ts
import { corsMiddleware } from '@/lib/cors/middleware'

export function middleware(request: NextRequest) {
  return corsMiddleware(request)
}
```

### Option 2: Per-App Configuration

Each app has its own CORS configuration.

**Pros:**
- App-specific origins
- Independent configuration
- No shared dependencies

**Implementation:**
```typescript
// your-app/middleware.ts
const ALLOWED_ORIGINS = [
  'https://your-specific-domain.com',
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  // ... validation logic
}
```

### Option 3: API Route Wrapper

Wrap individual API routes with CORS logic.

**Pros:**
- Route-specific CORS
- Fine-grained control
- Easy to customize

**Implementation:**
```typescript
// your-app/app/api/example/route.ts
import { withCors } from '@/lib/cors/middleware'

export const POST = withCors(async (request: Request) => {
  // Your API logic
  return Response.json({ success: true })
})
```

---

## ⚙️ Configuration Details

### Environment Variables

Set these in your `.env.local` (development) and Vercel dashboard (production):

```bash
# Production application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Vercel automatically sets this
VERCEL_URL=your-app.vercel.app

# Node environment
NODE_ENV=production
```

### Allowed Origins

Configure in `lib/cors/config.ts` or your middleware:

```typescript
const ALLOWED_ORIGINS = [
  // Production domains
  process.env.NEXT_PUBLIC_APP_URL,
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  
  // Vercel deployments
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  
  // Development (only in dev mode)
  ...(process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
      ]
    : []),
].filter(Boolean) as string[]
```

### Advanced: Wildcard Subdomains

For apps with dynamic subdomains:

```typescript
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  
  // Exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true
  
  // Pattern matching for *.yourdomain.com
  const allowedPatterns = [
    /^https:\/\/[\w-]+\.yourdomain\.com$/,
    /^https:\/\/[\w-]+\.vercel\.app$/,
  ]
  
  return allowedPatterns.some(pattern => pattern.test(origin))
}
```

---

## 🔒 Security Best Practices

### ✅ DO

1. **Explicitly list allowed origins**
   ```typescript
   const ALLOWED_ORIGINS = ['https://trustedsite.com']
   ```

2. **Validate origins per-request**
   ```typescript
   const origin = request.headers.get('origin')
   if (!isOriginAllowed(origin)) {
     return new Response(null, { status: 403 })
   }
   ```

3. **Handle preflight requests**
   ```typescript
   if (request.method === 'OPTIONS') {
     return new Response(null, {
       status: 204,
       headers: getCorsHeaders(origin),
     })
   }
   ```

4. **Use environment-specific origins**
   ```typescript
   ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
   ```

5. **Log blocked requests**
   ```typescript
   if (!isOriginAllowed(origin)) {
     console.warn(`Blocked CORS request from origin: ${origin}`)
     return new Response(null, { status: 403 })
   }
   ```

### ❌ DON'T

1. **Never use wildcard in production**
   ```typescript
   // ❌ NEVER DO THIS
   res.header('Access-Control-Allow-Origin', '*')
   ```

2. **Don't set headers without validation**
   ```typescript
   // ❌ BAD: No validation
   res.header('Access-Control-Allow-Origin', request.headers.get('origin'))
   
   // ✅ GOOD: With validation
   if (isOriginAllowed(origin)) {
     res.header('Access-Control-Allow-Origin', origin)
   }
   ```

3. **Don't enable credentials with wildcard**
   ```typescript
   // ❌ NEVER: This combination is invalid and insecure
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Credentials': 'true'
   ```

4. **Don't skip preflight validation**
   ```typescript
   // ❌ BAD: Allows any origin for preflight
   if (request.method === 'OPTIONS') {
     return new Response(null, { status: 204 })
   }
   
   // ✅ GOOD: Validates origin first
   if (request.method === 'OPTIONS') {
     if (!isOriginAllowed(origin)) return new Response(null, { status: 403 })
     return new Response(null, { status: 204, headers: getCorsHeaders(origin) })
   }
   ```

5. **Don't trust the origin header blindly**
   ```typescript
   // ❌ BAD: Origin can be spoofed in some contexts
   const origin = request.headers.get('origin')
   // Always validate against your allowed list
   ```

---

## 🧪 Testing Guide

### Manual Testing

#### Test 1: Allowed Origin

```bash
curl -X POST http://localhost:3000/api/test \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -v
```

**Expected Response:**
```
< HTTP/1.1 200 OK
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Credentials: true
```

#### Test 2: Blocked Origin

```bash
curl -X POST http://localhost:3000/api/test \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -v
```

**Expected Response:**
```
< HTTP/1.1 403 Forbidden
(No CORS headers)
```

#### Test 3: Preflight Request

```bash
curl -X OPTIONS http://localhost:3000/api/test \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response:**
```
< HTTP/1.1 204 No Content
< Access-Control-Allow-Origin: http://localhost:3000
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
< Access-Control-Allow-Headers: Content-Type, Authorization
< Access-Control-Max-Age: 86400
```

### Browser Testing

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Test allowed origin:**
   ```javascript
   fetch('http://localhost:3000/api/test', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ test: 'data' })
   }).then(r => r.json()).then(console.log)
   ```

4. **Check Network tab** for CORS headers

### Automated Testing

Create `tests/cors.test.ts`:

```typescript
import { describe, test, expect } from '@jest/globals'

describe('CORS Security', () => {
  const API_URL = 'http://localhost:3000/api/test'
  
  test('allows requests from localhost:3000', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' }),
    })
    
    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
  })
  
  test('blocks requests from unauthorized origins', async () => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Origin': 'https://evil.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' }),
    })
    
    expect(response.status).toBe(403)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
  
  test('handles preflight requests correctly', async () => {
    const response = await fetch(API_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
      },
    })
    
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
  })
})
```

Run tests:
```bash
npm test -- cors.test.ts
```

---

## 🐛 Troubleshooting

### Issue: CORS Error in Browser

**Symptoms:**
```
Access to fetch at 'http://localhost:3000/api/test' from origin 'http://localhost:3001' 
has been blocked by CORS policy
```

**Solutions:**

1. **Add the origin to ALLOWED_ORIGINS:**
   ```typescript
   const ALLOWED_ORIGINS = [
     'http://localhost:3000',
     'http://localhost:3001', // Add this
   ]
   ```

2. **Check middleware is applied:**
   ```typescript
   export const config = {
     matcher: '/api/:path*', // Ensure this matches your API routes
   }
   ```

3. **Verify headers are set:**
   - Check Network tab in DevTools
   - Look for `Access-Control-Allow-Origin` header

### Issue: Preflight Request Fails

**Symptoms:**
```
Response to preflight request doesn't pass access control check
```

**Solutions:**

1. **Ensure OPTIONS handler exists:**
   ```typescript
   if (request.method === 'OPTIONS') {
     return new Response(null, {
       status: 204,
       headers: getCorsHeaders(origin),
     })
   }
   ```

2. **Check allowed methods include requested method:**
   ```typescript
   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
   ```

3. **Verify allowed headers:**
   ```typescript
   'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
   ```

### Issue: Credentials Not Working

**Symptoms:**
```
The value of the 'Access-Control-Allow-Origin' header must not be the wildcard '*' 
when the request's credentials mode is 'include'
```

**Solutions:**

1. **Never use wildcard with credentials:**
   ```typescript
   // ❌ This doesn't work
   'Access-Control-Allow-Origin': '*'
   'Access-Control-Allow-Credentials': 'true'
   
   // ✅ Use specific origin
   'Access-Control-Allow-Origin': origin
   'Access-Control-Allow-Credentials': 'true'
   ```

2. **Enable credentials in fetch:**
   ```javascript
   fetch(url, {
     credentials: 'include', // or 'same-origin'
   })
   ```

---

## 📊 Monitoring & Logging

### Log Blocked Requests

```typescript
export function corsMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  if (!isOriginAllowed(origin)) {
    // Log for security monitoring
    console.warn('[CORS] Blocked request', {
      origin,
      path: request.nextUrl.pathname,
      method: request.method,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
    })
    
    return new NextResponse(null, { status: 403 })
  }
  
  // ... rest of middleware
}
```

### Set Up Alerts

Monitor for:
- Spike in blocked CORS requests
- Requests from unexpected origins
- Unusual patterns (e.g., scanning)

Example alert rule:
```
blocked_cors_requests > 100 per hour → Send alert
```

---

## 🎓 Additional Resources

### Documentation
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP CORS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

### Tools
- [CORS Tester](https://www.test-cors.org/)
- [Browser DevTools Network Tab](https://developer.chrome.com/docs/devtools/network/)

### Support
- Check `/lib/cors/README.md` for detailed usage
- Review `CORS_SECURITY_AUDIT.md` for security guidelines
- Create an issue if you encounter problems

---

## ✅ Implementation Checklist

Before deploying to production:

- [ ] CORS library implemented (`/lib/cors/`)
- [ ] Middleware created and configured
- [ ] `next.config.js` headers added
- [ ] Allowed origins configured
- [ ] Environment variables set
- [ ] Wildcard origins removed
- [ ] API routes tested with allowed origins
- [ ] API routes tested with blocked origins
- [ ] Preflight requests working
- [ ] Credentials configured correctly (if needed)
- [ ] Logging implemented
- [ ] Documentation updated
- [ ] Team trained on CORS policies

---

**Last Updated**: 2026-04-27  
**Version**: 1.0.0  
**Maintainer**: Security Team
