import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const textProcessSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text too long'),
  mood: z.string().optional(),
  genre_preference: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, mood, genre_preference } = textProcessSchema.parse(body)

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are a music expert analyzing text to understand its emotional content, themes, and mood. Based on the user's text, provide a detailed analysis that will be used to generate a music playlist.

Analyze the following aspects:
1. Overall mood and emotional tone
2. Themes and subjects discussed
3. Energy level (high, medium, low)
4. Specific emotions expressed
5. Any cultural or temporal references
6. Suggested music genres that would complement the text

Provide your analysis in a structured format that captures the essence of the text for music recommendation purposes.`

    const userPrompt = `Please analyze this text for music playlist generation:

Text: "${text}"
${mood ? `User's mood preference: ${mood}` : ''}
${genre_preference ? `User's genre preference: ${genre_preference}` : ''}

Provide a detailed analysis focusing on musical elements that would complement this text.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
        'X-Title': 'Reco - AI Playlist Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat-v3-0324:free',
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
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter API error:', errorData)
      
      return NextResponse.json(
        { 
          error: 'Failed to process text',
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
      originalText: text,
      metadata: {
        model: 'deepseek-chat-v3-0324:free',
        timestamp: new Date().toISOString(),
        tokens_used: data.usage?.total_tokens || 0,
      }
    })

  } catch (error) {
    console.error('Text processing error:', error)
    
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
      message: 'Text processing endpoint',
      method: 'POST',
      model: 'deepseek-chat-v3-0324:free'
    },
    { status: 200 }
  )
      }
