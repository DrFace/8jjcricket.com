import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import NewsClient from "@/components/NewsClient"; // Importing the client component

// 1. IMPORT SEO DATA
import { newsMetadata, newsJsonLd } from "@/components/seo/newsSeo";

// 2. EXPORT METADATA (This works because this file is a Server Component)
export const metadata = newsMetadata;

export default function NewsPage() {
  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Main Layout */}
      <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
        <TopNav />

        <main className="flex-1 px-4 py-10">
          <NewsClient />
        </main>

        <Footer />
      </div>
    </>
  );
}
