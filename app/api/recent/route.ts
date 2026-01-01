import { NextResponse } from "next/server";
import { smFetch, mapTeam } from "@/lib/sportmonks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getCategory(leagueName?: string): string {
  if (!leagueName) return "Leagues";
  const name = leagueName.toLowerCase();
  if (name.includes("test")) return "Test";
  if (name.includes("one day") || name.includes("odi")) return "ODI";
  if (name.includes("t20")) return "T20";
  if (name.includes("international")) return "International";
  return "Leagues";
}

export async function GET() {
  try {
    // ✅ include league so we can build category filter on frontend
    const json = await smFetch(
      "/fixtures?filter[status]=Finished&sort=-starting_at&include=league,localteam,visitorteam"
    );

    const fixtures = (json?.data ?? []).map((f: any) => ({
      id: f.id,
      round: f.round,
      status: f.status,
      starting_at: f.starting_at,
      note: f.note,
      localteam_id: f.localteam_id ?? f.localteam?.id,
      visitorteam_id: f.visitorteam_id ?? f.visitorteam?.id,
      league_id: f.league_id,
      league: f.league ? { id: f.league.id, name: f.league.name } : undefined,
      localteam: mapTeam(f.localteam),
      visitorteam: mapTeam(f.visitorteam),
      live: f.live ?? false,
      category: getCategory(f.league?.name),
    }));

    return NextResponse.json({ data: fixtures });
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg === "SPORTMONKS_RATE_LIMIT") {
      return NextResponse.json(
        { error: "SportMonks rate limit reached. Please try again soon." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: msg || "Failed to load recent fixtures", data: [] },
      { status: 500 }
    );
  }
}
