"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  id: number;
  fullname: string;
  position?: string | null;
  country?: string | null;
  image_path?: string | null;
};

export default function PlayerCard({
  id,
  fullname,
  position,
  country,
  image_path,
}: Props) {
  return (
    <Link
      href={`/players/${id}`}
      className="group block rounded-2xl india-card-gradient p-4 shadow-xl backdrop-blur-xl transition hover:border-india-gold hover:shadow-india-gold/30 hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-india-gold/20 bg-slate-900">
          {image_path ? (
            <Image
              src={image_path}
              alt={fullname}
              fill
              className="object-contain"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-sky-100/70">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-lg font-bold text-white group-hover:text-india-gold transition-colors drop-shadow">
            {fullname}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-sky-100/90">
            {position && (
              <span className="rounded-full bg-slate-800/70 px-2 py-0.5 text-india-gold font-semibold uppercase tracking-wide text-xs">
                {position}
              </span>
            )}
            {country && <span className="truncate text-xs text-slate-300">{country}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
