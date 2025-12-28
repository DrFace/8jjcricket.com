// app/portraits/page.tsx
"use client";

import Link from "next/link";
import useSWR from "swr";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

type PortraitListItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;

  hover_banner_path?: string | null;
  hover_banner_url?: string | null;
  portrait_image_path?: string | null;
  portrait_image_url?: string | null;

  // sometimes older fields
  hover_banner?: string | null;
  portrait_image?: string | null;
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then(async (r) => {
    const text = await r.text();
    if (!r.ok) throw new Error(text || `${r.status} ${r.statusText}`);
    return JSON.parse(text);
  });

const DEFAULT_BACKEND = "http://72.60.107.98:8001";
const BACKEND = (
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN || DEFAULT_BACKEND
).replace(/\/+$/, "");

function pickFirst<T>(...vals: (T | null | undefined)[]) {
  for (const v of vals)
    if (v !== null && v !== undefined && String(v).trim() !== "") return v;
  return null;
}

function imgFromBackend(pathOrUrl: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const clean = pathOrUrl.replace(/^\/+/, "");
  // backend stores file under storage/app/public => served via /storage/...
  return `${BACKEND}/storage/${clean}`;
}

export default function PortraitsPage() {
  const { data, error, isLoading } = useSWR("/api/portrait-pages", fetcher);
  const items: PortraitListItem[] = (data?.data || []) as PortraitListItem[];

  const cards = items.map((p) => {
    const coverRaw = pickFirst(
      p.hover_banner_url,
      p.hover_banner_path,
      p.hover_banner,
      p.portrait_image_url,
      p.portrait_image_path,
      p.portrait_image
    );

    return {
      ...p,
      _cover: imgFromBackend(coverRaw),
    };
  });

  return (
    <>
      <TopNav />
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mt-5 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/10">
                    {isLoading ? "Loading…" : `${cards.length} Pages`}
                  </span>
                </div>
              </div>
              <Link
                href="/"
                className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 hover:bg-white/15"
              >
                Back Home
              </Link>
            </div>
          </div>

          <div className="mt-8">
            {error ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/60">
                Failed to load portraits.
              </div>
            ) : isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/60">
                Loading portraits…
              </div>
            ) : cards.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/60">
                No portraits found.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((p) => (
                  <Link
                    key={p.id}
                    href={`/portraits/${p.slug}`}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  >
                    {p._cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p._cover}
                        alt={p.title}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-44 w-full bg-gradient-to-br from-white/10 to-white/5" />
                    )}

                    <div className="p-5">
                      <div className="text-base font-semibold text-white/90">
                        {p.title}
                      </div>
                      {p.subtitle ? (
                        <div className="mt-1 text-sm text-white/60">
                          {p.subtitle}
                        </div>
                      ) : null}
                      <div className="mt-4 text-xs text-white/60">
                        Click to view details →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
