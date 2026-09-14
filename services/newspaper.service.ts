import { supabase } from "@/providers/database/supabase";
import type {
  NewspaperArticle,
  NewspaperCategory,
  NewspaperEdition,
} from "@/types/newspaper";

export type NewspaperArticleWithCategory = NewspaperArticle & {
  category: NewspaperCategory | null;
};

export type NewspaperEditionWithArticles = NewspaperEdition & {
  articles: NewspaperArticleWithCategory[];
};

export async function getPublishedEditions(): Promise<NewspaperEdition[]> {
  const { data, error } = await supabase
    .from("newspaper_editions")
    .select("*")
    .eq("status", "published")
    .order("edition_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as NewspaperEdition[];
}

export async function getPublishedEdition(
  editionId?: string,
): Promise<NewspaperEditionWithArticles | null> {
  let query = supabase
    .from("newspaper_editions")
    .select("*")
    .eq("status", "published");

  if (editionId) query = query.eq("id", editionId);
  else query = query.order("edition_date", { ascending: false }).limit(1);

  const { data: edition, error: editionError } = await query.maybeSingle();

  if (editionError) throw editionError;
  if (!edition) return null;

  const { data: articles, error: articlesError } = await supabase
    .from("newspaper_articles")
    .select(`
      *,
      category:newspaper_categories (
        id,
        name,
        slug,
        description,
        display_order,
        created_at
      )
    `)
    .eq("edition_id", edition.id)
    .order("display_order", { ascending: true });

  if (articlesError) throw articlesError;

  return {
    ...(edition as NewspaperEdition),
    articles: (articles ?? []) as NewspaperArticleWithCategory[],
  };
}

export async function getNewspaperCategories(): Promise<NewspaperCategory[]> {
  const { data, error } = await supabase
    .from("newspaper_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as NewspaperCategory[];
}
