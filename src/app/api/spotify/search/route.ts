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