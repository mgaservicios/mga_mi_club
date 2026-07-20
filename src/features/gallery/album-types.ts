export interface Album {
  id: string;
  team_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AlbumInput {
  team_id: string;
  name: string;
  description?: string | null;
  cover_image_url?: string | null;
}
