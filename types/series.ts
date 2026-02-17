export interface League {
  id: number;
  name: string;
  code: string;
  seasons?: Array<{
    id: number;
    name: string;
    is_current?: boolean;
    starting_at?: string;
  }>;
}

export interface LeagueRespond {
  seasons: any[];
  id: number;
  name: string;
  code: string;
  image_path: string;
  type: string;
  dateRange?: string;
  sportmonks_league_id?: number;
}

export interface SeriesByMonth {
  [key: string]: LeagueRespond[];
}
