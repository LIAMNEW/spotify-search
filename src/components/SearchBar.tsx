import type { SearchType } from '../utils/spotify-api';

const FILTER_OPTIONS: Array<{ label: string; value: SearchType }> = [
  { label: 'All', value: 'both' },
  { label: 'Artists', value: 'artist' },
  { label: 'Tracks', value: 'track' },
];

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  searchType: SearchType;
  onSearchTypeChange: (t: SearchType) => void;
}

export function SearchBar({ query, onQueryChange, searchType, onSearchTypeChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search artists, songs..."
          autoFocus
          aria-label="Search Spotify"
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-full pl-11 pr-5 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors"
        />
      </div>

      <div className="flex gap-2 shrink-0" role="group" aria-label="Filter by type">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSearchTypeChange(opt.value)}
            aria-pressed={searchType === opt.value}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              searchType === opt.value
                ? 'bg-white text-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
