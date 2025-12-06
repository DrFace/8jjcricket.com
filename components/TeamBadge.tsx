"use client"

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Team } from '@/types/team'

/**
 * A reusable component that displays a team logo and name. The size of the
 * logo can be customized via the `size` prop. When `hideName` is set, only
 * the logo is shown. If a logo URL is not provided, the component renders
 * an empty box to preserve spacing.
 */
export default function TeamBadge({
  team,
  size = 28,
  className,
  hideName = false,
}: {
  team?: Team
  size?: number
  className?: string
  hideName?: boolean
}) {
  const label = team?.short_name || team?.name || 'Team'
  const logo = team?.logo

  return (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      {/* fixed-size box; image fills it and keeps aspect */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {logo ? (
          <Image
            alt={label}
            src={logo}
            fill
            sizes={`${size}px`}
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      {!hideName && <span className="truncate">{label}</span>}
    </div>
  )
}