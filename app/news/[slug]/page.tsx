// app/news/[slug]/page.tsx

import Link from "next/link"

type Article = {
    id: number
    title: string
    slug: string
    body: string
    excerpt: string | null
    image_url: string | null
    published_at: string | null
}

// Where your Laravel/Next site is hosted.
// For local Laragon this might be "http://8jjcricket.com" (note http).
const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"

// API base = "<origin>/api" (e.g. https://8jjcricket.com/api)
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    `${SITE_ORIGIN.replace(/\/+$/, "")}/api`

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
    // ABSOLUTE URL – this fixes ERR_INVALID_URL
    const base = API_BASE.replace(/\/+$/, "")
    const url = `${base}/news/${encodeURIComponent(slug)}`

    console.log("Fetching article from:", url)

    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
        console.error("Failed to fetch article:", res.status, res.statusText)
        // You can uncomment this if you want to see the body, but it can be noisy:
        // try {
        //   console.error(await res.text())
        // } catch {}
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
            <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <Link href="/news" className="text-blue-600 hover:underline">
                        ← Back to news
                    </Link>
                    <p className="mt-6 text-gray-600">Article not found.</p>
                </div>
            </main>
        )
    }

    const imgSrc = normalizeImageUrl(article.image_url)

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <Link href="/news" className="text-blue-600 hover:underline">
                    ← Back to news
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
                    {article.title}
                </h1>

                {article.published_at && (
                    <p className="text-xs text-gray-500 mb-4">
                        {new Date(article.published_at).toLocaleString()}
                    </p>
                )}

                {imgSrc && (
                    <div className="mb-6 overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgSrc}
                            alt={article.title}
                            className="w-full max-h-96 object-cover"
                        />
                    </div>
                )}

                {/* If body is HTML from Laravel, use dangerouslySetInnerHTML instead */}
                <div className="prose max-w-none whitespace-pre-line">
                    {article.body}
                </div>
            </div>
        </main>
    )
}
