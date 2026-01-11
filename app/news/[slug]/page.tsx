// app/news/[slug]/page.tsx

import Link from "next/link"

import DesktopOnly from "@/components/DesktopOnly"
import TopNav from "@/components/TopNav"
import Footer from "@/components/Footer"
import ShareButton from "@/components/ShareButton"

type Article = {
    id: number
    title: string
    slug: string
    body: string
    excerpt: string | null
    image_url: string | null
    published_at: string | null
}

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || `${SITE_ORIGIN.replace(/\/+$/, "")}/api`

function normalizeImageUrl(url: string | null): string | null {
    if (!url) return null

    try {
        const u = new URL(url, SITE_ORIGIN)
        let pathname = u.pathname

        if (!pathname.startsWith("/storage/")) {
            const clean = pathname.replace(/^\/+/, "")
            pathname = `/storage/${clean}`
        }

        return `${SITE_ORIGIN}${pathname}${u.search}`
    } catch {
        const clean = String(url).replace(/^\/+/, "")
        return `${SITE_ORIGIN}/storage/${clean}`
    }
}

async function getArticle(slug: string): Promise<Article | null> {
    const base = API_BASE.replace(/\/+$/, "")
    const url = `${base}/news/${encodeURIComponent(slug)}`

    console.log("Fetching article from:", url)

    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
        console.error("Failed to fetch article:", res.status, res.statusText)
        return null
    }

    const json = await res.json()
    return (json.data || null) as Article | null
}

type Props = { params: { slug: string } }

/**
 * Minimal sanitizer (no external libs):
 * - removes <script> blocks
 * - removes inline on* handlers (onclick, onerror, etc.)
 * - removes javascript: URLs
 */
function sanitizeHtml(input: string): string {
    if (!input) return ""

    let html = String(input)

    // Remove script tags + content
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    // Remove inline event handlers: onClick="...", onerror='...'
    html = html.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")

    // Remove javascript: from href/src
    html = html.replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, " $1=$2#$2")

    return html
}

export async function generateMetadata({ params }: Props) {
    const article = await getArticle(params.slug)

    if (!article) {
        return { title: "News | 8jjcricket" }
    }

    return {
        title: `${article.title} | 8jjcricket`,
        description: article.excerpt ?? undefined,
    }
}

export default async function ArticlePage({ params }: Props) {
    const article = await getArticle(params.slug)

    if (!article) {
        return (
            <DesktopOnly>
                <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
                    <TopNav />

                    <main className="flex-1 px-4 py-10">
                        <div className="max-w-3xl mx-auto">
                            <Link
                                href="/news"
                                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full
                                          bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500
                                          px-5 py-2.5 text-sm font-semibold text-black
                                          shadow-lg shadow-amber-500/40
                                          ring-1 ring-white/20
                                          transition-all duration-300
                                          hover:brightness-110 hover:shadow-xl hover:shadow-amber-500/50 
                                          hover:-translate-y-[2px]
                                          active:scale-95 active:translate-y-0"
                            >
                                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                <span className="relative z-10">Back to News</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                               -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Link>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-slate-300">
                                Article not found.
                            </div>
                        </div>
                    </main>

                    <Footer />
                </div>
            </DesktopOnly>
        )
    }

    const imgSrc = normalizeImageUrl(article.image_url)
    const safeBodyHtml = sanitizeHtml(article.body)

    return (
        <DesktopOnly>
            <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
                <TopNav />

                <main className="flex-1 px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between gap-3">
                            <Link 
                                href="/news" 
                                className="group inline-flex items-center gap-2 text-amber-400 font-medium
                                          hover:text-amber-300 transition-all duration-300 hover:-translate-x-1"
                            >
                                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                Back to news
                            </Link>

                            {/* Share button + popup */}
                            <ShareButton slug={article.slug} title={article.title} />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3 text-slate-100 
                                      bg-gradient-to-r from-amber-200 via-yellow-100 to-orange-200 
                                      bg-clip-text text-transparent">
                            {article.title}
                        </h1>

                        {article.published_at && (
                            <p className="text-xs text-slate-400 mb-4">
                                {new Date(article.published_at).toLocaleString()}
                            </p>
                        )}

                        {imgSrc && (
                            <div className="group mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md
                                          transition-all duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imgSrc}
                                    alt={article.title}
                                    className="w-full max-h-96 object-cover transition-transform duration-700 
                                              group-hover:scale-105"
                                />
                            </div>
                        )}

                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 
                                       transition-all duration-300 hover:border-white/15">
                            {/* FIX: render HTML body */}
                            <div
                                className="prose prose-invert max-w-none 
                                          prose-p:text-slate-300 prose-p:leading-relaxed
                                          prose-headings:text-slate-100 prose-headings:font-bold
                                          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300 hover:prose-a:underline
                                          prose-strong:text-amber-200 prose-strong:font-semibold
                                          prose-ul:text-slate-300 prose-ol:text-slate-300
                                          prose-li:marker:text-amber-400"
                                dangerouslySetInnerHTML={{ __html: safeBodyHtml }}
                            />
                        </div>

                        {/* Back to news footer button */}
                        <div className="mt-8 flex justify-center">
                            <Link
                                href="/news"
                                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full
                                          bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500
                                          px-6 py-3 text-sm font-semibold text-black
                                          shadow-lg shadow-amber-500/40
                                          transition-all duration-300
                                          hover:brightness-110 hover:shadow-xl hover:shadow-amber-500/50 
                                          hover:-translate-y-[2px]
                                          active:scale-95 active:translate-y-0"
                            >
                                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                <span className="relative z-10">Back to All News</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                               -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </DesktopOnly>
    )
}