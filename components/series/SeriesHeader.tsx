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
    <div className="rounded-3xl india-card-gradient p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-4 mb-4">
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
        <Link
          href={`/teams?league=${league.id}`}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black font-bold rounded-lg hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-xl flex-shrink-0"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="hidden sm:inline">Teams</span>
        </Link>
      </div>

      <SeriesTabs activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
}
