"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import TeamBadge from "@/components/TeamBadge";
import type { Fixture } from "@/types/fixture";

export default function MobileLiveCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  const metaLine = `${f.round ?? "Match"} · ${formatDate(f.starting_at)}`;

  return (
    <Link
      href={`/mobile/match/${f.id}`}
      className={cn(
        "p-[1px] rounded-2xl to-transparent",
        "hover:border-amber-300/30 hover:bg-white/7"
      )}
    >
      <div className="bg-[#0B0E14] rounded-2xl p-4 overflow-hidden">
        <div className="px-4 py-3">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {homeLabel} vs {awayLabel}
              </h3>

              <p className="mt-0.5 text-[11px] text-sky-100/60">{metaLine}</p>

              {f.status && (
                <p className="mt-0.5 text-[11px] text-sky-100/50">{f.status}</p>
              )}
            </div>

            <span
              className={cn(
                "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                f.live
                  ? "bg-red-500/15 text-red-200 border border-red-500/25"
                  : "bg-white/10 text-sky-100/70 border border-white/10"
              )}
            >
              {f.live ? "LIVE" : "SOON"}
            </span>
          </div>

          <div className="mt-2 h-px w-full bg-white/10" />

          {/* Teams row */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0 text-sky-100/90">
              <TeamBadge
                team={home}
                className="justify-start text-sky-100/90"
              />
            </div>

            <div className="px-2 text-[11px] text-sky-100/40 uppercase tracking-wide">
              vs
            </div>

            <div className="flex-1 min-w-0 flex justify-end text-sky-100/90">
              <TeamBadge
                team={away}
                className="justify-end text-right text-sky-100/90"
              />
            </div>
          </div>

          {f.note && <p className="mt-2 text-xs text-sky-100/70">{f.note}</p>}
        </div>
      </div>
    </Link>
  );
}
