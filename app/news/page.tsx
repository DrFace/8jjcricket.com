"use client"

import useSWR from 'swr'

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  published_at: string | null
}

// Fetcher helper for SWR
const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Normalize absolute URLs returned by the API to relative paths
function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.pathname + u.search
  } catch {
    if (url.startsWith('/')) return url
    return null
  }
}

// Metadata is defined in a parent layout or left to the default site settings.
// Do not export metadata from a client component, as this is disallowed in Next.js.

export default function NewsPage() {
  const { data, error, isLoading } = useSWR('/api/news', fetcher)
  // If the API returns an error property we treat it as a failure
  if (error || (data && data.error)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
          <p className="text-slate-400">Failed to load news articles.</p>
        </div>
      </main>
    )
  }
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
          <p className="text-slate-400">Loading news…</p>
        </div>
      </main>
    )
  }
  const articles: Article[] = (data?.data || []) as Article[]
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
        {articles.length === 0 ? (
          <p className="text-slate-400">No news articles found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((item) => {
              const imgSrc = normalizeImageUrl(item.image_url)
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-sky-500 transition"
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
                    <a
                      href={`/news/${item.slug}`}
                      className="hover:text-sky-400"
                    >
                      {item.title}
                    </a>
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
                    <a
                      href={`/news/${item.slug}`}
                      className="text-sm font-medium text-sky-400 hover:underline"
                    >
                      Read more..
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}