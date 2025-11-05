'use client'
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'
import TeamBadge from '@/components/TeamBadge'
import type { Fixture } from '@/types/fixture'

export default function LiveCard({ f }: { f: Fixture }) {
  const home = f.localteam
  const away = f.visitorteam

  return (
    <Link href={`/match/${f.id}`} className="card block hover:shadow-md transition">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">
            {(home?.short_name || home?.name || `Team ${f.localteam_id}`)} vs{' '}
            {(away?.short_name || away?.name || `Team ${f.visitorteam_id}`)}
          </h3>
          <p className="text-sm text-gray-600">{f.round ?? 'Match'}</p>
          <p className="text-xs text-gray-500">{formatDate(f.starting_at)}</p>
        </div>
        <div className="text-right">
          <span className={cn('badge', f.live ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800')}>
            {f.live ? 'LIVE' : 'Not live'}
          </span>
          <div className="text-xs text-gray-600 mt-1">{f.status}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-5 items-center gap-2">
        <TeamBadge team={home} className="col-span-2" />
        <div className="text-center text-xs text-gray-500">vs</div>
        <TeamBadge team={away} className="col-span-2 justify-self-end text-right" />
      </div>

      {f.note && <p className="text-sm mt-2 text-gray-700">{f.note}</p>}
    </Link>
  )
}
