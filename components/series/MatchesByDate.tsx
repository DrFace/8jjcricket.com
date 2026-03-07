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
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, matches]) => (
        <div key={date}>
          <div className="mb-4">
            <p className="text-sm font-bold text-india-gold uppercase tracking-wide">
              {date}
            </p>

            {liveMatches.some((m) => matches.includes(m)) && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                ● LIVE
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {matches.map((match) => (
              <ArchiveCard key={match.id} f={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
