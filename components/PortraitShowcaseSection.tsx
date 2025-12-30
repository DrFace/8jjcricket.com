// components/home/PortraitShowcaseSection.tsx
import PortraitShowcase from "./PortraitShowcase";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://8jjcricket.com/api").replace(
    /\/+$/,
    ""
);

async function fetchPortraitPages() {
    // Laravel route is: GET /api/portrait-pages
    // If API_BASE already ends with /api, do NOT add another /api.
    const url = `${API_BASE}/portrait-pages`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        // helpful server log (visible in terminal where Next.js runs)
        console.error("PortraitShowcaseSection fetch failed:", res.status, url);
        return [];
    }

    const json = await res.json();
    return (json?.data || []) as any[];
}

export default async function PortraitShowcaseSection() {
    const pages = await fetchPortraitPages();

    // Keep only published (backend already filters is_published=true, but keep your safety filter)
    const published = Array.isArray(pages)
        ? pages.filter(
            (p) => p?.is_published === true || p?.is_published === 1 || p?.is_published === "true"
        )
        : [];

    // Only items that have a main portrait (or fallback portrait)
    const withMain = published.filter(
        (p) =>
            p?.main_portrait_path ||
            p?.main_portrait_url ||
            p?.portrait_image_path ||
            p?.portrait_image_url
    );

    return <PortraitShowcase pages={withMain} />;
}
