"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BadgeTeam = {
  name?: string | null;
  short_name?: string | null;
  logo?: string | null;
  image_path?: string | null;
};

export default function ScoreTeamBadge({
  team,
  className,
}: {
  team?: BadgeTeam;
  className?: string;
}) {
  const label = team?.short_name || team?.name || "Team";
  const logo = team?.logo ?? team?.image_path ?? null;

  return (
    <div className={cn("items-center gap-2 min-w-0", className)}>
      <div
        className="relative shrink-0 rounded-2xl"
        style={{ width: 100, height: 80 }}
      >
        {logo ? (
          <Image
            alt={label}
            src={logo}
            fill
            className="object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
