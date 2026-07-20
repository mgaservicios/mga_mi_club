 export interface Match {
  id: string;
  team_id: string;
  rival: string;
  rival_id: string | null;
  date: string;
  matchday: number | null;
  result: string | null;
  summary: string | null;
  is_home: boolean;
  image_url: string | null;
  images: string[];
  championship_id: string | null;
  is_next_match: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchInput {
  team_id: string;
  rival: string;
  rival_id?: string | null;
  date: string;
  matchday?: number | null;
  result?: string | null;
  summary?: string | null;
  is_home?: boolean;
  image_url?: string | null;
  images?: string[];
  championship_id?: string | null;
  is_next_match?: boolean;
}
