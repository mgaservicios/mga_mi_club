export interface Rival {
  id: string;
  team_id: string;
  name: string;
  location: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RivalInput {
  team_id: string;
  name: string;
  location?: string | null;
  logo_url?: string | null;
}
