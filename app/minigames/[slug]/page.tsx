import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { fetchGameBySlug } from "@/lib/games-api";
import BuiltInGameRouter from "@/components/BuiltInGameRouter";

export default async function GamePage({ params }: { params: { slug: string } }) {
  // Try DB first: if exists, we show iframe embed
  let dbGame:
    | {
      title: string;
      embed: string;
      description: string | null;
    }
    | null = null;

  try {
    const g = await fetchGameBySlug(params.slug);
    if (g?.embed) {
      dbGame = { title: g.title, embed: g.embed, description: g.description };
    }
  } catch {
    dbGame = null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 space-y-4 m-1">
        <Link
          href="/minigames"
          className="inline-flex items-center gap-2 rounded-full
                     bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#EA580C]
                     px-4 py-2 text-sm font-semibold text-black
                     shadow-lg shadow-amber-500/40
                     ring-1 ring-white/20
                     hover:brightness-110 active:scale-95"
        >
          ← Back to Minigames
        </Link>

        {dbGame ? (
          <>
            <h1 className="text-2xl font-bold">{dbGame.title}</h1>
            {dbGame.description ? (
              <p className="text-sm text-white/80">{dbGame.description}</p>
            ) : null}

            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <iframe
                src={dbGame.embed}
                className="w-full"
                style={{ height: "75vh" }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold capitalize">
              {params.slug.replace(/-/g, " ")}
            </h1>
            {/* Fallback to your built-in minigames switch */}
            <BuiltInGameRouter slug={params.slug} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
