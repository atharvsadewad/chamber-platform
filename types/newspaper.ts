export interface NewspaperEdition {
  id: string;
  edition_date: string;
  title: string;
  subtitle: string | null;
  cover_image_path: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewspaperCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface NewspaperArticle {
  id: string;
  edition_id: string;
  category_id: string | null;
  headline: string;
  subheadline: string | null;
  summary: string | null;
  content: string | null;
  image_path: string | null;
  source_name: string | null;
  source_url: string | null;
  author: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
