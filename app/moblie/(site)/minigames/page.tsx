import MinigameCard from '@/components/MinigameCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minigames',
  description: 'Play casual minigames while you follow live cricket.'
}

const GAMES = [
  { slug: 'stickman-quest', title: 'Stickman Quest', desc: 'Dash, slash, and level up.' }, // 👈 add this
  { slug: 'tictactoe', title: 'Tic Tac Toe', desc: 'Classic 3×3 duel.' },
  { slug: 'numberguess', title: 'Number Guess', desc: 'Hot or cold 1–100.' },
  { slug: 'flappysquare', title: 'Flappy Square', desc: 'Click to fly!' },
  { slug: 'cricket-superover', title: 'Cricket Super Over', desc: '6 balls, pure timing — hit for 6s!' }, // ✅ new game
  { slug: 'cricket-legends', title: 'Cricket Legends', desc: 'Career mode with levels & characters.' }
  


]

export default function MinigamesPage() {
  return (
    <div className="space-y-4 m-1">
      <h1 className="text-2xl font-bold">Minigames</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(g => <MinigameCard key={g.slug} {...g} />)}
      </div>
    </div>
  )
}