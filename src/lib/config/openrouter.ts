// src/lib/config/openrouter.ts
export const OPENROUTER_MODELS = {
  TEXT_PROCESSOR: 'deepseek-chat-v3-0324:free',
  VISUAL_PROCESSOR: 'meta-llama/llama-4-maverick:free',
  PLAYLIST_GENERATOR: 'mistral-small-3.1-24b-instruct:free',
} as const;

export const OPENROUTER_CONFIG = {
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
    'X-Title': 'Reco - AI Playlist Generator',
  },
};