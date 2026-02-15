// app/page.tsx
import dynamic from "next/dynamic";
import TopNav from "@/components/TopNav";
import SmoothScroller from "@/components/SmoothScroller";
import DesktopOnly from "@/components/DesktopOnly";
import BottomNav from "@/components/BottomNav";
import HomeVerticalSwiper from "@/components/HomeVerticalSwiper";
import HomeNewsShowcase from "@/components/HomeNewsShowcase";
import HomeFeedbackSection from "@/components/HomeFeedbackSection";
import PortraitShowcaseSection from "@/components/PortraitShowcaseSection";

// --- IMPORT SEO DATA ---
import { homeMetadata, homeJsonLd } from "@/components/seo/HomeSeo";
import SponsorBar from "@/components/SponsorBar";

// --- EXPORT METADATA (This sets the <head> tags) ---
export const metadata = homeMetadata;

const WelcomePopup = dynamic(() => import("@/components/WelcomePopup"), {
  ssr: false,
});
const AnimatedText = dynamic(() => import("@/components/AnimatedText"), {
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

async function getNewsPreview(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;
  const url = `${base.replace(/\/+$/, "")}/news`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API Error:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    return ((json.data || []) as Article[]).slice(0, 5);
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

export default async function HomePage() {
  const news = await getNewsPreview();
  const [videosRaw] = await Promise.all([fetchVideos()]);

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
    .filter(
      (a: { id: number; slug: string; title: string; imgSrc: string | null }) =>
        a.imgSrc,
    ) as {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
  }[];

  function normalizeVideoUrl(url: string | null): string | null {
    if (!url) return null;
    let backend_url = apiBase().replace(/\/api$/, "");
    try {
      const u = new URL(url, backend_url);
      let pathname = u.pathname;
      if (!pathname.startsWith("/storage/")) {
        pathname = `/storage/${pathname.replace(/^\/+/, "")}`;
      }

      return `${backend_url}${pathname}${u.search}`;
    } catch {
      return `${backend_url}/storage/${String(url).replace(/^\/+/, "")}`;
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

  return (
    <SmoothScroller>
      {/* --- INJECT SCHEMA JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <DesktopOnly>
        <WelcomePopup />
      </DesktopOnly>

      <BottomNav />
      <TopNav />

      {/* Swiper vertical scroll effect wrapper */}
      <HomeVerticalSwiper>
        <section
          data-snap
          className="SectionScroll sticky top-0 xl:h-[90vh] lg:h-[84vh] w-full overflow-hidden"
        >
          {/* SEO-Optimized H1 for India & South Asia */}
          <h1 className="sr-only">
            8JJ Cricket - Live Cricket Scores, IPL Updates & Match News for
            India & South Asia
          </h1>

          {(() => {
            const raw = videos?.[0]?.video_path ?? "";

            const getSafeVideoUrl = (input: string) => {
              if (!input) return "";
              if (input.startsWith("/")) {
                return `https://8jjcricket.com${input}`;
              }
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
                <video
                  src={safeSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full bg-black object-contain sm:object-cover"
                />
              </>
            );
          })()}
          <SponsorBar />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-india-saffron/20 to-transparent" />
        </section>

        <section
          data-snap
          className="SectionScroll sticky top-0 flex w-full items-center px-6 xl:mt-0 lg:mt-10"
        >
          <div className="relative h-full w-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/CricketBG.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-india-gold/40 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-2xl shadow-india-saffron/20">
              <PortraitShowcaseSection />
            </div>
          </div>
        </section>
        {/* News */}
        <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            {/* Background removed as per request */}

            <div className="relative w-full max-w-[1480px] mx-auto rounded-2xl border border-india-green/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-india-green/10 p-6 shadow-2xl backdrop-blur-xl shadow-india-green/10 ring-1 ring-white/5">
              <HomeNewsShowcase />
            </div>
          </div>
        </section>

        <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            {/* Background removed as per request */}

            <div className="relative w-full rounded-2xl border border-india-blue/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-india-blue/10 p-4 shadow-2xl backdrop-blur-xl shadow-india-blue/10 ring-1 ring-white/5">
              <HomeFeedbackSection />
            </div>
          </div>
        </section>
      </HomeVerticalSwiper>
    </SmoothScroller>
  );
}
