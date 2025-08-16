// src/components/visual/visual-processor.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUpload } from './image-upload'
import { CameraCapture } from './camera-capture'
import { VisualResults } from './visual-results'
import { useVisualProcessor } from '@/lib/hooks/use-visual-processor'
import { Upload, Camera } from 'lucide-react'

interface VisualProcessorProps {
  onResult: (result: string) => void
}

export function VisualProcessor({ onResult }: VisualProcessorProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'camera'>('upload')
  const { processImage, isLoading, error, result } = useVisualProcessor()

  const handleImageSelect = async (file: File) => {
    setSelectedImage(file)
    try {
      const analysis = await processImage(file)
      onResult(analysis)
    } catch (err) {
      console.error('Visual processing failed:', err)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    onResult('')
  }

  const handleRetry = () => {
    if (selectedImage) {
      handleImageSelect(selectedImage)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={captureMethod} onValueChange={(value) => setCaptureMethod(value as 'upload' | 'camera')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="camera" className="mt-4">
          <CameraCapture
            onCapture={handleImageSelect}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {(result || error) && (
        <VisualResults
          image={selectedImage}
          result={result}
          error={error}
          isLoading={isLoading}
          onClear={handleClear}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}