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
    ""
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
console.log('test for branch');

const latest: { slug: string; title: string; desc: string }[] = [
  {
    slug: "cricket-legends",
    title: "Cricket Legends",
    desc: "Career mode with levels & characters.",
  },
  {
    slug: "cricket-superover",
    title: "Cricket Super Over",
    desc: "6 balls, pure timing — hit for 6s!",
  },
  { slug: "tictactoe", title: "Tic Tac Toe", desc: "Classic 3×3 duel." },
  { slug: "flappysquare", title: "Flappy Square", desc: "Click to fly!" },
];

function gameInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

const DOWNLOAD_URL = "https://download.9ipl.vip/normal/";
// const BRAND_ITEMS = [
//   "MB66",
//   "OK9",
//   "78win",
//   "QQ88",
//   "F168",
//   "FLY88",
//   "CM88",
//   "OK8386",
//   "SC88",
//   "C168",
//   "iP88",
// ];

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
        a.imgSrc
    ) as {
    id: number;
    slug: string;
    title: string;
    imgSrc: string;
  }[];

  function normalizeVideoUrl(url: string | null): string | null {
    if (!url) return null;
    // Remove '/api' from backend_url if present
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
      <DesktopOnly>
        <WelcomePopup />
      </DesktopOnly>

      <BottomNav />
      <TopNav />

      {/* Swiper vertical scroll effect wrapper (no content changes inside) */}
      <HomeVerticalSwiper>
        <section
          data-snap
          className="SectionScroll sticky top-0 Sh-screen w-full overflow-hidden "
        >
          {/* Build a safe HTTPS URL for the video without changing backend/env */}
          {(() => {
            const raw = videos?.[0]?.video_path ?? "";

            // Convert IP-based HTTP storage URLs to your HTTPS domain storage URL
            const getSafeVideoUrl = (input: string) => {
              if (!input) return "";

              // If backend returns a relative path like "/storage/....mp4"
              if (input.startsWith("/")) {
                return `https://8jjcricket.com${input}`;
              }

              // If backend returns full URL with the IP + port over http
              // e.g. http://72.60.107.98:8001/storage/home_videos/xxx.mp4
              if (input.startsWith("http://72.60.107.98:8001/")) {
                return input.replace(
                  "http://72.60.107.98:8001",
                  "https://8jjcricket.com"
                );
              }

              // If any other http URL, try to remap just the /storage/... portion to your HTTPS domain
              if (input.startsWith("http://")) {
                try {
                  const u = new URL(input);
                  if (u.pathname.startsWith("/storage/")) {
                    return `https://8jjcricket.com${u.pathname}${u.search}`;
                  }
                  // If it's some other path, still force https on same host (best effort)
                  return `https://${u.host}${u.pathname}${u.search}`;
                } catch {
                  return input;
                }
              }

              // Already https or something else
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

          {/* <div className="pointer-events-auto absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4 ">
            <div className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 overflow-x-auto rounded-full border border-white/20 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-xl ">
              {BRAND_ITEMS.map((name: string) => (
                <a
                  key={name}
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap rounded-full bg-slate-200/90 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-md transition hover:bg-white sm:text-sm"
                >
                  {name}
                </a>
              ))}
            </div>
          </div> */}
        </section>
        <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/CricketBG.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <PortraitShowcaseSection />
            </div>
          </div>
        </section>

        {/* SLIDE — GALLERY SHOWCASE */}
        {/* <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/CricketBG.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <HomeGalleryShowcase />
            </div>
          </div>
        </section> */}

        {/* SLIDE — NEWS */}
        <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/CricketBG.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full max-w-[1480px] mx-auto rounded-2xl border border-white/15 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-2xl">
              <HomeNewsShowcase />
            </div>
          </div>
        </section>

        {/* SLIDE — FEEDBACK */}
        <section
          data-snap
          className="SectionScroll sticky top-0 flex h-screen w-full items-center px-6"
        >
          <div className="relative h-full w-full flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/CricketBG.jpg)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            <div className="relative w-full rounded-2xl border border-white/15 bg-slate-900/70 p-4 shadow-2xl backdrop-blur-2xl">
              <HomeFeedbackSection />
            </div>
          </div>
        </section>
      </HomeVerticalSwiper>
    </SmoothScroller>
  );
}
