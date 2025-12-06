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

export default function RankingsPage() {
  const { data, error, isLoading } = useSWR('/api/team-rankings', fetcher)

  if (error) {
    return (
      <div className="card">Failed to load team rankings.{' '}{
        typeof error === 'string' ? error : ''
      }</div>
    )
  }
  if (isLoading) {
    return <div className="card animate-pulse">Loading rankings…</div>
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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold mb-4">ICC Team Rankings</h1>
      {sortedTypes.map((type) => {
        const teams = groups[type]
        return (
          <div key={type} className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2 capitalize">{type}{' '}Rankings</h2>
            <table className="min-w-full border divide-y divide-gray-200 bg-white rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Matches</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Points</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">
                      {t.ranking.position}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                      <Image
                        src={t.image_path}
                        alt={t.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span>{t.name}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {t.ranking.matches}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                      {t.ranking.points}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700 font-semibold">
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
  )
}