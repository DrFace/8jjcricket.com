'use client'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Team } from '@/types/team'

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
            <div
                className="relative shrink-0"
                style={{ width: size, height: size }}
            >
                {logo ? (
                    <Image
                        alt={label}
                        src={logo}
                        fill
                        sizes={`${size}px`}
                        className="object-contain"
                    // no width/height props; fill + object-contain preserves ratio
                    />
                ) : (
                    <div className="w-full h-full" />
                )}
            </div>
            {!hideName && <span className="truncate">{label}</span>}
        </div>
    )
}
