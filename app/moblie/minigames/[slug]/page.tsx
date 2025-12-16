'use client'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

export default function GamePage({ params }: { params: { slug: string } }) {
  const Comp = useMemo(() => {
    switch (params.slug) {
      case 'tictactoe': return dynamic(() => import('@/components/games/TicTacToe'))
      case 'numberguess': return dynamic(() => import('@/components/games/NumberGuess'))
      case 'cricket-superover': return dynamic(() => import('@/components/games/CricketSuperOver'), { ssr: false })
      case 'flappysquare': return dynamic(() => import('@/components/games/FlappySquare'), { ssr: false })
      case 'cricket-legends': return dynamic(() => import('@/components/games/CricketLegends'), { ssr: false })
      case 'stickman-quest':
        return dynamic(() => import('@/components/games/StickmanQuest'), { ssr: false })

      default: return () => <div>Game not found.</div>
    }
  }, [params.slug])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">{params.slug.replace('-', ' ')}</h1>
      <div className="card">
        <Comp />
      </div>
    </div>
  )
}