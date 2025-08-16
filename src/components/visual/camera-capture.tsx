// src/components/visual/camera-capture.tsx
'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Square, RotateCcw, Download } from 'lucide-react'

interface CameraCaptureProps {
  onCapture: (file: File) => void
  isLoading?: boolean
}

export function CameraCapture({ onCapture, isLoading = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.')
      console.error('Camera access error:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })
        
        // Create preview URL
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageUrl)
        
        onCapture(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.8)
  }, [onCapture, stopCamera])

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a')
      link.href = capturedImage
      link.download = `reco-capture-${Date.now()}.jpg`
      link.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5" />
          Camera Capture
        </CardTitle>
        <CardDescription>
          Take a photo to analyze and generate a playlist
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isStreaming && !capturedImage && (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Ready to capture the moment?
            </p>
            <Button onClick={startCamera} disabled={isLoading}>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </div>
        )}

        {/* Camera stream */}
        {isStreaming && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
              
              {/* Camera controls overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-16 h-16 p-0 bg-white hover:bg-gray-100 text-black"
                  disabled={isLoading}
                >
                  <Square className="h-6 w-6" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={stopCamera} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Captured image preview */}
        {capturedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={retakePhoto}
                variant="outline"
                size="sm"
                className="gap-2 flex-1"
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4" />
                Retake
              </Button>
              <Button
                onClick={downloadImage}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}