// src/components/text/text-results.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, RotateCcw, Trash2, Type, Sparkles } from 'lucide-react'

interface TextResultsProps {
  text: string | null
  result: string | null
  error: string | null
  isLoading: boolean
  onClear: () => void
  onRetry: () => void
}

export function TextResults({ 
  text, 
  result, 
  error, 
  isLoading, 
  onClear, 
  onRetry 
}: TextResultsProps) {
  if (!text && !result && !error) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Type className="h-5 w-5" />
          Text Analysis Results
        </CardTitle>
        <CardDescription>
          AI analysis of your text input
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original text preview */}
        {text && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Your Input:</h4>
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="line-clamp-3">{text}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Sparkles className="h-8 w-8 text-spotify-green animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Analyzing your text...</p>
                <p className="text-xs text-muted-foreground">This may take a few seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Success state */}
        {result && !isLoading && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Text analysis completed successfully!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">AI Analysis:</h4>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">{result}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {(result || error) && !isLoading && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button
              onClick={onClear}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}