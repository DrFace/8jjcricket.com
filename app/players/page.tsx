'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import PlayerCard from '../../components/PlayerCard'
import { debounce } from '../../lib/debounce'

type Player = {
  id: number
  fullname: string
  firstname?: string
  lastname?: string
  image_path?: string | null
  country?: string | null
  position?: string | null
}

type Country = { id: number; name: string }
type Pagination = { current_page: number; total_pages: number }

const PAGE_SIZE = 20 // show 20 players at a time

/**
 * PlayersPage lists cricket players and provides search and filter controls. It
 * adds a `<title>` and `<meta>` tag at the top of the returned JSX to
 * improve SEO for this client component. Without these head tags, many
 * crawlers would see generic metadata or none at all because client
 * components cannot export a `metadata` object【744642906249488†L34-L87】.
 */
export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  // filters
  const [q, setQ] = useState('')
  const [country, setCountry] = useState('')
  const [role, setRole] = useState('')
  // client-side pagination state
  const [page, setPage] = useState(1)
  const debouncedSetQ = useRef(
    debounce((val: string) => {
      setQ(val)
      setPage(1)
    }, 300)
  ).current
  async function loadData(p = 1) {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/api/players?page=${p}`),
        fetch('/api/countries'),
      ])
      if (!pRes.ok) throw new Error('Failed to fetch players')
      if (!cRes.ok) throw new Error('Failed to fetch countries')
      const pJson = await pRes.json()
      const cJson = await cRes.json()
      setPagination(pJson.pagination ?? null)
      setCountries(cJson.data ?? [])
      setPlayers(pJson.data ?? [])
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  const countryOptions = useMemo(() => {
    const names = new Set<string>()
    players.forEach((p) => p.country && names.add(p.country))
    countries.forEach((c) => names.add(c.name))
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [players, countries])
  const roleOptions = useMemo(() => {
    const names = new Set<string>()
    players.forEach((p) => p.position && names.add(p.position))
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [players])
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase()
    return players.filter((p) => {
      const matchesQ =
        !qLower ||
        p.fullname.toLowerCase().includes(qLower) ||
        p.firstname?.toLowerCase().includes(qLower) ||
        p.lastname?.toLowerCase().includes(qLower)
      const matchesCountry = !country || (p.country ?? '').toLowerCase() === country.toLowerCase()
      const matchesRole = !role || (p.position ?? '').toLowerCase() === role.toLowerCase()
      return matchesQ && matchesCountry && matchesRole
    })
  }, [players, q, country, role])
  // pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return (
    <>
      <title>Players | 8jjcricket</title>
      <meta
        name="description"
        content="Browse all cricket players, search by name and filter by country or role."
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold">Players</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse all players. Use search and filters to find them faster.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <label className="text-sm font-medium">Search by name</label>
                <input
                  type="text"
                  placeholder="e.g. Ahmed, Sharma..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => debouncedSetQ(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  {countryOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/*
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  {roleOptions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              */}
            </div>
          </div>
          {/* Players Grid */}
          <div className="md:col-span-3">
            {loading && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
                Loading players…
              </div>
            )}
            {err && !loading && (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-700">
                {err}
              </div>
            )}
            {!loading && !err && (
              <>
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-600 shadow-sm">
                    No players match your filters.
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-sm text-gray-600">
                      Showing {paged.length} of {filtered.length} players
                      {q || country || role ? ' (filtered)' : ''}.
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {paged.map((p) => (
                        <PlayerCard
                          key={p.id}
                          id={p.id}
                          fullname={p.fullname}
                          position={p.position}
                          country={p.country}
                          image_path={p.image_path}
                        />
                      ))}
                    </div>
                    {/* Pagination buttons */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="rounded-full border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <span className="rounded-full border border-gray-200 px-3 py-1.5 text-sm">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className="rounded-full border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}