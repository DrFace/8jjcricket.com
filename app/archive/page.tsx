"use client"

import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import type { Fixture } from '@/types/fixture'
import LiveCard from '@/components/LiveCard'
import ArchhiveCard from '@/components/ArchhiveCard'
import BetButton from '@/components/BetButton'
import TopNav from '@/components/TopNav'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'

// Simple fetcher for SWR; fetches JSON from the given URL.
const fetcher = (u: string) => fetch(u).then((r) => r.json())

/**
 * Simple inline calendar component (copied from Upcoming/Recent template).
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
          className="rounded-md px-2 py-1 text-amber-300 hover:bg-white/10 transition-colors"
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
            className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-amber-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400 backdrop-blur-sm"
            value={monthIndex}
            onChange={handleMonthChange}
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx} className="bg-slate-900">
                {name.slice(0, 3)}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-xs font-medium text-amber-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-400 backdrop-blur-sm"
            value={yearValue}
            onChange={handleYearChange}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y} className="bg-slate-900">
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="rounded-md px-2 py-1 text-amber-300 hover:bg-white/10 transition-colors"
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
      <div className="grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-wide text-amber-300">
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
                'text-white',
                'hover:bg-white/10',
                selected && 'bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-bold hover:brightness-110',
                disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                !selected && isToday && !disabled && 'border border-amber-400 text-amber-300',
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
          className="text-[11px] font-medium text-amber-300 hover:text-amber-200 transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onSelectDate(null)}
          className="text-[11px] font-medium text-sky-200 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

/**
 * ArchivePage displays a list of archived cricket fixtures. It provides
 * consistent light-themed styling and in-line `<title>`/`<meta>` tags for SEO.
 */
export default function ArchivePage() {
  const { data, error, isLoading } = useSWR('/api/recent', fetcher)
  const title = 'Match Archive | 8jjcricket'
  const description = 'Browse archived cricket matches with results and details.'

  const fixtures: Fixture[] = data?.data ?? []

  // Calendar / date filter state and derived data
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const sortedFixtures = useMemo(
    () =>
      [...fixtures].sort(
        (a, b) =>
          new Date(a.starting_at).getTime() -
          new Date(b.starting_at).getTime(),
      ),
    [fixtures],
  )

  const minDate =
    sortedFixtures.length > 0
      ? sortedFixtures[0].starting_at.slice(0, 10)
      : undefined
  const maxDate =
    sortedFixtures.length > 0
      ? sortedFixtures[sortedFixtures.length - 1].starting_at.slice(0, 10)
      : undefined

  const filteredFixtures = useMemo(() => {
    if (!selectedDate) return sortedFixtures
    return sortedFixtures.filter(
      (f) => f.starting_at.slice(0, 10) === selectedDate,
    )
  }, [sortedFixtures, selectedDate])

  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h1 className="text-lg font-semibold text-red-400 mb-1">
                  Failed to load archived matches
                </h1>
                <p className="text-sm text-red-300/80">
                  Please refresh the page or try again in a moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />

        <div className="min-h-[60vh] flex flex-col gap-6">
          {/* Dark hero */}
          <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Archive
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/80 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-200">
                  Loading archive…
                </span>
              </div>
            </div>
          </div>

          {/* Skeleton grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-4 shadow-2xl animate-pulse"
              >
                <div className="h-3 w-20 rounded-full bg-amber-900/40 mb-3" />
                <div className="h-4 w-32 rounded-full bg-amber-900/40 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-800/50" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-800/50" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-800/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  if (!fixtures.length) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl px-6 py-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏏</div>
              <div>
                <h1 className="text-lg font-semibold text-amber-200 mb-1">
                  No archived matches found
                </h1>
                <p className="text-sm text-sky-100/80">
                  Once matches are completed, they&apos;ll appear here with full
                  details and results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <TopNav />
      <BottomNav />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* LEFT: existing archive header + grid */}
        <main className="flex-1 space-y-6">
          {/* Dark header / hero */}
          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Archive
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Completed matches
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-300 shadow-sm">
                  🏏 All formats
                </span>
              </div>
            </div>
          </div>

          {/* Archive grid with dark glassmorphism */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredFixtures.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-2 shadow-2xl hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition-all"
              >
                <ArchhiveCard f={f} />
              </div>
            ))}
          </div>
        </main>

        {/* RIGHT: calendar / date filter with bet button */}
        <aside className="lg:w-72">
          <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-4 shadow-2xl space-y-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-amber-200">
                Filter by date
              </h2>
              <p className="mt-1 text-xs text-sky-100/70">
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
            <div className="mt-2 flex justify-end border-t border-white/10 pt-3">
              <BetButton />
            </div>
          </div>
        </aside>
      </div>
      
      <Footer />
    </>
  )
}
