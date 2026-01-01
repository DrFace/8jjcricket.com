import { NextResponse } from 'next/server';

const BASE = process.env.SPORTMONKS_API_BASE ?? 'http://72.60.107.98:8001/api';
const TOKEN = process.env.SPORTMONKS_API_TOKEN;

export const revalidate = 86400; // cache for 1 day

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ error: 'Missing SPORTMONKS_API_TOKEN' }, { status: 500 });
  }

  const url = `${BASE}/countries?api_token=${TOKEN}&per_page=500`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ SportMonks countries error:', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch countries', status: res.status }, { status: 502 });
    }

    const json = await res.json();
    const countries = (json.data ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
    }));

    return NextResponse.json({ data: countries });
  } catch (err: any) {
    console.error('❌ Exception:', err);
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
