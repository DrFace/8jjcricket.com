"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import IconButton from "./ui/IconButton";
import { ChevronUp, ChevronDown } from "lucide-react";

export type PortraitItem = {
  id: number;
  slug: string;
  image_url: string;
};

type Props = {
  portraits: PortraitItem[];
  onPortraitHover?: (portraitId: number) => void;
};

export default function PortraitPager({ portraits, onPortraitHover }: Props) {
  const pageSize = 4;
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(portraits.length / pageSize));

  const visible = useMemo(() => {
    const start = page * pageSize;
    return portraits.slice(start, start + pageSize);
  }, [page, portraits]);

  const canUp = page > 0;
  const canDown = page < totalPages - 1;

  return (
    <div className="relative h-full">
      {/* arrows */}
      {portraits.length > pageSize && (
        <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-2">
          <IconButton
            onClick={() => canUp && setPage((p) => p - 1)}
            disabled={!canUp}
            ariaLabel="Previous section"
            size="sm"
            icon={<ChevronUp size={14} />}
            className="h-7 w-7"
          />

          <IconButton
            onClick={() => canDown && setPage((p) => p + 1)}
            disabled={!canDown}
            ariaLabel="Next section"
            size="sm"
            icon={<ChevronDown size={14} />}
            className="h-7 w-7"
          />
        </div>
      )}

      {/* portraits */}
      <div className="grid h-full grid-cols-4 gap-4 pr-10">
        {visible.map((p) => (
          <Link
            key={p.id}
            href={`/portraits/${encodeURIComponent(p.slug)}`}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => onPortraitHover?.(p.id)}
            className="group relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.image_url})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </Link>
        ))}
      </div>
    </div>
  );
}
