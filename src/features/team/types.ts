export interface Team {
  id: string;
  name: string;
  logo_url: string | null;
  city: string | null;
  description: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  history: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamInput {
  name: string;
  logo_url?: string | null;
  city?: string | null;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  history?: string | null;
}
