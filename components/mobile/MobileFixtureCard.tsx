import { formatDate } from "@/lib/utils";
import type { Fixture } from "@/types/fixture";
import TeamBadge from "../TeamBadge";

function getRelativeStart(starting_at: string) {
  const start = new Date(starting_at);
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (Number.isNaN(diffMinutes)) return "";

  if (diffMinutes <= -60) {
    const hoursAgo = Math.abs(Math.round(diffMinutes / 60));
    return `${hoursAgo}h ago`;
  }

  if (diffMinutes < 0) {
    return "Started";
  }

  if (diffMinutes < 60) {
    return `Starts in ${diffMinutes}m`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  if (hours < 24) {
    return `Starts in ${hours}h${mins ? ` ${mins}m` : ""}`;
  }

  const days = Math.floor(hours / 24);
  return `Starts in ${days}d`;
}

export default function MobileFixtureCard({ f }: { f: Fixture }) {
  if (!f) return null;
  const home = f.localteam;
  const away = f.visitorteam;
  const relative = getRelativeStart(f.starting_at);

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-[#FFD100]/50 to-transparent hover:shadow-lg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/80 via-blue-400/60 to-blue-500/80 opacity-75 group-hover:opacity-100" />
      <div className="bg-[#0B0E14] rounded-2xl p-4 overflow-hidden">
        <div className="relative space-y-3 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-tight">
                {home?.short_name || home?.name || `Team ${f.localteam_id}`}{" "}
                <span className="mx-1 text-xs font-normal text-gray-500">
                  vs
                </span>
                {away?.short_name || away?.name || `Team ${f.visitorteam_id}`}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {f.round ?? "Match"} · {formatDate(f.starting_at)}
              </p>
            </div>

            {relative && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800/70 dark:text-gray-200">
                {relative}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 items-center gap-2">
            <TeamBadge team={home} className="col-span-2" />
            <div className="text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
              vs
            </div>
            <TeamBadge
              team={away}
              className="col-span-2 justify-self-end text-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
