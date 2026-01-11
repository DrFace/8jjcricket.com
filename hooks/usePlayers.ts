'use client'
import useSWR from 'swr'
import type { Player } from '@/types/player'

const fetchJson = (u: string) => fetch(u).then(r => r.json())

export function usePlayers(ids: number[] | undefined) {
  const unique = Array.from(new Set((ids ?? []).filter(Boolean)))
  const key = unique.length ? `/api/catalog?ids=${unique.join(',')}` : null
  const { data } = useSWR<{ data: Player[] }>(key, fetchJson)
  const map = new Map<number, Player>()
  data?.data?.forEach(p => map.set(p.id, p))
  return { players: map }
}