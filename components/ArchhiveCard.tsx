"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import { Match } from "@/lib/cricket-types";

export default function ArchhiveCard({ f }: { f: Match }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  const metaLine = f.round ?? "Match";
  const dateLine = formatDate(f.starting_at);

  return (
    <Link href={`/match/${f.id}`} className="relative group p-4">
      {/* Base card with dark glassmorphism and visible border */}
      <div className="absolute inset-0 rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-5 shadow-2xl backdrop-blur-xl" />

      {/* Minimal glow on hover (outside border only) */}
      <div
        className="
          pointer-events-none
          absolute -inset-px rounded-3xl
          opacity-0 group-hover:opacity-50
          transition-opacity duration-300
          bg-gradient-to-r from-white/5 via-white/0 to-white/5
          blur-md
        "
      />

      <div className="relative z-10 block transition">
        <div className="w-full">
          <h3 className="text-md font-semibold text-white/90 truncate text-center">
            {homeLabel} vs {awayLabel}
          </h3>
        </div>
        {/* Top row: title + status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-white/60 mt-0.5">{metaLine}</p>

            <p className="text-[11px] text-white/45 mt-0.5">{dateLine}</p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                f.live
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-green-500/10 text-green-400 border border-green-500/20",
              )}
            >
              {f.live ? "LIVE" : "Soon"}
            </span>

            {f.status && (
              <div className="text-[11px] text-white/50">{f.status}</div>
            )}
          </div>
        </div>
        {/* Middle: badges + "vs" */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <TeamBadge size={50} team={home} className="justify-start" />
          </div>

          <div className="px-2 text-md text-white/35 uppercase tracking-wide font-medium">
            vs
          </div>

          <div className="flex-1 min-w-0 flex justify-end">
            <TeamBadge
              size={50}
              team={away}
              className="justify-end text-right"
            />
          </div>
        </div>
        {/* Optional note */}
        {f.note && (
          <p className="text-xs sm:text-sm mt-2 text-white/55 text-center">
            {f.note}
          </p>
        )}
      </div>
    </Link>
  );
}
