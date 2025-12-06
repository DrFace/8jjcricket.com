"use client"

import React from 'react'
import TeamBadge from '@/components/TeamBadge'
import type { Team } from '@/types/team'

// A static list of major international cricket teams. Logos are left empty
// because the source repository does not bundle team logos. If you have
// appropriate logo URLs, populate the `logo` field accordingly.
const teams: Team[] = [
  { id: 1, name: 'India', short_name: 'IND', logo: '' },
  { id: 2, name: 'Australia', short_name: 'AUS', logo: '' },
  { id: 3, name: 'England', short_name: 'ENG', logo: '' },
  { id: 4, name: 'Pakistan', short_name: 'PAK', logo: '' },
  { id: 5, name: 'South Africa', short_name: 'SA', logo: '' },
  { id: 6, name: 'New Zealand', short_name: 'NZ', logo: '' },
  { id: 7, name: 'Sri Lanka', short_name: 'SL', logo: '' },
  { id: 8, name: 'Bangladesh', short_name: 'BAN', logo: '' },
  { id: 9, name: 'West Indies', short_name: 'WI', logo: '' },
  { id: 10, name: 'Afghanistan', short_name: 'AFG', logo: '' },
]

export default function TeamsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>
      <p className="text-sm text-gray-600">
        Browse some of the major cricket teams around the world.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex items-center"
          >
            <TeamBadge team={team} size={40} />
          </div>
        ))}
      </div>
    </div>
  )
}