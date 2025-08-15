import { Music, Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Logo with animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="w-16 h-16 bg-spotify-green/20 rounded-full mx-auto"></div>
          </div>
          <div className="relative w-16 h-16 bg-spotify-green/10 rounded-full flex items-center justify-center mx-auto">
            <Music className="h-8 w-8 text-spotify-green animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Loading Reco</h2>
          <p className="text-muted-foreground">Preparing your AI-powered playlist generator...</p>
        </div>

        {/* Loading spinner */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="loading-dots text-sm">
            Loading<span>.</span><span>.</span><span>.</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-spotify-green rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
