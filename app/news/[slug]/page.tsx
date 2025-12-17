// app/news/[slug]/page.tsx

import Link from "next/link"

import DesktopOnly from "@/components/DesktopOnly"
import TopNav from "@/components/TopNav"
import Footer from "@/components/Footer"

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
                                className="text-sky-400 hover:underline transition"
                            >
                                ← Back to news
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

    return (
        <DesktopOnly>
            <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
                <TopNav />

                <main className="flex-1 px-4 py-10">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/news"
                            className="text-sky-400 hover:underline transition"
                        >
                            ← Back to news
                        </Link>

                        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3 text-slate-100">
                            {article.title}
                        </h1>

                        {article.published_at && (
                            <p className="text-xs text-slate-400 mb-4">
                                {new Date(article.published_at).toLocaleString()}
                            </p>
                        )}

                        {imgSrc && (
                            <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imgSrc}
                                    alt={article.title}
                                    className="w-full max-h-96 object-cover"
                                />
                            </div>
                        )}

                        {/* If body is HTML from Laravel, use dangerouslySetInnerHTML instead */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                            <div className="prose prose-invert max-w-none whitespace-pre-line prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-sky-400">
                                {article.body}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </DesktopOnly>
    )
}
