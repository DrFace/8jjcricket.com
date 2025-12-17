import { RankingTeam, RankingEntry } from "../../types/rankings";

export function groupByGender(
  rankings: RankingEntry[],
  targetType: string[]
) {
  const result = { men: [] as RankingTeam[], women: [] as RankingTeam[] };

  // normalize target types once
  const normalizedTypes = targetType.map(t => t.toUpperCase());

  for (const entry of rankings) {
    if (!entry.team || entry.team.length === 0) continue;

    if (!normalizedTypes.includes(entry.type?.toUpperCase() ?? "")) continue;

    if (entry.gender === "women") {
      result.women = entry.team;
    } else if (entry.gender === "men") {
      result.men = entry.team;
    }
  }

  return result;
}

