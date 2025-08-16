// src/components/text/text-input.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Type, Send, Sparkles } from 'lucide-react'

interface TextInputProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function TextInput({ onSubmit, isLoading = false, placeholder }: TextInputProps) {
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)
  
  const maxChars = 1000
  const minChars = 10

  const handleTextChange = (value: string) => {
    if (value.length <= maxChars) {
      setText(value)
      setCharCount(value.length)
    }
  }

  const handleSubmit = () => {
    if (text.trim().length >= minChars && !isLoading) {
      onSubmit(text.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isValidLength = text.trim().length >= minChars && text.trim().length <= maxChars

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5" />
          Describe Your Mood
        </CardTitle>
        <CardDescription>
          Tell us what you're feeling, thinking, or the vibe you want for your playlist
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Describe your current mood, a memory, an activity, or anything that inspires you..."}
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
          
          {/* Character counter */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>
              {charCount < minChars ? `${minChars - charCount} more characters needed` : 'Ready to generate'}
            </span>
            <span className={charCount > maxChars * 0.9 ? 'text-destructive' : ''}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Example prompts */}
        {!text && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Feeling nostalgic about summer nights",
                "Working out at the gym",
                "Cozy rainy day vibes",
                "Road trip with friends"
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1 px-2"
                  onClick={() => setText(example)}
                  disabled={isLoading}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isValidLength || isLoading}
          className="w-full gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Analyzing your text...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Generate Playlist
            </>
          )}
        </Button>

        {/* Keyboard shortcut hint */}
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to submit
        </p>
      </CardContent>
    </Card>
  )
}