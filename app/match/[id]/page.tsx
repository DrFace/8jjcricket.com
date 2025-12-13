"use client"

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Ball {
  id: number
  over: number
  ball: number
  runs: number
  commentary?: string
  score?: string
}

export default function MatchPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState('scorecard')

  const { data: scorecardData, isLoading: scorecardLoading } = useSWR(
    `/api/match/${params.id}/scorecard`,
    fetcher
  )
  const { data: commentaryData, isLoading: commentaryLoading } = useSWR(
    tab === 'commentary' ? `/api/match/${params.id}/commentary` : null,
    fetcher
  )

  if (scorecardLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const match = scorecardData?.data

  if (!match) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Match not found</p>
      </div>
    )
  }

  const tabs = [
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'commentary', label: 'Commentary' },
    { id: 'info', label: 'Info' },
  ]

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">
              {match.league?.name} • {match.stage?.name || 'Match'}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {match.localteam?.name} vs {match.visitorteam?.name}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{match.venue?.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(match.starting_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Teams & Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">
              {match.localteam?.name}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {match.runs?.[0]?.score || 'Yet to bat'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-900 mb-2">
              {match.visitorteam?.name}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {match.runs?.[1]?.score || 'Yet to bat'}
            </p>
          </div>
        </div>

        {/* Match Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-800 capitalize">
            {match.status || 'Scheduled'}
          </p>
          {match.note && (
            <p className="text-xs text-blue-700 mt-1">{match.note}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Scorecard Tab */}
        {tab === 'scorecard' && (
          <div className="space-y-6">
            {match.scoreboards && match.scoreboards.length > 0 ? (
              match.scoreboards.map((inn: any) => (
                <div key={inn.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {inn.team?.name || 'Team'} Innings
                    </h2>
                    <p className="text-lg font-bold text-gray-900">
                      {inn.total}/{inn.wickets} ({inn.overs} ov)
                    </p>
                  </div>

                  {/* Batting */}
                  {inn.batting && inn.batting.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batter</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">R</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">B</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">4s</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">6s</th>
                            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">SR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {inn.batting.slice(0, 11).map((bat: any) => (
                            <tr key={bat.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-900">{bat.player?.fullname || bat.player_id}</td>
                              <td className="px-3 py-2 text-center text-gray-900 font-medium">{bat.score || 0}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{bat.ball || 0}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{bat.four_x || 0}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{bat.six_x || 0}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{bat.rate || '0.0'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bowling */}
                  {inn.bowling && inn.bowling.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">Bowling</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bowler</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">O</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">M</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">R</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">W</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Econ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {inn.bowling.slice(0, 6).map((bowl: any) => (
                              <tr key={bowl.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-gray-900">{bowl.player?.fullname || bowl.player_id}</td>
                                <td className="px-3 py-2 text-center text-gray-600">{bowl.overs || 0}</td>
                                <td className="px-3 py-2 text-center text-gray-600">{bowl.medians || 0}</td>
                                <td className="px-3 py-2 text-center text-gray-600">{bowl.runs || 0}</td>
                                <td className="px-3 py-2 text-center text-gray-900 font-medium">{bowl.wickets || 0}</td>
                                <td className="px-3 py-2 text-center text-gray-600">{bowl.rate || '0.0'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <hr className="my-6" />
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Scorecard not available yet
              </p>
            )}
          </div>
        )}

        {/* Commentary Tab */}
        {tab === 'commentary' && (
          <div>
            {commentaryLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading commentary...</p>
              </div>
            ) : commentaryData?.data?.balls && commentaryData.data.balls.length > 0 ? (
              <div className="space-y-3">
                {commentaryData.data.balls.slice(0, 50).map((ball: Ball) => (
                  <div key={ball.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {ball.over}.{ball.ball}
                      </span>
                      <span className="mx-2">–</span>
                      <span className="text-gray-700">
                        {ball.commentary || ball.score || `${ball.runs} run(s)`}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                Ball-by-ball commentary not available
              </p>
            )}
          </div>
        )}

        {/* Info Tab */}
        {tab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Series</p>
                <p className="font-medium text-gray-900">{match.league?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Venue</p>
                <p className="font-medium text-gray-900">{match.venue?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(match.starting_at).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Match Type</p>
                <p className="font-medium text-gray-900 capitalize">{match.type || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
