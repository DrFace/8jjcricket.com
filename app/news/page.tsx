"use client"

import useSWR from "swr"
import { useState } from "react"

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

// Base of your backend (no trailing /)
const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://72.60.107.98:8001"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Make sure images always come from 72.60.107.98:8001
function normalizeImageUrl(url: string | null): string | null {
    if (!url) return null

    // Already absolute (http or https) – use as-is
    if (/^https?:\/\//i.test(url)) {
        return url
    }

    const baseOrigin = new URL(API_BASE).origin

    // If backend returns "/storage/..."
    if (url.startsWith("/")) {
        return baseOrigin + url
    }

    // If backend returns "storage/..." (no leading slash)
    return baseOrigin + "/" + url.replace(/^\/+/, "")
}

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // API URLs
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
                            {activeCategory
                                ? `News in "${activeCategory}"`
                                : "Latest News"}
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
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.title}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                </div>
                                            )}

                                            <h2 className="text-xl font-semibold mb-2">
                                                <a
                                                    href={`/news/${item.slug}`}
                                                    className="hover:text-blue-600"
                                                >
                                                    {item.title}
                                                </a>
                                            </h2>

                                            {item.published_at && (
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {new Date(item.published_at).toLocaleString()}
                                                </p>
                                            )}

                                            {item.excerpt && (
                                                <p className="text-sm text-gray-700">
                                                    {item.excerpt}
                                                </p>
                                            )}

                                            <div className="mt-4">
                                                <a
                                                    href={`/news/${item.slug}`}
                                                    className="text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    Read more..
                                                </a>
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
