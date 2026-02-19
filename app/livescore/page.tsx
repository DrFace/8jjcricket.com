import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import DesktopOnly from "@/components/DesktopOnly";
import LiveScoreHome from "./LiveScoreClient";

// --- IMPORT SEO DATA ---
import { liveScoreMetadata, liveScoreJsonLd } from "@/components/seo/liveScore";

// --- EXPORT METADATA ---
export const metadata = liveScoreMetadata;

export default function LiveScorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* --- INJECT SCHEMA JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(liveScoreJsonLd) }}
      />
      {/* ----------------------------- */}

      <TopNav />
      <main className="flex-1">
        <DesktopOnly>
          <LiveScoreHome />
        </DesktopOnly>
      </main>
      <Footer />
    </div>
  );
}
