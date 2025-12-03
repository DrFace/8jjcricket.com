// src/lib/sportmonks.ts
const BASE = 'https://cricket.sportmonks.com/api/v2.0'
const TOKEN = process.env.SPORTMONKS_API_TOKEN!

if (!TOKEN) {
  // Warn clearly (matches the actual env var name)
  console.warn('⚠️ SPORTMONKS_API_TOKEN is missing in .env.local')
}


export async function smFetch(path: string, options: any = {}) {
  const url = `https://cricket.sportmonks.com/api/v2.0${path}${
    path.includes('?') ? '&' : '?'
  }api_token=${process.env.SPORTMONKS_API_TOKEN}`;

  const res = await fetch(url, {
    cache: 'no-store', // IMPORTANT — stop Next.js from caching SportMonks responses
    ...options,
  });

  // Rate-limit handling
  if (!res.ok) {
    const text = await res.text();

    if (text.includes("Too Many Attempts") || res.status === 429) {
      throw new Error("SPORTMONKS_RATE_LIMIT");
    }

    throw new Error(`SPORTMONKS_ERROR: ${res.status} - ${text}`);
  }

  return res.json();
}

export function mapTeam(t: any) {
  if (!t) return undefined
  return {
    id: t.id,
    name: t.name ?? t.code ?? `Team ${t.id}`,
    short_name: t.code ?? t.short_code ?? null,
    logo: t.image_path ?? `https://cdn.sportmonks.com/images/cricket/teams/${t.id}/${t.id}.png`,
  }
}
