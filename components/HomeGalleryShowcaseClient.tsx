"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import PortraitPager from "./PortraitPager";

type PortraitItem = { id: number; image_url: string };

function bySortOrNewest(a: any, b: any) {
  const sa = typeof a?.sort_order === "number" ? a.sort_order : 0;
  const sb = typeof b?.sort_order === "number" ? b.sort_order : 0;
  if (sa !== sb) return sa - sb;

  const da = a?.created_at ? new Date(a.created_at).getTime() : 0;
  const db = b?.created_at ? new Date(b.created_at).getTime() : 0;
  return db - da;
}

/** Slideshow WITHOUT titles/names (works for any items.length >= 2) */
function Slideshow({ items }: { items: { src: string }[] }) {
  const len = items.length;
  const step = 100 / len;
  const holdRatio = 0.82;
  const segment = 100 / len;
  const hold = segment * holdRatio;
  const animName = `homeGallerySlide_${len}`;

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
        css += `
          ${tNext.toFixed(4)}% { transform: translateX(-${((i + 1) * step).toFixed(6)}%); }
        `;
      }
    }

    css += `
      100% { transform: translateX(0%); }
    }`;

    return css;
  })();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div
        className="flex h-full w-full will-change-transform"
        style={{
          width: `${len * 100}%`,
          animation: len > 1 ? `${animName} ${len * 4}s infinite` : undefined,
        }}
      >
        {items.map((it, idx) => (
          <div key={idx} className="relative h-full" style={{ width: `${100 / len}%` }}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${it.src})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          </div>
        ))}
      </div>

      {keyframes && <style dangerouslySetInnerHTML={{ __html: keyframes }} />}
    </div>
  );
}

function BannerPanel({
  activeBannerUrl,
  fallbackLandscapes,
}: {
  activeBannerUrl: string | null;
  fallbackLandscapes: { src: string }[];
}) {
  // If a banner is active -> show it
  if (activeBannerUrl) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeBannerUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      </div>
    );
  }

  // Otherwise show landscape slideshow as before
  if (fallbackLandscapes.length) {
    return <Slideshow items={fallbackLandscapes} />;
  }

  return <div className="flex h-full items-center justify-center text-sm text-white/60">No images</div>;
}

export default function HomeGalleryShowcaseClient({
  portraits,
  bannerByPortraitId,
  bannersList,
  landscapes,
  leftDefaultSrc = "/AMD.png",
}: {
  portraits: PortraitItem[];
  bannerByPortraitId: Record<number, string>;
  bannersList: any[];
  landscapes: { src: string }[];
  leftDefaultSrc?: string;
}) {
  // One state controls BOTH left panel and right banner
  const [activeBannerUrl, setActiveBannerUrl] = useState<string | null>(null);

  // Optional default banner at start (newest / sort_order)
  // If you want NO default and only change on hover, comment this useEffect.
  useEffect(() => {
    if (activeBannerUrl) return;
    if (!bannersList?.length) return;

    const sorted = [...bannersList].sort(bySortOrNewest);
    const first = sorted[0];

    const url = first?.banner_image_url;
    if (typeof url === "string" && url.length) setActiveBannerUrl(url);
  }, [activeBannerUrl, bannersList]);

  const onPortraitHover = useCallback(
    (portraitId: number) => {
      const bannerUrl = bannerByPortraitId[portraitId];
      // IMPORTANT behavior you asked: if no banner, keep the last shown banner (do nothing)
      if (bannerUrl) setActiveBannerUrl(bannerUrl);
    },
    [bannerByPortraitId]
  );

  const fallbackLandscapes = useMemo(() => landscapes, [landscapes]);

  // LEFT area image: banner if present, otherwise AMD.png
  const leftImage = activeBannerUrl || leftDefaultSrc;

  return (
    <div className="relative mx-auto h-[80vh] w-full max-w-7xl">
      {/* Small "Show all" button in top-right */}
      <div className="absolute right-4 top-4 z-20">
        <Link
          href="/gallery"
          className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
        >
          Show all
        </Link>
      </div>

      {/* Background glass layer */}
      <div className="absolute inset-0 rounded-3xl bg-black/25 backdrop-blur-[2px]" />

      {/* LEFT reactive image (was AMD.png; now changes on hover too) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%]">
        <div
          className="absolute inset-0 bg-contain bg-left-bottom bg-no-repeat opacity-95 transition-[background-image] duration-200"
          style={{ backgroundImage: `url(${leftImage})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: "linear-gradient(to right, black 0%, black 75%, transparent 100%)",
            maskImage: "linear-gradient(to right, black 0%, black 75%, transparent 100%)",
          }}
        />
      </div>

      {/* RIGHT content area (banner + portraits) */}
      <div className="relative ml-[46%] flex h-full flex-col gap-6 p-6">
        {/* (1) Banner area */}
        <div className="h-[62%] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
          <BannerPanel activeBannerUrl={activeBannerUrl} fallbackLandscapes={fallbackLandscapes} />
        </div>

        {/* (2) Portraits area */}
        <div className="h-[38%]">
          <PortraitPager portraits={portraits} onPortraitHover={onPortraitHover} />
        </div>
      </div>
    </div>
  );
}
