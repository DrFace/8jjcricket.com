"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PortraitPage = {
  id: number;
  slug: string;
  title: string;
  portrait_image_path?: string | null;
  portrait_image_url?: string | null;
};

const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://8jjcricket.com")
).replace(/\/+$/, "");

function pickFirst<T>(...vals: (T | null | undefined)[]) {
  for (const v of vals) {
    if (v !== null && v !== undefined && String(v).trim() !== "") return v;
  }
  return null;
}

function toStorageUrl(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");
  return `${SITE_ORIGIN}/storage/${clean}`;
}

function getPortraitImage(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.portrait_image_url, p.portrait_image_path));
}

function BannerSlideshow({
  items,
}: {
  items: { src: string; href: string; title: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const len = items.length;

  useEffect(() => {
    if (!autoPlay || len <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % len), 4000);
    return () => clearInterval(t);
  }, [autoPlay, len]);

  const prev = useCallback(() => {
    if (!len) return;
    setAutoPlay(false);
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const next = useCallback(() => {
    if (!len) return;
    setAutoPlay(false);
    setIndex((i) => (i + 1) % len);
  }, [len]);

  const goTo = useCallback((i: number) => {
    setAutoPlay(false);
    setIndex(i);
  }, []);

  if (!len) return null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl p-0 m-0">
      {/* SLIDES */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out adsdas p-0 m-0"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-full w-full flex-shrink-0 block p-0 m-0"
            onClick={() => setAutoPlay(false)}
            title={item.title}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.title}
              className="h-full w-full object-cover p-0 m-0"
              draggable={false}
            />
          </Link>
        ))}
      </div>

      {/* ARROWS */}
      {len > 1 && (
        <>
          <button
            aria-label="previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur border border-white/20 grid place-items-center active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            aria-label="next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur border border-white/20 grid place-items-center active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default function MobilePortraitShowcase({
  pages,
}: {
  pages: PortraitPage[];
}) {
  const cleanPages = useMemo(() => {
    return [...(pages || [])]
      .filter((p) => p?.slug && p?.title)
      .sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0));
  }, [pages]);

  const items = useMemo(() => {
    return cleanPages
      .map((p) => {
        const src = getPortraitImage(p);
        const isHttp =
          p.slug.startsWith("http://") || p.slug.startsWith("https://");
        if (!src) return null;
        return {
          src,
          href: isHttp ? p.slug : `/mobile/portraits/${p.slug}`,
          title: p.title,
        };
      })
      .filter(Boolean) as { src: string; href: string; title: string }[];
  }, [cleanPages]);

  if (!items.length) return null;

  return (
    // ✅ IMPORTANT: this section DOES NOT force height.
    // Your "main card" should set the height.
    <section className="p-0 m-0">
      <div className="p-0 m-0">
        {/* ✅ THIS DIV MUST BE YOUR MAIN CARD CONTAINER (already has height in your layout) */}
        <div className="p-0 m-0">
          {/* ✅ SLIDER FILLS MAIN CARD */}
          <BannerSlideshow items={items} />
        </div>
      </div>
    </section>
  );
}
