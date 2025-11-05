// /app/api/recent/route.ts
import { NextResponse } from 'next/server'
import { smFetch, mapTeam } from '@/lib/sportmonks'

export async function GET() {
  try {
    const json = await smFetch(
      '/fixtures?filter[status]=Finished&sort=-starting_at&include=localteam,visitorteam'
    )

    const fixtures = (json?.data ?? []).map((f: any) => ({
      id: f.id,
      round: f.round,
      status: f.status,
      starting_at: f.starting_at,
      note: f.note,
      localteam_id: f.localteam_id ?? f.localteam?.id,
      visitorteam_id: f.visitorteam_id ?? f.visitorteam?.id,
      localteam: mapTeam(f.localteam),       // 👈 HERE
      visitorteam: mapTeam(f.visitorteam),   // 👈 HERE
      live: f.live ?? false,
    }))

    return NextResponse.json({ data: fixtures })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
