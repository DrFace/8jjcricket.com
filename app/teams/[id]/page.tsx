"use client"

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

interface Country {
  id: number
  name: string
  image_path?: string
}

interface Player {
  id: number
  fullname: string
  image_path?: string
  position?: {
    name: string
  }
  dateofbirth?: string
  battingstyle?: string
  bowlingstyle?: string
}

interface Team {
  id: number
  name: string
  code: string
  image_path?: string
  national_team: boolean
  country?: Country
  squad?: {
    data?: Player[]
  }
  updated_at?: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useSWR(`/api/teams/${params.id}`, fetcher)
  
  const teamData: Team = data?.data

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/teams" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
          ← Back to Teams
        </Link>
        <div className="rounded-2xl border border-red-500/30 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-red-300 font-medium">Failed to load team details. Please try again later.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-900/80 border border-white/20 rounded w-32 mb-6 backdrop-blur-xl"></div>
          <div className="h-32 bg-slate-900/80 border border-white/20 rounded-3xl mb-6 backdrop-blur-xl"></div>
          <div className="h-64 bg-slate-900/80 border border-white/20 rounded-2xl backdrop-blur-xl"></div>
        </div>
      </div>
    )
  }

  if (!teamData) {
    return (
      <div className="space-y-4">
        <Link href="/teams" className="text-amber-400 hover:text-amber-300 text-sm font-medium">
          ← Back to Teams
        </Link>
        <div className="rounded-2xl border border-white/20 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
          <p className="text-white">Team not found</p>
        </div>
      </div>
    )
  }

  const squad = teamData.squad?.data || []

  return (
    <>
      {/* Back Button */}
      <Link 
        href="/teams" 
        className="inline-flex items-center gap-2 text-india-gold hover:text-india-saffron text-sm font-bold mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Teams
      </Link>

      {/* Team Header */}
      <div className="rounded-3xl border border-india-gold/40 bg-gradient-to-br from-india-charcoal via-india-maroon/20 to-india-blue/30 p-8 mb-6 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Team Logo */}
          <div className="relative w-32 h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-india-gold/20 p-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,153,51,0.1)]">
            {teamData.image_path ? (
              <Image
                src={teamData.image_path}
                alt={teamData.name}
                width={96}
                height={96}
                className="object-contain"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-india-saffron to-india-gold flex items-center justify-center">
                <span className="text-4xl font-black text-slate-900">
                  {teamData.code || teamData.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white india-header-text">
                {teamData.name}
              </h1>
              {teamData.national_team && (
                <span className="px-3 py-1 bg-india-saffron/20 border border-india-saffron/50 text-india-gold text-xs font-bold rounded-full shadow-lg">
                  NATIONAL TEAM
                </span>
              )}
            </div>
            
            {teamData.country && (
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                {teamData.country.image_path && (
                  <Image
                    src={teamData.country.image_path}
                    alt={teamData.country.name}
                    width={24}
                    height={16}
                    className="rounded shadow-sm"
                  />
                )}
                <p className="text-slate-300 text-lg font-medium">
                  {teamData.country.name}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <div className="bg-slate-900/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 shadow-inner">
                <span className="text-india-gold font-bold">Code: </span>
                <span className="text-white font-bold">{teamData.code}</span>
              </div>
              {squad.length > 0 && (
                <div className="bg-slate-900/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 shadow-inner">
                  <span className="text-india-gold font-bold">Squad: </span>
                  <span className="text-white font-bold">{squad.length} Players</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Squad Section */}
      <div className="bg-slate-900/80 rounded-2xl border border-india-gold/20 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-india-charcoal via-slate-900 to-india-charcoal border-b border-india-gold/30 px-6 py-4">
          <h2 className="text-2xl font-bold text-india-gold india-header-text">Squad</h2>
        </div>

        {squad.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-india-gold/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-white font-bold text-lg">No squad information available</p>
            <p className="text-sm text-slate-400 mt-2">Squad details will appear here when available</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {squad.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="bg-slate-800/40 rounded-xl p-4 border border-white/5 hover:border-india-gold/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,153,51,0.15)] group"
                >
                  <div className="flex items-center gap-4">
                    {/* Player Avatar */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-india-saffron to-india-gold flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-india-gold transition-colors">
                      {player.image_path ? (
                        <Image
                          src={player.image_path}
                          alt={player.fullname}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-black text-slate-900">
                          {player.fullname.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm truncate group-hover:text-india-gold transition-colors">
                        {player.fullname}
                      </h3>
                      {player.position?.name && (
                        <p className="text-india-gold/90 text-xs font-medium mt-1 uppercase tracking-wide">
                          {player.position.name}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {player.battingstyle && (
                          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-400/30 text-blue-200 text-[10px] font-bold rounded uppercase">
                            Bat
                          </span>
                        )}
                        {player.bowlingstyle && (
                          <span className="px-2 py-0.5 bg-india-green/10 border border-india-green/30 text-india-green text-[10px] font-bold rounded uppercase">
                            Bowl
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
