import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? 'https://8jjcricket.com'
).replace(/\/+$/, '');

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Match ID is required' },
      { status: 400 }
    );
  }

  const backendUrl = `${BACKEND_BASE}/api/match/${id}`;

  try {
    const res = await fetch(backendUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Backend /api/match/${id} error:`, res.status, text);
      return NextResponse.json(
        { error: 'Failed to fetch match data', status: res.status },
        { status: res.status === 404 ? 404 : 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    console.error('❌ Exception fetching match data:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
