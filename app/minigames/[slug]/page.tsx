'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Link from 'next/link'
import TopNav from "@/components/TopNav"
import Footer from "@/components/Footer"

export default function GamePage({ params }: { params: { slug: string } }) {
  const Comp = useMemo(() => {
    switch (params.slug) {
      case 'tictactoe':
        return dynamic(() => import('@/components/games/TicTacToe'))
      case 'numberguess':
        return dynamic(() => import('@/components/games/NumberGuess'))
      case 'cricket-superover':
        return dynamic(() => import('@/components/games/CricketSuperOver'), { ssr: false })
      case 'flappysquare':
        return dynamic(() => import('@/components/games/FlappySquare'), { ssr: false })
      case 'cricket-legends':
        return dynamic(() => import('@/components/games/CricketLegends'), { ssr: false })
      case 'stickman-quest':
        return dynamic(() => import('@/components/games/StickmanQuest'), { ssr: false })
      default:
        return () => <div>Game not found.</div>
    }
  }, [params.slug])

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />

      <main className="flex-1 space-y-4 m-1">
        {/* Back button */}
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

        {/* Title */}
        <h1 className="text-2xl font-bold capitalize">
          {params.slug.replace('-', ' ')}
        </h1>

        {/* Game container */}
        <div className="card">
          <Comp />
        </div>
      </main>

      <Footer />
    </div>
  )
}
