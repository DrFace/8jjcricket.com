export interface RankingTeam {
  id: number;
  name: string;
  code: string;
  image_path: string;
  ranking: {
    position: number;
    matches: number;
    points: number;
    rating: number;
  };
}
export interface RankingEntry {
  resource: string;
  type: string;
  gender: string;
  team: RankingTeam[];
}