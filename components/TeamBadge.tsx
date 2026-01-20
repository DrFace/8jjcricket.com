"use client";

import { useState } from "react";
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
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn("items-center gap-2 min-w-0", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {logo && !imageError ? (
          <img
            alt={label}
            src={logo}
            className="w-full h-full object-contain rounded-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            style={{ fontSize: `${Math.max(8, size / 3)}px` }}
          >
            {label?.substring(0, 2).toUpperCase() || 'TM'}
          </div>
        )}
      </div>
      {!hideName && <span className="truncate">{label}</span>}
    </div>
  );
}
