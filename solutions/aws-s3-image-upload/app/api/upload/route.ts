import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// Secure CORS configuration
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://127.0.0.1:3000']
    : []),
].filter(Boolean) as string[]

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

function getCorsHeaders(origin: string | null) {
  if (!isOriginAllowed(origin)) return {}
  
  return {
    'Access-Control-Allow-Origin': origin!,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')
  
  if (!isOriginAllowed(origin)) {
    return new Response(null, { status: 403 })
  }
  
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  
  // Validate origin for CORS
  if (!isOriginAllowed(origin)) {
    return new Response(
      JSON.stringify({ error: 'Origin not allowed' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { filename, contentType } = await request.json()

  try {
    const client = new S3Client({ region: process.env.AWS_REGION })
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uuidv4(),
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    })

    return Response.json({ url, fields }, {
      headers: getCorsHeaders(origin),
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { 
        status: 500,
        headers: getCorsHeaders(origin),
      }
    )
  }
}
