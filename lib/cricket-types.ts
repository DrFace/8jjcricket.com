import { Fixture } from "@/types/fixture";

export interface Season {
  is_current: boolean;
  id: number;
  name: string;
  league_id: number;
  starting_at?: string;
  ending_at?: string;
}

export interface League {
  id: number;
  name: string;
  code: string;
  image_path: string;
  type: string;
  country?: {
    id: number;
    name: string;
    image_path: string;
  };
  seasons?: Season[];
  currentseason?: Season;
}
export interface Team {
  id: number;
  logo: string;
  name: string;
  short_name: string;
  code: string;
  image_path?: string;
  national_team?: boolean;
  country?: {
    id: number;
    name: string;
    image_path?: string;
  };
}

export interface Venue {
  id: number;
  name: string;
  city?: string;
  country_id?: number;
  capacity?: number;
}

export interface Run {
  score: number;
  wickets: number;
  overs?: number;
  pp_score?: string;
}

export interface Match {
  id: number;
  league_id: number;
  season_id?: number;
  stage_id?: number;
  round?: string | null;
  localteam_id: number;
  visitorteam_id: number;
  starting_at: string;
  type: string;
  live: boolean;
  status: string;
  note?: string;
  venue_id?: number;
  winner_team_id?: number;
  elected?: string;
  localteam?: Team;
  visitorteam?: Team;
  venue?: Venue;
  runs?: Run[];
  league?: { id: number; name: string };
}

export type ApiEnvelope<T> = { data: T };
