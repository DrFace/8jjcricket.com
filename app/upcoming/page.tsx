'use client'

import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import TeamBadge from '@/components/TeamBadge'
import { formatDate } from '@/lib/utils'
import type { Fixture } from '@/types/fixture'
import BetButton from '@/components/BetButton'
import DesktopOnly from '@/components/DesktopOnly'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

function getRelativeStart(starting_at: string) {
  const start = new Date(starting_at)
  const now = new Date()
  const diffMs = start.getTime() - now.getTime()
  const diffMinutes = Math.round(diffMs / 60000)

  if (Number.isNaN(diffMinutes)) return ''

  if (diffMinutes <= -60) {
    const hoursAgo = Math.abs(Math.round(diffMinutes / 60))
    return `${hoursAgo}h ago`
  }

  if (diffMinutes < 0) {
    return 'Started'
  }

  if (diffMinutes < 60) {
    return `Starts in ${diffMinutes}m`
  }

  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60

  if (hours < 24) {
    return `Starts in ${hours}h${mins ? ` ${mins}m` : ''}`
  }

  const days = Math.floor(hours / 24)
  return `Starts in ${days}d`
}

function FixtureCard({ f }: { f: Fixture }) {
  if (!f) return null
  const home = f.localteam
  const away = f.visitorteam
  const relative = getRelativeStart(f.starting_at)

  return (
    <div className="card group relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/80 via-blue-400/60 to-blue-500/80 opacity-75 group-hover:opacity-100" />

      <div className="relative space-y-3 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold leading-tight">
              {home?.short_name || home?.name || `Team ${f.localteam_id}`}{' '}
              <span className="mx-1 text-xs font-normal text-gray-500">vs</span>
              {away?.short_name || away?.name || `Team ${f.visitorteam_id}`}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {f.round ?? 'Match'} · {formatDate(f.starting_at)}
            </p>
          </div>

          {relative && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800/70 dark:text-gray-200">
              {relative}
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 items-center gap-2">
          <TeamBadge team={home} className="col-span-2" />
          <div className="text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
            vs
          </div>
          <TeamBadge
            team={away}
            className="col-span-2 justify-self-end text-right"
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Simple inline calendar component.
 */
type CalendarProps = {
  selectedDate: string | null
  onSelectDate: (value: string | null) => void
  minDate?: string
  maxDate?: string
}

function toDateString(date: Date) {
  // YYYY-MM-DD in local time
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const mm = month < 10 ? `0${month}` : `${month}`
  const dd = day < 10 ? `0${day}` : `${day}`
  return `${year}-${mm}-${dd}`
}

function Calendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
}: CalendarProps) {
  const initialMonth = selectedDate ? new Date(selectedDate) : new Date()
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  )

  // Bounds for disabling days (and for year dropdown range)
  const min = minDate ? new Date(minDate) : undefined
  const max = maxDate ? new Date(maxDate) : undefined

  const weeks = useMemo(() => {
    const startOfMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      1,
    )
    const startDay = startOfMonth.getDay() // 0-6, Sunday start
    const gridStart = new Date(startOfMonth)
    gridStart.setDate(startOfMonth.getDate() - startDay)

    const days: Date[] = []
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      days.push(d)
    }

    const weekRows: Date[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weekRows.push(days.slice(i, i + 7))
    }

    return { weekRows }
  }, [viewMonth])

  const isDisabled = (day: Date) => {
    if (min && day < min) return true
    if (max && day > max) return true
    return false
  }

  const handleDayClick = (day: Date) => {
    if (isDisabled(day)) return
    const value = toDateString(day)
    onSelectDate(value)
  }

  const todayStr = toDateString(new Date())

  // Month + year dropdown data
  const monthIndex = viewMonth.getMonth()
  const yearValue = viewMonth.getFullYear()

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const currentYear = new Date().getFullYear()
  const startYear = min ? min.getFullYear() : currentYear - 3
  const endYear = max ? max.getFullYear() : currentYear + 3
  const yearOptions: number[] = []
  for (let y = startYear; y <= endYear; y += 1) {
    yearOptions.push(y)
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value)
    setViewMonth(new Date(yearValue, newMonth, 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(e.target.value)
    setViewMonth(new Date(newYear, monthIndex, 1))
  }

  return (
    <div className="space-y-3">
      {/* Header: month/year selects + nav arrows */}
      <div className="flex items-center justify-between text-sm font-medium">
        <button
          type="button"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
            )
          }
        >
          ‹
        </button>

        <div className="flex items-center gap-1">
          <select
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={monthIndex}
            onChange={handleMonthChange}
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>
                {name.slice(0, 3)}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={yearValue}
            onChange={handleYearChange}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          onClick={() =>
            setViewMonth(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
            )
          }
        >
          ›
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-wide text-blue-600">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {weeks.weekRows.flat().map((day, idx) => {
          const dayStr = toDateString(day)
          const selected = selectedDate === dayStr
          const isToday = dayStr === todayStr
          const disabled = isDisabled(day)

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(day)}
              className={[
                'h-7 w-7 rounded-md text-center leading-7 transition',
                'text-black',
                'hover:bg-gray-100',
                selected && 'bg-blue-600 text-white hover:bg-blue-600',
                disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
                !selected && isToday && !disabled && 'border border-blue-500',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => {
            const now = new Date()
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            )
            setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
            onSelectDate(toDateString(today))
          }}
          className="text-[11px] font-medium text-blue-600 hover:underline"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onSelectDate(null)}
          className="text-[11px] font-medium text-gray-500 hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

