export type Player = {
  id: number;
  fullname: string;
};

export type BattingStats = {
  matches: number;
  innings: number;
  runs_scored: number;
  not_outs: number;
  highest_inning_score: number;
  strike_rate: string; // API gives "105.40" as string
  balls_faced: number;
  average: string; // API gives "128.80" as string
  four_x: number;
  six_x: number;
  fow_score: number | null;
  fow_balls: number | null;
  hundreds: number;
  fifties: number;
};

export type BowlingStats = {
  matches: number;
  overs: string; // API gives "1.00"
  innings: number;
  average: string; // API gives "0.00"
  econ_rate: string; // API gives "7.00"
  runs: number;
  wickets: number;
  wide: number;
  noball: number;
  strike_rate: string; // API gives "0.00"
  four_wickets: number;
  five_wickets: number;
  ten_wickets: number;
  rate: string; // API gives "7.00"
};

export type Career = {
  type: string;
  season_id: number | null;
  player_id: number | null;
  batting: BattingStats | null;
  bowling: BowlingStats | null;
};

export type PlayerRespond = {
  id: number;
  name?: string;
  fullname?: string;
  firstname?: string | null;
  lastname?: string | null;
  image_path?: string | null;
  country?: { id: number; name: string } | null;
  dateofbirth?: string | null;
  battingstyle?: string | null;
  bowlingstyle?: string | null;
  gender?: string | null;
  career?: Career[]; // SportMonks (old)
};

export type CricketsFormat = "Test" | "ODI" | "T20" | "T20I";
export const CRICKETS_FORMATS: CricketsFormat[] = [
  "Test",
  "ODI",
  "T20",
  "T20I",
];
