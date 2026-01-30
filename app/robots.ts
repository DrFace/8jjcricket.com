import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

  return {
    rules: [
      // Rule 1: Encourage aggressive crawling for news bots (Google Discover)
      {
        userAgent: "Googlebot-News",
        allow: "/",
        crawlDelay: 0, // Crawl as fast as possible for news
      },
      
      // Rule 2: Standard Googlebot (main search)
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/account/",
          "/login",
          "/register",
          "/*?*sort=", // Block URL parameters that create duplicates
          "/*?*filter=",
          "/*&page=", // Prevent indexing of paginated duplicates
        ],
        crawlDelay: 1, // Faster crawling for live scores
      },

      // Rule 3: Image crawlers (for Google Images traffic)
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },

      // Rule 4: All other bots
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/account/",
          "/login",
          "/register",
          "/checkout/",
          "/cart/",
          "/_next/", // Next.js internal files
          "/static/", // If you have static assets folder
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
