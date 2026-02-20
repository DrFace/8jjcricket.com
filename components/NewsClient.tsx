"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

// --- TYPES ---
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

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok)
      throw new Error(`Failed to fetch ${url}: ${r.status} ${r.statusText}`);
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

function buildShareUrl(slug: string) {
  return `${SITE_ORIGIN}/news/${slug}`;
}

function ShareIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/10 group-hover:bg-white/15 transition">
      {children}
    </span>
  );
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-7.3L4.7 22H2l7.3-8.4L1 2h6.9l4.8 6.7L18.9 2Zm-2.3 18h1.9L7.3 3.9H5.2L16.6 20Z" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.6v8h3.9Z" />
    </svg>
  );
}
function IconTelegram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.7 4.3c.3-1.2-.9-2.2-2-1.7L3.5 9c-1.3.5-1.3 2.3.1 2.8l4.3 1.5 1.7 5.3c.4 1.1 1.8 1.4 2.6.6l2.5-2.5 4.6 3.4c1 .7 2.4.2 2.6-1l4-18.8ZM9.7 12.6l9.6-6.1-7.8 7.5-.3 3.5-1.4-4.4-3.7-1.3Z" />
    </svg>
  );
}
function IconWhatsapp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.7.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.6-5.5c-.3-.2-1.7-.9-2-.9s-.5-.2-.7.2-.8.9-1 .9-.4 0-.7-.2a6.6 6.6 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.7c-.1-.3 0-.5.2-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.1 3 2 3.2 4.8 4.5c.7.3 1.3.5 1.8.6.8.2 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4s-.2-.2-.4-.3Z" />
    </svg>
  );
}
function IconMessenger() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.5 5.5 3.9 7.2V22l3.5-2c.8.2 1.7.3 2.6.3 5.5 0 10-4.1 10-9.1S17.5 2 12 2Zm1 12.2-2.6-2.8-5 2.8 5.7-6 2.6 2.8 5-2.8-5.7 6Z" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a3 3 0 1 1 4.2 4.2l-1.5 1.5a1 1 0 1 1-1.4-1.4l1.5-1.5a1 1 0 1 0-1.4-1.4l-3.4 3.4a1 1 0 0 1-1.4 0ZM13.4 10.6a1 1 0 0 1 0 1.4l-3.4 3.4a3 3 0 1 1-4.2-4.2l1.5-1.5a1 1 0 0 1 1.4 1.4L7.2 12.6a1 1 0 0 0 1.4 1.4l3.4-3.4a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}
function IconMore() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

function ShareModal({
  open,
  onClose,
  url,
  title,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const links = useMemo(() => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return {
      messenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=0&redirect_uri=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    };
  }, [url, title]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setToast("Link copied.");
      setTimeout(() => {
        setCopied(false);
        setToast(null);
      }, 1400);
    } catch {
      setToast("Copy failed. Please copy manually.");
      setTimeout(() => setToast(null), 1600);
    }
  }

  async function onMore() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        onClose();
        return;
      } catch {}
    }
    setToast("Sharing not supported on this device. Use Copy link.");
    setTimeout(() => setToast(null), 1600);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close share dialog"
      />
      <div className="relative w-full sm:w-[520px] rounded-t-2xl sm:rounded-2xl border border-white/10 bg-slate-950/85 backdrop-blur-xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold text-slate-100">Share to</div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconWhatsapp />
            </ShareIcon>
            <span className="text-xs text-slate-200">WhatsApp</span>
          </a>
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconFacebook />
            </ShareIcon>
            <span className="text-xs text-slate-200">Facebook</span>
          </a>
          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconX />
            </ShareIcon>
            <span className="text-xs text-slate-200">X</span>
          </a>
          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconTelegram />
            </ShareIcon>
            <span className="text-xs text-slate-200">Telegram</span>
          </a>
          <a
            href={links.messenger}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconMessenger />
            </ShareIcon>
            <span className="text-xs text-slate-200">Messenger</span>
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconLink />
            </ShareIcon>
            <span className="text-xs text-slate-200">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <button
            type="button"
            onClick={onMore}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ShareIcon>
              <IconMore />
            </ShareIcon>
            <span className="text-xs text-slate-200">More</span>
          </button>
        </div>
        {toast && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
function ShareButton({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SecondaryButton
        type="button"
        onClick={() => setOpen(true)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 16a3 3 0 0 0-2.4 1.2l-6.3-3.2a3 3 0 0 0 0-2l6.3-3.2A3 3 0 1 0 15 6a3 3 0 0 0 .1.8L8.8 10a3 3 0 1 0 0 4l6.3 3.2A3 3 0 1 0 18 16Z" />
        </svg>
        Share
      </SecondaryButton>
      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        url={url}
        title={title}
      />
    </>
  );
}

export default function NewsClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const newsUrl = activeCategory
    ? `/api/news?category=${encodeURIComponent(activeCategory)}`
    : `/api/news`;

  const { data: categories } = useSWR("/api/news/categories", fetcher);
  const { data, error, isLoading } = useSWR(newsUrl, fetcher);

  const articles: Article[] = (data?.data || []) as Article[];

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* LEFT SIDEBAR */}
      <aside className="md:col-span-1 h-fit sticky top-28">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <h2 className="text-lg font-semibold mb-3 text-slate-100">
            Categories
          </h2>
          <SecondaryButton
            onClick={() => setActiveCategory(null)}
            active={activeCategory === null}
            className="w-full justify-start mb-1"
          >
            All News
          </SecondaryButton>
          {categories?.data?.map((cat: Category) => (
            <SecondaryButton
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              active={activeCategory === cat.slug}
              className="w-full justify-start mb-1"
            >
              {cat.name}
            </SecondaryButton>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="md:col-span-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
          {activeCategory ? `News in "${activeCategory}"` : "Latest News"}
        </h1>

        {error ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-slate-300">
            Failed to load news articles.
          </div>
        ) : isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-slate-300">
            Loading news…
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-slate-300">
            No news found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {articles.map((item) => {
              const imgSrc = normalizeImageUrl(item.image_url);
              const shareUrl = buildShareUrl(item.slug);
              return (
                <article
                  key={item.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition-all duration-300 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
                >
                  {imgSrc && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-white/10 relative">
                      <img
                        src={imgSrc}
                        alt={item.title}
                        className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold mb-2 text-slate-100 transition-colors duration-300 group-hover:text-amber-300">
                    <Link
                      href={`/news/${item.slug}`}
                      className="hover:text-amber-400 transition"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  {item.published_at && (
                    <p className="text-xs text-slate-400 mb-2 transition-colors duration-300 group-hover:text-slate-300">
                      {new Date(item.published_at).toLocaleString()}
                    </p>
                  )}
                  {item.excerpt && (
                    <p className="text-sm text-slate-300 line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <PrimaryButton
                      href={`/news/${item.slug}`}
                      size="sm"
                    >
                      Read more →
                    </PrimaryButton>
                    <ShareButton url={shareUrl} title={item.title} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
