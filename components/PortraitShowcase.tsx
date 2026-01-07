"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PortraitPage = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  hero_image_path?: string | null;
  hero_image_url?: string | null;
  hover_banner_path?: string | null;
  hover_banner_url?: string | null;
  main_portrait_path?: string | null;
  main_portrait_url?: string | null;
  portrait_image_path?: string | null;
  portrait_image_url?: string | null;
};

// IMPORTANT:
// Use NEXT_PUBLIC_BACKEND_BASE as the site origin (NO /api)
const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_BACKEND_BASE ||
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://8jjcricket.com")
).replace(/\/+$/, "");

const DEFAULT_LEFT_IMAGE = "/AMD.png";

function pickFirst<T>(...vals: (T | null | undefined)[]) {
  for (const v of vals) {
    if (v !== null && v !== undefined && String(v).trim() !== "") return v;
  }
  return null;
}

function toStorageUrl(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null;

  // If backend returns absolute URLs, keep them
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  // Otherwise treat as a storage path
  const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");
  return `${SITE_ORIGIN}/storage/${clean}`;
}

function getHero(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.hero_image_url, p.hero_image_path));
}
function getHover(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.hover_banner_url, p.hover_banner_path));
}
function getMainPortrait(p: PortraitPage) {
  return toStorageUrl(
    pickFirst(
      p.main_portrait_url,
      p.main_portrait_path,
      p.portrait_image_url,
      p.portrait_image_path
    )
  );
}

// THIS is what you requested for the slideshow:
function getPortraitImage(p: PortraitPage) {
  return toStorageUrl(pickFirst(p.portrait_image_url, p.portrait_image_path));
}

function PortraitSlideshow({
  items,
}: {
  items: { src: string; href: string; title: string }[];
}) {
  const [index, setIndex] = useState(0);
  const len = items.length;

  useEffect(() => {
    if (index >= len) setIndex(0);
  }, [index, len]);

  const canGo = len > 1;

  const prev = useCallback(() => {
    if (!len) return;
    setIndex((i) => (i - 1 + len) % len);
  }, [len]);

  const next = useCallback(() => {
    if (!len) return;
    setIndex((i) => (i + 1) % len);
  }, [len]);

  if (!len) return null;

  const active = items[index];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
      {/* Click opens in NEW TAB to relevant portrait page */}
      <a
        href={active.href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 block"
        title={active.title}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.src}
          alt={active.title}
          className="h-full w-full object-cover object-center transition-opacity duration-500"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </a>

      {/* Prev / Next buttons */}
      <div className="absolute inset-y-0 left-4 z-20 flex items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prev();
          }}
          disabled={!canGo}
          className={`group relative h-12 w-12 overflow-hidden rounded-2xl transition-all duration-300 ${
            canGo
              ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
              : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
          }`}
          type="button"
          aria-label="Previous slide"
        >
          <svg
            className="absolute inset-0 m-auto h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-4 z-20 flex items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            next();
          }}
          disabled={!canGo}
          className={`group relative h-12 w-12 overflow-hidden rounded-2xl transition-all duration-300 ${
            canGo
              ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
              : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
          }`}
          type="button"
          aria-label="Next slide"
        >
          <svg
            className="absolute inset-0 m-auto h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* small counter */}
      {len > 1 && (
        <div className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-xl bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
          {index + 1} / {len}
        </div>
      )}
    </div>
  );
}

export default function PortraitShowcase({ pages }: { pages: PortraitPage[] }) {
 const cleanPages = useMemo(() => {
   return [...(pages || [])]
     .filter((p) => !!p?.slug && !!p?.title)
     .sort((a, b) => {
       const aId = typeof a?.id === "number" ? a.id : Number(a?.id ?? 0);
       const bId = typeof b?.id === "number" ? b.id : Number(b?.id ?? 0);
       return aId - bId; // ASC: 0,1,2...
     });
 }, [pages]);


  const [activeLeftUrl, setActiveLeftUrl] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const leftImage = activeLeftUrl || DEFAULT_LEFT_IMAGE;

  // Slideshow: use ONLY portrait_image_path / portrait_image_url (as requested)
  const slideshowItems = useMemo(() => {
    const items = cleanPages
      .map((p) => {
        const src = getPortraitImage(p);
        if (!src) return null;
        return {
          src,
          href: `/portraits/${p.slug}`,
          title: p.title,
        };
      })
      .filter(Boolean) as { src: string; href: string; title: string }[];

    return items;
  }, [cleanPages]);

  const onPortraitHover = useCallback((p: PortraitPage) => {
    const hoverImg = getHover(p) || getHero(p) || getMainPortrait(p);
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
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem]" />

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

        <div className="relative ml-[46%] flex h-full flex-col gap-7 p-8 pt-16">
          {/* TOP: Replace BannerCarouselNew with portrait_image_path slideshow + buttons */}
          <div className="group relative h-[40%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20 transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/30">
            <PortraitSlideshow items={slideshowItems} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <div className="relative h-[45%] overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/30 to-slate-900/30 shadow-xl ring-1 ring-white/10 backdrop-blur-sm mt-8 bg-white-500">
            <div className="grid h-full grid-cols-4 gap-2 p-6 pr-24 bg-white-500 w-full">
              {visiblePages.map((p) => {
                const thumb = getMainPortrait(p) || getHero(p) || getHover(p);
                const isHovered = hoveredId === p.id;

                return (
                  <a
                    key={p.id}
                    href={`/portraits/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative h-full w-full max-w-[460px] mx-auto overflow-hidden rounded-[1.75rem]  shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-blue-500/30"
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </a>
                );
              })}
            </div>

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
                <svg
                  className="absolute inset-0 m-auto h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              <button
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
                disabled={!canNext}
                className={`group relative h-14 w-14 overflow-hidden rounded-2xl transition-all duration-300 ${
                  canNext
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
                    : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
                }`}
                type="button"
                aria-label="Next"
              >
                <svg
                  className="absolute inset-0 m-auto h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-blue-500/0 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-purple-500/0 blur-[100px]" />
      </div>
    </section>
  );
}
