declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENROUTER_API_KEY: string
      OPENROUTER_BASE_URL: string
      SPOTIFY_CLIENT_ID: string
      SPOTIFY_CLIENT_SECRET: string
      SPOTIFY_REDIRECT_URI: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }

  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

export {}