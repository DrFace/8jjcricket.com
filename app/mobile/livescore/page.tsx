// app/mobile/livescore/page.tsx
import LivescoreClient from "./LivescoreClient";

// --- IMPORT SEO DATA ---
import { liveScoreMetadata, liveScoreJsonLd } from "@/components/seo/liveScore";

// --- EXPORT METADATA ---
export const metadata = liveScoreMetadata;

export default function MobileLivescorePage() {
  return <LivescoreClient />;
}
