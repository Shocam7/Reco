'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, Home, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  const isAPIError = error.message.includes('API') || error.message.includes('OpenRouter') || error.message.includes('Spotify')

  const getErrorMessage = () => {
    if (isNetworkError) {
      return "We're having trouble connecting to our servers. Please check your internet connection and try again."
    }
    if (isAPIError) {
      return "There's an issue with our AI services. Our team has been notified and is working on a fix."
    }
    return "Something unexpected happened. Don't worry, we're on it!"
  }

  const getErrorTitle = () => {
    if (isNetworkError) return "Connection Problem"
    if (isAPIError) return "Service Unavailable"
    return "Oops! Something went wrong"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader className="pb-4">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            
            <CardTitle className="text-xl font-semibold">
              {getErrorTitle()}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {getErrorMessage()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground mb-2">
                  Technical Details
                </summary>
                <div className="text-xs font-mono bg-muted p-3 rounded-md text-muted-foreground break-all">
                  <div className="mb-2">
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.digest && (
                    <div>
                      <strong>Digest:</strong> {error.digest}
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Error ID: {error.digest || 'unknown'}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {/* Action buttons */}
            <div className="flex gap-3 w-full">
              <Button 
                onClick={reset}
                className="flex-1 gap-2"
                variant="default"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                className="flex-1 gap-2"
                variant="outline"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* Additional help */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Still having issues?
              </p>
              <Button 
                variant="link" 
                size="sm"
                className="text-xs h-auto p-0"
                onClick={() => window.location.reload()}
              >
                Refresh the page
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Brand footer */}
        <div className="text-center mt-6 text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Music className="h-4 w-4 text-spotify-green" />
            <span>Reco - AI Playlist Generator</span>
          </div>
        </div>
      </div>
    </div>
  )
                    }
