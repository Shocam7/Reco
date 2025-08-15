import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const playlistGenerationSchema = z.object({
  analysis: z.string().min(1, 'Analysis data is required'),
  input_type: z.enum(['text', 'visual']),
  playlist_length: z.number().min(5).max(50).default(20),
  genre_preferences: z.array(z.string()).optional(),
  explicit_content: z.boolean().default(true),
  popularity_range: z.enum(['mainstream', 'underground', 'mixed']).default('mixed'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      analysis, 
      input_type, 
      playlist_length, 
      genre_preferences, 
      explicit_content,
      popularity_range
    } = playlistGenerationSchema.parse(body)

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a music curator and playlist expert. Based on the provided analysis from ${input_type === 'text' ? 'text' : 'visual'} input, create a thoughtful music playlist.

Your task:
1. Generate a playlist of exactly ${playlist_length} songs
2. Each song should match the mood and characteristics from the analysis
3. Provide diverse but coherent song selections
4. Include both popular and lesser-known tracks for discovery
5. Consider the flow and progression of the playlist

Output format (JSON):
{
  "playlist_name": "Creative playlist name based on the analysis",
  "description": "Brief description explaining the playlist concept",
  "mood_tags": ["tag1", "tag2", "tag3"],
  "tracks": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name (if known)",
      "year": "Release year (if known)",
      "reason": "Brief explanation why this song fits"
    }
  ]
}

Guidelines:
- Prioritize song accuracy (real songs by real artists)
- Balance familiar hits with discovery tracks
- Consider playlist flow and energy progression
- Match the emotional tone from the analysis
${genre_preferences?.length ? `- Incorporate these preferred genres: ${genre_preferences.join(', ')}` : ''}
${!explicit_content ? '- Avoid explicit content' : ''}
- Focus on ${popularity_range} popularity level`

    const userPrompt = `Based on this ${input_type} analysis, create a ${playlist_length}-song playlist:

Analysis: ${analysis}

Generate a cohesive playlist that captures the essence and mood identified in the analysis. Ensure all songs are real and accurately attributed.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Reco - AI Playlist Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-small-3.1-24b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
        top_p: 0.9,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter Playlist API error:', errorData)
      
      return NextResponse.json(
        { 
          error: 'Failed to generate playlist',
          details: response.status === 429 ? 'Rate limit exceeded' : 'Service unavailable'
        },
        { status: response.status === 429 ? 429 : 500 }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    let playlistData
    try {
      playlistData = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse playlist JSON:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse playlist data' },
        { status: 500 }
      )
    }

    // Validate the generated playlist structure
    if (!playlistData.tracks || !Array.isArray(playlistData.tracks)) {
      return NextResponse.json(
        { error: 'Invalid playlist format generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      playlist: {
        ...playlistData,
        generated_from: input_type,
        track_count: playlistData.tracks.length,
      },
      metadata: {
        model: 'mistral-small-3.1-24b-instruct:free',
        timestamp: new Date().toISOString(),
        tokens_used: data.usage?.total_tokens || 0,
        generation_params: {
          playlist_length,
          genre_preferences,
          explicit_content,
          popularity_range
        }
      }
    })

  } catch (error) {
    console.error('Playlist generation error:', error)
    
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

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Playlist generation endpoint',
      method: 'POST',
      model: 'mistral-small-3.1-24b-instruct:free',
      max_tracks: 50,
      min_tracks: 5
    },
    { status: 200 }
  )
}