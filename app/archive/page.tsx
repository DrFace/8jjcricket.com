'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useArchives } from '@/hooks/useArchives';
import { ArchiveFilters, Archive } from '@/types/archive';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
// import BetButton from '@/components/BetButton';

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Archive Card Component
 */
interface ArchiveCardProps {
  archive: Archive;
}

function ArchiveCard({ archive }: ArchiveCardProps) {
  return (
    <Link href={`/match/${archive.sportmonks_fixture_id}`} className="block">
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl p-5 shadow-2xl hover:border-amber-400/50 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] transition-all duration-300 group cursor-pointer">
        {/* Format and Category Badges */}
        <div className="flex items-center gap-2 mb-3">
          {archive.format && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
              archive.format === 'T20'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : archive.format === 'ODI'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {archive.format}
            </span>
          )}
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
            archive.category === 'International'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          }`}>
            {archive.category}
          </span>
          <span className="ml-auto text-[10px] text-emerald-400 font-medium uppercase tracking-wide">
            {archive.status}
          </span>
        </div>

        {/* Match Title */}
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
          {archive.match_title}
        </h3>

        {/* Round */}
        {archive.round && (
          <p className="text-xs text-sky-200/70 mb-3">{archive.round}</p>
        )}

        {/* Scores */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
            <span className="text-sm font-medium text-white">{archive.home_team}</span>
            <span className="text-sm font-bold text-amber-300">
              {archive.home_score || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
            <span className="text-sm font-medium text-white">{archive.away_team}</span>
            <span className="text-sm font-bold text-amber-300">
              {archive.away_score || 'N/A'}
            </span>
          </div>
        </div>

        {/* Result */}
        {archive.result && (
          <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-emerald-200 font-medium">{archive.result}</p>
          </div>
        )}

        {/* Match Date */}
        <div className="flex items-center justify-between text-xs text-sky-100/60 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(archive.match_date)}
          </div>
          <div className="flex items-center gap-1 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium">View Details</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

/**
 * Pagination Component
 */
interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  totalMatches: number;
  from: number;
  to: number;
}

function Pagination({ currentPage, lastPage, onPageChange, totalMatches, from, to }: PaginationProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    scrollToTop();
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (lastPage <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < lastPage - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-6 shadow-2xl">
      {/* Info text */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-sky-100/70">
          Showing <span className="font-semibold text-amber-300">{from}</span> to{' '}
          <span className="font-semibold text-amber-300">{to}</span> of{' '}
          <span className="font-semibold text-amber-300">{totalMatches}</span> matches
        </p>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage === 1
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30'
          }`}
          aria-label="Previous page"
        >
          ← Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-sky-100/50">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-black font-bold shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800/50 text-sky-100 hover:bg-slate-700/70 border border-white/10'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentPage === lastPage
              ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30'
          }`}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/**
 * Archives Page Component
 */
export default function ArchivePage() {
  const title = 'Match Archive | 8jjcricket';
  const description = 'Browse archived cricket matches with results and details.';

  // Filter states
  const [category, setCategory] = useState<'' | 'International' | 'Leagues'>('');
  const [format, setFormat] = useState<'' | 'T20' | 'ODI' | 'Test'>('');
  const [date, setDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Build filters object
  const filters: ArchiveFilters = useMemo(() => {
    const f: ArchiveFilters = {
      page,
      per_page: 30,
    };
    if (category) f.category = category;
    if (format) f.format = format;
    if (date) f.date = date;
    return f;
  }, [category, format, date, page]);

  // Fetch archives using custom hook
  const { data, loading, error } = useArchives(filters);

  // Clear all filters
  const clearFilters = () => {
    setCategory('');
    setFormat('');
    setDate('');
    setPage(1);
  };

  // Handle filter changes (reset to page 1)
  const handleCategoryChange = (value: '' | 'International' | 'Leagues') => {
    setCategory(value);
    setPage(1);
  };

  const handleFormatChange = (value: '' | 'T20' | 'ODI' | 'Test') => {
    setFormat(value);
    setPage(1);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = category || format || date;

  // Error state
  if (error) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <TopNav />
        <BottomNav />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-black/70 backdrop-blur-xl px-6 py-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <h1 className="text-xl font-semibold text-red-400 mb-2">
                  Failed to load archives
                </h1>
                <p className="text-sm text-red-300/80 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/30"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <TopNav />
        <BottomNav />

        <div className="min-h-[60vh] space-y-6">
          {/* Hero */}
          <div className="rounded-3xl border border-white/80 bg-slate-900/80 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-300">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Cricket Archives
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/80 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-200">
                  Loading archives…
                </span>
              </div>
            </div>
          </div>

          {/* Skeleton grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl animate-pulse"
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
        <Footer />
      </>
    );
  }

  // Empty state
  if (!data || data.data.length === 0) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <TopNav />
        <BottomNav />

        <div className="space-y-6">
          {/* Hero */}
          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Cricket Archives
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-xs font-medium text-amber-200 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as '' | 'International' | 'Leagues')}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="International">International</option>
                  <option value="Leagues">Leagues</option>
                </select>
              </div>

              {/* Format Filter */}
              <div>
                <label htmlFor="format" className="block text-xs font-medium text-amber-200 mb-2">
                  Format
                </label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as '' | 'T20' | 'ODI' | 'Test')}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                >
                  <option value="">All Formats</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Test">Test</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label htmlFor="date" className="block text-xs font-medium text-amber-200 mb-2">
                  Match Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Clear Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    hasActiveFilters
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30'
                      : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Empty state message */}
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="max-w-md w-full rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl px-6 py-8 shadow-2xl text-center">
              <div className="text-5xl mb-4">🏏</div>
              <h2 className="text-xl font-semibold text-amber-200 mb-2">
                No matches found
              </h2>
              <p className="text-sm text-sky-100/80">
                {hasActiveFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'No archived matches are available at this time.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-sm font-medium border border-amber-500/30"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Main content
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <TopNav />
      <BottomNav />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        {/* Main content */}
        <main className="flex-1 space-y-6">
          {/* Hero */}
          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/30 px-6 py-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-400">
                  8JJCRICKET · ARCHIVE
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold text-white">
                  Cricket Archives
                </h1>
                <p className="mt-2 text-sm md:text-base text-sky-100/90 max-w-xl">
                  {description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {data.total} matches
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-950/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-amber-300 shadow-sm">
                  🏏 All formats
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-xs font-medium text-amber-200 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as '' | 'International' | 'Leagues')}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="International">International</option>
                  <option value="Leagues">Leagues</option>
                </select>
              </div>

              {/* Format Filter */}
              <div>
                <label htmlFor="format" className="block text-xs font-medium text-amber-200 mb-2">
                  Format
                </label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as '' | 'T20' | 'ODI' | 'Test')}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                >
                  <option value="">All Formats</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Test">Test</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label htmlFor="date" className="block text-xs font-medium text-amber-200 mb-2">
                  Match Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-slate-800/80 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
              </div>

              {/* Clear Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    hasActiveFilters
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30'
                      : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Archives Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((archive) => (
              <ArchiveCard key={archive.id} archive={archive} />
            ))}
          </div>

          {/* Pagination */}
          {data.last_page > 1 && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              onPageChange={setPage}
              totalMatches={data.total}
              from={data.from}
              to={data.to}
            />
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:w-72">
          <div className="rounded-2xl border border-white/15 bg-black/50 backdrop-blur-xl p-5 shadow-2xl space-y-4 sticky top-6">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-amber-200 mb-2">
                Quick Stats
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sky-100/70">Total Matches</span>
                  <span className="font-bold text-amber-300">{data.total}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sky-100/70">Current Page</span>
                  <span className="font-bold text-amber-300">{data.current_page} / {data.last_page}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-sky-100/70">Per Page</span>
                  <span className="font-bold text-amber-300">{data.per_page}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h2 className="text-sm font-semibold tracking-tight text-amber-200 mb-3">
                Active Filters
              </h2>
              <div className="space-y-2">
                {category && (
                  <div className="flex items-center justify-between bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                    <span className="text-xs text-amber-300">Category</span>
                    <span className="text-xs font-bold text-white">{category}</span>
                  </div>
                )}
                {format && (
                  <div className="flex items-center justify-between bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
                    <span className="text-xs text-purple-300">Format</span>
                    <span className="text-xs font-bold text-white">{format}</span>
                  </div>
                )}
                {date && (
                  <div className="flex items-center justify-between bg-blue-500/10 rounded-lg px-3 py-2 border border-blue-500/20">
                    <span className="text-xs text-blue-300">Date</span>
                    <span className="text-xs font-bold text-white">{date}</span>
                  </div>
                )}
                {!hasActiveFilters && (
                  <p className="text-xs text-sky-100/50 italic">No filters applied</p>
                )}
              </div>
            </div>

            {/* Bet Button */}
            <div className="border-t border-white/10 pt-4 flex justify-center">
              {/* <BetButton /> */}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}
