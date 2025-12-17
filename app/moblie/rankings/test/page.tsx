"use client"

import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
import RankingTabBar from '@/components/RankingTabBar'
import { tr } from 'framer-motion/client'
import { groupByGender } from '@/src/utils/groupByGender'
import { RankingEntry } from '@/types/rankings'
import RankingTable from '@/components/mobile/RankingTable'


const fetcher = (url: string) => fetch(url).then((r) => r.json())


/**
 * TestRankingsPage shows ICC Test team rankings for men and women. It
 * injects `<title>` and `<meta>` tags for SEO.
 */
export default function TestRankingsPage() {
  const { data, error, isLoading } = useSWR('/api/team-rankings', fetcher)
  const title = 'Test Team Rankings | 8jjcricket'
  const description = 'ICC Test team rankings for men and women teams.'

    const rankingTabs = [
    { label: "ODI", href: "odi", active: false },
    { label: "T20I", href: "t20i", active: false },
    { label: "Test", href: "test", active: true },
];

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
  const { men, women } = groupByGender(rankings, ['TEST'])
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold mb-4">ICC Test Team Rankings</h1>
        <RankingTabBar tabs={rankingTabs} />
         {men.length > 0 ? (
              <RankingTable
                data={men}
                title="Men Rankings"
                onViewAll={() =>
                  console.log("View All need to change this function")
                }
              />
            ) : (
              <div className="card text-gray-500 text-center">No men's rankings available</div>
            )}
            {women.length > 0 ? (
              <RankingTable
                data={women}
                title="Women Rankings"
                onViewAll={() =>
                  console.log("View All need to change this function")
                }
              />
            ) : (
              <div className="card text-gray-500 text-center">No women's rankings available</div>
            )}
      </div>
    </>
  )
}