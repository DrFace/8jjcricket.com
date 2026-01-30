import { MetadataRoute } from "next";

// Define your API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://8jjcricket.com/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

// Helper to fetch data safely
async function fetchSitemapData(endpoint: string) {
  try {
    // Revalidate every 15 minutes to keep sitemap fresh without overloading server
    const res = await fetch(`${API_BASE}/${endpoint}`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Sitemap Error (${endpoint}):`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Parallel Data Fetching (Fastest Method)
  // ✅ OPTIMIZED: Removed 'teamsData' to save server resources and crawl budget
  const [newsData, seriesData] = await Promise.all([
    fetchSitemapData("news"),   // Critical for Discover
    fetchSitemapData("series"), // Critical for "IPL Schedule" queries
  ]);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // ==========================================
  // 1. CORE STATIC PAGES (The Backbone)
  // ==========================================
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0, // Homepage is king
    },
    {
      url: `${SITE_URL}/livescore`,
      lastModified: now,
      changeFrequency: "always", // Tells Google: "Crawl this constantly"
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: "hourly", // News hub updates often
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/series`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/rankings`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/archive`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/minigames`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Push static pages
  // @ts-ignore - TypeScript sometimes complains about strict string types for frequency
  sitemapEntries.push(...staticPages);

  // ==========================================
  // 2. DYNAMIC NEWS (Freshness Algorithm)
  // ==========================================
  if (Array.isArray(newsData)) {
    newsData.forEach((item: any) => {
      if (!item.slug) return;

      const publishedAt = item.updated_at ? new Date(item.updated_at) : new Date(item.published_at);
      
      // Check if news is fresh (< 24 hours)
      const isFresh = (now.getTime() - publishedAt.getTime()) < (24 * 60 * 60 * 1000);

      sitemapEntries.push({
        url: `${SITE_URL}/news/${item.slug}`,
        lastModified: publishedAt,
        changeFrequency: isFresh ? "hourly" : "monthly", // Stop crawling old news often
        priority: isFresh ? 0.9 : 0.5, // Prioritize fresh content
      });
    });
  }

  // ==========================================
  // 3. DYNAMIC SERIES (Tournaments)
  // ==========================================
  if (Array.isArray(seriesData)) {
    seriesData.forEach((item: any) => {
      if (!item.slug && !item.id) return;
      const slug = item.slug || item.id; // Fallback to ID if slug missing

      sitemapEntries.push({
        url: `${SITE_URL}/series/${slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency: "daily", // Schedules change, points tables update
        priority: 0.8,
      });
    });
  }

  return sitemapEntries;
}