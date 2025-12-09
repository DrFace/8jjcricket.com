"use client"

import useSWR from 'swr'
import Image from 'next/image'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PlayerPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useSWR(`/api/player/${params.id}`, fetcher)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const player = data?.data

  if (!player) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Player not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {player.image_path && (
            <Image
              src={player.image_path}
              alt={player.fullname}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {player.fullname}
            </h1>
            {player.country && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                {player.country.image_path && (
                  <Image
                    src={player.country.image_path}
                    alt={player.country.name}
                    width={24}
                    height={16}
                    className="object-contain"
                  />
                )}
                <span>{player.country.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {player.dateofbirth && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
              <p className="font-medium text-gray-900">
                🎂 {new Date(player.dateofbirth).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
          {player.battingstyle && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Batting Style</p>
              <p className="font-medium text-gray-900">🏏 {player.battingstyle}</p>
            </div>
          )}
          {player.bowlingstyle && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Bowling Style</p>
              <p className="font-medium text-gray-900">🎯 {player.bowlingstyle}</p>
            </div>
          )}
          {player.position && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Position</p>
              <p className="font-medium text-gray-900">{player.position.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Career Stats */}
      {player.career && player.career.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Statistics</h2>
          <div className="space-y-4">
            {player.career.map((career: any) => (
              <div key={career.id} className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2 uppercase">{career.type}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {career.batting && (
                    <>
                      <div>
                        <p className="text-gray-600">Matches</p>
                        <p className="font-medium text-gray-900">{career.batting.matches || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Runs</p>
                        <p className="font-medium text-gray-900">{career.batting.runs || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Average</p>
                        <p className="font-medium text-gray-900">{career.batting.average || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Strike Rate</p>
                        <p className="font-medium text-gray-900">{career.batting.strike_rate || '0.00'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
