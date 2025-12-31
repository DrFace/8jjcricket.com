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
    const today = new Date().toISOString().slice(0, 10);
    const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const q = `/fixtures?filter[starts_between]=${today},${future}&include=league,localteam,visitorteam,runs,tosswon`;
    const json = await smFetch(q);

    const now = Date.now();

    const fixtures = (json?.data ?? [])
      .filter((m: any) => new Date(m.starting_at).getTime() > now)
      .map((f: any) => ({
        id: f.id,
        round: f.round ?? null,
        status: f.status ?? "upcoming",
        starting_at: f.starting_at,
        note: f.note ?? "",
        type: f.type ?? "",
        league_id: f.league_id,
        league: f.league ? { id: f.league.id, name: f.league.name } : undefined,
        localteam_id: f.localteam_id ?? f.localteam?.id,
        visitorteam_id: f.visitorteam_id ?? f.visitorteam?.id,
        localteam: mapTeam(f.localteam),
        visitorteam: mapTeam(f.visitorteam),
        runs: f.runs ?? [],
        tosswon: f.tosswon ?? null,
        category: getCategory(f.league?.name),
      }));

    return NextResponse.json({ data: fixtures });
  } catch (e: any) {
    console.error("Error in /api/upcoming:", e);
    return NextResponse.json(
      { error: e.message ?? "Failed to load upcoming matches", data: [] },
      { status: 500 }
    );
  }
}