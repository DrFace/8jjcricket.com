"use client"

import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'
import TeamBadge from '@/components/TeamBadge'
import type { Fixture } from '@/types/fixture'

export default function LiveCard({ f }: { f: Fixture }) {
  const home = f.localteam
  const away = f.visitorteam

  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div
        className="
          absolute inset-0 rounded-lg p-[2px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
          gradient-border
        "
      >
        <div className="w-full h-full bg-white rounded-lg"></div>
      </div>

      <Link
        href={`/match/${f.id}`}
        className="relative z-10 block px-2 sm:px-3 py-3 hover:bg-gray-50 transition rounded-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {(home?.short_name || home?.name || `Team ${f.localteam_id}`)} vs{' '}
              {(away?.short_name || away?.name || `Team ${f.visitorteam_id}`)}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {f.round ?? 'Match'}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {formatDate(f.starting_at)}
            </p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                f.live ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              )}
            >
              {f.live ? 'LIVE' : 'Not live'}
            </span>
            <div className="text-[11px] text-gray-600">{f.status}</div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <TeamBadge team={home} className="justify-start" />
          </div>
          <div className="px-2 text-[11px] text-gray-500 uppercase tracking-wide">
            vs
          </div>
          <div className="flex-1 min-w-0 flex justify-end">
            <TeamBadge team={away} className="justify-end text-right" />
          </div>
        </div>

        {f.note && (
          <p className="text-xs sm:text-sm mt-2 text-gray-700">{f.note}</p>
        )}
      </Link>
    </div>
  )
}
