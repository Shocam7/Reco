// src/components/layout/footer.tsx
import { Music, Github, Twitter, Heart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-spotify-green/10 rounded-lg">
                <Music className="h-5 w-5 text-spotify-green" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">Reco</h3>
                <p className="text-xs text-muted-foreground">AI Playlist Generator</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Transform your thoughts and images into personalized Spotify playlists using cutting-edge AI technology.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-foreground transition-colors flex items-center gap-1">
                  API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#help" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#status" className="hover:text-foreground transition-colors flex items-center gap-1">
                  Status
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear} Reco. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for music lovers</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/yourusername/reco" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com/reco_app" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Powered by section */}
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a href="https://openrouter.ai" className="hover:text-foreground transition-colors font-medium">
              OpenRouter
            </a>
            {" "}and{" "}
            <a href="https://developer.spotify.com" className="hover:text-foreground transition-colors font-medium">
              Spotify
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
        }
