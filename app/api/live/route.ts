// src/app/api/live/route.ts
import { NextResponse } from 'next/server'
import { smFetch, mapTeam } from '@/lib/sportmonks'
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const today = new Date()
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  const startPast = new Date(today); startPast.setUTCDate(startPast.getUTCDate() - 45)
  const endFuture = new Date(today); endFuture.setUTCDate(endFuture.getUTCDate() + 90)

  // Endpoints (match your WP example)
  const liveP = smFetch(`/livescores?include=league,localteam,visitorteam,runs,tosswon`)
  const upcomingP = smFetch(
    `/fixtures?filter[starts_between]=${iso(today)},${iso(endFuture)}&include=league,localteam,visitorteam,runs,tosswon`
  )
  const recentP = smFetch(
    `/fixtures?filter[starts_between]=${iso(startPast)},${iso(today)}&include=league,localteam,visitorteam,runs,tosswon`
  )

  const [liveJ, upcomingJ, recentJ] = await Promise.all([liveP, upcomingP, recentP])

  const mapFx = (x: any): any => ({
    id: x.id,
    round: x.round ?? null,
    starting_at: x.starting_at,
    live: x.live === true || x.status === 'LIVE' || x.status === 'In Progress',
    status: x.status ?? null,
    note: x.note ?? null,
    league_id: x.league_id,
    localteam_id: x.localteam_id ?? x.localteam?.id,
    visitorteam_id: x.visitorteam_id ?? x.visitorteam?.id,
    league: x.league ? { id: x.league.id, name: x.league.name } : undefined,
    localteam: mapTeam(x.localteam),
    visitorteam: mapTeam(x.visitorteam),
    runs: x.runs ?? [],
  })

  // upcoming ascending by start, recent descending by start
  const upcoming = (upcomingJ?.data ?? [])
    .filter((m: any) => new Date(m.starting_at).getTime() > Date.now())
    .sort((a: any, b: any) => +new Date(a.starting_at) - +new Date(b.starting_at))
    .map(mapFx)

  const recent = (recentJ?.data ?? [])
    .sort((a: any, b: any) => +new Date(b.starting_at) - +new Date(a.starting_at))
    .map(mapFx)

  const live = (liveJ?.data ?? []).map(mapFx)

  return NextResponse.json({ data: { live, upcoming, recent } })
}
