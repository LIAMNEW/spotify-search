import type { SearchResults } from '../types/spotify';

const BASE_URL = 'https://api.spotify.com/v1';

async function fetchApi<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) throw new Error('UNAUTHORIZED');
  if (!response.ok) throw new Error(`Spotify API error (${response.status})`);

  return response.json() as Promise<T>;
}

export type SearchType = 'track' | 'artist' | 'both';

export async function searchSpotify(
  query: string,
  type: SearchType,
  token: string,
  limit = 20
): Promise<SearchResults> {
  const types = type === 'both' ? 'track,artist' : type;
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return fetchApi<SearchResults>(`/search?${params}&type=${types}`, token);
}
