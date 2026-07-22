import { useState } from 'react';

interface Props {
  onLogin: (clientId: string) => void;
  error: string | null;
}

function SpotifyIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function LoginScreen({ onLogin, error }: Props) {
  const [clientId, setClientId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (clientId.trim()) onLogin(clientId.trim());
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-3">
          <SpotifyIcon />
          <h1 className="text-3xl font-bold text-white tracking-tight">Spotify Search</h1>
          <p className="text-zinc-500 text-sm">Search artists and tracks</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800"
        >
          <h2 className="text-white font-semibold mb-1">Connect your account</h2>
          <p className="text-zinc-500 text-sm mb-5">
            You&apos;ll need a Spotify app Client ID. Create one at{' '}
            <a
              href="https://developer.spotify.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors underline underline-offset-2"
            >
              developer.spotify.com
            </a>{' '}
            and set the Redirect URI to{' '}
            <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
              {window.location.origin}
            </code>
          </p>

          <label htmlFor="clientId" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Client ID
          </label>
          <input
            id="clientId"
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Paste your Spotify Client ID"
            autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors text-sm mb-4"
          />

          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-800/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!clientId.trim()}
            className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-all text-sm"
          >
            Connect with Spotify
          </button>
        </form>
      </div>
    </div>
  );
}
