"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SectionShell from "@/components/ui/SectionShell";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

import SeriesHeader from "@/components/series/SeriesHeader";
import MatchDateFilter from "@/components/series/MatchDateFilter";
import MatchesByDate from "@/components/series/MatchesByDate";

import type { League, Match } from "@/lib/cricket-types";
import { Fetcher } from "@/lib/fetcher";
import {
  classifyFixtures,
  deriveMinMaxDate,
  extractTeamsFromFixtures,
  filterFixturesBySelectedDate,
  getLatestSeasonId,
  getTodayDateString,
  groupFixturesByDisplayDate,
  pickCurrentSeason,
  sortFixturesByCloseness,
} from "@/lib/series-utils";
import type { SeriesTabId } from "@/components/series/SeriesTabs";
import PointsTable from "@/components/series/PointsTable";

export default function SeriesDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<SeriesTabId>("matches");
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(() =>
    getTodayDateString()
  );

  const leagueSwr = useSWR<{ data: League }>(
    `/api/leagues/${params.id}`,
    Fetcher
  );
  const league = leagueSwr.data?.data;

  // ✅ IMPORTANT: derive seasons + sortedSeasons BEFORE any early returns
  const seasonsRaw: any = league?.seasons;
  const seasons = Array.isArray(seasonsRaw)
    ? seasonsRaw
    : Array.isArray(seasonsRaw?.data)
    ? seasonsRaw.data
    : [];

  const sortedSeasons = useMemo(() => {
    const getLatestYear = (name: string) => {
      const years = name.match(/\d{4}/g);
      return years ? Math.max(...years.map((y) => parseInt(y, 10))) : 0;
    };

    return [...seasons].sort(
      (a, b) => getLatestYear(b.name) - getLatestYear(a.name)
    );
  }, [seasons]);

  const currentSeason = useMemo(
    () => (league ? pickCurrentSeason(league) : undefined),
    [league]
  );

  const seasonId = useMemo(() => {
    if (!league) return undefined;
    return (
      selectedSeasonId || league.currentseason?.id || getLatestSeasonId(league)
    );
  }, [league, selectedSeasonId]);

  const fixturesSwr = useSWR<{ data: Match[] }>(
    activeTab === "matches" ? `/api/leagues/${params.id}/fixtures` : null,
    Fetcher,
    { revalidateOnFocus: false }
  );

  const fixtures = useMemo(() => {
    const raw = fixturesSwr.data?.data ?? [];
    return sortFixturesByCloseness(raw);
  }, [fixturesSwr.data]);

  const { minDate, maxDate } = useMemo(
    () => deriveMinMaxDate(fixtures),
    [fixtures]
  );

  // Reset today filter behavior
  useEffect(() => {
    if (activeTab !== "matches" || fixtures.length === 0) return;
    const today = getTodayDateString();
    const todayHasMatches = fixtures.some(
      (m) => m.starting_at?.slice(0, 10) === today
    );
    if (!todayHasMatches && selectedDate === today) setSelectedDate(null);
  }, [activeTab, fixtures, selectedDate]);

  const filteredFixtures = useMemo(
    () => filterFixturesBySelectedDate(fixtures, selectedDate),
    [fixtures, selectedDate]
  );

  const classifiedFixtures = useMemo(
    () => classifyFixtures(filteredFixtures),
    [filteredFixtures]
  );

  const grouped = useMemo(
    () => groupFixturesByDisplayDate(classifiedFixtures),
    [classifiedFixtures]
  );

  // For LIVE badge per date group
  const liveMatches = useMemo(() => {
    const now = new Date();
    return filteredFixtures.filter((m) => {
      const start = new Date(m.starting_at);
      const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
      return m.status === "NS" && start <= now && now <= end;
    });
  }, [filteredFixtures]);

  // You compute teams but don’t use it here; keeping it is fine
  const teams = useMemo(() => extractTeamsFromFixtures(fixtures), [fixtures]);

  const standingsSwr = useSWR<{ data: any[] }>(
    activeTab === "points" && seasonId
      ? `/api/seasons/${seasonId}/standings`
      : null,
    Fetcher,
    { revalidateOnFocus: false }
  );
  const standingsData = standingsSwr.data;
  // ✅ Early returns AFTER all hooks are called
  if (leagueSwr.error) {
    return (
      <ErrorState message="Failed to load series details. Please try again later." />
    );
  }

  if (leagueSwr.isLoading) {
    return <LoadingState label="Loading series..." />;
  }

  if (!league) {
    return <ErrorState message="Series not found." />;
  }

  const dateRange =
    currentSeason?.starting_at && currentSeason?.ending_at
      ? `${new Date(currentSeason.starting_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${new Date(currentSeason.ending_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`
      : "Check schedule for dates";

  return (
    <>
      <TopNav />
      <BottomNav />

      <div className="space-y-6">
        <SeriesHeader
          league={league}
          currentSeason={currentSeason}
          dateRange={dateRange}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <SectionShell>
          {/* Matches */}
          {activeTab === "matches" && (
            <div className="p-6">
              {fixturesSwr.isLoading ? (
                <LoadingState label="Loading matches..." />
              ) : fixtures.length === 0 ? (
                <EmptyState
                  title="No matches available for this series"
                  subtitle="Matches will appear here once the schedule is announced"
                />
              ) : (
                <>
                  <MatchDateFilter
                    selectedDate={selectedDate}
                    onChange={setSelectedDate}
                    minDate={minDate}
                    maxDate={maxDate}
                  />

                  {selectedDate && filteredFixtures.length === 0 ? (
                    <EmptyState
                      title={`No matches available for ${new Date(
                        selectedDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`}
                      subtitle="Try selecting a different date or view all matches"
                      action={
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-xl"
                        >
                          View All Matches
                        </button>
                      }
                    />
                  ) : (
                    <MatchesByDate
                      grouped={grouped}
                      liveMatches={liveMatches}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* Points */}
          {activeTab === "points" && (
            <div className="p-6">
              <PointsTable
                seasons={seasons}
                sortedSeasons={sortedSeasons}
                seasonId={seasonId}
                onSeasonChange={(id) => setSelectedSeasonId(id)}
                standingsData={standingsData}
                isLoading={!standingsData}
              />
            </div>
          )}
        </SectionShell>
      </div>

      <Footer />
    </>
  );
}
