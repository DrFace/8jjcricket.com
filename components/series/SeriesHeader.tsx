import Image from "next/image";
import Link from "next/link";
import type { League, Season } from "@/lib/cricket-types";
import SeriesTabs, { SeriesTabId } from "./SeriesTabs";

export default function SeriesHeader({
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
    <div className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 px-6 py-4 shadow-2xl backdrop-blur-xl flex justify-between items-center">
      <div className="flex items-start gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-india-charcoal/60 border border-india-gold/30 rounded-full transition-all duration-300 hover:scale-110 group shadow-lg backdrop-blur-sm flex-shrink-0"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-india-gold group-hover:-translate-x-0.5 transition-transform"
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
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 india-header-text">
            {league.name}
          </h1>
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
      </div>

      <SeriesTabs activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
