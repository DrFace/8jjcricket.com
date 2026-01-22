// Archive match data structure
export interface Archive {
  id: number;
  sportmonks_fixture_id: number;
  match_title: string;
  format: string | null;
  category: string;
  round: string | null;
  home_team: string;
  away_team: string;
  home_team_logo?: string | null;
  away_team_logo?: string | null;
  home_score: string | null;
  away_score: string | null;
  status: string;
  result: string | null;
  match_date: string;
  created_at: string;
  updated_at: string;
}

// Pagination link structure
export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

// Paginated API response
export interface ArchivesResponse {
  current_page: number;
  data: Archive[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Filter parameters
export interface ArchiveFilters {
  date?: string; // Format: YYYY-MM-DD
  format?: 'T20' | 'ODI' | 'Test' | '';
  category?: 'International' | 'Leagues' | '';
  per_page?: number;
  page?: number;
}

