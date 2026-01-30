"use client";

import { useState } from "react";

type DataShape = {
  title: string;
  subtitle?: string | null;
  hero_image_url?: string | null;
  main_portrait_url?: string | null;
  paragraphs: string[];
  slider_images: { url: string; alt: string }[];
  gallery_images: { url: string; alt: string }[];
  embedded_news: { title: string; url: string }[];
  other_banners: { image_url: string; label: string; link: string }[];
};

export default function PortraitDetailsClient({ data }: { data: DataShape }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 h-96 w-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
      </div>

      <main className="relative">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
          {/* TOP BAR */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-5 py-2.5 font-semibold text-white backdrop-blur-xl ring-1 ring-white/20 transition-all hover:from-blue-600/30 hover:to-purple-600/30 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <svg
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Players
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl ring-1 ring-white/20 transition-all hover:bg-white/15 hover:shadow-lg"
              >
                Download
              </button>
              <button
                type="button"
                className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-xl ring-1 ring-white/20 transition-all hover:bg-white/15 hover:shadow-lg"
              >
                Share
              </button>
            </div>
          </div>

          {/* HERO SECTION */}
          <section className="group relative mb-12 overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/20 transition-all duration-500 hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-sm" />

            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
              <img
                src={data.hero_image_url || ""}
                alt={data.title}
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-purple-600/20" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
              <div className="max-w-4xl">
                <h1 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {data.title}
                </h1>

                {data.subtitle && (
                  <p className="max-w-3xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl">
                    {data.subtitle}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* MAIN CONTENT GRID */}
          <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
            {/* LEFT SIDEBAR */}
            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              <div className="group overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/40 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl transition-all duration-500 hover:ring-white/30">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-6">
                  <img
                    src={data.main_portrait_url || ""}
                    alt={data.title}
                    className="h-[480px] w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4 text-xs font-bold tracking-widest text-white/50">
                    QUICK STATS
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <div className="text-2xl font-bold text-white">{data.gallery_images.length}</div>
                      <div className="mt-1 text-xs text-white/60">Gallery</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <div className="text-2xl font-bold text-white">{data.slider_images.length}</div>
                      <div className="mt-1 text-xs text-white/60">Highlights</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
                      <div className="text-2xl font-bold text-white">{data.embedded_news.length}</div>
                      <div className="mt-1 text-xs text-white/60">News</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <div className="space-y-8">
              {/* ABOUT */}
              {data.paragraphs.length > 0 && (
                <section className="rounded-[2rem] bg-gradient-to-br from-slate-900/60 to-slate-800/40 p-8 shadow-xl ring-1 ring-white/20 backdrop-blur-xl">
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-white">
                    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    About
                  </h2>
                  <div className="space-y-5">
                    {data.paragraphs.map((p, idx) => (
                      <p key={idx} className="text-base leading-relaxed text-white/80">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* GALLERY */}
              {data.gallery_images.length > 0 && (
                <section>
                  <h2 className="mb-6 flex items-center gap-3 text-2xl font-black text-white">
                    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    Gallery
                  </h2>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {data.gallery_images.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedImage(item.url)}
                        className="group relative aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-900/60 to-slate-800/40 ring-1 ring-white/20 transition-all duration-500 hover:scale-[1.02] hover:ring-white/30"
                      >
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="h-full w-full object-cover p-2 transition-all duration-700 group-hover:scale-110 group-hover:p-1"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 backdrop-blur-xl ring-1 ring-white/20 transition-all hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            ✕
          </button>

          <img
            src={selectedImage}
            alt="Gallery"
            className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain shadow-2xl ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}