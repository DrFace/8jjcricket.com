'use client'

import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import type { Fixture } from '@/types/fixture'
import LiveCard from '@/components/LiveCard'
import BetButton from '@/components/BetButton'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

/**
 * Simple inline calendar component (copied from UpcomingPage template).
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
 * RecentPage lists recently completed matches. It adds page-specific
 * `<title>` and `<meta>` tags for SEO, and uses the UpcomingPage template layout.
 */
export default function RecentPage() {
  const { data, error, isLoading } = useSWR('/api/recent', fetcher)
  const title = 'Recent Matches | 8jjcricket'
  const description =
    'See the most recent cricket matches and results on 8jjcricket.'

  const fixtures: Fixture[] = data?.data ?? []

  // Hooks must be before any early returns
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // sort fixtures by start time ascending (same idea as UpcomingPage)
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

  // early returns

  if (error)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">Failed to load recent matches.</div>
      </>
    )

  if (isLoading)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card space-y-4 animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-4 w-64 rounded bg-gray-200" />
          <div className="mt-4 h-20 rounded bg-gray-200" />
        </div>
      </>
    )

  if (!fixtures.length)
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="card">No recent matches found.</div>
      </>
    )

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* LEFT: heading + fixtures grid */}
        <main className="flex-1 space-y-5">
          {/* Heading + nav pills (matching UpcomingPage style) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Recent Matches
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                See the most recent cricket matches and results on 8jjcricket.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-1 shadow-sm">
              <a
                href="/"
                className="px-3 py-1 text-sm text-gray-600 rounded-full hover:text-blue-600 transition"
              >
                Live
              </a>

              <a
                href="/upcoming"
                className="px-3 py-1 text-sm text-gray-600 rounded-full hover:text-blue-600 transition"
              >
                Upcoming
              </a>

              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white shadow">
                Recent
              </span>
            </div>
          </div>

          {/* Fixtures grid */}
          {filteredFixtures.length === 0 ? (
            <div className="card text-sm text-gray-600">
              No matches found for this date. Try another day or clear the
              filter.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredFixtures.map((f) => (
                <LiveCard key={f.id} f={f} />
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
       
                   {/* Bet button under the calendar, aligned to the right */}
                   <div className="mt-2 flex justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                     <BetButton />
                   </div>
                 </div>
               </aside>
      </div>
    </>
  )
}
