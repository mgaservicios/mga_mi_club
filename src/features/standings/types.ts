export interface Standing {
  id: string;
  team_id: string;
  team_name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  position: number;
  championship_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface StandingInput {
  team_id: string;
  team_name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  position: number;
  championship_id?: string | null;
}
