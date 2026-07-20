export interface GalleryImage {
  id: string;
  team_id: string;
  title: string;
  image_url: string;
  description: string | null;
  album: string;
  album_id: string | null;
  photo_date: string | null;
  location: string | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryInput {
  team_id: string;
  title: string;
  image_url: string;
  description?: string | null;
  album?: string;
  album_id?: string | null;
  photo_date?: string | null;
  location?: string | null;
  sort_order?: number;
}
