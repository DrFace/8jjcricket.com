import { Suspense } from "react";
import SeriesClient from "./SeriesClient";

// --- IMPORT SEO DATA ---
import { seriesMetadata, seriesJsonLd } from "@/components/seo/SeriesSeo";

// --- EXPORT METADATA ---
export const metadata = seriesMetadata;

export default function Page() {
  return (
    <>
      {/* --- INJECT SCHEMA JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd) }}
      />
      {/* ----------------------------- */}

      <Suspense
        fallback={
          <div className="p-6 text-amber-200 animate-pulse">
            Loading series...
          </div>
        }
      >
        <SeriesClient />
      </Suspense>
    </>
  );
}
