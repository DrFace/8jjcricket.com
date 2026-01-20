import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/login/",
          "/signin/",
          "/signup/",
          "/register/",
          "/account/",
          "/profile/",
          "/search",
          "/search/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/search"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
