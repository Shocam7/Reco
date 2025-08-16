// src/components/text/text-processor.tsx
'use client'

import { useState } from 'react'
import { TextInput } from './text-input'
import { TextResults } from './text-results'
import { useTextProcessor } from '@/lib/hooks/use-text-processor'

interface TextProcessorProps {
  onResult: (result: string) => void
}

export function TextProcessor({ onResult }: TextProcessorProps) {
  const [currentText, setCurrentText] = useState<string | null>(null)
  const { processText, isLoading, error, result } = useTextProcessor()

  const handleTextSubmit = async (text: string) => {
    setCurrentText(text)
    try {
      const analysis = await processText(text)
      onResult(analysis)
    } catch (err) {
      console.error('Text processing failed:', err)
    }
  }

  const handleClear = () => {
    setCurrentText(null)
    onResult('')
  }

  return (
    <div className="space-y-6">
      <TextInput
        onSubmit={handleTextSubmit}
        isLoading={isLoading}
      />
      
      {(result || error) && (
        <TextResults
          text={currentText}
          result={result}
          error={error}
          isLoading={isLoading}
          onClear={handleClear}
          onRetry={() => currentText && handleTextSubmit(currentText)}
        />
      )}
    </div>
  )
}