import Image from "next/image";
import Link from "next/link";
import type { League, Season } from "@/lib/cricket-types";
import SeriesTabs, { SeriesTabId } from "./SeriesTabs";

export default function MobileSeriesHeader({
  league,
  currentSeason,
  dateRange,
  activeTab,
  onTabChange,
}: {
  league: League;
  currentSeason?: Season;
  dateRange: string;
  activeTab: SeriesTabId;
  onTabChange: (id: SeriesTabId) => void;
}) {
  return (
    <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-4 mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-amber-950/60 border border-amber-400/30 rounded-full transition-all duration-300 hover:scale-110 group shadow-lg backdrop-blur-sm flex-shrink-0"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-amber-300 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {league.image_path && (
          <Image
            src={league.image_path}
            alt={league.name}
            width={60}
            height={60}
            className="object-contain"
          />
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {league.code}
        </h1>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 text-sm text-sky-100/80">
          {currentSeason && (
            <>
              <span>{currentSeason.name}</span>
              <span>•</span>
            </>
          )}
          <span>{dateRange}</span>
        </div>
      </div>

      <SeriesTabs activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
