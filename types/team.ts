export type Team = {
  id: number;
  name: string;
  short_name?: string | null;
  logo: string;
  image_path: string;
};

export interface TeamFromAPI {
  id: number;
  sportmonks_team_id: number;
  name: string;
  code: string;
  image_path: string;
  country_id: number;
  national_team: boolean | number | string;
}

export type TabKey = "all" | "international" | "domestic";

export type ApiResponse<T> = { data: T };
