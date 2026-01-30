// app/news-sitemap/route.ts
import { SITE } from "@/lib/seo";

export async function GET() {
  const baseUrl = SITE.url || "https://8jjcricket.com";
  
  // Fetch ONLY recent news (You might need a backend filter or slice the array here)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news`, { next: { revalidate: 600 } });
  const data = await res.json();
  
  // Filter for last 48 hours
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentNews = data.data.filter((item: any) => new Date(item.published_at) > twoDaysAgo);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentNews.map((item: any) => `
        <url>
          <loc>${baseUrl}/news/${item.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>8JJ Cricket</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${item.published_at}</news:publication_date>
            <news:title>${item.title.replace(/&/g, '&amp;')}</news:title>
          </news:news>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}