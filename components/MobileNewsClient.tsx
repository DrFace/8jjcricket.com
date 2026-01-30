"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import MobileShareButton from "@/components/mobile/MobileShareButton";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

type NewsResponse = {
  data: Article[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    prev: string | null;
    next: string | null;
  };
};

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) {
      throw new Error(`Failed to fetch ${url}: ${r.status} ${r.statusText}`);
    }
    return r.json();
  });

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const u = new URL(url, SITE_ORIGIN);
    let pathname = u.pathname;

    if (!pathname.startsWith("/storage/")) {
      const clean = pathname.replace(/^\/+/, "");
      pathname = `/storage/${clean}`;
    }

    return `${SITE_ORIGIN}${pathname}${u.search}`;
  } catch {
    const clean = String(url).replace(/^\/+/, "");
    return `${SITE_ORIGIN}/storage/${clean}`;
  }
}

function formatPublishedAt(published_at: string | null) {
  if (!published_at) return null;
  const d = new Date(published_at);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

/** Mobile pagination UI */
function MobilePagination({
  page,
  lastPage,
  onChange,
}: {
  page: number;
  lastPage: number;
  onChange: (p: number) => void;
}) {
  if (lastPage <= 1) return null;

  const pagesToShow = 5;
  const half = Math.floor(pagesToShow / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(lastPage, start + pagesToShow - 1);
  start = Math.max(1, end - pagesToShow + 1);

  const numbers: number[] = [];
  for (let p = start; p <= end; p++) numbers.push(p);

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="text-xs text-white/60">
        Page {page} of {lastPage}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-4 py-2 rounded-full text-sm border transition disabled:opacity-50 disabled:cursor-not-allowed
                     bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
        >
          Prev
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onChange(1)}
              className="px-4 py-2 rounded-full text-sm border transition
                         bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
            >
              1
            </button>
            {start > 2 && <span className="text-white/40 px-1">…</span>}
          </>
        )}

        {numbers.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              "px-4 py-2 rounded-full text-sm border transition",
              p === page
                ? "bg-amber-300/20 text-amber-300 border-amber-300/40"
                : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        {end < lastPage && (
          <>
            {end < lastPage - 1 && (
              <span className="text-white/40 px-1">…</span>
            )}
            <button
              onClick={() => onChange(lastPage)}
              className="px-4 py-2 rounded-full text-sm border transition
                         bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
            >
              {lastPage}
            </button>
          </>
        )}

        <button
          onClick={() => onChange(Math.min(lastPage, page + 1))}
          disabled={page >= lastPage}
          className="px-4 py-2 rounded-full text-sm border transition disabled:opacity-50 disabled:cursor-not-allowed
                     bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function MobileNewsClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  // Reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const newsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    params.set("page", String(page));
    params.set("per_page", "20");
    return `/api/news?${params.toString()}`;
  }, [activeCategory, page]);

  const { data: categories, error: catError } = useSWR(
    "/api/news/categories",
    fetcher,
  );

  const { data, error, isLoading } = useSWR<NewsResponse>(newsUrl, fetcher);

  const articles: Article[] = (data?.data || []) as Article[];
  const currentPage = data?.meta?.current_page ?? page;
  const lastPage = data?.meta?.last_page ?? 1;

  return (
    <main className="min-h-screen bg-black text-white px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-3">
        {activeCategory ? `Latest News: ${activeCategory}` : "Latest News"}
      </h1>

      {/* Category chips */}
      <div className="mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 w-max">
          <button
            onClick={() => setActiveCategory(null)}
            className={[
              "px-4 py-2 rounded-full text-sm border transition",
              activeCategory === null
                ? "bg-amber-300/20 text-amber-300 border-amber-300/40"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            All
          </button>

          {!catError &&
            categories?.data?.map((cat: Category) => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={[
                    "px-4 py-2 rounded-full text-sm border transition",
                    isActive
                      ? "bg-amber-300/20 text-amber-300 border-amber-300/40"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* States */}
      {error ? (
        <p className="text-white/60">Failed to load news articles.</p>
      ) : isLoading ? (
        <p className="text-white/60">Loading news…</p>
      ) : articles.length === 0 ? (
        <p className="text-white/60">No news found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((item) => {
              const imgSrc = normalizeImageUrl(item.image_url);
              const publishedLabel = formatPublishedAt(item.published_at);

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  {imgSrc && (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="text-lg font-semibold leading-snug">
                      <Link
                        href={`/mobile/news/${item.slug}`}
                        className="hover:text-amber-300 transition"
                      >
                        {item.title}
                      </Link>
                    </h2>

                    {publishedLabel && (
                      <p className="text-xs text-white/50 mt-1">
                        {publishedLabel}
                      </p>
                    )}

                    {item.excerpt && (
                      <p className="text-sm text-white/70 mt-2 line-clamp-3">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <Link
                        href={`/mobile/news/${item.slug}`}
                        className="text-sm font-medium text-amber-300 hover:underline"
                      >
                        Read more
                      </Link>

                      <MobileShareButton slug={item.slug} title={item.title} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination (mobile) */}
          <MobilePagination
            page={currentPage}
            lastPage={lastPage}
            onChange={(p) => {
              setPage(p);
              // optional: scroll to top when page changes
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </main>
  );
}
