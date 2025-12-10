"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"

type Category = {
    id: number
    name: string
    slug: string
}

type Article = {
    id: number
    title: string
    slug: string
    excerpt: string | null
    image_url: string | null
    published_at: string | null
}

// Same pattern as the single article page
const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"

// SWR fetcher – these URLs are relative (e.g. "/api/news")
const fetcher = (url: string) =>
    fetch(url, { cache: "no-store" }).then((r) => {
        if (!r.ok) {
            throw new Error(`Failed to fetch ${url}: ${r.status} ${r.statusText}`)
        }
        return r.json()
    })

// Reuse the SAME normalizeImageUrl logic as in [slug]/page.tsx
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

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // These hit /api/news on the SAME origin (Next), which your proxy sends to Laravel
    const newsUrl = activeCategory
        ? `/api/news?category=${encodeURIComponent(activeCategory)}`
        : `/api/news`

    const { data: categories } = useSWR("/api/news/categories", fetcher)
    const { data, error, isLoading } = useSWR(newsUrl, fetcher)

    const title = "Latest News | 8jjcricket"
    const description =
        "Stay updated with the latest cricket news and articles on 8jjcricket."

    const articles: Article[] = (data?.data || []) as Article[]

    return (
        <>
            {/* If this is an /app route, prefer the metadata API.
                Leaving this here since you already had it. */}
            <title>{title}</title>
            <meta name="description" content={description} />

            <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR */}
                    <aside className="md:col-span-1 bg-white rounded-2xl p-4 border border-gray-200 h-fit sticky top-10">
                        <h2 className="text-lg font-semibold mb-3">Categories</h2>

                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`block w-full text-left px-3 py-2 rounded-lg mb-1 ${activeCategory === null
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            All News
                        </button>

                        {categories?.data?.map((cat: Category) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`block w-full text-left px-3 py-2 rounded-lg mb-1 ${activeCategory === cat.slug
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </aside>

                    {/* MAIN CONTENT */}
                    <section className="md:col-span-3">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">
                            {activeCategory ? `News in "${activeCategory}"` : "Latest News"}
                        </h1>

                        {error ? (
                            <p className="text-gray-500">Failed to load news articles.</p>
                        ) : isLoading ? (
                            <p className="text-gray-500">Loading news…</p>
                        ) : articles.length === 0 ? (
                            <p className="text-gray-500">No news found.</p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                {articles.map((item) => {
                                    const imgSrc = normalizeImageUrl(item.image_url)

                                    return (
                                        <article
                                            key={item.id}
                                            className="rounded-2xl border border-gray-200 bg-white p-4 hover:border-blue-500 transition"
                                        >
                                            {imgSrc && (
                                                <div className="mb-3 overflow-hidden rounded-xl">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.title}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                </div>
                                            )}

                                            <h2 className="text-xl font-semibold mb-2">
                                                <Link
                                                    href={`/news/${item.slug}`}
                                                    className="hover:text-blue-600"
                                                >
                                                    {item.title}
                                                </Link>
                                            </h2>

                                            {item.published_at && (
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {new Date(
                                                        item.published_at
                                                    ).toLocaleString()}
                                                </p>
                                            )}

                                            {item.excerpt && (
                                                <p className="text-sm text-gray-700">
                                                    {item.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-4">
                                                <Link
                                                    href={`/news/${item.slug}`}
                                                    className="text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Read more..
                                                </Link>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    )
}
