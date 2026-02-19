import { Suspense } from "react";
import SeriesClient from "./SeriesClient";

// --- IMPORT SEO DATA ---
import { seriesMetadata, seriesJsonLd } from "@/components/seo/SeriesSeo";

// --- EXPORT METADATA ---
export const metadata = seriesMetadata;

export default function Page() {
  return (
        <Suspense fallback={<div className="p-6">Loading series…</div>}>
      <SeriesClient />
    </Suspense>
  );
}
