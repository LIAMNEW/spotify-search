import { useState, useEffect, useRef } from 'react';
import { searchSpotify, type SearchType } from '../utils/spotify-api';
import type { SearchResults } from '../types/spotify';

const DEBOUNCE_MS = 400;

export function useSpotifySearch(token: string | null) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('both');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim() || !token) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    timerRef.current = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      searchSpotify(query, searchType, token)
        .then((data) => { if (!cancelled) setResults(data); })
        .catch((err: unknown) => {
          if (!cancelled) {
            const msg = err instanceof Error ? err.message : 'Search failed';
            setError(msg === 'UNAUTHORIZED' ? 'Session expired — please sign in again.' : msg);
          }
        })
        .finally(() => { if (!cancelled) setIsLoading(false); });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, searchType, token]);

  return { query, setQuery, searchType, setSearchType, results, isLoading, error };
}
