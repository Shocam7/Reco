import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const visualProcessSchema = z.object({
  image_data: z.string().min(1, 'Image data is required'),
  image_type: z.enum(['base64', 'url']).default('base64'),
  description: z.string().optional(),
  mood_preference: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image_data, image_type, description, mood_preference } = visualProcessSchema.parse(body)

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a visual analysis expert specializing in interpreting images to understand their mood, atmosphere, colors, and emotional content for music playlist generation.

Analyze images focusing on:
1. Overall mood and atmosphere
2. Color palette and its emotional associations
3. Visual themes and subjects
4. Energy level conveyed by the image
5. Time of day, season, or setting implications
6. Artistic style or photographic qualities
7. Any cultural or contextual elements

Provide detailed analysis that captures the visual essence for music recommendation purposes. Focus on translating visual elements into musical characteristics.`

    // Format the image data for the API
    let imageContent
    if (image_type === 'base64') {
      // Ensure proper base64 format
      const base64Data = image_data.startsWith('data:') 
        ? image_data 
        : `data:image/jpeg;base64,${image_data}`
      
      imageContent = {
        type: 'image_url',
        image_url: {
          url: base64Data
        }
      }
    } else {
      imageContent = {
        type: 'image_url',
        image_url: {
          url: image_data
        }
      }
    }

    const userPrompt = `Please analyze this image for music playlist generation. Focus on the visual elements that would translate well to musical characteristics.

${description ? `Additional context: ${description}` : ''}
${mood_preference ? `User's mood preference: ${mood_preference}` : ''}

Provide a comprehensive analysis of the visual elements and their musical implications.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Reco - AI Playlist Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              imageContent
            ]
          }
        ],
        max_tokens: 1200,
        temperature: 0.7,
        top_p: 1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter Visual API error:', errorData)
      
      return NextResponse.json(
        { 
          error: 'Failed to process image',
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

    const analysis = data.choices[0].message.content

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        model: 'meta-llama/llama-4-maverick:free',
        timestamp: new Date().toISOString(),
        tokens_used: data.usage?.total_tokens || 0,
        image_processed: true,
      }
    })

  } catch (error) {
    console.error('Visual processing error:', error)
    
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
      message: 'Visual processing endpoint',
      method: 'POST',
      model: 'meta-llama/llama-4-maverick:free',
      supported_formats: ['base64', 'url']
    },
    { status: 200 }
  )
}
