const VERIFIER_KEY = 'spotify_code_verifier';

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (x) => possible[x % possible.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function startOAuthFlow(clientId: string): Promise<void> {
  const verifier = generateRandomString(64);
  const challenge = base64urlencode(await sha256(verifier));

  sessionStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: window.location.origin,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function exchangeCodeForToken(
  code: string,
  clientId: string
): Promise<TokenResponse> {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error('No code verifier found — please try signing in again.');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: window.location.origin,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error_description?: string };
    throw new Error(err.error_description ?? 'Failed to authenticate with Spotify');
  }

  sessionStorage.removeItem(VERIFIER_KEY);
  return response.json() as Promise<TokenResponse>;
}
