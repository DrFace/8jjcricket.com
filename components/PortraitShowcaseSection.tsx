// components/home/PortraitShowcaseSection.tsx
import PortraitShowcase from "./PortraitShowcase";

const BACKEND_ORIGIN =
    (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://72.60.107.98:8001").replace(/\/+$/, "");

async function fetchPortraitPages() {
    const url = `${BACKEND_ORIGIN}/api/portrait-pages`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const json = await res.json();
    return (json?.data || []) as any[];
}

export default async function PortraitShowcaseSection() {
    const pages = await fetchPortraitPages();

    // Keep only published
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
