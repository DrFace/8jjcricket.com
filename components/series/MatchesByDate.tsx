import ArchiveCard from "@/components/ArchhiveCard";
import type { Match } from "@/lib/cricket-types"; // or wherever your Match type is

export default function MatchesByDate({
  grouped,
  liveMatches,
}: {
  grouped: Record<string, Match[]>;
  liveMatches: Match[];
}) {
  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, matches]) => (
        <div key={date}>
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-amber-400/30 px-4 py-3 mb-3 rounded-xl flex items-center justify-between backdrop-blur-sm">
            <p className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              {date}
            </p>

            {liveMatches.some((m) => matches.includes(m)) && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                ● LIVE
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <ArchiveCard key={match.id} f={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
