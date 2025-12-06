"use client";

import useSWR from "swr";
import Link from "next/link";

type NewsArticle = {
    id: number | string;
    title: string;
    slug?: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewsTicker() {
    const { data, error, isLoading } = useSWR("/api/news?limit=10", fetcher);

    const articles: NewsArticle[] = data?.data ?? [];

    if (isLoading || error || !articles.length) {
        return (
            <div className="flex-1 overflow-hidden text-xs md:text-sm text-white">
                Latest news will appear here…
            </div>
        );
    }

    const items = [...articles, ...articles];

    return (
        <div className="relative flex-1 overflow-hidden">
            <div className="inline-flex whitespace-nowrap animate-news-ticker">
                {items.map((a, idx) => (
                    <Link
                        key={`${a.id}-${idx}`}
                        href={a.slug ? `/news/${a.slug}` : `/news/${a.id}`}
                        className="mx-6 inline-flex whitespace-nowrap hover:underline text-white"
                        style={{ color: "#ffffff" }}   // 👈 force pure white on the <a>
                    >
                        {a.title}
                    </Link>
                ))}
            </div>

            <style jsx>{`
        .animate-news-ticker {
          animation: news-ticker 35s linear infinite;
        }

        @keyframes news-ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
        </div>
    );
}
