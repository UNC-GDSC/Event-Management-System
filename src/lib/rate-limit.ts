import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export async function rateLimitMiddleware(
  request: NextRequest,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute
): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const key = `${ip}:${request.nextUrl.pathname}`

  const record = rateLimit.get(key)

  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs })
    return null
  }

  if (record.count >= limit) {
    return new NextResponse('Too many requests', {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
      },
    })
  }

  record.count++
  return null
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key)
    }
  }
}, 60000)
