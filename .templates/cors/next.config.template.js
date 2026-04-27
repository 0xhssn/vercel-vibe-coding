/**
 * CORS Configuration Template for next.config.js
 * 
 * Copy this headers() function to your next.config.js to add CORS headers
 * to API routes. This should be combined with middleware for origin validation.
 */

module.exports = {
  // ... your existing config ...
  
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
          // Note: Access-Control-Allow-Origin must be set dynamically
          // in middleware or API route handlers based on origin validation
        ],
      },
    ]
  },
}
