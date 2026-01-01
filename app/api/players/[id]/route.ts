import { NextResponse } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE ?? '8jjcricket.com';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const url = `${BACKEND_BASE}/api/players/${encodeURIComponent(id)}`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Backend /api/players/:id error:', res.status, text);
      return NextResponse.json(
        { error: 'Failed to fetch player', status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    console.error('❌ Exception:', err);
    return NextResponse.json(
      { error: err.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
