// src/components/visual/visual-results.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, RotateCcw, Trash2, Camera, Sparkles, Eye } from 'lucide-react'

interface VisualResultsProps {
  image: File | null
  result: string | null
  error: string | null
  isLoading: boolean
  onClear: () => void
  onRetry: () => void
}

export function VisualResults({ 
  image, 
  result, 
  error, 
  isLoading, 
  onClear, 
  onRetry 
}: VisualResultsProps) {
  if (!image && !result && !error) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5" />
          Visual Analysis Results
        </CardTitle>
        <CardDescription>
          AI analysis of your image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image preview */}
        {image && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Your Image:</h4>
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded for analysis"
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {image.name}
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Sparkles className="h-8 w-8 text-spotify-green animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Analyzing your image...</p>
                <p className="text-xs text-muted-foreground">Our AI is examining visual elements and mood</p>
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
                Visual analysis completed successfully!
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">AI Visual Analysis:</h4>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">{result}</p>
              </div>
            </div>

            {/* Analysis insights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-muted-foreground mb-1">Detected Elements</p>
                <p className="text-muted-foreground">Colors, objects, mood</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-muted-foreground mb-1">Music Style</p>
                <p className="text-muted-foreground">Genre suggestions</p>
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
              disabled={!image}
            >
              <RotateCcw className="h-4 w-4" />
              Retry Analysis
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

        {/* Processing info */}
        {isLoading && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Processing with Meta Llama 4 Maverick • Estimated time: 10-30 seconds
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}