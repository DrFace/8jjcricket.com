"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BadgeTeam = {
  name?: string | null;
  short_name?: string | null;
  logo?: string | null;
  image_path?: string | null;
};

export default function MobileScoreBadge({
  team,
  className,
  hideName = false,
}: {
  team?: BadgeTeam;
  className?: string;
  hideName?: boolean;
}) {
  const label = team?.short_name || team?.name || "Team";
  const logo = team?.logo ?? team?.image_path ?? null;

  return (
    <div className={cn("", className)}>
      {/* Logo */}
      <div
        className="
          relative
          h-12 sm:h-14
          aspect-[4/3]
          rounded-lg sm:rounded-xl
          overflow-hidden
          bg-white/10
          shadow-lg
          ring-1 ring-white/10
        "
      >
        {logo && (
          <Image alt={label} src={logo} fill className="object-contain" />
        )}
      </div>

      {/* Name */}
      {!hideName && (
        <div
          className="
            text-[12px]
            font-semibold
            text-white
            truncate
            max-w-[90px]
            text-center
            mt-2
          "
        >
          {label}
        </div>
      )}
    </div>
  );
}
