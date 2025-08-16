import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString()
    
    // Check environment variables
    const envCheck = {
      openrouter_configured: !!process.env.OPENROUTER_API_KEY,
      spotify_configured: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET),
      nextauth_configured: !!process.env.NEXTAUTH_SECRET,
    }

    // Basic API connectivity test
    const apiChecks = {
      openrouter: false,
      spotify: false,
    }

    // Test OpenRouter connectivity (if configured)
    if (envCheck.openrouter_configured) {
      try {
        const openrouterResponse = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        apiChecks.openrouter = openrouterResponse.ok
      } catch (error) {
        console.warn('OpenRouter health check failed:', error)
        apiChecks.openrouter = false
      }
    }

    // Test Spotify API connectivity (basic endpoint)
    try {
      const spotifyResponse = await fetch('https://api.spotify.com/v1/browse/categories?limit=1', {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      apiChecks.spotify = spotifyResponse.ok || spotifyResponse.status === 401 // 401 is expected without auth
    } catch (error) {
      console.warn('Spotify health check failed:', error)
      apiChecks.spotify = false
    }

    const overallHealth = envCheck.openrouter_configured && 
                         envCheck.spotify_configured && 
                         apiChecks.openrouter && 
                         apiChecks.spotify

    const statusCode = overallHealth ? 200 : 503

    return NextResponse.json({
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp,
      uptime: process.uptime?.() || 0,
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        environment: envCheck,
        api_connectivity: apiChecks,
      },
      services: {
        openrouter: {
          models: [
            'deepseek-chat-v3-0324:free',
            'meta-llama/llama-4-maverick:free',
            'mistral-small-3.1-24b-instruct:free'
          ],
          status: apiChecks.openrouter ? 'up' : 'down'
        },
        spotify: {
          endpoints: ['auth', 'search', 'playlists'],
          status: apiChecks.spotify ? 'up' : 'down'
        }
      }
    }, { status: statusCode })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function HEAD(request: NextRequest) {
  // Simple health check for load balancers
  try {
    const hasRequiredEnv = !!(process.env.OPENROUTER_API_KEY && 
                             process.env.SPOTIFY_CLIENT_ID && 
                             process.env.SPOTIFY_CLIENT_SECRET)
    
    return new NextResponse(null, { 
      status: hasRequiredEnv ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

// Optional: WebSocket-like endpoint for real-time health monitoring
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({
    methods: ['GET', 'HEAD'],
    description: 'Health check endpoint for monitoring service status',
    endpoints: {
      'GET /api/health': 'Detailed health check with service status',
      'HEAD /api/health': 'Simple health check for load balancers'
    }
  })
}