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

const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://72.60.107.98:8001"
).replace(/\/+$/, "");

function pickFirst<T>(...vals: (T | null | undefined)[]) {
  for (const v of vals)
    if (v !== null && v !== undefined && String(v).trim() !== "") return v;
  return null;
}

function toStorageUrl(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const clean = String(pathOrUrl).replaceAll("\\", "/").replace(/^\/+/, "");
  return `${BACKEND_ORIGIN}/storage/${clean}`;
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

function Slideshow({ items }: { items: { src: string }[] }) {
  const len = items.length;
  const step = 100 / len;
  const holdRatio = 0.85;
  const segment = 100 / len;
  const hold = segment * holdRatio;
  const animName = `showcaseSlide_${len}`;

  const keyframes = (() => {
    if (len <= 1) return "";
    let css = `@keyframes ${animName} {`;
    for (let i = 0; i < len; i++) {
      const t0 = i * segment;
      const tHold = t0 + hold;
      css += `
        ${t0.toFixed(4)}% { transform: translateX(-${(i * step).toFixed(6)}%); }
        ${tHold.toFixed(4)}% { transform: translateX(-${(i * step).toFixed(6)}%); }
      `;
      if (i < len - 1) {
        const tNext = (i + 1) * segment;
        css += `${tNext.toFixed(4)}% { transform: translateX(-${(
          (i + 1) * step
        ).toFixed(6)}%); }`;
      }
    }
    css += `100% { transform: translateX(0%); }}`;
    return css;
  })();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          width: `${len * 100}%`,
          animation:
            len > 1 ? `${animName} ${len * 6}s ease-in-out infinite` : undefined,
        }}
      >
        {items.map((it, idx) => (
          <div
            key={idx}
            className="relative h-full"
            style={{ width: `${100 / len}%` }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
              style={{ backgroundImage: `url(${it.src})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ))}
      </div>
      {keyframes && <style dangerouslySetInnerHTML={{ __html: keyframes }} />}
    </div>
  );
}

export default function PortraitShowcase({ pages }: { pages: PortraitPage[] }) {
  const cleanPages = useMemo(
    () => (pages || []).filter((p) => !!p?.slug && !!p?.title),
    [pages]
  );

  const defaultBig = useMemo(() => {
    const first = cleanPages[0];
    if (!first) return null;
    return getHero(first) || getHover(first) || getMainPortrait(first);
  }, [cleanPages]);

  const [activeLeftUrl, setActiveLeftUrl] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const leftImage = activeLeftUrl || defaultBig || "/AMD.png";

  const slideshowItems = useMemo(() => {
    const items = cleanPages
      .map((p) => getHero(p) || getHover(p) || getMainPortrait(p))
      .filter(Boolean)
      .map((src) => ({ src: String(src) }));
    return items.length ? items : [];
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

  // ✅ STOP page from scrolling while cursor is over this showcase
  const lockScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = lockScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

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
        {/* ✅ Removed main card background (only keep a subtle outline if you want) */}
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10" />

        {/* LEFT */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] overflow-hidden rounded-l-[2.5rem]">
          <div
            className="absolute inset-0 bg-contain bg-left-bottom bg-no-repeat transition-all duration-700 ease-out"
            style={{
              backgroundImage: `url(${leftImage})`,
              filter:
                "drop-shadow(0 10px 60px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 40px rgba(0, 0, 0, 0.3))",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, transparent 55%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.95) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent" />
        </div>

        {/* RIGHT */}
        <div className="relative ml-[46%] flex h-full flex-col gap-7 p-8 pt-16">
          {/* Top slideshow */}
          <div className="group relative h-[60%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20 transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/30">
            {slideshowItems.length ? (
              <Slideshow items={slideshowItems} />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 text-sm text-white/50">
                No images available
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          {/* Bottom grid */}
          <div className="relative h-[40%] overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/30 to-slate-900/30 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
            <div className="grid h-full grid-cols-4 gap-6 p-6 pr-24">
              {visiblePages.map((p) => {
                const thumb = getMainPortrait(p) || getHero(p) || getHover(p);
                const isHovered = hoveredId === p.id;

                return (
                  <a
                    key={p.id}
                    href={`/portraits/${p.slug}`}
                    className="group relative h-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-blue-500/30"
                    onMouseEnter={() => onPortraitHover(p)}
                    onMouseLeave={onPortraitLeave}
                  >
                    <div
                      className={`absolute inset-0 rounded-[1.75rem] transition-all duration-500 ${
                        isHovered
                          ? "ring-[3px] ring-blue-400/70 shadow-lg shadow-blue-400/40"
                          : "ring-1 ring-black/5"
                      }`}
                    />

                    <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-gray-100 to-gray-50">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={p.title}
                          className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Arrows */}
            <div className="absolute right-6 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-4">
              <button
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={!canPrev}
                className={`group relative h-14 w-14 overflow-hidden rounded-2xl transition-all duration-300 ${
                  canPrev
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-110"
                    : "bg-gradient-to-br from-gray-600/40 to-gray-700/40 cursor-not-allowed"
                }`}
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

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-blue-0/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-purple-0/20 blur-[100px]" />
      </div>
    </section>
  );
}