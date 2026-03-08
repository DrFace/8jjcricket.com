import dynamic from "next/dynamic";
import TopNav from "@/components/TopNav";
import DesktopOnly from "@/components/DesktopOnly";
import BottomNav from "@/components/BottomNav";
import HomeVerticalSwiper from "@/components/HomeVerticalSwiper";
import HomeNewsShowcase from "@/components/HomeNewsShowcase";
import HomeFeedbackSection from "@/components/HomeFeedbackSection";
import PortraitShowcaseSection from "@/components/PortraitShowcaseSection";
import InteractiveHeroVideo from "@/components/InteractiveHeroVideo";
import PartnersCarousel from "@/components/PartnersCarousel";
// import HomeVideoGallery from "@/components/HomeVideoGallery";
import React from "react";

import { homeMetadata, homeJsonLd } from "@/components/seo/HomeSeo";
import SponsorBar from "@/components/SponsorBar";
import ScaleToFit from "@/components/ScaleToFit";
import WavingFlags from "@/components/WavingFlags";
import NeonBatSides from "@/components/NeonBatSides";
import CricketSideDecor from "@/components/CricketSideDecor";
export const metadata = homeMetadata;

const SIDE_PATTERN_STYLE = `
  .sp { position:absolute; top:0; height:100%; width:22vw; max-width:320px; pointer-events:none; }
  .sp-l { left:0; }
  .sp-r { right:0; }
  .sp-grid { background-repeat:repeat; background-size:60px 60px; mix-blend-mode:screen; }

  .sp-plus-l {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%2300aaff' stroke-opacity='0.55' stroke-width='1.5'%3E%3Cpath d='M10 10h10M15 5v10'/%3E%3Cpath d='M40 10h10M45 5v10'/%3E%3Cpath d='M10 40h10M15 35v10'/%3E%3Cpath d='M40 40h10M45 35v10'/%3E%3C/g%3E%3C/svg%3E");
    opacity:0.5;
    -webkit-mask-image:linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.9) 55%,rgba(0,0,0,0) 100%);
    mask-image:linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.9) 55%,rgba(0,0,0,0) 100%);
  }
  .sp-cross-l {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%2300aaff' stroke-opacity='0.30' stroke-width='2.5'%3E%3Cpath d='M30 30h30M45 15v30'/%3E%3Cpath d='M120 100h30M135 85v30'/%3E%3Cpath d='M20 140h20M30 130v20'/%3E%3C/g%3E%3C/svg%3E");
    background-size:180px 180px; opacity:0.55;
    -webkit-mask-image:linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.8) 55%,rgba(0,0,0,0) 100%);
    mask-image:linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.8) 55%,rgba(0,0,0,0) 100%);
  }
  .sp-plus-r {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23ffb800' stroke-opacity='0.55' stroke-width='1.5'%3E%3Cpath d='M10 10h10M15 5v10'/%3E%3Cpath d='M40 10h10M45 5v10'/%3E%3Cpath d='M10 40h10M15 35v10'/%3E%3Cpath d='M40 40h10M45 35v10'/%3E%3C/g%3E%3C/svg%3E");
    opacity:0.45;
    -webkit-mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.9) 55%,rgba(0,0,0,0) 100%);
    mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.9) 55%,rgba(0,0,0,0) 100%);
  }
  .sp-cross-r {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cg fill='none' stroke='%23ffb800' stroke-opacity='0.28' stroke-width='2.5'%3E%3Cpath d='M120 30h30M135 15v30'/%3E%3Cpath d='M20 90h30M35 75v30'/%3E%3Cpath d='M130 140h30M145 125v30'/%3E%3C/g%3E%3C/svg%3E");
    background-size:180px 180px; opacity:0.55;
    -webkit-mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.8) 55%,rgba(0,0,0,0) 100%);
    mask-image:linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.8) 55%,rgba(0,0,0,0) 100%);
  }
  .sp-fade-v {
    background: linear-gradient(to bottom, var(--bg-primary) 0%, transparent 8%, transparent 92%, var(--bg-primary) 100%);
  }
`;

