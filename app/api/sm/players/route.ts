import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API = 'https://cricket.sportmonks.com/api/v2.0'

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

  const url = `${API}/players?api_token=${token}&filter[id]=${encodeURIComponent(idsParam)}&include=team`

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const json = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: json?.message || `Upstream ${res.status}` }, { status: 500 })
    }

    const items = Array.isArray(json?.data) ? json.data : []
    const out = items.map((p: any) => ({
      id: p.id,
      fullname: p.fullname ?? `${p.firstname ?? ''} ${p.lastname ?? ''}`.trim(),
      firstname: p.firstname,
      lastname: p.lastname,
      image_path: p.image_path ?? p?.image?.path ?? '',
      team_id: p.team_id ?? p?.team?.id,
    }))

    return NextResponse.json({ data: out })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Fetch failed' }, { status: 500 })
  }
}
