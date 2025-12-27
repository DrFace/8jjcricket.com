// app/mobile/news/[slug]/page.tsx

import Link from "next/link";
import MobileShareButton from "@/components/mobile/MobileShareButton";

type Article = {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
};

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  `${SITE_ORIGIN.replace(/\/+$/, "")}/api`;

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

async function getArticle(slug: string): Promise<Article | null> {
  const base = API_BASE.replace(/\/+$/, "");
  const url = `${base}/news/${encodeURIComponent(slug)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json();
  return (json.data || null) as Article | null;
}

/**
 * Minimal sanitizer (no external libs):
 * - removes <script> blocks
 * - removes inline on* handlers (onclick, onerror, etc.)
 * - removes javascript: URLs
 */
function sanitizeHtml(input: string): string {
  if (!input) return "";

  let html = String(input);

  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  html = html.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");
  html = html.replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, " $1=$2#$2");

  return html;
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) return { title: "News | 8jjcricket" };

  return {
    title: `${article.title} | 8jjcricket`,
    description: article.excerpt ?? undefined,
  };
}

export default async function MobileArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    return (
      <main className="min-h-screen bg-black text-white px-4 pt-6 pb-24">
        <Link href="/mobile/news" className="text-amber-300 hover:underline">
          ← Back to news
        </Link>

        <p className="mt-6 text-white/60">Article not found.</p>
      </main>
    );
  }

  const imgSrc = normalizeImageUrl(article.image_url);
  const safeBodyHtml = sanitizeHtml(article.body);

  return (
    <main className="min-h-screen bg-black text-white px-4 pt-6 pb-24">
      <div className="mx-auto max-w-md">
        {/* Top row: Back + Share */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/mobile/news" className="text-amber-300 hover:underline">
            ← Back to news
          </Link>

          {/* Share button (same style as your list page) */}
          <MobileShareButton slug={article.slug} title={article.title} />
        </div>

        <h1 className="text-2xl font-bold mt-4 mb-2 leading-snug">
          {article.title}
        </h1>

        {article.published_at && (
          <p className="text-xs text-white/50 mb-4">
            {new Date(article.published_at).toLocaleString()}
          </p>
        )}

        {imgSrc && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={article.title}
              className="w-full max-h-80 object-cover"
            />
          </div>
        )}

        {/* FIX: render HTML body */}
        <div
          className="prose prose-invert max-w-none text-white/80"
          dangerouslySetInnerHTML={{ __html: safeBodyHtml }}
        />
      </div>
    </main>
  );
}
