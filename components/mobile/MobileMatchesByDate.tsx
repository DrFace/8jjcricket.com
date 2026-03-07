import type { Match } from "@/lib/cricket-types"; // or wherever your Match type is
import MobileSeriesDetailsCard from "./MobileSeriesDetailsCard";

export default function MobileMatchesByDate({
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
          <div className="px-4 py-3 mb-3 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <p className="text-sm font-bold text-amber-300 uppercase tracking-wide ">
              {date}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MobileSeriesDetailsCard key={match.id} f={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