const SidePatternBackground = React.memo(function SidePatternBackground() {
  const leftGlow = {
    background:
      "radial-gradient(ellipse at 25% 25%,rgba(0,170,255,.14) 0%,transparent 65%)," +
      "radial-gradient(ellipse at 60% 70%,rgba(255,184,0,.10) 0%,transparent 60%)," +
      "radial-gradient(ellipse at 10% 55%,rgba(0,170,255,.08) 0%,transparent 50%)",
    filter: "blur(28px)",
  } satisfies React.CSSProperties;

  const rightGlow = {
    background:
      "radial-gradient(ellipse at 75% 30%,rgba(255,184,0,.14) 0%,transparent 65%)," +
      "radial-gradient(ellipse at 40% 65%,rgba(0,170,255,.09) 0%,transparent 60%)," +
      "radial-gradient(ellipse at 90% 60%,rgba(255,184,0,.10) 0%,transparent 50%)",
    filter: "blur(28px)",
  } satisfies React.CSSProperties;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SIDE_PATTERN_STYLE }} />
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {/* LEFT */}
        <div className="sp sp-l sp-grid sp-plus-l" />
        <div className="sp sp-l sp-grid sp-cross-l" />
        <div className="sp sp-l" style={leftGlow} />
        <div className="sp sp-l sp-fade-v" />

        {/* RIGHT */}
        <div className="sp sp-r sp-grid sp-plus-r" />
        <div className="sp sp-r sp-grid sp-cross-r" />
        <div className="sp sp-r" style={rightGlow} />
        <div className="sp sp-r sp-fade-v" />
      </div>
    </>
  );
});

const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), {
  ssr: false,
});

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

type Video = {
  id: number;
  title: string;
  slug: string;
  video_path: string;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE).replace(
    /\/+$/,
    "",
  );
}

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, SITE_ORIGIN);
    let pathname = u.pathname;
    if (!pathname.startsWith("/storage/"))
      pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
    return `${SITE_ORIGIN}${pathname}${u.search}`;
  } catch {
    return `${SITE_ORIGIN}/storage/${String(url).replace(/^\/+/, "")}`;
  }
}

function normalizeVideoUrl(url: string | null): string | null {
  if (!url) return null;
  const backend_url = apiBase().replace(/\/api$/, "");
  try {
    const u = new URL(url, backend_url);
    let pathname = u.pathname;
    if (!pathname.startsWith("/storage/"))
      pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
    return `${backend_url}${pathname}${u.search}`;
  } catch {
    return `${backend_url}/storage/${String(url).replace(/^\/+/, "")}`;
  }
}

async function getNewsPreview(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return ((json.data || []) as Article[]).slice(0, 5);
  } catch {
    return [];
  }
}

