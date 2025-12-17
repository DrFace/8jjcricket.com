
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

type CareerStat = {
  type: string
  batting?: {
    matches: number
    innings: number
    runs_scored: number
    highest_inning_score: number
    strike_rate: number
    average: number
    hundreds: number
    fifties: number
  }
}
type Player = {
  id: number
  fullname: string
  firstname: string
  lastname: string
  image_path: string
  country?: { name: string }
  dateofbirth?: string
  gender?: string
  battingstyle?: string
  bowlingstyle?: string
  career?: CareerStat[]
}

export default function PlayerDetailPage() {
  const { id } = useParams()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const res = await fetch(`/api/players/${id}`)
        if (!res.ok) throw new Error('Failed to fetch player')
        const json = await res.json()
        setPlayer(json.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <>
        <title>Loading Player | 8jjcricket</title>
        <meta name="description" content="Loading player profile." />
        <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
          Loading player details...
          <div className="mt-4 h-6 w-6 animate-spin rounded-full border-4 border-amber-400 border-t-transparent mx-auto"></div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <title>Player Error | 8jjcricket</title>
        <meta name="description" content={error} />
        <div className="rounded-2xl border border-red-500/30 bg-black/70 p-6 text-sm text-red-300 backdrop-blur-xl">
          {error}
        </div>
      </>
    )
  }

  if (!player) {
    return (
      <>
        <title>Player Not Found | 8jjcricket</title>
        <meta name="description" content="Player not found." />
        <div className="rounded-2xl border border-white/15 bg-black/50 p-6 text-center text-sm text-sky-100/70 backdrop-blur-xl">
          Player not found.
        </div>
      </>
    )
  }

  return (
    <>
      <title>{player.fullname} | Player Profile | 8jjcricket</title>
      <meta
        name="description"
        content={`View ${player.fullname}'s player profile, stats and information on 8jjcricket.`}
      />
      <div className="mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <Image
              src={player.image_path || '/placeholder.png'}
              alt={player.fullname}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{player.fullname}</h1>
            <p className="text-amber-300">
              {player.country?.name ? player.country.name : 'Unknown Country'}
            </p>
            <div className="mt-3 space-y-1 text-sm text-sky-100/70">
              {player.dateofbirth && (
                <p>
                  <strong>DOB:</strong> {player.dateofbirth}
                </p>
              )}
              {player.battingstyle && (
                <p>
                  <strong>Batting Style:</strong> {player.battingstyle}
                </p>
              )}
              {player.bowlingstyle && (
                <p>
                  <strong>Bowling Style:</strong> {player.bowlingstyle}
                </p>
              )}
            </div>
          </div>
        </div>

        {player.career && player.career.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">Career Statistics</h2>
            <div className="overflow-x-auto rounded-xl border border-white/15 bg-black/50 backdrop-blur-xl">
              <table className="min-w-full text-sm text-left text-sky-100/70">
                <thead className="bg-slate-900/80 text-amber-300">
                  <tr>
                    <th className="px-4 py-2">Format</th>
                    <th className="px-4 py-2">Matches</th>
                    <th className="px-4 py-2">Innings</th>
                    <th className="px-4 py-2">Runs</th>
                    <th className="px-4 py-2">HS</th>
                    <th className="px-4 py-2">Avg</th>
                    <th className="px-4 py-2">SR</th>
                    <th className="px-4 py-2">100s</th>
                    <th className="px-4 py-2">50s</th>
                  </tr>
                </thead>
                <tbody>
                  {player.career.map((c) => (
                    <tr key={c.type} className="border-t border-white/10">
                      <td className="px-4 py-2 font-semibold text-amber-300">{c.type}</td>
                      <td className="px-4 py-2">{c.batting?.matches ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.innings ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.runs_scored ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.highest_inning_score ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.average ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.strike_rate ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.hundreds ?? '-'}</td>
                      <td className="px-4 py-2">{c.batting?.fifties ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
