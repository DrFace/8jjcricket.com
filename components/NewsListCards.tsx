"use client";

import Link from "next/link";

type NewsItem = {
  id: number;
  slug: string;
  title: string;
  imgSrc: string;
  date?: string;
  excerpt: string | null;
};

export default function NewsListCards({ items }: { items: NewsItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((n) => (
        <Link
          key={n.id}
          href={`/news/${n.slug}`}
          className="group flex items-center gap-4 rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10
                     transition-all duration-500 shadow-md
                     hover:bg-white/10 hover:ring-white/15 hover:scale-[1.03] hover:rotate-y-2 hover:translate-z-10 hover:shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Thumbnail */}
          {/* ✅ SAFARI FIX: Added explicit w-[96px] — Safari does not infer flex-shrink-0
              element width from the child <img> like Chrome does, so without a width the
              thumbnail expands to fill all available space, hiding the text column. */}
          <div className="relative aspect-[21/9] w-48 flex-shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
            {/* Blurred background to fill empty space */}
            <img
              src={n.imgSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover blur-sm opacity-30 scale-110"
              aria-hidden="true"
            />
            {/* Full image */}
            <img
              src={n.imgSrc}
              alt={n.title}
              className="relative h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-white">
              {n.title}
            </p>
            <span className="mt-1 block text-xs text-white/60">
              {n.date ?? ""}
            </span>
            <p className="line-clamp-2 text-sm text-white/80">{n.excerpt}</p>
          </div>

          {/* Arrow hint */}
          <div className="shrink-0 text-amber-300 transition group-hover:text-white/55">
            →
          </div>
        </Link>
      ))}
    </div>
  );
}