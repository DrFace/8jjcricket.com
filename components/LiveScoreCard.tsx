"use client";

import Link from "next/link";
import { formatDate, cn } from "@/lib/utils";
import type { Fixture } from "@/types/fixture";
import { CalcRuns, ExtractTarget, ScoreLine } from "@/lib/match";

export default function LiveScoreCard({ f }: { f: Fixture }) {
  const home = f.localteam;
  const away = f.visitorteam;

  const homeLabel = (home as any)?.short_name || home?.name || "Team 1";
  const awayLabel = (away as any)?.short_name || away?.name || "Team 2";

  const metaLine = `${f.round ?? "Match"} · ${formatDate(f.starting_at)}`;

  const runsArr = Array.isArray((f as any).runs) ? (f as any).runs : [];

  const homeRuns = CalcRuns(runsArr, f.localteam_id);
  const awayRuns = CalcRuns(runsArr, f.visitorteam_id);

  const target = ExtractTarget(f.note);

  // ✅ Robust match id resolution for desktop live score navigation
  // Backend live payload typically includes fixture_id; desktop previously used sportmonks_id.
  const matchId =
    (f as any)?.sportmonks_id ??
    (f as any)?.fixture_id ??
    (f as any)?.id ??
    null;

  const href = matchId ? `/match/${matchId}` : "#";

  // Prevent navigation if id is missing (avoid /match/undefined)
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
        "border-2 border-amber-500/30 bg-slate-950/80 backdrop-blur-xl",
        "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:scale-105",
        !matchId && "opacity-70 cursor-not-allowed hover:scale-100",
      )}
      title={!matchId ? "Match id unavailable" : undefined}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative px-5 py-4">
          {/* Top Section - Title and Status Badges */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white truncate">
                {homeLabel} vs {awayLabel}
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">{metaLine}</p>
              {f.status && (
                <p className="text-xs text-amber-100/60 mt-0.5">{f.status}</p>
              )}
              {/* Optional debug line (remove if you don't want it) */}
              {/* <p className="text-[10px] text-amber-200/40 mt-1">id: {String(matchId)}</p> */}
            </div>

            <div className="flex flex-col gap-2 items-end">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider",
                  f.live
                    ? "bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40",
                )}
              >
                {f.live ? "● LIVE" : "UPCOMING"}
              </span>

              {target !== null && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider bg-amber-500/25 text-amber-200 border border-amber-400/60 shadow-[0_0_12px_rgba(251,146,60,0.2)]">
                  🎯 TARGET {target}
                </span>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-amber-500/20 via-amber-500/40 to-amber-500/20 my-3" />

          {/* Teams and Scores Section */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
            {/* Home Team */}
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                  {home?.image_path ? (
                    <img
                      src={home?.image_path}
                      alt={homeLabel}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        if (
                          e.currentTarget.src.includes(
                            "cricket-team-placeholder.png",
                          )
                        ) {
                          // Placeholder failed, show initials
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".fallback-badge")
                          ) {
                            const fallback = document.createElement("div");
                            fallback.className =
                              "fallback-badge w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg";
                            fallback.textContent =
                              homeLabel?.substring(0, 2).toUpperCase() || "TM";
                            parent.appendChild(fallback);
                          }
                        } else {
                          // Try placeholder image
                          e.currentTarget.src =
                            "/images/cricket-team-placeholder.png";
                        }
                      }}
                    />
                  ) : (
                    <img
                      src="/images/cricket-team-placeholder.png"
                      alt={homeLabel}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (
                          parent &&
                          !parent.querySelector(".fallback-badge")
                        ) {
                          const fallback = document.createElement("div");
                          fallback.className =
                            "fallback-badge w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg";
                          fallback.textContent =
                            homeLabel?.substring(0, 2).toUpperCase() || "TM";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  )}
                </div>
                <span className="font-semibold text-white text-sm">
                  {homeLabel}
                </span>
              </div>
              <p className="text-xl font-bold text-amber-300">
                {ScoreLine(homeRuns)}
              </p>
            </div>

            {/* Center VS */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-amber-300/60 font-bold uppercase tracking-wider">
                vs
              </span>
              <div className="w-1 h-1 rounded-full bg-amber-400" />
            </div>

            {/* Away Team */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="font-semibold text-white text-sm">
                  {awayLabel}
                </span>
                <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                  {away?.image_path ? (
                    <img
                      src={away?.image_path}
                      alt={awayLabel}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        if (
                          e.currentTarget.src.includes(
                            "cricket-team-placeholder.png",
                          )
                        ) {
                          // Placeholder failed, show initials
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (
                            parent &&
                            !parent.querySelector(".fallback-badge")
                          ) {
                            const fallback = document.createElement("div");
                            fallback.className =
                              "fallback-badge w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg";
                            fallback.textContent =
                              awayLabel?.substring(0, 2).toUpperCase() || "TM";
                            parent.appendChild(fallback);
                          }
                        } else {
                          // Try placeholder image
                          e.currentTarget.src =
                            "/images/cricket-team-placeholder.png";
                        }
                      }}
                    />
                  ) : (
                    <img
                      src="/images/cricket-team-placeholder.png"
                      alt={awayLabel}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (
                          parent &&
                          !parent.querySelector(".fallback-badge")
                        ) {
                          const fallback = document.createElement("div");
                          fallback.className =
                            "fallback-badge w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg";
                          fallback.textContent =
                            awayLabel?.substring(0, 2).toUpperCase() || "TM";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <p className="text-xl font-bold text-amber-300">
                {ScoreLine(awayRuns)}
              </p>
            </div>
          </div>

          {f.note && (
            <div className="mt-3 pt-3 border-t border-amber-500/20">
              <p className="text-xs text-amber-100/70">{f.note}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
