# CORS Security Configuration

This directory contains the centralized CORS (Cross-Origin Resource Sharing) security configuration for all Next.js applications in this monorepo.

## 🔒 Security Principles

1. **Explicit Allow List**: Only explicitly allowed origins can access API endpoints
2. **No Wildcards**: The wildcard `*` origin is never used in production
3. **Dynamic Validation**: Origins are validated per-request
4. **Environment-Aware**: Different origins are allowed based on environment (dev/preview/prod)

## 📁 Files

- **`config.ts`**: Core CORS configuration and origin validation logic
- **`middleware.ts`**: Middleware utilities for Next.js apps

## 🚀 Usage

### Option 1: Using Middleware (Recommended)

Create or update your application's `middleware.ts`:

```typescript
import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/lib/cors/middleware'

export function middleware(request: NextRequest) {
  // Add CORS headers to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return corsMiddleware(request)
  }
  
  // ... other middleware logic
}

export const config = {
  matcher: ['/api/:path*'],
}
```

### Option 2: Using API Route Wrapper

Wrap your API route handlers with the `withCors` function:

```typescript
// app/api/example/route.ts
import { withCors } from '@/lib/cors/middleware'

export const POST = withCors(async (request: Request) => {
  const data = await request.json()
  
  // Your API logic here
  
  return Response.json({ success: true })
})
```

### Option 3: Using next.config.js Headers

Add CORS headers in your `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ]
  },
}
```

**Note**: When using this approach, you must still validate origins in middleware or API routes.

## ⚙️ Configuration

### Adding Allowed Origins

Edit `lib/cors/config.ts` and add your trusted origins to the `ALLOWED_ORIGINS` array:

```typescript
export const ALLOWED_ORIGINS = [
  // Production domains
  process.env.NEXT_PUBLIC_APP_URL,
  'https://yourdomain.com',
  
  // Development origins (only in dev)
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001']
    : []),
]
```

### Environment Variables

Set these environment variables for proper CORS configuration:

- **`NEXT_PUBLIC_APP_URL`**: Your production application URL
- **`VERCEL_URL`**: Automatically set by Vercel (for preview deployments)
- **`NODE_ENV`**: Set to `development` for local development

## 🧪 Testing

### Testing Allowed Origins

```bash
# Should succeed (allowed origin)
curl -X POST http://localhost:3000/api/test \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -v

# Should fail (disallowed origin)
curl -X POST http://localhost:3000/api/test \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  -v
```

### Testing Preflight Requests

```bash
# OPTIONS request for CORS preflight
curl -X OPTIONS http://localhost:3000/api/test \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## 🔍 Security Checklist

- [ ] Wildcard `*` origins removed from all CORS configurations
- [ ] All allowed origins explicitly listed in config
- [ ] Origins validated per-request (not just headers set)
- [ ] Preflight requests (OPTIONS) handled correctly
- [ ] Credentials (`Access-Control-Allow-Credentials`) only enabled when needed
- [ ] API routes reject requests from unauthorized origins
- [ ] Environment-specific origins properly configured

## 📝 Migration Guide

### Migrating Existing Applications

1. **Remove wildcard CORS**:
   ```javascript
   // ❌ Before
   res.header('Access-Control-Allow-Origin', '*')
   
   // ✅ After
   const origin = req.headers.get('origin')
   if (isOriginAllowed(origin)) {
     res.header('Access-Control-Allow-Origin', origin)
   }
   ```

2. **Add middleware**: Create `middleware.ts` using Option 1 above

3. **Update API routes**: Wrap handlers with `withCors` or add origin validation

4. **Test thoroughly**: Verify that legitimate requests work and unauthorized requests are blocked

## 🚨 Common Issues

### Issue: CORS errors in development

**Solution**: Ensure `http://localhost:3000` is in `ALLOWED_ORIGINS` when `NODE_ENV === 'development'`

### Issue: Preview deployments blocked

**Solution**: The configuration automatically includes Vercel preview URLs via `VERCEL_URL`

### Issue: Credentials not working

**Solution**: Ensure both `Access-Control-Allow-Credentials: true` and `Access-Control-Allow-Origin` (not `*`) are set

## 📚 Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP CORS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
