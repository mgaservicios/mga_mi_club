export interface News {
  id: string;
  team_id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsInput {
  team_id: string;
  title: string;
  content: string;
  image_url?: string | null;
  published?: boolean;
}
