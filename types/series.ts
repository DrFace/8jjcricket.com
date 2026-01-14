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
