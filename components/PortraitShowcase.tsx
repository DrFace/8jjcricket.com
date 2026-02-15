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
      p.portrait_image_path,
    ),
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const len = items.length;
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (index >= len) setIndex(0);
  }, [index, len]);

  // Progress bar animation
  useEffect(() => {
    if (len <= 1) return;
    
    setProgress(0);
    const startTime = Date.now();
    const duration = 4000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        progressRef.current = setTimeout(updateProgress, 16);
      }
    };

    updateProgress();

    return () => {
      if (progressRef.current) {
        clearTimeout(progressRef.current);
      }
    };
  }, [index, len]);

  // Auto-play functionality
  useEffect(() => {
    if (len <= 1) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % len);
      }, 4000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [len]);

  const canGo = len > 1;

  const prev = useCallback(() => {
    if (!len || isTransitioning) return;
    setIsTransitioning(true);
    setIndex((i) => (i - 1 + len) % len);
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % len);
      }, 4000);
    }
    
    setTimeout(() => setIsTransitioning(false), 700);
  }, [len, isTransitioning]);

  const next = useCallback(() => {
    if (!len || isTransitioning) return;
    setIsTransitioning(true);
    setIndex((i) => (i + 1) % len);
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % len);
      }, 4000);
    }
    
    setTimeout(() => setIsTransitioning(false), 700);
  }, [len, isTransitioning]);

  const goToSlide = useCallback((slideIndex: number) => {
    if (isTransitioning || slideIndex === index) return;
    setIsTransitioning(true);
    setIndex(slideIndex);
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % len);
      }, 4000);
    }
    
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning, index, len]);

  if (!len) return null;

  return (
    <div className="group/carousel relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Sliding container - FIXED: Use proper flex layout */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {items.map((item, idx) => {
          const isActive = idx === index;
          const isPrev = idx === (index - 1 + len) % len;
          const isNext = idx === (index + 1) % len;
          
          return (
            <div
              key={idx}
              className="relative h-full w-full flex-shrink-0"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 block group/slide"
                title={item.title}
              >
                {/* Image with parallax effect */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className={`h-full w-full object-cover object-center transition-all duration-700 ${
                      isActive ? "scale-100" : "scale-105"
                    } group-hover/slide:scale-105`}
                    draggable={false}
                  />
                </div>
                
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-0 transition-opacity duration-500 group-hover/slide:opacity-100" />
                
                {/* Title overlay with animation - only visible on hover */}
                <div className={`pointer-events-none absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-700 ${
                  isActive ? "translate-y-0" : "translate-y-4"
                } opacity-0 group-hover/carousel:opacity-100`}>
                  <h3 className="text-3xl font-bold drop-shadow-2xl mb-2 transform transition-transform duration-500 group-hover/slide:translate-x-2">
                    {item.title}
                  </h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform transition-all duration-500 group-hover/slide:w-32" />
                </div>
              </a>
            </div>
          );
        })}
      </div>

      {/* Enhanced Prev / Next buttons */}
      <div className="absolute inset-y-0 left-6 z-20 flex items-center opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prev();
          }}
          disabled={!canGo}
          className={`group relative h-16 w-16 overflow-hidden rounded-full transition-all duration-300 ${
            canGo
              ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-110 active:scale-95"
              : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
          }`}
          type="button"
          aria-label="Previous slide"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <svg
            className="absolute inset-0 m-auto h-8 w-8 text-white transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="absolute inset-y-0 right-6 z-20 flex items-center opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            next();
          }}
          disabled={!canGo}
          className={`group relative h-16 w-16 overflow-hidden rounded-full transition-all duration-300 ${
            canGo
              ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-110 active:scale-95"
              : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
          }`}
          type="button"
          aria-label="Next slide"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          <svg
            className="absolute inset-0 m-auto h-8 w-8 text-white transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Enhanced dot indicators - only visible on hover */}
      {len > 1 && (
        <div className="absolute top-6 left-1/2 z-20 flex -translate-x-1/2 gap-3 rounded-full bg-black/40 px-4 py-3 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={`relative h-2.5 rounded-full transition-all duration-300 ${
                idx === index
                  ? "w-10 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"
                  : "w-2.5 bg-white/40 hover:bg-white/70 hover:w-4"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === index && (
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Decorative corner accents */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-br-full" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full" />
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
        const isHttp =
          p.slug.startsWith("http://") || p.slug.startsWith("https://");
        if (!src) return null;
        return {
          src,
          href: isHttp ? p.slug : `/portraits/${p.slug}`,
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
    pageIndex * PAGE_SIZE + PAGE_SIZE,
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
                const isHttp =
                  p.slug.startsWith("http://") || p.slug.startsWith("https://");

                return (
                  <a
                    key={p.id}
                    href={isHttp ? p.slug : `/portraits/${p.slug}`}
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
