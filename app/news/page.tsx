"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"

import DesktopOnly from "@/components/DesktopOnly"
import TopNav from "@/components/TopNav"
import Footer from "@/components/Footer"

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

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com"

const fetcher = (url: string) =>
    fetch(url, { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status} ${r.statusText}`)
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

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    const newsUrl = activeCategory
        ? `/api/news?category=${encodeURIComponent(activeCategory)}`
        : `/api/news`

    const { data: categories } = useSWR("/api/news/categories", fetcher)
    const { data, error, isLoading } = useSWR(newsUrl, fetcher)

    const articles: Article[] = (data?.data || []) as Article[]

    return (
            <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
                <TopNav />

                <main className="flex-1 px-4 py-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* LEFT SIDEBAR */}
                        <aside className="md:col-span-1 h-fit sticky top-28">
                            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                                <h2 className="text-lg font-semibold mb-3 text-slate-100">Categories</h2>

                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`block w-full text-left px-3 py-2 rounded-xl mb-1 transition ${activeCategory === null
                                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                        : "text-slate-200 hover:bg-white/5"
                                        }`}
                                >
                                    All News
                                </button>

                                {categories?.data?.map((cat: Category) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.slug)}
                                        className={`block w-full text-left px-3 py-2 rounded-xl mb-1 transition ${activeCategory === cat.slug
                                            ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                                            : "text-slate-200 hover:bg-white/5"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
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
                                        const imgSrc = normalizeImageUrl(item.image_url)

                                        return (
                                            <article
                                                key={item.id}
                                                className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 transition
                                                           hover:border-blue-400/40 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                                            >
                                                {imgSrc && (
                                                    <div className="mb-3 overflow-hidden rounded-xl border border-white/10">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={imgSrc}
                                                            alt={item.title}
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <h2 className="text-xl font-semibold mb-2 text-slate-100">
                                                    <Link
                                                        href={`/news/${item.slug}`}
                                                        className="hover:text-sky-400 transition"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                </h2>

                                                {item.published_at && (
                                                    <p className="text-xs text-slate-400 mb-2">
                                                        {new Date(item.published_at).toLocaleString()}
                                                    </p>
                                                )}

                                                {item.excerpt && (
                                                    <p className="text-sm text-slate-300">
                                                        {item.excerpt}
                                                    </p>
                                                )}

                                                <div className="mt-4">
                                                    <Link
                                                        href={`/news/${item.slug}`}
                                                        className="text-sm font-medium text-sky-400 hover:underline"
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

                <Footer />
            </div>
    )
}
