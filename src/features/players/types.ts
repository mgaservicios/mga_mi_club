export type PlayerRole = "player" | "head_coach" | "assistant_coach";
export type Position = "base" | "escolta" | "alero" | "ala_pivot" | "pivot";

export interface Player {
  id: string;
  team_id: string;
  name: string;
  photo_url: string | null;
  number: number | null;
  position: Position | null;
  role: PlayerRole;
  birth_date: string | null;
  birthplace: string | null;
  height_cm: number | null;
  previous_clubs: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  social_links: Record<string, string>;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  minutes: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerInput {
  team_id: string;
  name: string;
  photo_url?: string | null;
  number?: number | null;
  position?: Position | null;
  role?: PlayerRole;
  birth_date?: string | null;
  birthplace?: string | null;
  height_cm?: number | null;
  previous_clubs?: string | null;
  phone?: string | null;
  email?: string | null;
  bio?: string | null;
  social_links?: Record<string, string>;
  points?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  minutes?: number;
}
