import { SITE } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ===============================
  // STATIC ROUTES (DESKTOP ONLY)
  // Keep: livescore, minigames, news, gallery
  // ===============================
  const staticDesktopRoutes = ["/livescore", "/minigames", "/gallery", "/news"];

  staticDesktopRoutes.forEach((path) => {
    urls.push({
      url: `${SITE.url}${path}`,
      lastModified: now,
    });
  });

  // ===============================
  // DYNAMIC: NEWS (DESKTOP ONLY)
  // ===============================
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/news`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();

      data?.data?.forEach((item: any) => {
        if (!item?.slug) return;

        const lastMod = item.updated_at ? new Date(item.updated_at) : now;

        urls.push({
          url: `${SITE.url}/news/${item.slug}`,
          lastModified: lastMod,
        });
      });
    }
  } catch {}

  return urls;
}
