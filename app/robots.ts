import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://8jjcricket.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",             // Block backend API routes (Google doesn't need JSON)
        "/admin/",           // Block admin panels
        "/dashboard/",       // Block user dashboards
        "/account/",         // Block private user account pages
        "/login",            // Block auth pages
        "/register",
        "/search",           // CRITICAL: Block internal search results (prevents duplicate/thin content)
        "/_next/",           // Block Next.js internal build files
        "/*.json$",          // Block raw JSON files if any exist publicly
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}