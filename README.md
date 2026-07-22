# Spotify Search

Search for your favourite artists and tracks using the Spotify Web API. Real-time debounced search, 30-second preview playback, and click-through to Spotify.

## Tech stack

- **React 18** + **TypeScript** (strict mode, no `any`)
- **Tailwind CSS v3** — dark theme
- **Vite** — dev server and build tool
- **Spotify Web API** — OAuth 2.0 with PKCE (no server required)

## Setup

### 1. Create a Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create app**, fill in a name and description
3. Under **Redirect URIs**, add `http://localhost:5173` and save
4. Copy your **Client ID** from the app overview

### 2. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), paste your Client ID, and connect.

> **Note:** The Client ID is stored in `localStorage` — never commit it. To use your own key, just paste it in on the login screen.

## How it works

Authentication uses the [PKCE flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) — the app generates a code verifier/challenge pair, redirects to Spotify for login, then exchanges the returned code for an access token. No client secret is ever exposed.

Search is debounced (400ms) and cancels in-flight requests when the query changes, so there are no stale result races.

## Project structure

```
src/
├── types/spotify.ts          # Spotify API response types
├── utils/
│   ├── pkce.ts               # PKCE OAuth helpers
│   └── spotify-api.ts        # Typed API client
├── hooks/
│   ├── useSpotifyAuth.ts     # Auth state + callback handling
│   └── useSpotifySearch.ts   # Debounced search with loading/error/cancellation
└── components/
    ├── LoginScreen.tsx        # Client ID entry + OAuth redirect
    ├── SearchBar.tsx          # Search input + type filter (All / Artists / Tracks)
    ├── ArtistCard.tsx         # Artist result card (photo, genre, followers)
    └── TrackCard.tsx          # Track row with album art + 30s preview playback
```
