"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import type { Fixture } from "@/types/fixture";

export default function SeriesDetailsCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  const metaLine = f.round ?? "Match";
  const dateLine = formatDate(f.starting_at);

  return (
    <div className="relative group w-80 ">
      {/* Base card with dark glassmorphism and visible border */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/20 bg-slate-900/80 backdrop-blur-sm shadow-xl group-hover:border-amber-400/60 group-hover:shadow-2xl transition-all" />

      {/* Subtle amber glow on hover (outside border only) */}
      <div
        className="
          pointer-events-none
          absolute -inset-px rounded-[18px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-orange-500/20
          blur-md
        "
      />

      <Link
        href={`match/${f.id}`}
        className="relative z-10 block rounded-xl px-2 sm:px-3 py-3 transition"
      >
        {/* Top row: title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {homeLabel} vs {awayLabel}
            </h3>

            <p className="text-xs text-amber-200 mt-0.5">{metaLine}</p>

            <p className="text-[11px] text-sky-100/70 mt-0.5">{dateLine}</p>
          </div>

          <div className="text-right flex flex-col items-end gap-1">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                f.live
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}
            >
              {f.live ? "LIVE" : "Finished"}
            </span>

            {f.status && (
              <div className="text-[11px] text-amber-200/80">{f.status}</div>
            )}
          </div>
        </div>

        {/* Middle: badges + "vs" */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <TeamBadge team={home} className="justify-start" />
          </div>

          <div className="px-2 text-[11px] text-amber-300 uppercase tracking-wide font-semibold">
            vs
          </div>

          <div className="flex-1 min-w-0 flex justify-end">
            <TeamBadge team={away} className="justify-end text-right" />
          </div>
        </div>

        {/* Optional note */}
        {f.note && (
          <p className="text-xs sm:text-sm mt-2 text-sky-100/80">{f.note}</p>
        )}
      </Link>
    </div>
  );
}
