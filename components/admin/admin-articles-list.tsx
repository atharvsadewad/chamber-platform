"use client";

import Link from "next/link";
import {
  Edit3,
  FileText,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminArticle {
  id: string;
  headline: string;
  subheadline: string | null;
  summary: string | null;
  content: string | null;
  category_id: string | null;
  image_path: string | null;
  source_name: string | null;
  source_url: string | null;
  author: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AdminArticlesListProps {
  editionId: string;
  articles: AdminArticle[];
}

export function AdminArticlesList({
  editionId,
  articles,
}: AdminArticlesListProps) {
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  async function deleteArticle(article: AdminArticle) {
    const confirmed = window.confirm(
      `Delete "${article.headline}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(article.id);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/newspaper/${editionId}/articles?articleId=${encodeURIComponent(article.id)}`,
        {
          method: "DELETE",
        },
      );

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            payload.message ||
            "Unable to delete the article.",
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the article.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-5 py-12 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

        <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
          No articles yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add the first article to start building this newspaper
          edition.
        </p>

        <Link
          href={`/admin/newspaper/${editionId}/articles/new`}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Add Article
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div
          className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="rounded-lg border border-border bg-background p-4 transition-colors hover:bg-secondary/20"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {article.category ? (
                    <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {article.category.name}
                    </span>
                  ) : (
                    <span className="rounded-full border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                      No category
                    </span>
                  )}

                  {article.is_featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  ) : null}

                  <span className="text-[11px] text-muted-foreground">
                    Order {article.display_order}
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-foreground">
                  {article.headline}
                </h3>

                {article.subheadline ? (
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
                    {article.subheadline}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {article.source_name ? (
                    <span>
                      Source: {article.source_name}
                    </span>
                  ) : null}

                  {article.author ? (
                    <span>
                      Author: {article.author}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/newspaper/${editionId}/articles/${article.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => void deleteArticle(article)}
                  disabled={deletingId === article.id}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-destructive/20 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === article.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}

                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}