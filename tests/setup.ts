import '@testing-library/jest-dom'

// Mock environment variables
process.env.OPENROUTER_API_KEY = 'test-openrouter-key'
process.env.SPOTIFY_CLIENT_ID = 'test-spotify-client-id'
process.env.SPOTIFY_CLIENT_SECRET = 'test-spotify-client-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Mock fetch globally
global.fetch = jest.fn()

// Mock File and FileReader
global.File = class MockFile {
  constructor(
    public chunks: BlobPart[],
    public name: string,
    public options: FilePropertyBag = {}
  ) {}
  
  get size() {
    return this.chunks.reduce((acc, chunk) => acc + chunk.toString().length, 0)
  }
  
  get type() {
    return this.options.type || ''
  }
}

global.FileReader = class MockFileReader {
  result: string | ArrayBuffer | null = null
  onload: ((ev: ProgressEvent) => void) | null = null
  onerror: ((ev: ProgressEvent) => void) | null = null
  
  readAsDataURL(file: Blob) {
    setTimeout(() => {
      this.result = 'data:image/jpeg;base64,mock-base64-data'
      this.onload?.({} as ProgressEvent)
    }, 0)
  }
  
  readAsText(file: Blob) {
    setTimeout(() => {
      this.result = 'mock file content'
      this.onload?.({} as ProgressEvent)
    }, 0)
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class MockIntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}
  
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks()
})