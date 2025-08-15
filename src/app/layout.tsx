import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Reco - AI-Powered Playlist Generator',
    template: '%s | Reco'
  },
  description: 'Transform your thoughts and images into personalized Spotify playlists using AI. Enter text or upload photos to discover music that matches your vibe.',
  keywords: [
    'AI playlist generator',
    'Spotify playlists',
    'music discovery',
    'AI music',
    'playlist creation',
    'text to music',
    'image to music',
    'personalized playlists'
  ],
  authors: [{ name: 'Reco Team' }],
  creator: 'Reco',
  publisher: 'Reco',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Reco - AI-Powered Playlist Generator',
    description: 'Transform your thoughts and images into personalized Spotify playlists using AI.',
    siteName: 'Reco',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reco - AI-Powered Playlist Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reco - AI-Powered Playlist Generator',
    description: 'Transform your thoughts and images into personalized Spotify playlists using AI.',
    images: ['/og-image.png'],
    creator: '@reco_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      me: ['your-social-links'],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1DB954" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}
