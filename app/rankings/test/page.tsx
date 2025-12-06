"use client"

import useSWR from 'swr'
import Link from 'next/link'
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

function groupByGender(rankings: RankingEntry[], targetType: string) {
  const result = { men: [] as RankingTeam[], women: [] as RankingTeam[] }
  for (const entry of rankings) {
    if (!entry.team) continue
    const type = entry.type?.toUpperCase() || ''
    if (!type.includes(targetType.toUpperCase())) continue
    const resource = entry.resource?.toLowerCase() || ''
    const isWomen = resource.includes('women') || resource.includes('female')
    if (isWomen) {
      result.women = entry.team
    } else {
      result.men = entry.team
    }
  }
  return result
}

/**
 * TestRankingsPage shows ICC Test team rankings for men and women. It
 * injects `<title>` and `<meta>` tags for SEO.
 */
export default function TestRankingsPage() {
  const { data, error, isLoading } = useSWR('/api/team-rankings', fetcher)
  const title = 'Test Team Rankings | 8jjcricket'
  const description = 'ICC Test team rankings for men and women teams.'
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load team rankings.{typeof error === 'string' ? ` ${error}` : ''}</div>
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
  const { men, women } = groupByGender(rankings, 'TEST')
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold mb-4">ICC Test Team Rankings</h1>
        <div className="flex gap-2 mb-4">
          <Link href="/rankings/odi" className="px-4 py-2 rounded-md font-medium text-blue-600 bg-gray-100 hover:bg-gray-200">ODI</Link>
          <Link href="/rankings/t20i" className="px-4 py-2 rounded-md font-medium text-blue-600 bg-gray-100 hover:bg-gray-200">T20I</Link>
          <Link href="/rankings/test" className="px-4 py-2 rounded-md font-medium text-white bg-blue-600">Test</Link>
        </div>
        {men.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Men</h2>
            <div className="overflow-x-auto">
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
                  {men.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">{team.ranking.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                        <Image src={team.image_path} alt={team.name} width={24} height={24} className="object-contain" />
                        <span>{team.name}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">{team.ranking.matches}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">{team.ranking.points}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700 font-semibold">{team.ranking.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {women.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Women</h2>
            <div className="overflow-x-auto">
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
                  {women.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-700">{team.ranking.position}</td>
                      <td className="px-4 py-2 whitespace-nowrap flex items-center gap-2">
                        <Image src={team.image_path} alt={team.name} width={24} height={24} className="object-contain" />
                        <span>{team.name}</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">{team.ranking.matches}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700">{team.ranking.points}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-700 font-semibold">{team.ranking.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  )
}