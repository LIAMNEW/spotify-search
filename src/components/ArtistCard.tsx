import type { SpotifyArtist } from '../types/spotify';

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M followers`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K followers`;
  return `${n} followers`;
}

interface Props {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: Props) {
  const image = artist.images[0]?.url;

  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 transition-colors"
      aria-label={`Open ${artist.name} on Spotify`}
    >
      <div className="relative aspect-square mb-4 rounded-full overflow-hidden bg-zinc-800 shadow-lg">
        {image ? (
          <img
            src={image}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      <p className="font-semibold text-white truncate">{artist.name}</p>

      {artist.genres.length > 0 ? (
        <p className="text-xs text-zinc-500 mt-0.5 truncate capitalize">{artist.genres[0]}</p>
      ) : (
        <p className="text-xs text-zinc-600 mt-0.5">Artist</p>
      )}

      <p className="text-xs text-zinc-600 mt-1">{formatFollowers(artist.followers.total)}</p>
    </a>
  );
}
