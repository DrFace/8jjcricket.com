"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BadgeTeam = {
  name?: string | null;
  short_name?: string | null;
  logo?: string | null;
  image_path?: string | null;
};

export default function MobileTeamBadge({
  team,
  size = 55,
  className,
  hideName = false,
}: {
  team?: BadgeTeam;
  size?: number;
  className?: string;
  hideName?: boolean;
}) {
  const label = team?.short_name || team?.name || "Team";
  const logo = team?.logo ?? team?.image_path ?? null;

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className="relative shrink-0 rounded-2xl"
        style={{ width: 80, height: size }}
      >
        {logo ? (
          <Image
            alt={label}
            src={logo || "/placeholder.svg"}
            fill
            className="object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl" />
        )}
      </div>
      {!hideName && (
        <div className="text-sm font-semibold text-slate-200 mt-1 text-center">
          {label?.split(" ")[0]}
        </div>
      )}
    </div>
  );
}
