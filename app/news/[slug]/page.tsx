// app/news/[slug]/page.tsx

type Article = {
    id: number;
    title: string;
    slug: string;
    body: string;
    excerpt: string | null;
    image_url: string | null;
    published_at: string | null;
};

async function getArticle(slug: string): Promise<Article | null> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!base) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
    }

    const res = await fetch(`${base}/news/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("Failed to fetch article:", res.status);
        return null;
    }

    const json = await res.json();
    // Laravel resource: { data: {...} }
    return json.data as Article;
}

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
    const article = await getArticle(params.slug);

    if (!article) {
        return { title: "News | 8jjcricket" };
    }

    return {
        title: `${article.title} | 8jjcricket`,
        description: article.excerpt ?? undefined,
    };
}

export default async function ArticlePage({ params }: Props) {
    const article = await getArticle(params.slug);

    if (!article) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
                <div className="max-w-3xl mx-auto">
                    <a href="/news" className="text-sky-400 hover:underline">
                        ← Back to news
                    </a>
                    <p className="mt-6 text-slate-300">Article not found.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
            <div className="max-w-3xl mx-auto">
                <a href="/news" className="text-sky-400 hover:underline">
                    ← Back to news
                </a>

                <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
                    {article.title}
                </h1>

                {article.published_at && (
                    <p className="text-xs text-slate-400 mb-4">
                        {new Date(article.published_at).toLocaleString()}
                    </p>
                )}

                {article.image_url && (
                    <div className="mb-6 overflow-hidden rounded-2xl">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full max-h-96 object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-invert max-w-none whitespace-pre-line">
                    {article.body}
                </div>
            </div>
        </main>
    );
}
