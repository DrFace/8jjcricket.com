// app/portraits/[slug]/page.tsx

import Link from "next/link";

/**
 * IMPORTANT:
 * - API_BASE is used ONLY to fetch JSON (must include /api)
 * - SITE_ORIGIN is used ONLY to serve storage assets (/storage/...) and should be HTTPS in production
 *
 * This matches the working pattern used in the home page PortraitShowcase.
 */

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://8jjcricket.com/api"
).replace(/\/+$/, "");

const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"
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
  return `${SITE_ORIGIN}/storage/${clean}`;
}

async function fetchPortrait(slug: string) {
  const url = `${API_BASE}/portraits/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json();
  return (json?.data ?? json) as any;
}
export default async function PortraitDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await fetchPortrait(params.slug);
  if (!data) {
    return (
      <>
        <main className="mx-auto max-w-6xl px-6 py-16 text-white">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-8 text-white/70 backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-white/80">
                Portrait page not found or not published.
              </p>
              <Link
                href="/portraits"
                className="mt-4 inline-block rounded-full bg-blue-500/20 px-6 py-2.5 text-sm font-semibold text-blue-300 ring-1 ring-blue-400/30 hover:bg-blue-500/30 transition-all duration-300"
              >
                ← Back to Players
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const title = data.title || "";
  const subtitle = data.subtitle || null;

  const topHeroRaw = pickFirst(
    data.hero_image_url,
    data.hero_image_path,
    data.hover_banner_url,
    data.hover_banner_path
  );
  const mainPortraitRaw = pickFirst(
    data.main_portrait_url,
    data.main_portrait_path,
    data.portrait_image_url,
    data.portrait_image_path
  );
  const footerBannerRaw = pickFirst(
    data.footer_banner_url,
    data.footer_banner_path
  );

  const topHero = toStorageUrl(topHeroRaw);
  const mainPortrait = toStorageUrl(mainPortraitRaw);
  const footerBanner = toStorageUrl(footerBannerRaw);

  const paragraphs: string[] = Array.isArray(data.paragraphs)
    ? data.paragraphs
    : [];
  const slider_images: any[] = Array.isArray(data.slider_images)
    ? data.slider_images
    : [];
  const gallery_images: any[] = Array.isArray(data.gallery_images)
    ? data.gallery_images
    : [];
  const embedded_news: any[] = Array.isArray(data.embedded_news)
    ? data.embedded_news
    : [];
  const other_banners: any[] = Array.isArray(data.other_banners)
    ? data.other_banners
    : [];

  return (
    <>

      <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          {/* TOP BAR */}
          {/* <div className="mb-8 flex items-center justify-between gap-3">
            <Link
              href="/portraits"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-5 py-2.5 text-sm font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur-xl transition-all duration-300 hover:from-blue-500/20 hover:to-purple-500/20 hover:ring-white/30 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Players
            </Link>

           <div className="flex items-center gap-2">
              {topHero ? (
                <a
                  href={topHero}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-800/60 px-4 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/20 backdrop-blur-xl transition-all duration-300 hover:bg-slate-700/60 hover:ring-white/30"
                >
                  Open Banner
                </a>
              ) : null}
              {mainPortrait ? (
                <a
                  href={mainPortrait}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-800/60 px-4 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/20 backdrop-blur-xl transition-all duration-300 hover:bg-slate-700/60 hover:ring-white/30"
                >
                  Open Portrait
                </a>
              ) : null}
            </div>
          </div> */}

          {/* HERO */}
          <section className="group relative overflow-hidden rounded-[2.5rem] ring-1 ring-white/20 shadow-2xl transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/20 bg-gray-100">
            {topHero ? (
              <div
                className="
                  w-full
                  aspect-[2210/590]
                  bg-contain
                  bg-center
                  bg-no-repeat
                  transition-transform
                  duration-700
                  group-hover:scale-[1.02]
                "
                style={{ backgroundImage: `url(${topHero})` }}
              />
            ) : (
              <div className="h-[42vh] min-h-[280px] w-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-purple-600/20" />

            {/* Shine effect */}
            <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

            <div className="absolute bottom-10 left-10 h-50">
              <h1
                className="text-4xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-lg"
                style={{ height: 45 }}
              >
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 max-w-2xl text-base text-white/85 leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </section>

          {/* MAIN CONTENT */}
          <section className="mt-10 grid gap-8 lg:grid-cols-[360px,1fr]">
            {/* LEFT STICKY */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/60 ring-1 ring-white/20 backdrop-blur-xl shadow-2xl">
                {/* Background banner */}
                <img
                  src="/bg.png"
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                />

                {mainPortrait ? (
                  <div className="relative group/portrait z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainPortrait}
                      alt={title || "Portrait"}
                      className="h-[500px] w-full object-contain transition-transform duration-800 group-hover/portrait:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/portrait:opacity-100" />
                  </div>
                ) : (
                  <div className="h-[420px] w-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                )}

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-500/20 px-4 py-2 font-semibold text-blue-300 ring-1 ring-blue-400/30 backdrop-blur-xl transition-all duration-300 hover:bg-blue-500/30">
                      {gallery_images.length} Gallery
                    </span>
                    <span className="rounded-full bg-purple-500/20 px-4 py-2 font-semibold text-purple-300 ring-1 ring-purple-400/30 backdrop-blur-xl transition-all duration-300 hover:bg-purple-500/30">
                      {slider_images.length} Highlights
                    </span>
                    <span className="rounded-full bg-pink-500/20 px-4 py-2 font-semibold text-pink-300 ring-1 ring-pink-400/30 backdrop-blur-xl transition-all duration-300 hover:bg-pink-500/30">
                      {embedded_news.length} News
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT */}
            <div className="space-y-6 min-w-0">
              {/* ABOUT */}
              {paragraphs.length ? (
                <section className="rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-6 sm:p-8 ring-1 ring-white/20 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                    <h2 className="text-xl font-black text-white/95 tracking-tight">
                      About
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {paragraphs.map((p: string, idx: number) => (
                      <p
                        key={idx}
                        className="leading-relaxed text-white/85 text-[15px]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* HIGHLIGHTS */}
              {slider_images.length ? (
                <section className="min-w-0">
                  <div className="mb-5 flex items-end justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                      <h2 className="text-xl font-black text-white/95 tracking-tight">
                        Highlights
                      </h2>
                    </div>
                    <p className="text-xs text-white/60 font-medium">
                      Swipe to Explore →
                    </p>
                  </div>

                  {/* scroller */}
                  <div className="min-w-0">
                    <div
                      className={[
                        "flex flex-nowrap gap-4",
                        "overflow-x-auto overflow-y-hidden",
                        "pb-4",
                        "snap-x snap-mandatory",
                        "scroll-smooth overscroll-x-contain",
                        "[-webkit-overflow-scrolling:touch]",
                        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20",
                        "-mx-1 px-1",
                      ].join(" ")}
                    >
                      {slider_images.map((s: any, idx: number) => {
                        const img = toStorageUrl(
                          pickFirst(s?.url, s?.path, s?.image_url)
                        );

                        return (
                          <a
                            key={idx}
                            href="https://8jjcricket.com/news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={[
                              "flex-none snap-start",
                              "w-[280px] sm:w-[320px]",
                              "overflow-hidden rounded-[1.75rem]",
                              "bg-gradient-to-br from-slate-900/60 to-slate-800/60",
                              "ring-1 ring-white/20 backdrop-blur-xl shadow-xl",
                              "transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/20",
                            ].join(" ")}
                          >
                            {img ? (
                              <div className="relative overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img}
                                  alt={s?.alt || ""}
                                  className="h-44 w-full object-cover transition-transform duration-700 hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 hover:translate-x-[100%]" />
                              </div>
                            ) : (
                              <div className="h-44 w-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                            )}

                            <div className="p-4">
                              <div className="text-sm font-bold text-white/90">
                                {s?.alt || `Highlight ${idx + 1}`}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ) : null}

              {/* GALLERY */}
              {gallery_images.length ? (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                    <h2 className="text-xl font-black text-white/95 tracking-tight">
                      Gallery
                    </h2>
                  </div>
                  <div className="grid auto-rows-[160px] grid-cols-2 gap-4 sm:grid-cols-3">
                    {gallery_images.map((g: any, idx: number) => {
                      const img = toStorageUrl(
                        pickFirst(g?.url, g?.path, g?.image_url)
                      );
                      return (
                        <a
                          key={idx}
                          href={img || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative flex overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900/60 to-slate-800/60 ring-1 ring-white/20 backdrop-blur-xl shadow-xl transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/20 hover:scale-[1.02]"
                        >
                          {img ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={g?.alt || ""}
                                className="max-h-full max-w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                            </>
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* NEWS */}
              {embedded_news.length ? (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                    <h2 className="text-xl font-black text-white/95 tracking-tight">
                      News
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {embedded_news.map((n: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/60 p-6 ring-1 ring-white/20 backdrop-blur-xl shadow-xl transition-all duration-300 hover:ring-white/30"
                      >
                        {n?.title ? (
                          <div className="text-base font-bold text-white/95 mb-2">
                            {n.title}
                          </div>
                        ) : null}
                        {n?.url ? (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 text-sm text-blue-300 font-semibold transition-all duration-300 hover:text-blue-200"
                          >
                            Read more
                            <svg
                              className="h-4 w-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </a>
                        ) : null}
                        {n?.embed_html ? (
                          <div
                            className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/50"
                            dangerouslySetInnerHTML={{ __html: n.embed_html }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* OTHER BANNERS */}
              {other_banners.length ? (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                    <h2 className="text-xl font-black text-white/95 tracking-tight">
                      More
                    </h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {other_banners.map((b: any, idx: number) => {
                      const img = toStorageUrl(
                        pickFirst(b?.image_url, b?.path, b?.url)
                      );
                      const link = b?.link || null;

                      const card = (
                        <div className="group overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/60 ring-1 ring-white/20 backdrop-blur-xl shadow-xl transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/20 hover:scale-[1.02]">
                          {img ? (
                            <div className="relative overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt={b?.label || ""}
                                className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                            </div>
                          ) : (
                            <div className="h-40 w-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
                          )}

                          {b?.label || link ? (
                            <div className="p-4">
                              {b?.label ? (
                                <div className="text-sm font-bold text-white/95">
                                  {b.label}
                                </div>
                              ) : null}
                              {link ? (
                                <div className="mt-1 text-xs text-white/70">
                                  {link}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );

                      return link ? (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {card}
                        </a>
                      ) : (
                        <div key={idx}>{card}</div>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </div>
          </section>

          {/* FOOTER BANNER */}
          <section className="mt-8 group relative overflow-hidden rounded-[2.5rem] ring-1 ring-white/20 shadow-2xl transition-all duration-500 hover:ring-white/30 hover:shadow-blue-500/20">
            {footerBanner ? (
              <div
                className="
                w-full
                aspect-[2210/590]
                bg-no-repeat
                bg-center
                bg-contain
                transition-transform
                duration-700
                group-hover:scale-[1.02]
              "
                style={{ backgroundImage: `url(${footerBanner})` }}
              />
            ) : (
              <div className="w-full aspect-[2210/590] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
            )}
          </section>
        </div>
      </main>

    </>
  );
}
