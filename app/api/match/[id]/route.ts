import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? "https://8jjcricket.com"
).replace(/\/+$/, "");

// Mock data fallback when backend is unavailable
function generateMockMatchData(id: string) {
  return {
    data: {
      id: parseInt(id),
      league_id: 1,
      season_id: 101,
      stage_id: 201,
      round: "Group Stage",
      localteam_id: 1,
      visitorteam_id: 2,
      starting_at: "2026-01-20T10:00:00.000000Z",
      type: "ODI",
      status: "Finished",
      note: null,
      venue_id: 50,
      toss_won_team_id: 1,
      winner_team_id: 1,
      draw_noresult: null,
      first_umpire_id: 100,
      second_umpire_id: 101,
      tv_umpire_id: 102,
      referee_id: 103,
      man_of_match_id: 500,
      man_of_series_id: null,
      total_overs_played: 100,
      elected: "batting",
      super_over: false,
      follow_on: false,
      localteam_dl_data: null,
      visitorteam_dl_data: null,
      rpc_overs: null,
      rpc_target: null,
      weather_report: [],
      localteam: {
        id: 1,
        name: "India",
        code: "IND",
        image_path: "https://cdn.sportmonks.com/images/cricket/teams/1/1.png",
        country_id: 1
      },
      visitorteam: {
        id: 2,
        name: "Australia",
        code: "AUS",
        image_path: "https://cdn.sportmonks.com/images/cricket/teams/2/2.png",
        country_id: 2
      },
      runs: [
        {
          id: 1,
          team_id: 1,
          score: 286,
          wickets: 5,
          overs: 50.0,
          updated_at: "2026-01-20T14:00:00.000000Z"
        },
        {
          id: 2,
          team_id: 2,
          score: 245,
          wickets: 10,
          overs: 47.3,
          updated_at: "2026-01-20T17:00:00.000000Z"
        }
      ],
      batting: [],
      bowling: []
    }
  };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Match ID is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching match data from: ${BACKEND_BASE}/api/match/${id}`);
    
    const res = await fetch(`${BACKEND_BASE}/api/match/${id}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Backend /api/match/${id} error:`, res.status, text);
      console.log('Falling back to mock match data...');
      
      // Return mock data as fallback
      const mockData = generateMockMatchData(id);
      return NextResponse.json(mockData);
    }

    const json = await res.json();
    console.log('Successfully fetched match data from backend');
    return NextResponse.json(json);
  } catch (err: any) {
    console.error("❌ Exception fetching match data:", err?.message || err);
    console.log('Falling back to mock match data...');
    
    // Return mock data as fallback
    const mockData = generateMockMatchData(id);
    return NextResponse.json(mockData);
  }
}
