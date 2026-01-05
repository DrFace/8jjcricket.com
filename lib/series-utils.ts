import type { League, Match, Season, Team } from "./cricket-types";
import { toDateString, toDisplayDate } from "./date";

export function getLatestSeasonId(league?: League) {
  const seasons = league?.seasons ?? [];
  if (!seasons.length) return undefined;

  const getYear = (name: string) => {
    const years = name.match(/\d{4}/g);
    return years ? Math.max(...years.map((y) => Number(y))) : 0;
  };

  const sorted = [...seasons].sort((a, b) => getYear(b.name) - getYear(a.name));
  return sorted[0]?.id;
}

export function pickCurrentSeason(league: League) {
  const seasons = league.seasons ?? [];
  if (!seasons.length) return league.currentseason;

  const now = new Date();
  const currentYear = now.getFullYear();

  const getLatestYear = (name: string) => {
    const years = name.match(/\d{4}/g);
    return years ? Math.max(...years.map((y) => Number(y))) : 0;
  };

  const sortedSeasons = [...seasons].sort(
    (a, b) => getLatestYear(b.name) - getLatestYear(a.name)
  );

  const startedSeasons = sortedSeasons.filter((s) => {
    if (s.starting_at) return new Date(s.starting_at) <= now;
    const years = s.name.match(/\d{4}/g);
    if (years) return Math.max(...years.map(Number)) <= currentYear;
    return false;
  });

  return (
    league.currentseason ||
    seasons.find((s) => s.is_current) ||
    startedSeasons[0] ||
    sortedSeasons[0]
  );
}

export function sortFixturesByCloseness(fixtures: Match[]) {
  const now = Date.now();
  return [...fixtures].sort((a, b) => {
    const dateA = new Date(a.starting_at || 0).getTime();
    const dateB = new Date(b.starting_at || 0).getTime();
    return Math.abs(dateA - now) - Math.abs(dateB - now);
  });
}

export function deriveMinMaxDate(fixtures: Match[]) {
  const dates = fixtures
    .map((f) => f.starting_at?.slice(0, 10))
    .filter(Boolean)
    .sort();

  return {
    minDate: dates[0],
    maxDate: dates[dates.length - 1],
  };
}

export function filterFixturesBySelectedDate(
  fixtures: Match[],
  selectedDate: string | null
) {
  if (!selectedDate) return fixtures;
  return fixtures.filter((m) => m.starting_at?.slice(0, 10) === selectedDate);
}

export function classifyFixtures(fixtures: Match[]) {
  const now = new Date();
  const live: Match[] = [];
  const recent: Match[] = [];
  const upcoming: Match[] = [];

  fixtures.forEach((match) => {
    const matchDate = new Date(match.starting_at);
    const matchEndEstimate = new Date(matchDate.getTime() + 8 * 60 * 60 * 1000);

    // Your existing heuristic
    const isLiveHeuristic =
      match.status === "NS" && matchDate <= now && now <= matchEndEstimate;

    if (isLiveHeuristic) live.push(match);
    else if (matchDate < now) recent.push(match);
    else upcoming.push(match);
  });

  recent.sort(
    (a, b) =>
      new Date(b.starting_at).getTime() - new Date(a.starting_at).getTime()
  );
  upcoming.sort(
    (a, b) =>
      new Date(a.starting_at).getTime() - new Date(b.starting_at).getTime()
  );

  return [...live, ...recent, ...upcoming];
}

export function groupFixturesByDisplayDate(fixtures: Match[]) {
  const grouped: Record<string, Match[]> = {};
  fixtures.forEach((match) => {
    const key = toDisplayDate(match.starting_at);
    grouped[key] = grouped[key] ?? [];
    grouped[key].push(match);
  });
  return grouped;
}

export function extractTeamsFromFixtures(fixtures: Match[]) {
  const map = new Map<number, Team>();
  fixtures.forEach((f) => {
    if (f.localteam) map.set(f.localteam.id, f.localteam);
    if (f.visitorteam) map.set(f.visitorteam.id, f.visitorteam);
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getTodayDateString() {
  return toDateString(new Date());
}
