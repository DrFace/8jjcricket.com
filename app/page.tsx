import LiveGrid from '@/components/LiveGrid'
import MinigameCard from '@/components/MinigameCard'
import BannerCarousel from '@/components/BannerCarousel'

export default function HomePage() {
  const latest = [
    { slug: 'cricket-legends', title: 'Cricket Legends', desc: 'Career mode with levels & characters.' },
    { slug: 'cricket-superover', title: 'Cricket Super Over', desc: '6 balls, pure timing — hit for 6s!' }, // ✅ new game
    { slug: 'tictactoe', title: 'Tic Tac Toe', desc: 'Classic 3×3 duel.' },
    { slug: 'flappysquare', title: 'Flappy Square', desc: 'Click to fly!' },
  ]
  const popular = [
    { slug: 'numberguess', title: 'Number Guess', desc: 'Hot or cold 1–100.' },
    { slug: 'tictactoe', title: 'Tic Tac Toe', desc: 'Classic 3×3 duel.' },
    { slug: 'cricket-superover', title: 'Cricket Super Over', desc: '6 balls, pure timing — hit for 6s!' }, // ✅ new game

    
  ]

  return (
    <div className="space-y-8">
      <BannerCarousel />

      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Live Cricket</h1>
        <LiveGrid />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Latest Minigames</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map(g => <MinigameCard key={g.slug} {...g} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Most Popular</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map(g => <MinigameCard key={g.slug} {...g} />)}
        </div>
      </section>
    </div>
  )
}