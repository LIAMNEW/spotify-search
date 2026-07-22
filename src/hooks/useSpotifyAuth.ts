import { useState, useEffect, useCallback, useRef } from 'react';
import { exchangeCodeForToken, startOAuthFlow } from '../utils/pkce';

const TOKEN_KEY = 'spotify_token';
const EXPIRY_KEY = 'spotify_token_expiry';
const CLIENT_ID_KEY = 'spotify_client_id';

function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }
  return token;
}

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [isHandlingCallback, setIsHandlingCallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasHandled = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const clientId = localStorage.getItem(CLIENT_ID_KEY);

    if (!code || !clientId || hasHandled.current) return;

    hasHandled.current = true;
    setIsHandlingCallback(true);

    exchangeCodeForToken(code, clientId)
      .then((data) => {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(EXPIRY_KEY, String(Date.now() + data.expires_in * 1000));
        setToken(data.access_token);
        window.history.replaceState({}, '', '/');
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      })
      .finally(() => setIsHandlingCallback(false));
  }, []);

  const login = useCallback((clientId: string) => {
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    void startOAuthFlow(clientId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setToken(null);
  }, []);

  return { token, isHandlingCallback, error, login, logout };
}
