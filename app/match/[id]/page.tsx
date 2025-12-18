import type { Metadata } from "next"
import Scoreboard from "@/components/Scoreboard"
import TopNav from "@/components/TopNav"
import Footer from "@/components/Footer"

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const id = params.id
  return {
    title: `Scoreboard #${id}`,
    description: `Full scoreboard and ball-by-ball for fixture ${id}.`,
  }
}

export default function MatchPage({ params }: { params: { id: string } }) {
  const id = params.id

  return (
    <div className="min-h-screen bg-[#060A12] text-white">
      <TopNav />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8">
        {/* Hero / Header band (matches 8jjcricket page feel) */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#0B1222] via-[#120B15] to-[#1A0F0E] px-6 py-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B731]/90">
            8JJCRICKET - SCOREBOARD
          </p>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight">Scoreboard</h1>
              <p className="mt-1 text-sm text-white/70">
                Full scorecard and ball-by-ball details.
              </p>
            </div>

            {/* Right side “pill” chips like the site */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Match ID: {id}
              </span>

              <span className="inline-flex items-center rounded-full border border-[#F7B731]/30 bg-[#F7B731]/10 px-3 py-1 text-xs text-[#F7B731]">
                All formats
              </span>
            </div>
          </div>
        </section>

        {/* Content card (matches bordered panels/cards on 8jjcricket) */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#070D18] p-4 md:p-6">
          <Scoreboard id={id} />
        </section>
      </main>

      <Footer />
    </div>
  )
}