/**
 * UpcomingPage lists upcoming cricket fixtures.
 */
export default function UpcomingPage() {
  const { data, error, isLoading } = useSWR('/api/upcoming', fetcher)
  const title = 'Upcoming Matches | 8jjcricket'
  const description =
    'Check the upcoming cricket fixtures and schedule on 8jjcricket.'

  const fixtures: Fixture[] = data?.data ?? []

  // Hooks must be before any early returns
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // sort fixtures by start time ascending
  const sortedFixtures = useMemo(
    () =>
      [...fixtures].sort(
        (a, b) =>
          new Date(a.starting_at).getTime() -
          new Date(b.starting_at).getTime(),
      ),
    [fixtures],
  )

  // date bounds for the picker (YYYY-MM-DD)
  const minDate =
    sortedFixtures.length > 0
      ? sortedFixtures[0].starting_at.slice(0, 10)
      : undefined
  const maxDate =
    sortedFixtures.length > 0
      ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10)
      : undefined

  // fixtures filtered by selected date
  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return sortedFixtures
    return sortedFixtures.filter(
      (f) => f.starting_at.slice(0, 10) === selectedDate,
    )
  }, [sortedFixtures, selectedDate])

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <TopNav />

      <DesktopOnly>
        <div className="flex flex-col-reverse gap-6 lg:flex-row">
          {/* LEFT: heading + fixtures grid */}
          <main className="flex-1 space-y-5">
            {/* Heading + nav pills */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Upcoming Matches
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Stay ahead of the action with the next fixtures on 8jjcricket.
                </p>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-1 shadow-sm">
                <a
                  href="/"
                  className="px-3 py-1 text-sm text-gray-600 rounded-full hover:text-blue-600 transition"
                >
                  Live
                </a>

                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white shadow">
                  Upcoming
                </span>

                <a
                  href="/recent"
                  className="px-3 py-1 text-sm text-gray-600 rounded-full hover:text-blue-600 transition"
                >
                  Recent
                </a>
              </div>
            </div>

            {/* Fixtures grid */}
            {error ? (
              <div className="card">Failed to load upcoming fixtures.</div>
            ) : isLoading ? (
              <div className="card space-y-4 animate-pulse">
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="h-4 w-64 rounded bg-gray-200" />
                <div className="mt-4 h-20 rounded bg-gray-200" />
              </div>
            ) : !fixtures.length ? (
              <div className="card">No upcoming matches right now.</div>
            ) : filteredFixtures.length === 0 ? (
              <div className="card text-sm text-gray-600">
                No matches found for this date. Try another day or clear the
                filter.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {filteredFixtures.map((f) => (
                  <FixtureCard key={f.id} f={f} />
                ))}
              </div>
            )}
          </main>

          {/* RIGHT: calendar / date filter */}
          <aside className="lg:w-72">
            <div className="card space-y-4">
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  Filter by date
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Pick a day to see matches scheduled on that date.
                </p>
              </div>

              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                minDate={minDate}
                maxDate={maxDate}
              />

              <div className="mt-2 flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                <BetButton />
              </div>
            </div>
          </aside>
        </div>
      </DesktopOnly>

      <Footer />
    </>
  )
}
