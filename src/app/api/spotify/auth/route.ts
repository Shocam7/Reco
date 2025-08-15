import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'

const scopes = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
].join(' ')

export async function GET(request: NextRequest) {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_REDIRECT_URI) {
      return NextResponse.json(
        { error: 'Spotify configuration missing' },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'login') {
      // Generate auth URL for Spotify login
      const state = Math.random().toString(36).substring(2, 15)
      
      const authParams = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state,
        show_dialog: 'true'
      })

      const authUrl = `${SPOTIFY_AUTH_URL}?${authParams.toString()}`

      return NextResponse.json({
        success: true,
        auth_url: authUrl,
        state: state
      })
    }

    if (action === 'callback') {
      // Handle the callback from Spotify
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        return NextResponse.json(
          { error: `Spotify auth error: ${error}` },
          { status: 400 }
        )
      }

      if (!code) {
        return NextResponse.json(
          { error: 'No authorization code received' },
          { status: 400 }
        )
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        console.error('Spotify token exchange error:', errorData)
        return NextResponse.json(
          { error: 'Failed to exchange code for token' },
          { status: 400 }
        )
      }

      const tokenData = await tokenResponse.json()

      return NextResponse.json({
        success: true,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope
      })
    }

    return NextResponse.json(
      { 
        message: 'Spotify auth endpoint',
        available_actions: ['login', 'callback']
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Refresh the access token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Spotify token refresh error:', errorData)
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 400 }
      )
    }

    const tokenData = await response.json()

    return NextResponse.json({
      success: true,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      refresh_token: tokenData.refresh_token || refresh_token
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}