"use client"

import useSWR from 'swr'
import Image from 'next/image'

interface RankingTeam {
  id: number
  name: string
  code: string
  image_path: string
  ranking: {
    position: number
    matches: number
    points: number
    rating: number
  }
}
interface RankingEntry {
  resource: string
  type: string
  team: RankingTeam[]
}
const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * RankingsPage shows overall ICC team rankings grouped by format. It adds
 * page-level SEO metadata using `<title>` and `<meta>` tags, since client
 * components cannot export a `metadata` object. See the Next.js docs for
 * details【744642906249488†L34-L87】.
 */
export default function RankingsPage() {
  const { data, error, isLoading } = useSWR('/api/team-rankings', fetcher)
  const title = 'Team Rankings | 8jjcricket'
  const description = 'Check ICC team rankings across Test, ODI and T20 formats for men and women.'
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load team rankings.{' '}{typeof error === 'string' ? error : ''}</div>
      </>
    )
  }
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card animate-pulse">Loading rankings…</div>
      </>
    )
  }
  const rankings: RankingEntry[] = data?.data ?? []
  // Group by ranking type (TEST, ODI, T20I, etc.)
  const groups: Record<string, RankingTeam[]> = {}
  for (const r of rankings) {
    if (!r.team) continue
    groups[r.type] = r.team
  }
  const sortedTypes = Object.keys(groups).sort((a, b) => {
    // order as Test, ODI, T20I, then others alphabetically
    const order = ['TEST', 'ODI', 'T20', 'T20I']
    const ia = order.indexOf(a)
    const ib = order.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-white india-header-text mb-4">ICC Team Rankings</h1>
        {sortedTypes.map((type) => {
          const teams = groups[type]
          return (
            <div key={type} className="overflow-x-auto">
              <h2 className="text-xl font-bold text-india-gold mb-3 capitalize">
                {type} Rankings
              </h2>
              <table className="min-w-full border border-india-gold/20 divide-y divide-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-india-saffron via-india-gold to-india-orange text-black">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Pos</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Matches</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Points</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {teams.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-india-gold">
                        {t.ranking.position}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                        <Image
                          src={t.image_path}
                          alt={t.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <span className="text-white font-medium">{t.name}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sky-100/80">
                        {t.ranking.matches}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sky-100/80">
                        {t.ranking.points}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-white font-bold">
                        {t.ranking.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </>
  )
}