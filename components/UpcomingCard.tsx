"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import { Match } from "@/lib/cricket-types";

export default function UpcomingCard({ f }: { f: Match }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = home?.short_name || home?.name || `Team ${f.localteam_id}`;
  const awayLabel =
    away?.short_name || away?.name || `Team ${f.visitorteam_id}`;

  const metaLine = `${f.round ?? "Match"} · ${formatDate(f.starting_at)}`;

  const matchId =
    (f as any)?.sportmonks_id ??
    (f as any)?.fixture_id ??
    (f as any)?.id ??
    null;

  const href = matchId ? `/match/${matchId}` : "#";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!matchId) e.preventDefault();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-disabled={!matchId}
      className={cn(
        "group block rounded-2xl transition-all duration-300",
        "india-card-gold-glow",
        "hover:scale-[1.02]",
        !matchId && "opacity-70 cursor-not-allowed hover:scale-100",
      )}
      title={!matchId ? "Match id unavailable" : undefined}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-india-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative px-5 py-4">
          {/* Top Section - Title and Status Badges */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate group-hover:text-india-gold transition-colors">
                {homeLabel} vs {awayLabel}
              </h3>
              <p className="text-xs text-india-gold/70 mt-1">{metaLine}</p>
              {f.status && (
                <p className="text-xs text-india-saffron/80 mt-0.5">
                  {f.status}
                </p>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-india-gold/20 via-india-gold/40 to-india-gold/20 my-3" />

          {/* Teams Section */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            {/* Home Team */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 bg-white/5 ring-1 ring-white/10">
                  <img
                    src={home?.image_path || home?.logo || "/images/cricket-team-placeholder.png"}
                    alt={homeLabel}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/cricket-team-placeholder.png";
                    }}
                  />
                </div>
                <span className="font-semibold text-white text-sm truncate max-w-[100px] sm:max-w-none">
                  {homeLabel}
                </span>
              </div>
            </div>

            {/* Center VS */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-india-gold/60 font-bold uppercase tracking-wider">
                vs
              </span>
              <div className="w-1 h-1 rounded-full bg-india-saffron/80" />
            </div>

            {/* Away Team */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="font-semibold text-white text-sm truncate max-w-[100px] sm:max-w-none">
                  {awayLabel}
                </span>
                <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 bg-white/5 ring-1 ring-white/10">
                  <img
                    src={away?.image_path || away?.logo || "/images/cricket-team-placeholder.png"}
                    alt={awayLabel}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/cricket-team-placeholder.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {f.note && (
            <div className="mt-3 pt-3 border-t border-india-gold/20">
              <p className="text-xs text-india-gold/70 italic">{f.note}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
