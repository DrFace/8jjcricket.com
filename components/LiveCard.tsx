'use client'

import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'
import TeamBadge from '@/components/TeamBadge'
import type { Fixture } from '@/types/fixture'

export default function LiveCard({ f }: { f: Fixture }) {
  const home = f.localteam
  const away = f.visitorteam

  const homeLabel =
    home?.short_name || home?.name || `Team ${f.localteam_id}`
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`

  const metaLine = `${f.round ?? 'Match'} · ${formatDate(f.starting_at)}`

  return (
    <div className="relative group">
      {/* Base card + subtle border to match screenshot */}
      <div className="absolute inset-0 rounded-xl border border-gray-200 bg-white shadow-sm group-hover:shadow-md transition-shadow" />

      {/* Optional glow on hover (keeps your gradient-border idea but only as a halo) */}
      <div
        className="
          pointer-events-none
          absolute -inset-px rounded-[18px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
        "
      />

      <Link
        href={`/match/${f.id}`}
        className="relative z-10 block rounded-xl px-4 py-3"
      >
        {/* Top: title + status pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {homeLabel} vs {awayLabel}
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-500">{metaLine}</p>

            {f.status && (
              <p className="mt-0.5 text-[11px] text-gray-500">{f.status}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                f.live
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {f.live ? 'LIVE' : 'Not live'}
            </span>
          </div>
        </div>

        {/* Divider like in the screenshot card */}
        <div className="mt-2 h-px w-full bg-gray-100" />

        {/* Middle row: teams + flags (via TeamBadge) + vs */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <TeamBadge team={home} className="justify-start" />
          </div>

          <div className="px-2 text-[11px] text-gray-400 uppercase tracking-wide">
            vs
          </div>

          <div className="flex-1 min-w-0 flex justify-end">
            <TeamBadge team={away} className="justify-end text-right" />
          </div>
        </div>

        {/* Optional note (unchanged logic) */}
        {f.note && (
          <p className="mt-2 text-xs sm:text-[13px] text-gray-700">
            {f.note}
          </p>
        )}
      </Link>
    </div>
  )
}
