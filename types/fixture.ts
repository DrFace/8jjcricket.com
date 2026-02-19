import type { Team } from "./team";

export type Fixture = {
  fixture_id: number;
  sportmonks_id: number;
  id: number;
  round?: string | null;
  starting_at: string;
  live: boolean;
  status: string | null;
  note: string | null;
  league_id: number;
  localteam_id: number;
  visitorteam_id: number;
  league?: { id: number; name: string };
  // enriched when the API includes teams or when you hydrate via hooks
  localteam?: Team;
  visitorteam?: Team;
  runs?: any[];
};

export type FixtureLive = {
  fixture_id: number;
  sportmonks_id: number;
  id: number;
  round?: string | null;
  starting_at: string;
  live: any[];
  status: string | null;
  note: string | null;
  league_id: number;
  localteam_id: number;
  visitorteam_id: number;
  league?: { id: number; name: string };
  // enriched when the API includes teams or when you hydrate via hooks
  localteam?: Team;
  visitorteam?: Team;
  runs?: any[];
};

export type LivePayload = { live: FixtureLive[] };
