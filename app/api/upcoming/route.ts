import { NextResponse } from 'next/server'
import { smFetch, mapTeam } from '@/lib/sportmonks'

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    // Fetch fixtures for the next 90 days
    const q = `/fixtures?filter[starts_between]=${today},${future}&include=league,localteam,visitorteam,runs,tosswon`
    const json = await smFetch(q)

    const now = Date.now()

    // Filter upcoming matches
    const fixtures = (json?.data ?? [])
      .filter((m: any) => new Date(m.starting_at).getTime() > now)
      .map((f: any) => ({
        id: f.id,
        round: f.round ?? null,
        status: f.status ?? 'upcoming',
        starting_at: f.starting_at,
        note: f.note ?? '',
        type: f.type ?? '',
        league_id: f.league_id,
        localteam_id: f.localteam_id ?? f.localteam?.id,
        visitorteam_id: f.visitorteam_id ?? f.visitorteam?.id,
        league: f.league
          ? { id: f.league.id, name: f.league.name }
          : undefined,
        localteam: mapTeam(f.localteam),       // ✅ add this
        visitorteam: mapTeam(f.visitorteam),   // ✅ add this
        runs: f.runs ?? [],
        tosswon: f.tosswon ?? null,
      }))

    return NextResponse.json({ data: fixtures })
  } catch (e: any) {
    console.error('Error in /api/upcoming:', e)
    return NextResponse.json(
      { error: e.message ?? 'Failed to load upcoming matches', data: [] },
      { status: 500 }
    )
  }
}
