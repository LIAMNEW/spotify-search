import { useState, useRef, useCallback, useEffect } from 'react';
import type { SpotifyTrack } from '../types/spotify';

function formatMs(ms: number): string {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

interface Props {
  track: SpotifyTrack;
  index: number;
}

export function TrackCard({ track, index }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const images = track.album.images;
  const image = images[images.length - 1]?.url;

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const togglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!track.preview_url) return;

      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current) {
          audioRef.current = new Audio(track.preview_url);
          audioRef.current.onended = () => setIsPlaying(false);
        }
        void audioRef.current.play();
        setIsPlaying(true);
      }
    },
    [isPlaying, track.preview_url]
  );

  const artistNames = track.artists.map((a) => a.name).join(', ');

  return (
    <a
      href={track.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-zinc-800/80 transition-colors"
      aria-label={`Open ${track.name} by ${artistNames} on Spotify`}
    >
      <span className="text-zinc-600 text-sm w-5 text-right shrink-0 tabular-nums">
        {index}
      </span>

      <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden bg-zinc-800">
        {image ? (
          <img
            src={image}
            alt={track.album.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        {track.preview_url && (
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause preview' : 'Play 30s preview'}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate text-sm">{track.name}</p>
        <p className="text-xs text-zinc-500 truncate">{artistNames}</p>
      </div>

      <p className="text-xs text-zinc-600 truncate hidden sm:block max-w-[160px]">
        {track.album.name}
      </p>

      <span className="text-xs text-zinc-600 shrink-0 tabular-nums">
        {formatMs(track.duration_ms)}
      </span>
    </a>
  );
}
