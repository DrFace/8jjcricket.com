"use client";

import Link from "next/link";

type NewsItem = {
  id: number;
  slug: string;
  title: string;
  imgSrc: string;
  date?: string;
};

export default function MobileNewsListCards({ items }: { items: NewsItem[] }) {
  return (
    <div className="">
      {items.map((n) => (
        <Link
          key={n.id}
          href={`mobile/news/${n.slug}`}
          className="group my-5 flex w-full flex-shrink-0 flex-col md:flex-row gap-3
                    rounded-3xl overflow-hidden
                    bg-gradient-to-b from-[#1b2230] via-[#141a26] to-[#0c111b]
                    ring-1 ring-white/10 shadow-xl
                    transition hover:from-[#20293a] hover:to-[#0f1625]"
        >
          {/* Thumbnail */}
          <div className="relative w-full flex-shrink-0 overflow-hidden rounded-lg bg-black/40 rounded-2xl">
            <img
              src={n.imgSrc}
              alt={n.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-col justify-between p-3">
            <p className="line-clamp-2 text-sm font-semibold text-white">
              {n.title}
            </p>
            <p className="mt-1 text-xs text-amber-300">
              {n.date ? new Date(n.date).toLocaleDateString() : ""}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
