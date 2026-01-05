"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BadgeTeam = {
  name?: string | null;
  short_name?: string | null;
  logo?: string | null;
  image_path?: string | null;
};

export default function TeamBadge({
  team,
  size = 28,
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
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {logo ? (
          <Image
            alt={label}
            src={logo}
            fill
            sizes={`${size}px`}
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
      {!hideName && <span className="truncate">{label}</span>}
    </div>
  );
}
