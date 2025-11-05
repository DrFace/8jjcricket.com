'use client'
import useSWR from 'swr'
import type { Team } from '@/types/team'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useTeams(ids: number[] | undefined) {
  const unique = Array.from(new Set((ids || []).filter(Boolean)))
  const key = unique.length ? `/api/teams?ids=${unique.join(',')}` : null

  const { data, error, isLoading } = useSWR<{ data: Team[] }>(key, fetcher)

  const byId = new Map<number, Team>()
  if (data?.data) {
    for (const t of data.data) byId.set(t.id, t)
  }

  return { teams: byId, error, isLoading }
}
