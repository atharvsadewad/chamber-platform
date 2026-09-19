import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Newspaper,
  Plus,
} from "lucide-react";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminEditionEditor } from "@/components/admin/admin-edition-editor";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";

interface PageProps {
  params: Promise<{
    editionId: string;
  }>;
}

export default async function AdminNewspaperEditionPage({
  params,
}: PageProps) {
  await requireAdmin();

  const { editionId } = await params;

  const { data: edition, error: editionError } =
    await supabaseAdmin
      .from("newspaper_editions")
      .select(
        "id, edition_date, title, subtitle, cover_image_path, status, published_at, created_at, updated_at",
      )
      .eq("id", editionId)
      .maybeSingle();

  if (editionError) {
    console.error(
      "Unable to load newspaper edition:",
      editionError,
    );

    throw new Error("Unable to load newspaper edition.");
  }

  if (!edition) {
    notFound();
  }

  const { data: articles, error: articlesError } =
    await supabaseAdmin
      .from("newspaper_articles")
      .select(
        `
        id,
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
        display_order,
        created_at,
        updated_at,
        category:newspaper_categories (
          id,
          name,
          slug
        )
      `,
      )
      .eq("edition_id", edition.id)
      .order("display_order", { ascending: true });

  if (articlesError) {
    console.error(
      "Unable to load newspaper articles:",
      articlesError,
    );

    throw new Error("Unable to load newspaper articles.");
  }

  const { data: categories, error: categoriesError } =
    await supabaseAdmin
      .from("newspaper_categories")
      .select(
        "id, name, slug, description, display_order",
      )
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

  if (categoriesError) {
    console.error(
      "Unable to load newspaper categories:",
      categoriesError,
    );

    throw new Error("Unable to load newspaper categories.");
  }

  let coverImageUrl: string | null = null;

  if (edition.cover_image_path) {
    const { data } = supabaseAdmin.storage
      .from(NEWSPAPER_MEDIA_BUCKET)
      .getPublicUrl(edition.cover_image_path);

    coverImageUrl = data.publicUrl;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/admin/newspaper"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Newspaper
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-accent" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Newspaper Administration
              </p>
            </div>

            <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Edit{" "}
              <span className="text-primary">Edition</span>
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {formatDate(edition.edition_date)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                edition.status === "published"
                  ? "rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
                  : "rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              }
            >
              {edition.status}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {articles?.length ?? 0}{" "}
              {(articles?.length ?? 0) === 1
                ? "article"
                : "articles"}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <AdminEditionEditor
            edition={{
              id: edition.id,
              editionDate: edition.edition_date,
              title: edition.title,
              subtitle: edition.subtitle,
              coverImagePath: edition.cover_image_path,
              coverImageUrl,
              status: edition.status,
              publishedAt: edition.published_at,
            }}
            articleCount={articles?.length ?? 0}
          />
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Articles
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage the stories included in this edition.
              </p>
            </div>

            <Link
              href={`/admin/newspaper/${edition.id}/articles/new`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Article
            </Link>
          </div>

          <div className="p-5">
            <AdminArticlesList
              editionId={edition.id}
              articles={(articles ?? []).map((article) => ({
                ...article,
                category: Array.isArray(article.category)
                  ? article.category[0] ?? null
                  : article.category ?? null,
              }))}
            />
          </div>
        </section>
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