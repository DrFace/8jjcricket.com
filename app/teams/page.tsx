"use client"

import useSWR from 'swr'
import Image from 'next/image'

interface TeamFromAPI {
  id: number
  name: string
  code: string
  image_path: string
  country_id: number
  national_team: boolean
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

/**
 * TeamsPage lists international and domestic cricket teams. It adds
 * `<title>` and `<meta>` tags for SEO and adheres to the light theme.
 */
export default function TeamsPage() {
  const { data, error, isLoading } = useSWR('/api/teams', fetcher)
  const title = 'Teams | 8jjcricket'
  const description = 'Browse cricket teams, including international and domestic teams.'
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load teams.</div>
      </>
    )
  }
  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card animate-pulse">Loading teams…</div>
      </>
    )
  }
  const teams: TeamFromAPI[] = data?.data ?? []
  const national = teams.filter((t) => t.national_team)
  const domestic = teams.filter((t) => !t.national_team)
  // Limit domestic teams to a manageable number for display
  const domesticLimited = domestic.slice(0, 30)
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold mb-4">Cricket Teams</h1>
        {/* International teams */}
        {national.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">International Teams</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {national.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={32}
                    height={32}
                    className="object-contain rounded-full"
                  />
                    <span className="font-medium text-gray-800">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Domestic teams */}
        {domesticLimited.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Domestic Teams</h2>
            <p className="text-sm text-gray-500 mb-2">
              Showing a selection of domestic teams. There are many more available via the API.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {domesticLimited.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={t.image_path}
                    alt={t.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                  />
                  <span className="font-medium text-gray-800 truncate">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}