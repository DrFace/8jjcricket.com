"use client";

import { useCallback, useMemo, useState } from "react";

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
    <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          width: `${len * 100}%`,
          animation:
            len > 1 ? `${animName} ${len * 5}s ease-in-out infinite` : undefined,
        }}
      >
        {items.map((it, idx) => (
          <div
            key={idx}
            className="relative h-full"
            style={{ width: `${100 / len}%` }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
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

  // 4-per-page pagination
  const PAGE_SIZE = 4;
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = Math.max(1, Math.ceil(cleanPages.length / PAGE_SIZE));
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  const visiblePages = cleanPages.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  if (!cleanPages.length) return null;

  return (
    <section className="w-full px-6 py-8">
      <div className="relative mx-auto h-[85vh] min-h-[700px] w-full max-w-7xl">
        {/* Enhanced background glass layer with gradients */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-xl shadow-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/15 shadow-inner" />
        </div>

        {/* LEFT featured image with enhanced effects */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] overflow-hidden rounded-l-[2rem]">
          <div
            className="absolute inset-0 bg-contain bg-left-bottom bg-no-repeat opacity-100 transition-all duration-500 ease-out"
            style={{ 
              backgroundImage: `url(${leftImage})`,
              filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, transparent 0%, transparent 60%, rgba(15, 23, 42, 0.3) 85%, rgba(15, 23, 42, 0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent" />
        </div>

        {/* RIGHT content area */}
        <div className="relative ml-[46%] flex h-full flex-col gap-7 p-8 pt-16">
          {/* Enhanced slideshow section */}
          <div className="group relative h-[58%] overflow-hidden rounded-3xl ring-1 ring-white/20 shadow-2xl transition-all duration-300 hover:ring-white/30 hover:shadow-blue-500/20">
            <Slideshow items={slideshowItems} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Enhanced bottom grid section with pagination */}
          <div className="relative h-[42%] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 ring-1 ring-white/15 backdrop-blur-sm shadow-xl">
            <div className="grid h-full grid-cols-4 gap-6 p-6 pr-24">
              {visiblePages.map((p) => {
                const thumb = getMainPortrait(p) || getHero(p) || getHover(p);
                const isHovered = hoveredId === p.id;
                return (
                  <a
                    key={p.id}
                    href={`/portraits/${p.slug}`}
                    className="group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
                    onMouseEnter={() => onPortraitHover(p)}
                    onMouseLeave={onPortraitLeave}
                  >
                    {/* Enhanced ring effect on hover */}
                    <div className={`absolute inset-0 rounded-3xl transition-all duration-300 ${
                      isHovered 
                        ? 'ring-2 ring-blue-400/60 shadow-lg shadow-blue-500/30' 
                        : 'ring-1 ring-black/10'
                    }`} />
                    
                    {thumb && (
                      <>
                        <img
                          src={thumb}
                          alt={p.title}
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Shine effect */}
                        <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                      </>
                    )}
                    
                    {/* Hover indicator dot */}
                    <div className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 transition-all duration-300 ${
                      isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`} />
                  </a>
                );
              })}
            </div>

            {/* Enhanced arrow navigation */}
            <div className="absolute right-5 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-3">
              <button
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={!canPrev}
                className={`group flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-all duration-300 shadow-lg ${
                  canPrev 
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/50 hover:scale-110 active:scale-95" 
                    : "bg-slate-800/40 text-white/30 cursor-not-allowed ring-1 ring-white/10"
                }`}
                aria-label="Previous page"
              >
                <svg className={`h-5 w-5 transition-transform ${canPrev ? 'group-hover:-translate-y-0.5' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              {/* Page indicator */}
              <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-slate-900/60 text-xs font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
                {pageIndex + 1}/{pageCount}
              </div>
              
              <button
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
                disabled={!canNext}
                className={`group flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold transition-all duration-300 shadow-lg ${
                  canNext 
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/50 hover:scale-110 active:scale-95" 
                    : "bg-slate-800/40 text-white/30 cursor-not-allowed ring-1 ring-white/10"
                }`}
                aria-label="Next page"
              >
                <svg className={`h-5 w-5 transition-transform ${canNext ? 'group-hover:translate-y-0.5' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient lighting effects */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600/5 to-transparent rounded-b-[2rem]" />
      </div>
    </section>
  );
}