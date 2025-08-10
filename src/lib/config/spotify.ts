// src/lib/config/spotify.ts
export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  scopes: [
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email',
  ],
  baseURL: 'https://api.spotify.com/v1',
  authURL: 'https://accounts.spotify.com',
};