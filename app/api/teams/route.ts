import { NextResponse } from 'next/server'

const API = 'https://cricket.sportmonks.com/api/v2.0'
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idsParam = (searchParams.get('ids') || '').trim()
  if (!idsParam) {
    return NextResponse.json({ error: 'ids required' }, { status: 400 })
  }

  const token = process.env.SPORTMONKS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SPORTMONKS_TOKEN missing' }, { status: 500 })
  }

  // SportMonks v2 supports filter by id
  const url = `${API}/teams?api_token=${token}&filter[id]=${encodeURIComponent(idsParam)}&include=*`

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const json = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: json?.message || `Upstream ${res.status}` }, { status: 500 })
    }

    const items = Array.isArray(json?.data) ? json.data : []
    // Map to a compact shape your UI expects
    const out = items.map((t: any) => ({
      id: t.id,
      name: t.name,
      short_name: t.short_code ?? t.short_name ?? t.name,
      image_path: t.image_path ?? t?.image?.path ?? '',
      logo: t.image_path ?? t?.image?.path ?? '',
      country_id: t.country_id,
    }))

    return NextResponse.json({ data: out })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Fetch failed' }, { status: 500 })
  }
}
