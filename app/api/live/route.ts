// src/app/api/live/route.ts
import { NextResponse } from 'next/server';
import { smFetch, mapTeam } from '@/lib/sportmonks';

/**
 * In-memory cache for live data. The structure stores both the
 * timestamp of the last fetch and the JSON response returned to the
 * client. Because this file is evaluated once per server process,
 * these variables persist across requests as long as the process lives.
 */
let liveCache: { timestamp: number; json: any } | null = null;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const now = Date.now();
    // If cached data is less than one minute old, return it instead of
    // contacting SportMonks again. This dramatically reduces the
    // likelihood of hitting the external API’s rate limit.
    if (liveCache && now - liveCache.timestamp < 60_000) {
      return NextResponse.json(liveCache.json);
    }

    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);

    const startPast = new Date(today);
    startPast.setUTCDate(startPast.getUTCDate() - 45);

    const endFuture = new Date(today);
    endFuture.setUTCDate(endFuture.getUTCDate() + 90);

    // Endpoint promises.  We initiate all three requests in parallel to
    // minimise total latency.  Each call may throw if SportMonks
    // responds with an error (e.g. rate limiting), in which case it
    // will be caught below.
    const liveP = smFetch(`/livescores?include=league,localteam,visitorteam,runs,tosswon`);
    const upcomingP = smFetch(
      `/fixtures?filter[starts_between]=${iso(today)},${iso(
        endFuture
      )}&include=league,localteam,visitorteam,runs,tosswon`
    );
    const recentP = smFetch(
      `/fixtures?filter[starts_between]=${iso(startPast)},${iso(
        today
      )}&include=league,localteam,visitorteam,runs,tosswon`
    );

    const [liveJ, upcomingJ, recentJ] = await Promise.all([liveP, upcomingP, recentP]);

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
    });

    // Sort and map upcoming fixtures
    const upcoming = (upcomingJ?.data ?? [])
      .filter((m: any) => new Date(m.starting_at).getTime() > Date.now())
      .sort((a: any, b: any) => +new Date(a.starting_at) - +new Date(b.starting_at))
      .map(mapFx);

    // Sort and map recent fixtures
    const recent = (recentJ?.data ?? [])
      .sort((a: any, b: any) => +new Date(b.starting_at) - +new Date(a.starting_at))
      .map(mapFx);

    // Map live fixtures
    const live = (liveJ?.data ?? []).map(mapFx);

    const responseJson = { data: { live, upcoming, recent } };

    // Update cache
    liveCache = { timestamp: now, json: responseJson };

    return NextResponse.json(responseJson);
  } catch (err: any) {
    console.error('Error in /api/live:', err);
    const msg = String(err?.message ?? '');
    // Handle SportMonks rate limit
    if (msg.includes('Too Many Attempts') || msg === 'SPORTMONKS_RATE_LIMIT') {
      return NextResponse.json(
        { error: 'API rate limit hit. Please try again in a moment.' },
        { status: 503 }
      );
    }
    // Fallback error
    return NextResponse.json(
      { error: 'Internal server error in /api/live' },
      { status: 500 }
    );
  }
}
