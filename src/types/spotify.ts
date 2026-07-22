export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    id: string;
    name: string;
    images: SpotifyImage[];
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SearchResults {
  artists?: { items: SpotifyArtist[]; total: number };
  tracks?: { items: SpotifyTrack[]; total: number };
}
