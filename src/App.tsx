import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import { useSpotifySearch } from './hooks/useSpotifySearch';
import { LoginScreen } from './components/LoginScreen';
import { SearchBar } from './components/SearchBar';
import { ArtistCard } from './components/ArtistCard';
import { TrackCard } from './components/TrackCard';

function SpotifyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function App() {
  const { token, isHandlingCallback, error: authError, login, logout } = useSpotifyAuth();
  const {
    query,
    setQuery,
    searchType,
    setSearchType,
    results,
    isLoading,
    error: searchError,
  } = useSpotifySearch(token);

  if (isHandlingCallback) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <SpotifyIcon size={48} />
          <p className="text-zinc-400 mt-4 text-sm">Connecting to Spotify...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <LoginScreen onLogin={login} error={authError} />;
  }

  const hasArtists = (results?.artists?.items?.length ?? 0) > 0;
  const hasTracks = (results?.tracks?.items?.length ?? 0) > 0;
  const hasResults = hasArtists || hasTracks;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <SpotifyIcon size={26} />
          <h1 className="text-lg font-bold tracking-tight flex-1">Spotify Search</h1>
          <button
            onClick={logout}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
        />

        {searchError && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-sm">
            {searchError}
          </div>
        )}

        {isLoading && (
          <div className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square rounded-full bg-zinc-800 mb-4" />
                  <div className="h-4 bg-zinc-800 rounded mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-zinc-900/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && hasResults && (
          <div className="mt-8 space-y-10">
            {hasArtists && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                  Artists
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results!.artists!.items.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {hasTracks && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
                  Tracks
                </h2>
                <div className="flex flex-col gap-1">
                  {results!.tracks!.items.map((track, idx) => (
                    <TrackCard key={track.id} track={track} index={idx + 1} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!isLoading && results && !hasResults && (
          <div className="mt-16 text-center">
            <p className="text-zinc-500">No results for &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {!isLoading && !results && (
          <div className="mt-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#52525b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-zinc-400 font-medium">Search for artists and songs</p>
            <p className="text-zinc-600 text-sm mt-1">
              Try searching for your favourite artists or tracks
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
