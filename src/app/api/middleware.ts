import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add CORS headers
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Rate limiting headers (informational)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Window', '3600')
  
  return response
}

export const config = {
  matcher: '/api/:path*',
}