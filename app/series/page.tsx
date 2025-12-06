"use client"

import React from 'react'

type Series = {
  id: number
  name: string
  dates: string
  details: string
}

// Static list of upcoming or notable series. In a real application this
// information would likely come from an API. For now, it is hard-coded to
// provide users with an overview of important tournaments.
const seriesList: Series[] = [
  {
    id: 1,
    name: 'India Tour of Australia 2025',
    dates: 'Jan 5 – Feb 10, 2025',
    details: '3 Tests · 5 ODIs · 3 T20Is',
  },
  {
    id: 2,
    name: 'Ashes 2025',
    dates: 'Jul 1 – Aug 1, 2025',
    details: '5 Tests',
  },
  {
    id: 3,
    name: 'ICC Champions Trophy 2025',
    dates: 'Oct 10 – Nov 5, 2025',
    details: 'Top ODI teams compete',
  },
  {
    id: 4,
    name: 'New Zealand Tour of Pakistan 2024',
    dates: 'Nov 15 – Dec 20, 2024',
    details: '2 Tests · 3 ODIs · 3 T20Is',
  },
  {
    id: 5,
    name: 'Asia Cup 2024',
    dates: 'Aug 20 – Sep 6, 2024',
    details: 'Regional ODI tournament',
  },
]

export default function SeriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold mb-4">Series</h1>
      <p className="text-sm text-gray-600">
        Keep up with upcoming and notable cricket series.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seriesList.map((series) => (
          <div
            key={series.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-1"
          >
            <h2 className="text-lg font-semibold">{series.name}</h2>
            <p className="text-xs text-gray-500">{series.dates}</p>
            <p className="text-xs text-gray-500">{series.details}</p>
          </div>
        ))}
      </div>
    </div>
  )
}