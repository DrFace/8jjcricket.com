import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


function generateMockArchives(page: number, perPage: number, filters: any) {
  const allMatches = [
    {
      id: 1,
      sportmonks_fixture_id: 66710,
      match_title: "Adelaide Strikers vs Brisbane Heat",
      format: "T20",
      category: "Leagues",
      round: "17th Match",
      home_team: "Adelaide Strikers",
      away_team: "Brisbane Heat",
      home_score: "125/3",
      away_score: "121/10",
      status: "Finished",
      result: "Adelaide Strikers won by 7 wickets (with 35 balls remaining)",
      match_date: "2025-12-31T08:15:00.000000Z",
      created_at: "2026-01-01T05:06:20.000000Z",
      updated_at: "2026-01-01T05:06:20.000000Z"
    },
    {
      id: 2,
      sportmonks_fixture_id: 66711,
      match_title: "India vs Australia",
      format: "ODI",
      category: "International",
      round: "3rd ODI",
      home_team: "India",
      away_team: "Australia",
      home_score: "286/5",
      away_score: "245/10",
      status: "Finished",
      result: "India won by 41 runs",
      match_date: "2025-12-30T09:30:00.000000Z",
      created_at: "2026-01-01T05:06:20.000000Z",
      updated_at: "2026-01-01T05:06:20.000000Z"
    },
    {
      id: 3,
      sportmonks_fixture_id: 66712,
      match_title: "England vs South Africa",
      format: "Test",
      category: "International",
      round: "1st Test, Day 5",
      home_team: "England",
      away_team: "South Africa",
      home_score: "425 & 287/6d",
      away_score: "298 & 372",
      status: "Finished",
      result: "England won by 42 runs",
      match_date: "2025-12-29T10:00:00.000000Z",
      created_at: "2026-01-01T05:06:20.000000Z",
      updated_at: "2026-01-01T05:06:20.000000Z"
    },
    {
      id: 4,
      sportmonks_fixture_id: 66713,
      match_title: "Mumbai Indians vs Chennai Super Kings",
      format: "T20",
      category: "Leagues",
      round: "Final",
      home_team: "Mumbai Indians",
      away_team: "Chennai Super Kings",
      home_score: "189/7",
      away_score: "187/9",
      status: "Finished",
      result: "Mumbai Indians won by 2 runs",
      match_date: "2025-12-28T14:00:00.000000Z",
      created_at: "2026-01-01T05:06:20.000000Z",
      updated_at: "2026-01-01T05:06:20.000000Z"
    },
    {
      id: 5,
      sportmonks_fixture_id: 66714,
      match_title: "Pakistan vs New Zealand",
      format: "T20",
      category: "International",
      round: "2nd T20I",
      home_team: "Pakistan",
      away_team: "New Zealand",
      home_score: "175/6",
      away_score: "171/8",
      status: "Finished",
      result: "Pakistan won by 4 runs",
      match_date: "2025-12-27T15:30:00.000000Z",
      created_at: "2026-01-01T05:06:20.000000Z",
      updated_at: "2026-01-01T05:06:20.000000Z"
    },
  ];

  // Apply filters
  let filtered = [...allMatches];
  if (filters.format) {
    filtered = filtered.filter(m => m.format === filters.format);
  }
  if (filters.category) {
    filtered = filtered.filter(m => m.category === filters.category);
  }
  if (filters.date) {
    filtered = filtered.filter(m => m.match_date.startsWith(filters.date));
  }

  // Duplicate data to simulate pagination
  const expandedData = [];
  for (let i = 0; i < 100; i++) {
    expandedData.push(...filtered.map((m, idx) => ({
      ...m,
      id: m.id + (i * filtered.length) + idx,
      sportmonks_fixture_id: m.sportmonks_fixture_id + (i * 100)
    })));
  }

  const total = expandedData.length;
  const lastPage = Math.ceil(total / perPage);
  const from = ((page - 1) * perPage) + 1;
  const to = Math.min(page * perPage, total);
  const data = expandedData.slice((page - 1) * perPage, page * perPage);

  return {
    current_page: page,
    data,
    first_page_url: `/api/archives?page=1`,
    from,
    last_page: lastPage,
    last_page_url: `/api/archives?page=${lastPage}`,
    links: [
      { url: page > 1 ? `/api/archives?page=${page - 1}` : null, label: "&laquo; Previous", page: page > 1 ? page - 1 : null, active: false },
      { url: `/api/archives?page=${page}`, label: String(page), page, active: true },
      { url: page < lastPage ? `/api/archives?page=${page + 1}` : null, label: "&raquo; Next", page: page < lastPage ? page + 1 : null, active: false }
    ],
    next_page_url: page < lastPage ? `/api/archives?page=${page + 1}` : null,
    path: `/api/archives`,
    per_page: perPage,
    prev_page_url: page > 1 ? `/api/archives?page=${page - 1}` : null,
    to,
    total
  };
}

/**
 * Archives API Route
 * Tries to fetch from backend, falls back to mock data if backend is unavailable
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const filters = {
      date: searchParams.get('date') || '',
      format: searchParams.get('format') || '',
      category: searchParams.get('category') || '',
    };
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '30');

    // Build query parameters for backend
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.format) params.append('format', filters.format);
    if (filters.category) params.append('category', filters.category);
    params.append('per_page', String(perPage));
    params.append('page', String(page));

    const queryString = params.toString();
    const backendUrl = `${process.env.BACKEND_ORIGIN || 'https://api.8jjcricket.com'}/archives${queryString ? `?${queryString}` : ''}`;

    console.log('Attempting to fetch archives from backend:', backendUrl);

    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched from backend');
        return NextResponse.json(data);
      } else {
        console.warn('Backend returned error:', response.status, '- Falling back to mock data');
      }
    } catch (fetchError) {
      console.warn('Backend fetch failed:', fetchError instanceof Error ? fetchError.message : 'Unknown error');
      console.log('Falling back to mock data...');
    }

    // Return mock data as fallback
    const mockData = generateMockArchives(page, perPage, filters);
    console.log(`Returning mock data: ${mockData.data.length} items on page ${page}`);
    return NextResponse.json(mockData);

  } catch (error) {
    console.error('Error in archives API route:', error);
    // Even if there's an error, return mock data
    const mockData = generateMockArchives(1, 30, {});
    return NextResponse.json(mockData);
  }
}
