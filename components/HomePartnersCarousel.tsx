"use client";

// This component is a refined version of the previous HomePartnersCarousel.  It adjusts
// sizing, spacing and animation timing to more closely mirror the sliding effect
// showcased in the provided video.  The underlying API interactions remain
// unchanged – the component still fetches the partner data from
// `/api/home-partners` and cycles through each item automatically.  Visual
// refinements include larger central logos, smoother transitions, wider
// spacing between items and a more prominent orbital ring.  Feel free to
// adjust the constants (e.g. spacing or sizes) further to fine tune the
// appearance.

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

type PartnerRow = {
  id?: number;
  title?: string | null;
  image?: string | null;
  link?: string | null;
  sort_order?: number | null;
  description?: string | null;
};

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function normalizeStorageUrl(input: string): string {
  if (!input) return "";
  const fixed = String(input).replace(/\\/g, "/").replace(/^\/+/, "");
  if (fixed.startsWith("http://") || fixed.startsWith("https://")) return fixed;
  if (fixed.startsWith("storage/")) return `${SITE_ORIGIN}/${fixed}`;
  return `${SITE_ORIGIN}/storage/${fixed}`;
}

function safeOpenNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function HomePartnersCarousel({
  heading = "Partner Brands",
}: {
  heading?: string;
}) {
  const [items, setItems] = useState<PartnerRow[]>([]);
  // We keep an active index for compatibility, but the carousel logic rotates
  // the array instead of incrementing this value.  Active is therefore
  // always the first element (index 0) after each rotation.
  const [active, setActive] = useState(0);

  const len = items.length;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/home-partners", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok)
          throw new Error(`GET /api/home-partners failed: ${res.status}`);
        const json = await res.json();

        const arr: PartnerRow[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const cleaned = arr.filter((x) => !!x?.image);
        setItems(cleaned);
        setActive(0);
      } catch (e) {
        console.error("Home partners fetch failed:", e);
        setItems([]);
        setActive(0);
      }
    };
    load();
  }, []);

  const activeItem = useMemo(() => {
    if (!len) return null;
    // active element is always at the front of the array after rotation
    return items[0] ?? null;
  }, [items, len]);

  // Rotate the items array to the left (forward) or right (backward) to
  // simulate the carousel movement.  When rotating left, the first
  // element becomes the last; when rotating right, the last element becomes
  // the first.  After rotation the active element is always at index 0.
  const rotateLeft = (count = 1) => {
    if (len <= 1) return;
    setItems((prev) => {
      const n = prev.length;
      const k = ((count % n) + n) % n;
      if (k === 0) return prev;
      const newItems = prev.slice(k).concat(prev.slice(0, k));
      return newItems;
    });
  };

  const rotateRight = (count = 1) => {
    if (len <= 1) return;
    setItems((prev) => {
      const n = prev.length;
      const k = ((count % n) + n) % n;
      if (k === 0) return prev;
      const newItems = prev.slice(n - k).concat(prev.slice(0, n - k));
      return newItems;
    });
  };

  const goPrev = () => rotateRight(1);

  const goNext = () => rotateLeft(1);

  const onClickActive = () => {
    const link = activeItem?.link ? String(activeItem.link) : "";
    if (!link) return;
    safeOpenNewTab(link);
  };

  /**
   * Rotate the carousel to bring the clicked partner into the center.  The
   * argument `index` refers to the position of the item in the current
   * `items` array.  Rotating left by `index` positions will move the
   * chosen item to the front of the array, making it the active item.
   */
  const rotateToIndex = (index: number) => {
    if (len <= 1) return;
    rotateLeft(index);
  };

  const windowItems = useMemo(() => {
    if (!len) return [];
    // With rotation logic, the active item is always at index 0.  Compute
    // positions relative to index 0.  The modulo operation ensures wrap
    // around for negative indices.
    const idxs = [-2, -1, 0, 1, 2].map((d) => {
      const i = (d + len) % len;
      return i;
    });
    return idxs.map((idx, pos) => ({
      idx,
      item: items[idx],
      delta: pos - 2,
    }));
  }, [items, len]);

  useEffect(() => {
    if (len <= 1) return;
    // auto-slide every 4 seconds instead of 5 for a smoother, quicker loop
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
    // Only depend on length so that interval is not reset on every rotation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  if (!len) return null;

  return (
    <section className="relative w-full py-16 sm:py-24 select-none overflow-hidden bg-black">
      {/* --- BACKGROUND ENHANCEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 1. Large Ambient Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/5 rounded-full blur-[140px] animate-pulse [animation-delay:2s]" />

        {/* 2. Subtle Mesh Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* 3. Floating Particles (Diamonds) */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rotate-45 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.1 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Carousel Track with Orbital Rings */}
        <div className="relative flex items-center justify-center min-h-[450px] sm:min-h-[550px] mb-12">
          {/* Orbital Ring for Center Item */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] border border-white/25 rounded-full relative">
              {/* top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_#fff]" />
              {/* bottom glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_#fff]" />
              {/* rotating arc */}
              <div className="absolute inset-x-[-12px] inset-y-[-12px] border border-transparent border-t-white/15 rounded-full animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          {/* ✅ SLIDE/ORBIT LAYER */}
          <div className="relative z-10 w-full h-[300px] sm:h-[420px]">
            {windowItems.map(({ idx, item, delta }) => {
              const src = item?.image ? normalizeStorageUrl(String(item.image)) : "";
              const isActive = delta === 0;

              // Adjust horizontal spacing: more generous to better match the reference
              const spacingMobile = 140;
              const spacingDesktop = 260;

              // Styling based on distance from center
              // Defaults for the farthest items: keep them small but still
              // visible by using a higher opacity and a lighter background.
              let sizeClass = "h-32 w-32 sm:h-40 sm:w-40";
              let opacity = "opacity-75";
              let scale = "scale-[0.8]";
              let shadow = "shadow-[0_10px_25px_rgba(0,0,0,0.4)]";
              let zIndex = "z-0";
              let borderCol = "border-white/15";
              let bgStyle: React.CSSProperties = {
                // lighter radial gradient so dark logos remain visible
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.15) 100%)",
              };

              if (delta === 0) {
                sizeClass = "h-48 w-48 sm:h-72 sm:w-72";
                opacity = "opacity-100";
                scale = "scale-100";
                shadow =
                  "shadow-[0_35px_80px_rgba(0,0,0,0.7),inset_-5px_-5px_25px_rgba(0,0,0,0.3),inset_5px_5px_25px_rgba(255,255,255,0.05)]";
                zIndex = "z-20";
                borderCol = "border-white/25";
                bgStyle = {
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.3) 100%)",
                };
              } else if (Math.abs(delta) === 1) {
                sizeClass = "h-40 w-40 sm:h-56 sm:w-56";
                // Near items are a bit more opaque so they don't fade too much
                opacity = "opacity-90";
                scale = "scale-[0.9]";
                zIndex = "z-10";
                borderCol = "border-white/20";
                bgStyle = {
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)",
                };
              }

              return (
                <button
                  key={item?.id ?? idx} // ✅ key by identity
                  type="button"
                  onClick={() => (isActive ? onClickActive() : rotateToIndex(idx))}
                  className={
                    `hp-orb absolute left-1/2 top-1/2 focus:outline-none flex items-center justify-center ` +
                    `transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ` +
                    `${opacity} ${zIndex}`
                  }
                  style={{
                    // mobile transform (desktop overridden in CSS below)
                    transform: `translateX(calc(-50% + ${delta * spacingMobile}px)) translateY(-50%)`,
                    ["--desktop-x" as any]: `${delta * spacingDesktop}px`,
                  } as React.CSSProperties}
                >
                  {/* Outer Glow for Active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl animate-pulse" />
                  )}

                  <div
                    style={bgStyle}
                    className={
                      `${sizeClass} ${scale} rounded-full overflow-hidden ` +
                      `border-2 ${borderCol} ` +
                      `flex items-center justify-center p-8 ` +
                      `${shadow} ` +
                      `transition-all duration-300 relative`
                    }
                  >
                    {/* Background Contrast Glow for Logo Visibility */}
                    <div className="absolute inset-[15%] bg-white/5 blur-2xl rounded-full pointer-events-none" />

                    {/* Specular Highlight Spot */}
                    <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/10 blur-[8px] rounded-full pointer-events-none" />
                    <div className="absolute top-[5%] left-[10%] w-[10%] h-[10%] bg-white/20 blur-[2px] rounded-full pointer-events-none" />

                    {src ? (
                      <div className="relative w-full h-full transform transition-transform duration-500 hover:scale-110">
                        <Image
                          src={src}
                          alt={item?.title ? String(item.title) : "Partner"}
                          fill
                          sizes="(max-width: 640px) 250px, 500px"
                          className="object-contain"
                          priority={isActive}
                        />
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="text-center mt-10">
          {/* Heading with Diamonds */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="w-3 h-3 bg-white rotate-45 shadow-[0_0_12px_#fff]" />
            <h2 className="text-white font-black text-2xl sm:text-3xl uppercase tracking-[0.25em] italic drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              {heading}
            </h2>
            <div className="w-3 h-3 bg-white rotate-45 shadow-[0_0_12px_#fff]" />
          </div>

          {/* Nav & Active Title */}
          <div className="relative flex items-center justify-center gap-12 mb-6">
            {/* Left Arrow */}
            <button
              onClick={goPrev}
              className="group w-12 h-12 rounded-full border border-white/25 bg-white/5 flex items-center justify-center hover:bg-white/15 hover:border-white/40 transition-all duration-300"
            >
              <span className="text-white/50 text-2xl font-light group-hover:text-white transition-colors">
                ←
              </span>
            </button>

            {/* Active Name */}
            <div className="min-w-[200px] sm:min-w-[450px] text-white font-black text-4xl sm:text-8xl uppercase tracking-tighter scale-y-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
              {activeItem?.title}
            </div>

            {/* Right Arrow */}
            <button
              onClick={goNext}
              className="group w-12 h-12 rounded-full border border-white/25 bg-white/5 flex items-center justify-center hover:bg-white/15 hover:border-white/40 transition-all duration-300"
            >
              <span className="text-white/50 text-2xl font-light group-hover:text-white transition-colors">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* keep your float animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(45deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }

        /* ✅ override transform on desktop using CSS var */
        @media (min-width: 640px) {
          .hp-orb {
            transform: translateX(calc(-50% + var(--desktop-x))) translateY(-50%) !important;
          }
        }
      `}</style>
    </section>
  );
}