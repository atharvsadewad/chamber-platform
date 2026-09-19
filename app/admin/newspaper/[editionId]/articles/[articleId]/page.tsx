import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Newspaper,
} from "lucide-react";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminArticleEditor } from "@/components/admin/admin-article-editor";

interface PageProps {
  params: Promise<{
    editionId: string;
    articleId: string;
  }>;
}

export default async function AdminArticlePage({
  params,
}: PageProps) {
  await requireAdmin();

  const { editionId, articleId } = await params;

  const [
    { data: edition, error: editionError },
    { data: article, error: articleError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    supabaseAdmin
      .from("newspaper_editions")
      .select("id, title, edition_date")
      .eq("id", editionId)
      .maybeSingle(),

    supabaseAdmin
      .from("newspaper_articles")
      .select(
        `
        id,
        edition_id,
        headline,
        subheadline,
        summary,
        content,
        category_id,
        image_path,
        source_name,
        source_url,
        author,
        is_featured,
        display_order
      `,
      )
      .eq("id", articleId)
      .eq("edition_id", editionId)
      .maybeSingle(),

    supabaseAdmin
      .from("newspaper_categories")
      .select(
        "id, name, slug, description, display_order",
      )
      .order("display_order", {
        ascending: true,
      })
      .order("name", {
        ascending: true,
      }),
  ]);

  if (editionError) {
    console.error(
      "Unable to load article edition:",
      editionError,
    );

    throw new Error("Unable to load newspaper edition.");
  }

  if (articleError) {
    console.error(
      "Unable to load newspaper article:",
      articleError,
    );

    throw new Error("Unable to load newspaper article.");
  }

  if (categoriesError) {
    console.error(
      "Unable to load newspaper categories:",
      categoriesError,
    );

    throw new Error(
      "Unable to load newspaper categories.",
    );
  }

  if (!edition || !article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href={`/admin/newspaper/${edition.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Edition
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-accent" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {edition.title}
            </p>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Edit{" "}
            <span className="text-primary">Article</span>
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Article
            </span>

            <span>
              {formatDate(edition.edition_date)}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <AdminArticleEditor
            editionId={edition.id}
            article={article}
            categories={categories ?? []}
          />
        </div>
      </div>
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}