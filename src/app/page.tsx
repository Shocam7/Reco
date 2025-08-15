'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TextProcessor } from '@/components/text/text-processor'
import { VisualProcessor } from '@/components/visual/visual-processor'
import { PlaylistGenerator } from '@/components/playlist/playlist-generator'
import { Music, Type, Camera, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [textResult, setTextResult] = useState<string | null>(null)
  const [visualResult, setVisualResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text')

  const currentResult = activeTab === 'text' ? textResult : visualResult

  const handleTextResult = (result: string) => {
    setTextResult(result)
  }

  const handleVisualResult = (result: string) => {
    setVisualResult(result)
  }

  const handleClearResults = () => {
    setTextResult(null)
    setVisualResult(null)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-spotify-green/10 rounded-full">
            <Music className="h-8 w-8 text-spotify-green" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
          Reco
        </h1>
        <p className="text-xl text-muted-foreground mb-2 max-w-2xl mx-auto">
          Transform your thoughts and images into personalized Spotify playlists
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-spotify-green" />
          Powered by AI
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Input Your Content
              </CardTitle>
              <CardDescription>
                Share your thoughts through text or upload an image to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as 'text' | 'visual')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Visual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-6">
                  <TextProcessor onResult={handleTextResult} />
                </TabsContent>

                <TabsContent value="visual" className="mt-6">
                  <VisualProcessor onResult={handleVisualResult} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-spotify-green" />
                Your Playlist
              </CardTitle>
              <CardDescription>
                AI-generated playlist based on your input
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlaylistGenerator 
                inputData={currentResult}
                inputType={activeTab}
                onClear={handleClearResults}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
              <Type className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Text Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Our AI analyzes your text to understand mood, themes, and emotions, creating the perfect soundtrack for your thoughts.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Visual Recognition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Upload photos and let our AI interpret the visual elements, colors, and atmosphere to suggest matching music.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-spotify-green/10 rounded-lg flex items-center justify-center mb-4">
              <Music className="h-6 w-6 text-spotify-green" />
            </div>
            <CardTitle className="text-lg">Spotify Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Seamlessly create and save playlists directly to your Spotify account with just one click.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
