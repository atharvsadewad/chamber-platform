import Link from "next/link";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";

import { requireAdmin } from "@/lib/auth/server";
import { AdminEditionForm } from "@/components/admin/admin-edition-form";

export default async function NewNewspaperEditionPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/admin/newspaper"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Newspaper
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-accent" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Newspaper Administration
            </p>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Create{" "}
            <span className="text-primary">Edition</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create a new newspaper edition. Articles and the cover
            can be added after the edition is created.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="text-sm leading-6 text-muted-foreground">
              The edition date identifies the daily newspaper in
              the public archive. Choose the actual publication
              date carefully.
            </p>
          </div>

          <AdminEditionForm />
        </div>
      </div>
    </main>
  );
}