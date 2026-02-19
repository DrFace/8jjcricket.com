// components/HomeNewsShowcase.tsx
import Link from "next/link";
import NewsListCards from "@/components/NewsListCards";
import { HOME_NEWS_PARAM } from "@/lib/constant";

type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;

  category?: {
    id?: number;
    slug?: string | null;
    name?: string | null;
  } | null;

  category_name?: string | null;
};

const DEFAULT_API_BASE = "http://72.60.107.98:8001/api";
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";


function formatDate(date?: string | null) {
  if (!date) return "";
  return date.slice(0, 10);
}


async function fetchNews(): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE;
  const res = await fetch(`${base.replace(/\/+$/, "")}/news${HOME_NEWS_PARAM}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function HomeNewsShowcase() {
  const news = await fetchNews();

  const items = news

  const featured = items.at(0);

  if (!featured) {
    return (
      <div className="text-white/60 text-center py-10">No news available</div>
    );
  }

  const listItems = items.slice(1, 5).map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    imgSrc: n.image_url!,
    excerpt: n.excerpt,
    date: formatDate(n.published_at),
  }));

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.25fr,0.75fr]">
        {/* LEFT — Featured */}
        <Link
          href={`/news/${featured.slug}`}
          className="group relative overflow-hidden rounded-3xl india-card-green-glow transition-all duration-500 hover:scale-[1.05] hover:rotate-x-3 hover:translate-z-10 hover:shadow-2xl shadow-lg"
        >
          {/* Image */}
          <div
            className="relative w-full h-[28vw] max-h-[440px] min-h-[260px]
                       overflow-hidden rounded-t-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out
                         group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${featured.image_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-india-charcoal via-india-charcoal/50 to-transparent" />

            {/* subtle shine */}
            <div
              className="pointer-events-none absolute -inset-x-24 -top-24 h-48 rotate-12 bg-india-saffron/20 blur-2xl opacity-0
                         transition-opacity duration-700 group-hover:opacity-100"
            />
          </div>

          {/* Content */}
          <div className="p-6 lg:p-7">
            <div className="india-header-text text-sm mb-1 inline-block">
              {formatDate(featured.published_at)}
            </div>

            <h3 className="mt-3 line-clamp-2 text-2xl lg:text-[28px] font-extrabold text-white group-hover:text-india-gold transition-colors">
              {featured.title}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm text-gray-300">
              {featured.excerpt || featured.title}
            </p>

            {/* CTA */}
            <div className="mt-5">
              <div
                className="india-btn-primary inline-block text-sm"
              >
                Read more
              </div>
            </div>
          </div>
        </Link>

        {/* RIGHT — List */}
        <div className="flex flex-col">
          <NewsListCards items={listItems} />

          <Link
            href="/news"
            className="mt-4 flex items-center justify-center rounded-2xl india-card-gold-glow py-4 text-sm font-semibold text-india-gold
                        transition hover:scale-[1.01]"
          >
            View more →
          </Link>
        </div>
      </div>
    </div>
  );
}

