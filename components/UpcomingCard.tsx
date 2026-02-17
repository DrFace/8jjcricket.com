"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import { Match } from "@/lib/cricket-types";

export default function UpcomingCard({ f }: { f: Match }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  const metaLine = f.round ?? "Match";
  const dateLine = formatDate(f.starting_at);

  return (
    <div className="relative group">
      {/* Base card with dark glassmorphism and visible border */}
      <div className="absolute inset-0 rounded-xl india-card-blue-glow group-hover:border-india-blue/60 group-hover:shadow-[0_0_20px_rgba(0,0,128,0.3)] transition-all" />

      {/* Subtle amber glow on hover (outside border only) */}
      <div
        className="
          pointer-events-none
          absolute -inset-px rounded-[18px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-india-blue/20 via-indigo-400/20 to-blue-500/20
          blur-md
        "
      />

      <div className="relative z-10 block rounded-xl px-2 sm:px-3 py-3 transition">
        {/* Top row: title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-india-gold transition-colors">
              {homeLabel} vs {awayLabel}
            </h3>

            <p className="text-xs text-india-gold mt-0.5">{metaLine}</p>

            <p className="text-[11px] text-gray-400 mt-0.5">{dateLine}</p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            {f.status && (
              <div className="text-[11px] text-india-gold/80">{f.status}</div>
            )}
          </div>

        </div>

        {/* Middle: badges + "vs" */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <TeamBadge team={home} className="justify-start" />
          </div>

          <div className="px-2 text-[11px] text-india-saffron uppercase tracking-wide font-semibold">
            vs
          </div>

          <div className="flex-1 min-w-0 flex justify-end">
            <TeamBadge team={away} className="justify-end text-right" />
          </div>
        </div>

        {/* Optional note */}
        {f.note && (
          <p className="text-xs sm:text-sm mt-2 text-gray-400 italic">{f.note}</p>
        )}
      </div>
    </div>
  );
}

