import { NextResponse } from 'next/server'

const TOKEN =
  process.env.SPORTMONKS_TOKEN ||
  '5UQRUKnTvsE96yL1DirHmacieacUoJ5D9KgzuUmDbvHSpTecnYUcsLwatoVd'

const BASE = 'http://72.60.107.98:8001/api'

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' })
  const text = await res.text()
  let json: any = {}
  try { json = text ? JSON.parse(text) : {} } catch { throw new Error(`Bad JSON (${res.status}) ${text.slice(0, 200)}`) }
  if (!res.ok) {
    const msg = json?.message?.message || json?.message || `HTTP ${res.status}`
    throw new Error(String(msg))
  }
  return json
}

async function hydrateTeamIfMissing(team: any, id?: number) {
  if (team?.image_path || !id) return team
  try {
    const j = await fetchJson(`${BASE}/teams/${id}?api_token=${TOKEN}`)
    return { ...(team || {}), ...j?.data }
  } catch {
    return team
  }
}

// --- NEW: players hydration -------------------------------------------------

async function fetchPlayer(id: number) {
  try {
    const j = await fetchJson(`${BASE}/players/${id}?api_token=${TOKEN}`)
    return j?.data
  } catch {
    return null
  }
}

async function hydratePlayersOnRows(rows: any[]) {
  const ids = Array.from(new Set(rows.map(r => r?.player_id).filter(Boolean))) as number[]
  if (ids.length === 0) return { rows, playersMap: new Map<number, any>() }

  // basic concurrency; Sportmonks rate limits are generous for a handful
  const results = await Promise.all(ids.map(async (pid) => [pid, await fetchPlayer(pid)] as const))
  const playersMap = new Map<number, any>()
  results.forEach(([pid, p]) => { if (p) playersMap.set(pid, p) })

  const withNames = rows.map(r => {
    const p = r?.player_id ? playersMap.get(r.player_id) : null
    // attach normalized name fields if missing
    const player_name =
      r.player_name ??
      p?.fullname ??
      p?.lastname ??
      p?.firstname ??
      (r.player_id ? `Player ${r.player_id}` : '—')
    return {
      ...r,
      player_name,
      fullname: r.fullname ?? p?.fullname,
      firstname: r.firstname ?? p?.firstname,
      lastname: r.lastname ?? p?.lastname,
    }
  })

  return { rows: withNames, playersMap }
}

// ---------------------------------------------------------------------------

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'No match selected.' }, { status: 400 })

  try {
    // 1) Fixture (like the shortcode)
    const fxUrl = `${BASE}/fixtures/${id}?api_token=${TOKEN}&include=league,localteam,visitorteam,runs`
    const fxRes = await fetchJson(fxUrl)
    const fixture = fxRes?.data
    if (!fixture) return NextResponse.json({ error: 'No data available.' }, { status: 502 })

    // 2) Separate includes for batting/bowling
    const [batJson, bowlJson] = await Promise.all([
      fetchJson(`${BASE}/fixtures/${id}?api_token=${TOKEN}&include=batting`).catch(() => ({})),
      fetchJson(`${BASE}/fixtures/${id}?api_token=${TOKEN}&include=bowling`).catch(() => ({})),
    ])

    const rawBatting =
      (batJson?.data?.batting as any[]) ??
      (Array.isArray(batJson?.data) ? batJson.data : []) ??
      []
    const rawBowling =
      (bowlJson?.data?.bowling as any[]) ??
      (Array.isArray(bowlJson?.data) ? bowlJson.data : []) ??
      []

    // 3) **Hydrate player names** onto both arrays
    const [{ rows: batting }, { rows: bowling }] = await Promise.all([
      hydratePlayersOnRows(rawBatting),
      hydratePlayersOnRows(rawBowling),
    ])

    // 4) Ensure teams have images
    const localteam = await hydrateTeamIfMissing(fixture.localteam, fixture.localteam_id)
    const visitorteam = await hydrateTeamIfMissing(fixture.visitorteam, fixture.visitorteam_id)

    return NextResponse.json({
      data: { ...fixture, localteam, visitorteam, batting, bowling },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load fixture.' }, { status: 500 })
  }
}
