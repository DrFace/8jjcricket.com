// src/lib/sportmonks.ts
const BASE = 'https://cricket.sportmonks.com/api/v2.0'
const TOKEN = process.env.SPORTMONKS_API_TOKEN!

if (!TOKEN) {
  // Warn clearly (matches the actual env var name)
  console.warn('⚠️ SPORTMONKS_API_TOKEN is missing in .env.local')
}

export async function smFetch(path: string, init?: RequestInit) {
  const sep = path.includes('?') ? '&' : '?'
  const url = `${BASE}${path}${sep}api_token=${TOKEN}`

  const res = await fetch(url, { ...init, next: { revalidate: 60 } })
  const text = await res.text()
  let json: any = {}
  try { json = text ? JSON.parse(text) : {} } catch { /* ignore */ }

  if (!res.ok) {
    // surface API error messages
    const msg = json?.message?.message || json?.message || text || `HTTP ${res.status}`
    throw new Error(`SportMonks ${res.status}: ${msg}`)
  }
  return json
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