async function getLatestEvent(): Promise<Article | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news?category=events&per_page=1`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data?.[0] as Article) || null;
  } catch {
    return null;
  }
}

async function fetchVideos(): Promise<Video[]> {
  const url = `${apiBase()}/home-videos`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [news, latestEvent, videosRaw] = await Promise.all([
    getNewsPreview(),
    getLatestEvent(),
    fetchVideos(),
  ]);

  const videos: Video[] = (videosRaw || [])
    .map((p: any) => {
      return {
        ...p,
        video_path: normalizeVideoUrl(p.video_path) || p.video_path,
      } as Video;
    })
    .filter((p) => !!p.video_path);

  const newsWithImages = news
    .map((a: Article) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      imgSrc: normalizeImageUrl(a.image_url),
    }))
    .filter((a) => a.imgSrc) as {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
  }[];

  void newsWithImages;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <DesktopOnly>
        <WelcomePopup />
      </DesktopOnly>

      <BottomNav />
      <TopNav />

      <HomeVerticalSwiper>
        {/* Hero Video Section */}
        <section
          data-snap
          className="SectionScroll w-full h-full overflow-hidden"
        >
          <h1 className="sr-only">
            8jjcricket - Live Cricket Scores, IPL 2026 Updates & Cricket News
            for India
          </h1>

          {(() => {
            const raw = videos?.[0]?.video_path ?? "";

            const getSafeVideoUrl = (input: string) => {
              if (!input) return "";
              if (input.startsWith("/"))
                return `https://8jjcricket.com${input}`;
              if (input.startsWith("http://72.60.107.98:8001/")) {
                return input.replace(
                  "http://72.60.107.98:8001",
                  "https://8jjcricket.com",
                );
              }
              if (input.startsWith("http://")) {
                try {
                  const u = new URL(input);
                  if (u.pathname.startsWith("/storage/")) {
                    return `https://8jjcricket.com${u.pathname}${u.search}`;
                  }
                  return `https://${u.host}${u.pathname}${u.search}`;
                } catch {
                  return input;
                }
              }
              return input;
            };

            const safeSrc = getSafeVideoUrl(raw);

            return (
              <>
                <InteractiveHeroVideo
                  videoUrl={safeSrc}
                  latestEvent={
                    latestEvent
                      ? {
                          ...latestEvent,
                          image_url: normalizeImageUrl(latestEvent.image_url),
                        }
                      : null
                  }
                />
                <SponsorBar />
              </>
            );
          })()}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </section>

        {/* ===================== Portfolio Section — WAVING FLAGS ADDED ===================== */}
      <section
      data-snap
      className="SectionScroll relative w-full h-full flex items-start"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative h-full w-full flex items-start overflow-hidden">
        {/* base bg */}
        <div className="absolute inset-0" style={{ background: "var(--bg-primary)" }} />

        {/* trophy videos — left + right */}
        {/* <CricketSideDecor /> */}

        {/* plus/cross pattern decorations */}
        <SidePatternBackground />

        {/* main content */}
        <ScaleToFit className="w-full h-full pt-16 pb-2">
          <div className="relative w-full bg-transparent p-4 min-w-[1440px]">
            <PortraitShowcaseSection />
          </div>
        </ScaleToFit>
      </div>
    </section>
        {/* ===================== End Portfolio Section ================================= */}

        {/* News Section */}
        <section
          data-snap
          className="SectionScroll w-full h-full flex items-start"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="relative h-full w-full flex items-start">
            <div
              className="absolute inset-0"
              style={{ background: "var(--bg-primary)" }}
            />

            {/* plus/cross pattern decorations */}
            <SidePatternBackground />


            <ScaleToFit className="w-full h-full pt-16 pb-2">
              <div className="relative w-full bg-transparent p-4 min-w-[1440px]">
                <HomeNewsShowcase />
              </div>
            </ScaleToFit>
          </div>
        </section>

        {/* Video Gallery Section */}
        {/* <section
          data-snap
          className="SectionScroll relative w-full h-full flex items-start"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="relative h-full w-full flex items-start overflow-hidden">
            <div
              className="absolute inset-0"
              style={{ background: "var(--bg-primary)" }}
            />

            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <div
                className="absolute left-0 top-0 h-full w-[22vw] max-w-[320px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%2300aaff' stroke-opacity='0.55' stroke-width='1.5'%3E%3Cpath d='M10 10h10M15 5v10'/%3E%3Cpath d='M40 10h10M45 5v10'/%3E%3Cpath d='M10 40h10M15 35v10'/%3E%3Cpath d='M40 40h10M45 35v10'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "60px 60px",
                  mixBlendMode: "screen",
                  opacity: 0.5,
                  WebkitMaskImage:
                    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
                }}
              />
              <div
                className="absolute right-0 top-0 h-full w-[22vw] max-w-[320px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23ffb800' stroke-opacity='0.55' stroke-width='1.5'%3E%3Cpath d='M10 10h10M15 5v10'/%3E%3Cpath d='M40 10h10M45 5v10'/%3E%3Cpath d='M10 40h10M15 35v10'/%3E%3Cpath d='M40 40h10M45 35v10'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "60px 60px",
                  mixBlendMode: "screen",
                  opacity: 0.45,
                  WebkitMaskImage:
                    "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
                }}
              />
            </div>

            <ScaleToFit className="w-full h-full pt-16 pb-2">
              <div className="relative w-full bg-transparent p-4 min-w-[1440px]">
                <HomeVideoGallery />
              </div>
            </ScaleToFit>
          </div>
        </section> */}

        {/* Associate Section */}
        <section
          data-snap
          className="SectionScroll w-full h-full flex items-start"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="relative h-full w-full flex items-start">
            <div
              className="absolute inset-0"
              style={{ background: "var(--bg-primary)" }}
            />

            {/* plus/cross pattern decorations */}
            <SidePatternBackground />


            <ScaleToFit className="w-full h-full pt-16 pb-2">
              <div className="relative w-full bg-transparent p-4 min-w-[1440px]">
                <PartnersCarousel />
              </div>
            </ScaleToFit>
          </div>
        </section>

        {/* FeedBack Section */}
        <section
          data-snap
          className="SectionScroll w-full h-full flex items-start"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="relative h-full w-full flex items-start">
            <div
              className="absolute inset-0"
              style={{ background: "var(--bg-primary)" }}
            />

            {/* plus/cross pattern decorations */}
            <SidePatternBackground />


            <ScaleToFit className="w-full h-full pt-16 pb-2">
              <div className="relative w-full bg-transparent p-4 min-w-[1440px]">
                <HomeFeedbackSection />
              </div>
            </ScaleToFit>
          </div>
        </section>
      </HomeVerticalSwiper>
    </>
  );
}