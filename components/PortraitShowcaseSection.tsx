// components/home/PortraitShowcaseSection.tsx
import PortraitShowcase from "./PortraitShowcase";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_BASE || "https://8jjcricket.com"
).replace(/\/+$/, "");

const API_BASE = `${BACKEND_BASE}/api`.replace(/\/+$/, "");

async function fetchPortraitPages() {
  // Laravel route is: GET /api/portrait-pages
  const url = `${API_BASE}/portrait-pages`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("PortraitShowcaseSection fetch failed:", res.status, url);
    return [];
  }

  const json = await res.json();
  return (json?.data || []) as any[];
}

export default async function PortraitShowcaseSection() {
  const pages = await fetchPortraitPages();

  const published = Array.isArray(pages)
    ? pages.filter(
        (p) =>
          p?.is_published === true ||
          p?.is_published === 1 ||
          p?.is_published === "true"
      )
    : [];

  const withMain = published.filter(
    (p) =>
      p?.main_portrait_path ||
      p?.main_portrait_url ||
      p?.portrait_image_path ||
      p?.portrait_image_url
  );

  return <PortraitShowcase pages={withMain} />;
}
