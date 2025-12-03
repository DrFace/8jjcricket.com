import { NextResponse } from 'next/server';

const BASE = process.env.SPORTMONKS_API_BASE ?? 'https://cricket.sportmonks.com/api/v2.0';
const TOKEN = process.env.SPORTMONKS_API_TOKEN;

// You can remove this or set to 0 for fully dynamic
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!TOKEN) {
    console.error('❌ Missing SPORTMONKS_API_TOKEN');
    return NextResponse.json({ error: 'Missing SPORTMONKS_API_TOKEN' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? '1';

  // reduce default page size a bit to keep responses smaller
  const perPage = searchParams.get('per_page') ?? '50';

  // You can also limit fields from SportMonks if you want even smaller payloads:
  // &fields[players]=id,fullname,firstname,lastname,image_path,country_id,position_id
  const url = `${BASE}/players?api_token=${TOKEN}&include=country&per_page=${perPage}&page=${page}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',      // 👈 key change: don't put this in Next.js data cache
      // or: next: { revalidate: 0 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ SportMonks Error:', res.status, text);
      return NextResponse.json(
        { error: 'Failed to fetch from SportMonks', status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();
    const players = (json.data ?? []).map((p: any) => ({
      id: p.id,
      fullname: p.fullname,
      firstname: p.firstname,
      lastname: p.lastname,
      image_path: p.image_path,
      country: p.country?.name ?? null,
      position: p.position_id ? getPositionName(p.position_id) : null,
    }));

    return NextResponse.json({
      data: players,
      pagination: json.meta?.pagination ?? null,
    });
  } catch (err: any) {
    console.error('❌ Exception:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}

// small helper: map SportMonks position IDs
function getPositionName(id: number): string {
  switch (id) {
    case 1:
      return 'Batsman';
    case 2:
      return 'Bowler';
    case 3:
      return 'Allrounder';
    case 4:
      return 'Wicketkeeper';
    default:
      return 'Unknown';
  }
}
