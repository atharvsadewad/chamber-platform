import Link from "next/link";
import { ArrowLeft, FileText, Newspaper } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminArticleForm } from "@/components/admin/admin-article-form";

interface PageProps {
  params: Promise<{
    editionId: string;
  }>;
}

export default async function NewNewspaperArticlePage({
  params,
}: PageProps) {
  await requireAdmin();

  const { editionId } = await params;

  const [{ data: edition, error: editionError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabaseAdmin
        .from("newspaper_editions")
        .select("id, edition_date, title")
        .eq("id", editionId)
        .maybeSingle(),

      supabaseAdmin
        .from("newspaper_categories")
        .select(
          "id, name, slug, description, display_order",
        )
        .order("display_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

  if (editionError) {
    console.error(
      "Unable to load article edition:",
      editionError,
    );

    throw new Error("Unable to load newspaper edition.");
  }

  if (!edition) {
    notFound();
  }

  if (categoriesError) {
    console.error(
      "Unable to load article categories:",
      categoriesError,
    );

    throw new Error("Unable to load newspaper categories.");
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
            Add{" "}
            <span className="text-primary">Article</span>
          </h1>

          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            {formatDate(edition.edition_date)}
          </p>
        </div>

        <div className="mt-8">
          <AdminArticleForm
            editionId={edition.id}
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