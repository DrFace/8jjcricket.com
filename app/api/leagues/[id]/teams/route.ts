import { NextRequest, NextResponse } from "next/server";

const SPORTMONKS_API_TOKEN = process.env.SPORTMONKS_API_TOKEN || "";
const BASE_URL = "https://cricket.sportmonks.com/api/v2.0";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const leagueId = params.id;

  // Validate league ID
  if (!leagueId || leagueId === "null" || leagueId === "undefined") {
    console.error("Invalid league ID:", leagueId);
    return NextResponse.json(
      { error: "Invalid league ID", data: [] },
      { status: 422 }
    );
  }

  try {
    const url = `${BASE_URL}/leagues/${leagueId}?api_token=${SPORTMONKS_API_TOKEN}&include=teams`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(
        "API responded with status:",
        res.status,
        "for league:",
        leagueId
      );
      return NextResponse.json(
        { error: "Failed to fetch league teams", data: [] },
        { status: res.status }
      );
    }

    const json = await res.json();

    // Extract teams from the league data
    const teams = json.data?.teams?.data || json.data?.teams || [];

    return NextResponse.json({
      data: teams,
      meta: {
        league_id: leagueId,
        count: teams.length,
      },
    });
  } catch (error) {
    console.error("Error fetching league teams:", error);
    return NextResponse.json(
      { error: "Internal server error", data: [] },
      { status: 500 }
    );
  }
}
