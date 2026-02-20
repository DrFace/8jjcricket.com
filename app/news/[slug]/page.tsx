// app/news/[slug]/page.tsx

import Link from "next/link";

import DesktopOnly from "@/components/DesktopOnly";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

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

  console.log("Fetching article from:", url);

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    console.error("Failed to fetch article:", res.status, res.statusText);
    return null;
  }

  const json = await res.json();
  return (json.data || null) as Article | null;
}

type Props = { params: { slug: string } };

/**
 * Minimal sanitizer (no external libs):
 * - removes <script> blocks
 * - removes inline on* handlers (onclick, onerror, etc.)
 * - removes javascript: URLs
 */
function sanitizeHtml(input: string): string {
  if (!input) return "";

  let html = String(input);

  // Remove script tags + content
  html = html.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove inline event handlers: onClick="...", onerror='...'
  html = html.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  // Remove javascript: from href/src
  html = html.replace(
    /\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi,
    " $1=$2#$2",
  );

  return html;
}

export async function generateMetadata({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    return { title: "News | 8jjcricket" };
  }

  return {
    title: `${article.title} | 8jjcricket`,
    description: article.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    return (
      <DesktopOnly>
        <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
          <TopNav />

          <main className="flex-1 px-4 py-10">
            <div className="max-w-3xl mx-auto">
              <PrimaryButton
                href="/news"
                size="md"
                className="mb-4"
              >
                ← Back to News
              </PrimaryButton>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-slate-300">
                Article not found.
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </DesktopOnly>
    );
  }

  const imgSrc = normalizeImageUrl(article.image_url);
  const safeBodyHtml = sanitizeHtml(article.body);

  return (
    <DesktopOnly>
      <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
        <TopNav />

        <main className="flex-1 px-4 py-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between gap-3">
              <PrimaryButton
                href="/news"
                size="sm"
              >
                ← Back to news
              </PrimaryButton>

            {/* Share button + popup */}
              <ShareButton slug={article.slug} title={article.title} />
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold mt-4 mb-3 india-header-text leading-tight"
            >
              {article.title}
            </h1>

            {article.published_at && (
              <p className="text-xs text-slate-400 mb-4">
                {new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(article.published_at))}
              </p>
            )}

            {imgSrc && (
              <div
                className="group mb-6 overflow-hidden rounded-2xl india-card-blue-glow transition-all duration-300 hover:shadow-lg hover:shadow-india-blue/20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={article.title}
                  className="w-full max-h-96 object-cover transition-transform duration-700 
                                              group-hover:scale-105"
                />
              </div>
            )}

            <div
              className="rounded-2xl india-card-gradient p-6"
            >
              {/* FIX: render HTML body */}
              <div
                className="prose prose-invert max-w-none 
                                          prose-p:text-slate-300 prose-p:leading-relaxed
                                          prose-headings:text-india-gold prose-headings:font-bold
                                          prose-a:text-india-saffron prose-a:no-underline hover:prose-a:text-india-gold hover:prose-a:underline
                                          prose-strong:text-white prose-strong:font-semibold
                                          prose-ul:text-slate-300 prose-ol:text-slate-300
                                          prose-li:marker:text-india-saffron"
                dangerouslySetInnerHTML={{ __html: safeBodyHtml }}
              />
            </div>

            {/* Back to news footer button */}
            <div className="mt-8 flex justify-center">
              <PrimaryButton
                href="/news"
                size="lg"
              >
                ← Back to All News
              </PrimaryButton>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </DesktopOnly>
  );
}

