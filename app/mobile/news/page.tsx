import MobileNewsClient from "@/components/MobileNewsClient";

// 1. IMPORT SEO DATA
import { newsMetadata, newsJsonLd } from "@/components/seo/newsSeo";

// 2. EXPORT METADATA (Server-Side)
export const metadata = newsMetadata;

export default function MobileNewsPage() {
  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Render Client Logic */}
      <MobileNewsClient />
    </>
  );
}
