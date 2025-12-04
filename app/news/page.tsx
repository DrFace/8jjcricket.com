// app/news/page.tsx

type Article = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
};

async function getNews(): Promise<Article[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!base) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
    }

    const res = await fetch(`${base}/news?published_only=1`, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("Failed to fetch news:", res.status);
        try {
            console.error(await res.text());
        } catch { }
        return [];
    }

    const json = await res.json();
    // Laravel resource collection: { data: [...] }
    return json.data as Article[];
}

export const metadata = {
    title: "News | 8jjcricket",
};

export default async function NewsPage() {
    const articles = await getNews();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Latest News</h1>

                {articles.length === 0 ? (
                    <p className="text-slate-400">No news articles found.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {articles.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-sky-500 transition"
                            >
                                {item.image_url && (
                                    <div className="mb-3 overflow-hidden rounded-xl">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    </div>
                                )}

                                <h2 className="text-xl font-semibold mb-2">
                                    <a href={`/news/${item.slug}`} className="hover:text-sky-400">
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
                                        Read more →
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
