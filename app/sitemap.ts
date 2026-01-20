import { SITE } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ===============================
  // STATIC DESKTOP ROUTES
  // ===============================
  const staticDesktopRoutes = [
    "",
    "/archive",
    "/gallery",
    "/livescore",
    "/minigames",
    "/rankings",
    "/recent",
    "/series",
    "/teams",
    "/upcoming",
    "/portraits",
    "/search",
    "/stream",
    "/privacy-policy",
  ];

  staticDesktopRoutes.forEach((path) => {
    urls.push({
      url: `${SITE.url}${path}`,
      lastModified: now,
    });
  });

  // ===============================
  // STATIC MOBILE ROUTES
  // ===============================
  const staticMobileRoutes = [
    "/mobile",
    "/mobile/archive",
    "/mobile/gallery",
    "/mobile/livescore",
    "/mobile/minigames",
    "/mobile/rankings",
    "/mobile/recent",
    "/mobile/series",
    "/mobile/teams",
    "/mobile/upcoming",
  ];

  staticMobileRoutes.forEach((path) => {
    urls.push({
      url: `${SITE.url}${path}`,
      lastModified: now,
    });
  });

  // ===============================
  // DYNAMIC: NEWS (DESKTOP + MOBILE)
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

        urls.push(
          {
            url: `${SITE.url}/news/${item.slug}`,
            lastModified: lastMod,
          },
          {
            url: `${SITE.url}/mobile/news/${item.slug}`,
            lastModified: lastMod,
          },
        );
      });
    }
  } catch {}

  // ===============================
  // DYNAMIC: MATCHES (DESKTOP + MOBILE)
  // ===============================
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/matches`, {
      next: { revalidate: 1800 },
    });

    if (res.ok) {
      const data = await res.json();

      data?.data?.forEach((match: any) => {
        if (!match?.id) return;

        const lastMod = match.updated_at ? new Date(match.updated_at) : now;

        urls.push(
          {
            url: `${SITE.url}/match/${match.id}`,
            lastModified: lastMod,
          },
          {
            url: `${SITE.url}/mobile/match/${match.id}`,
            lastModified: lastMod,
          },
        );
      });
    }
  } catch {}

  // ===============================
  // DYNAMIC: TEAMS (DESKTOP + MOBILE)
  // ===============================
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/teams`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();

      data?.data?.forEach((team: any) => {
        if (!team?.id) return;

        const lastMod = team.updated_at ? new Date(team.updated_at) : now;

        urls.push(
          {
            url: `${SITE.url}/teams/${team.id}`,
            lastModified: lastMod,
          },
          {
            url: `${SITE.url}/mobile/teams/${team.id}`,
            lastModified: lastMod,
          },
        );
      });
    }
  } catch {}

  // ===============================
  // DYNAMIC: PLAYERS (DESKTOP + MOBILE)
  // ===============================
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/players`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();

      data?.data?.forEach((player: any) => {
        if (!player?.id) return;

        urls.push(
          {
            url: `${SITE.url}/players/${player.id}`,
            lastModified: now,
          },
          {
            url: `${SITE.url}/mobile/players/${player.id}`,
            lastModified: now,
          },
        );
      });
    }
  } catch {}

  return urls;
}
