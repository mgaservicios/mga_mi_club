export interface Championship {
  id: string;
  team_id: string;
  name: string;
  organizer: string | null;
  start_date: string | null;
  end_date: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChampionshipInput {
  team_id: string;
  name: string;
  organizer?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  logo_url?: string | null;
}
