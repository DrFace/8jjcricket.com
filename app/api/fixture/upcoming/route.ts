import { NextResponse } from "next/server";

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
    const origin = process.env.BACKEND_ORIGIN || "http://localhost:8000";
    const backendUrl = `${origin}/api/fixtures/upcoming`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Backend error ${res.status}`, details: text, data: [] },
        { status: 502 }
      );
    }

    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : [];

    // Your backend rows look like:
    // { sportmonks_id: 66773, payload: { ..., localteam: {...}, visitorteam: {...} } }
    const fixtures = rows
      .map((row: any) => {
        const p = row?.payload ?? row;

        const leagueName =
          p?.league?.name ??
          p?.league_name ??
          p?.league?.data?.name ??
          undefined;

        return {
          id: Number(
            p?.id ?? row?.sportmonks_id ?? row?.sportmonks_fixture_id ?? row?.id
          ),
          round: p?.round ?? null,
          starting_at: p?.starting_at,
          live: Boolean(p?.live),
          status: p?.status ?? null,
          note: p?.note ?? null,
          type: p?.type ?? "",
          league_id: Number(p?.league_id ?? 0),
          localteam_id: Number(p?.localteam_id ?? 0),
          visitorteam_id: Number(p?.visitorteam_id ?? 0),

          // IMPORTANT: hydrate teams from payload so cards can show name + image
          localteam: p?.localteam ?? null,
          visitorteam: p?.visitorteam ?? null,

          league: p?.league
            ? {
                id: Number(p.league.id ?? p.league_id),
                name: String(p.league.name ?? ""),
              }
            : undefined,

          runs: p?.runs ?? [],
          category: getCategory(leagueName),
        };
      })
      // discard any broken items without a start time
      .filter((f: any) => Boolean(f?.starting_at));

    return NextResponse.json({ data: fixtures });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load upcoming fixtures", data: [] },
      { status: 500 }
    );
  }
}
