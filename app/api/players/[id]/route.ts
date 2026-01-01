import { NextResponse } from 'next/server';

const BASE = process.env.SPORTMONKS_API_BASE ?? 'https://cricket.sportmonks.com/api/v2.0';
const TOKEN = process.env.SPORTMONKS_API_TOKEN;

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!TOKEN) {
    return NextResponse.json({ error: 'Missing SPORTMONKS_API_TOKEN' }, { status: 500 });
  }

  try {
    const url = `${BASE}/players/${id}?api_token=${TOKEN}&include=career,country`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ SportMonks Error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch player' }, { status: 502 });
    }

    const json = await res.json();
    const player = json.data;

    return NextResponse.json({ data: player });
  } catch (err: any) {
    console.error('❌ Exception:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
