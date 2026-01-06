import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBackendBase(): string {
  return (
    process.env.BACKEND_BASE ||
    process.env.NEXT_PUBLIC_BACKEND_BASE ||
    "https://8jjcricket.com"
  ).replace(/\/$/, "");
}

type TeamRow = {
  id: number;
  name?: string;
  code?: string;
  image_path?: string;
};

function getCategory(leagueName?: string): string {
  if (!leagueName) return "Leagues";
  const name = leagueName.toLowerCase();
  if (name.includes("test")) return "Test";
  if (name.includes("one day") || name.includes("odi")) return "ODI";
  if (name.includes("t20")) return "T20";
  if (name.includes("international")) return "International";
  return "Leagues";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") ?? "200";

    const base = getBackendBase();

    // 1) Fetch upcoming fixtures from Laravel
    const fixturesRes = await fetch(
      `${base}/api/fixtures/upcoming?limit=${encodeURIComponent(limit)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );

    if (!fixturesRes.ok) {
      const text = await fixturesRes.text();
      return NextResponse.json(
        {
          error: `Backend /api/fixtures/upcoming returned ${fixturesRes.status}`,
          details: text.slice(0, 2000),
          data: [],
        },
        { status: 502 }
      );
    }

    const fixturesJson = await fixturesRes.json();
    const fixtures: any[] = fixturesJson?.data ?? [];

    // 2) Fetch teams from Laravel (id -> name/logo)
    const teamsRes = await fetch(`${base}/api/teams`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!teamsRes.ok) {
      const text = await teamsRes.text();
      return NextResponse.json(
        {
          error: `Backend /api/teams returned ${teamsRes.status}`,
          details: text.slice(0, 2000),
          data: [],
        },
        { status: 502 }
      );
    }

    const teamsJson = await teamsRes.json();
    const teams: TeamRow[] = teamsJson?.data ?? [];

    const teamsById = new Map<number, TeamRow>();
    for (const t of teams) {
      if (typeof t?.id === "number") teamsById.set(t.id, t);
    }

    // 3) Enrich fixtures so ArchhiveCard can show name/logo
    const enriched = fixtures.map((f: any) => {
      const localId = Number(f.localteam_id ?? f.localteam?.id);
      const visitId = Number(f.visitorteam_id ?? f.visitorteam?.id);

      const local = teamsById.get(localId);
      const visitor = teamsById.get(visitId);

      // If your Laravel row is DB-id, but you want SportMonks fixture id in UI:
      const fixtureId = f.sportmonks_id ?? f.id;

      return {
        ...f,
        id: fixtureId,

        localteam_id: localId || f.localteam_id,
        visitorteam_id: visitId || f.visitorteam_id,

        localteam: local
          ? {
              id: local.id,
              name: local.name ?? `Team ${local.id}`,
              code: local.code ?? null,
              image_path: local.image_path ?? null,
            }
          : f.localteam ?? null,

        visitorteam: visitor
          ? {
              id: visitor.id,
              name: visitor.name ?? `Team ${visitor.id}`,
              code: visitor.code ?? null,
              image_path: visitor.image_path ?? null,
            }
          : f.visitorteam ?? null,

        // Optional: category if your UI expects it
        category: f.category ?? getCategory(f?.league?.name),
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (e: any) {
    console.error("Error in /api/upcoming (backend+teams enrichment):", e);
    return NextResponse.json(
      { error: e?.message ?? "Failed to load upcoming matches", data: [] },
      { status: 500 }
    );
  }
}
