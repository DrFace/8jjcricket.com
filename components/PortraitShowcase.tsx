"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ImageCarousel from "./ImageCarousel"; // Your new carousel component

type PortraitPage = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  main_portrait_path?: string | null;
  main_portrait_url?: string | null;
  portrait_image_path?: string | null;
  portrait_image_url?: string | null;
};

const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (typeof window !== "undefined" ? window.location.origin : "https://8jjcricket.com")
).replace(/\/+$/, "");

const DEFAULT_LEFT_IMAGE = "/AMD.png";

// Utility to pick first non-empty value
function pickFirst<T>(...vals: (T | null | undefined)[]) {
  for (const v of vals) {
    if (v !== null && v !== undefined && String(v).trim() !== "") return v;
  }
  return null;
}

// Convert path or URL to full URL
function toStorageUrl(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");
  return `${SITE_ORIGIN}/storage/${clean}`;
}

// For thumbnails and hover images
function getMainPortrait(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.main_portrait_url, p.main_portrait_path));
}

// **Only for the ImageCarousel**
function getCarouselPortrait(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.portrait_image_url, p.portrait_image_path));
}

export default function PortraitShowcase({ pages }: { pages: PortraitPage[] }) {
  const cleanPages = useMemo(
    () => (pages || []).filter((p) => !!p?.slug && !!p?.title),
    [pages]
  );

  const [activeLeftUrl, setActiveLeftUrl] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const leftImage = activeLeftUrl || DEFAULT_LEFT_IMAGE;

  //Carousel uses portrait_image_path / portrait_image_url
  const carouselItems = useMemo(() => {
    return cleanPages
      .map((p) => {
        const src = getCarouselPortrait(p);
        if (!src) return null;
        return {
          src,
          href: `/portraits/${p.slug}`,
          title: p.title,
        };
      })
      .filter(Boolean) as { src: string; href: string; title?: string }[];
  }, [cleanPages]);

  const onPortraitHover = useCallback((p: PortraitPage) => {
    const hoverImg = getMainPortrait(p); // still uses main portrait for hover
    if (hoverImg) {
      setActiveLeftUrl(hoverImg);
      setHoveredId(p.id);
    }
  }, []);

  const onPortraitLeave = useCallback(() => {
    setActiveLeftUrl(null);
    setHoveredId(null);
  }, []);

  const PAGE_SIZE = 4;
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.max(1, Math.ceil(cleanPages.length / PAGE_SIZE));
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;
  const visiblePages = cleanPages.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  const lockScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = lockScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => e.preventDefault();
    const onTouchMove = (e: TouchEvent) => e.preventDefault();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel as any);
      el.removeEventListener("touchmove", onTouchMove as any);
    };
  }, []);

  if (!cleanPages.length) return null;

  return (
    <section className="w-full px-6 py-8">
      <div
        ref={lockScrollRef}
        className="relative mx-auto h-[85vh] min-h-[700px] w-full max-w-[1600px]"
      >
        {/* Left Hover Image */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] overflow-hidden rounded-l-[2.5rem]">
          <div
            className="absolute inset-0 bg-contain bg-left-bottom bg-no-repeat transition-all duration-700"
            style={{
              backgroundImage: `url(${leftImage})`,
              filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.18))",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, transparent 94%, rgba(0,0,0,0.06) 100%)",
            }}
          />
        </div>

        {/* Right side: carousel + thumbnails */}
        <div className="relative ml-[46%] flex h-full flex-col gap-7 p-8 pt-16">
          {/* Carousel */}
          <div className="group relative h-[50%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20 transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/30">
            <ImageCarousel items={carouselItems} interval={2000} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Thumbnails */}
          <div className="relative h-[45%] overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/30 to-slate-900/30 shadow-xl ring-1 ring-white/10 backdrop-blur-sm mt-8">
            <div className="grid h-full grid-cols-4 gap-2 p-6 pr-24 w-full">
              {visiblePages.map((p) => {
                const thumb = getMainPortrait(p); // still main portrait
                const isHovered = hoveredId === p.id;

                return (
                  <a
                    key={p.id}
                    href={`/portraits/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative h-full w-full max-w-[460px] mx-auto overflow-hidden rounded-[1.75rem] shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-blue-500/30"
                    onMouseEnter={() => onPortraitHover(p)}
                    onMouseLeave={onPortraitLeave}
                    title={p.title}
                  >
                    <div
                      className={`w-full pointer-events-none absolute inset-0 rounded-[1.75rem] transition-all duration-500 ${
                        isHovered
                          ? "ring-[3px] ring-blue-400/70 shadow-lg shadow-blue-400/40"
                          : "ring-1 ring-black/5"
                      }`}
                    />
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Pagination Buttons */}
            <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-4">
              <button
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={!canPrev}
                className={`group relative h-14 w-14 overflow-hidden rounded-2xl transition-all duration-300 ${
                  canPrev
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
                    : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
                }`}
                type="button"
                aria-label="Previous"
              >
                <svg className="absolute inset-0 m-auto h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              <button
                onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                disabled={!canNext}
                className={`group relative h-14 w-14 overflow-hidden rounded-2xl transition-all duration-300 ${
                  canNext
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
                    : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
                }`}
                type="button"
                aria-label="Next"
              >
                <svg className="absolute inset-0 m-auto h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
