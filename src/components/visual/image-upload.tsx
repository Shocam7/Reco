// src/components/visual/image-upload.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage: File | null
  onClear: () => void
  isLoading?: boolean
}

export function ImageUpload({ onImageSelect, selectedImage, onClear, isLoading = false }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleClear = () => {
    onClear()
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-spotify-green bg-spotify-green/5' 
              : 'border-muted-foreground/25 hover:border-spotify-green/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload an Image</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop an image here, or click to browse
            </p>
            <Button variant="outline" disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Supports: JPG, PNG, GIF (max 10MB)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              {/* Image preview */}
              {previewUrl && (
                <div className="relative mb-4">
                  <img
                    src={previewUrl}
                    alt="Selected image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    onClick={handleClear}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* File info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-spotify-green" />
                  <span className="font-medium truncate max-w-[200px]">
                    {selectedImage.name}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {(selectedImage.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  )
}