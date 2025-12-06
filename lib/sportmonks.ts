// src/lib/sportmonks.ts

/*
 * Thin wrapper around the SportMonks Cricket API.
 *
 * The application uses the SportMonks API exclusively on the server side so
 * that the API token is never exposed to the browser. All requests are
 * automatically prefixed with the API base path and have the `api_token`
 * query parameter appended. When the API returns a 429 response (Too Many
 * Requests) or a body containing “Too Many Attempts”, this helper throws
 * a special error string (``SPORTMONKS_RATE_LIMIT``) so callers can
 * distinguish between rate limiting and other failures. See
 * https://docs.sportmonks.com for more details on rate limits.
 */

const BASE = 'https://cricket.sportmonks.com/api/v2.0';

/**
 * Safely fetch data from the SportMonks API. Append the API token and
 * propagate rate‑limit errors as a thrown error.
 */
export async function smFetch(path: string, options: RequestInit = {}) {
  const token = process.env.SPORTMONKS_API_TOKEN;
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}api_token=${token}`;
  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    if (text.includes('Too Many Attempts') || res.status === 429) {
      throw new Error('SPORTMONKS_RATE_LIMIT');
    }
    throw new Error(`SPORTMONKS_ERROR: ${res.status} - ${text}`);
  }
  return res.json();
}

/**
 * Normalise a team object returned by the API. The API returns nested team
 * structures in several endpoints. This helper extracts common fields.
 */
export function mapTeam(t: any) {
  if (!t) return undefined;
  return {
    id: t.id,
    name: t.name ?? t.code ?? `Team ${t.id}`,
    short_name: t.code ?? t.short_code ?? null,
    logo:
      t.image_path ??
      `https://cdn.sportmonks.com/images/cricket/teams/${t.id}/${t.id}.png`,
  };
}