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

/**
 * NewsPage displays a list of the latest news articles. It conforms to the
 * overall light theme of the site and provides on-page SEO metadata via
 * `<title>` and `<meta>` tags. Because this is a client component, Next.js
 * does not allow exporting a static `metadata` object. Instead, the head
 * tags are rendered directly as part of the component output. See the
 * Next.js documentation for more details【744642906249488†L34-L87】.
 */
export default function NewsPage() {
  const { data, error, isLoading } = useSWR('/api/news', fetcher)

  // Define page title and description for SEO
  const title = 'Latest News | 8jjcricket'
  const description = 'Stay updated with the latest cricket news and articles on 8jjcricket.'

  // Render error state
  if (error || (data && data.error)) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
            <p className="text-gray-500">Failed to load news articles.</p>
          </div>
        </main>
      </>
    )
  }

  // Render loading state
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
            <p className="text-gray-500">Loading news…</p>
          </div>
        </main>
      </>
    )
  }

  // Extract articles from API response
  const articles: Article[] = (data?.data || []) as Article[]

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>
          {articles.length === 0 ? (
            <p className="text-gray-500">No news articles found.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
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
        </div>
      </main>
    </>
  )
}