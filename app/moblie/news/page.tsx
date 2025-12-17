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

const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"

const fetcher = (url: string) =>
    fetch(url, { cache: "no-store" }).then((r) => {
        if (!r.ok) {
            throw new Error(`Failed to fetch ${url}: ${r.status} ${r.statusText}`)
        }
        return r.json()
    })

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

export default function MobileNewsPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const newsUrl = activeCategory
        ? `/api/news?category=${encodeURIComponent(activeCategory)}`
        : `/api/news`

    const { data: categories, error: catError } = useSWR(
        "/api/news/categories",
        fetcher
    )
    const { data, error, isLoading } = useSWR(newsUrl, fetcher)

    const articles: Article[] = (data?.data || []) as Article[]

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
                            const isActive = activeCategory === cat.slug
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
                            )
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
                <div className="space-y-4">
                    {articles.map((item) => {
                        const imgSrc = normalizeImageUrl(item.image_url)

                        return (
                            <article
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                            >
                                {imgSrc && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={imgSrc}
                                        alt={item.title}
                                        className="w-full h-44 object-cover"
                                    />
                                )}

                                <div className="p-4">
                                    <h2 className="text-lg font-semibold leading-snug">
                                        <Link
                                            // NOTE: your routes use /moblie, not /mobile
                                            href={`/moblie/news/${item.slug}`}
                                            className="hover:text-amber-300 transition"
                                        >
                                            {item.title}
                                        </Link>
                                    </h2>

                                    {item.published_at && (
                                        <p className="text-xs text-white/50 mt-1">
                                            {new Date(item.published_at).toLocaleString()}
                                        </p>
                                    )}

                                    {item.excerpt && (
                                        <p className="text-sm text-white/70 mt-2 line-clamp-3">
                                            {item.excerpt}
                                        </p>
                                    )}

                                    <div className="mt-3">
                                        <Link
                                            href={`/moblie/news/${item.slug}`}
                                            className="text-sm font-medium text-amber-300 hover:underline"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </main>
    )
}
