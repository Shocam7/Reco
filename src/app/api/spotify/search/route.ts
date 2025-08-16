import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchSchema = z.object({
  access_token: z.string().min(1, 'Access token is required'),
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['track', 'artist', 'album', 'playlist']).default('track'),
  limit: z.number().min(1).max(50).default(20),
  market: z.string().length(2).default('US'),
  offset: z.number().min(0).default(0)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { access_token, query, type, limit, market, offset } = searchSchema.parse(body)

    const searchParams = new URLSearchParams({
      q: query,
      type: type,
      limit: limit.toString(),
      market: market,
      offset: offset.toString()
    })

    const response = await fetch(
      `https://api.spotify.com/v1/search?${searchParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Spotify search error:', errorData)
      
      return NextResponse.json(
        { 
          error: 'Search failed',
          details: response.status === 401 ? 'Invalid or expired token' : 'Service unavailable'
        },
        { status: response.status }
      )
    }

    const searchData = await response.json()

    // Format the response based on search type
    let results = []
    if (type === 'track' && searchData.tracks) {
      results = searchData.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        artists: track.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name
        })),
        album: {
          id: track.album.id,
          name: track.album.name,
          images: track.album.images,
          release_date: track.album.release_date
        },
        duration_ms: track.duration_ms,
        explicit: track.explicit,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_urls: track.external_urls,
        uri: track.uri
      }))
    } else if (type === 'artist' && searchData.artists) {
      results = searchData.artists.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        followers: artist.followers.total,
        images: artist.images,
        external_urls: artist.external_urls,
        uri: artist.uri
      }))
    } else if (type === 'album' && searchData.albums) {
      results = searchData.albums.items.map((album: any) => ({
        id: album.id,
        name: album.name,
        artist: album.artists[0]?.name || 'Unknown Artist',
        artists: album.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name
        })),
        total_tracks: album.total_tracks,
        release_date: album.release_date,
        images: album.images,
        external_urls: album.external_urls,
        uri: album.uri
      }))
    }

    return NextResponse.json({
      success: true,
      results,
      total: searchData[`${type}s`]?.total || 0,
      limit,
      offset,
      query,
      type
    })

  } catch (error) {
    console.error('Spotify search error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: error.errors.map(e => e.message).join(', ')
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json(
      { 
        message: 'Spotify search endpoint',
        method: 'POST',
        parameters: {
          access_token: 'string (required)',
          query: 'string (required)',
          type: 'track | artist | album | playlist (default: track)',
          limit: 'number (1-50, default: 20)',
          market: 'string (2-letter country code, default: US)',
          offset: 'number (default: 0)'
        }
      },
      { status: 200 }
    )
  }

  return NextResponse.json(
    { error: 'Use POST method for search requests' },
    { status: 405 }
  )
}