import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Newspaper,
  Plus,
  Radio,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";

interface AdminEdition {
  id: string;
  edition_date: string;
  title: string;
  subtitle: string | null;
  cover_image_path: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  article_count: number;
  cover_image_url: string | null;
}

export default async function AdminNewspaperPage() {
  await requireAdmin();

  const { data: editions, error: editionsError } =
    await supabaseAdmin
      .from("newspaper_editions")
      .select(
        "id, edition_date, title, subtitle, cover_image_path, status, published_at, created_at, updated_at",
      )
      .order("edition_date", { ascending: false });

  if (editionsError) {
    console.error(
      "Unable to load newspaper editions:",
      editionsError,
    );

    throw new Error("Unable to load newspaper editions.");
  }

  const editionRows = editions ?? [];

  const editionIds = editionRows.map((edition) => edition.id);

  let articleRows: { edition_id: string }[] = [];

  if (editionIds.length > 0) {
    const { data: articles, error: articlesError } =
      await supabaseAdmin
        .from("newspaper_articles")
        .select("edition_id")
        .in("edition_id", editionIds);

    if (articlesError) {
      console.error(
        "Unable to load newspaper article counts:",
        articlesError,
      );

      throw new Error("Unable to load newspaper editions.");
    }

    articleRows = articles ?? [];
  }

  const articleCounts = new Map<string, number>();

  for (const article of articleRows) {
    articleCounts.set(
      article.edition_id,
      (articleCounts.get(article.edition_id) ?? 0) + 1,
    );
  }

  const usersEditions: AdminEdition[] =
    editionRows.map((edition) => {
      let coverImageUrl: string | null = null;

      if (edition.cover_image_path) {
        const { data } = supabaseAdmin.storage
          .from(NEWSPAPER_MEDIA_BUCKET)
          .getPublicUrl(edition.cover_image_path);

        coverImageUrl = data.publicUrl;
      }

      return {
        ...edition,
        article_count: articleCounts.get(edition.id) ?? 0,
        cover_image_url: coverImageUrl,
      };
    });

  const totalEditions = usersEditions.length;
  const publishedEditions = usersEditions.filter(
    (edition) => edition.status === "published",
  ).length;
  const draftEditions = usersEditions.filter(
    (edition) => edition.status === "draft",
  ).length;
  const totalArticles = usersEditions.reduce(
    (total, edition) => total + edition.article_count,
    0,
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-accent" />

              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Administration
              </p>
            </div>

            <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Legal{" "}
              <span className="text-primary">Newspaper</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Create, manage and publish daily legal newspaper
              editions and their articles.
            </p>
          </div>

          <Link
            href="/admin/newspaper/new"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Edition
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Newspaper}
            label="Total Editions"
            value={totalEditions}
          />

          <StatCard
            icon={Radio}
            label="Published"
            value={publishedEditions}
          />

          <StatCard
            icon={FileText}
            label="Drafts"
            value={draftEditions}
          />

          <StatCard
            icon={BookOpen}
            label="Articles"
            value={totalArticles}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-5">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Newspaper Editions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage every newspaper edition stored on the platform.
            </p>
          </div>

          {usersEditions.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" />

              <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
                No editions yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Create the first newspaper edition to start adding
                articles and publishing the daily paper.
              </p>

              <Link
                href="/admin/newspaper/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Create Edition
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {usersEditions.map((edition) => (
                <EditionRow
                  key={edition.id}
                  edition={edition}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Newspaper;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <p className="text-xs font-semibold uppercase tracking-[0.15em]">
          {label}
        </p>
      </div>

      <p className="mt-3 font-serif text-3xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

function EditionRow({
  edition,
}: {
  edition: AdminEdition;
}) {
  return (
    <Link
      href={`/admin/newspaper/${edition.id}`}
      className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-secondary/30 sm:flex-row sm:items-center"
    >
      <div className="h-24 w-18 shrink-0 overflow-hidden rounded-md border border-border bg-secondary sm:h-28 sm:w-[84px]">
        {edition.cover_image_url ? (
          <img
            src={edition.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Newspaper className="h-7 w-7 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              edition.status === "published"
                ? "rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
                : "rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            }
          >
            {edition.status}
          </span>

          <span className="text-xs text-muted-foreground">
            {edition.article_count}{" "}
            {edition.article_count === 1
              ? "article"
              : "articles"}
          </span>
        </div>

        <h3 className="mt-2 truncate font-serif text-xl font-bold text-foreground group-hover:text-primary">
          {edition.title}
        </h3>

        {edition.subtitle ? (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {edition.subtitle}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(edition.edition_date)}
          </span>

          {edition.published_at ? (
            <span>
              Published {formatDateTime(edition.published_at)}
            </span>
          ) : (
            <span>
              Created {formatDateTime(edition.created_at)}
            </span>
          )}
        </div>
      </div>

      <div className="hidden shrink-0 text-sm font-semibold text-muted-foreground group-hover:text-primary sm:block">
        Open →
      </div>
    </Link>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}