'use client'
import useSWR from 'swr'
import type { Team } from '@/types/team'

const fetchJson = (u: string) => fetch(u).then(r => r.json())

export function useTeams(ids: number[] | undefined) {
  const unique = Array.from(new Set((ids ?? []).filter(Boolean)))
  const key = unique.length ? `/api/sm/teams?ids=${unique.join(',')}` : null
  const { data } = useSWR<{ data: Team[] }>(key, fetchJson)
  const map = new Map<number, Team>()
  data?.data?.forEach(t => map.set(t.id, t))
  return { teams: map }
}
