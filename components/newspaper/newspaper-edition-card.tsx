import * as React from "react";
import { BookOpen } from "lucide-react";
import type { NewspaperArticle, NewspaperEdition } from "@/types/newspaper";

export function NewspaperEditionCard({
  edition,
  article,
  onOpen,
}: {
  edition: NewspaperEdition;
  article?: NewspaperArticle | null;
  onOpen: () => void;
}) {
  const date = new Date(`${edition.edition_date}T00:00:00`);
  const day = new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date);
  const formatted = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-2 shadow-sm">
      <div className="px-2 pb-2 text-center">
        <h3 className="font-serif text-xl font-bold text-primary">{day}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{formatted}</p>
        <div className="mx-auto mt-3 h-px w-10 bg-primary/60" />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="group block w-full overflow-hidden rounded-md border border-border bg-background text-left"
      >
        <div className="aspect-[3/4] overflow-hidden bg-secondary">
          {edition.cover_image_path ? (
            <img
              src={edition.cover_image_path}
              alt={`${edition.title} cover`}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <BookOpen className="h-9 w-9 text-primary/50" />
              <p className="mt-3 font-serif text-xl font-bold">{edition.title}</p>
              {edition.subtitle ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {edition.subtitle}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="line-clamp-3 font-serif text-sm font-bold leading-tight">
            {article?.headline ?? "Legal Newspaper"}
          </p>
          {article?.summary ? (
            <p className="mt-2 line-clamp-3 text-[11px] leading-4 text-muted-foreground">
              {article.summary}
            </p>
          ) : null}
        </div>
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"
      >
        <BookOpen className="h-4 w-4" />
        Read Newspaper
      </button>
    </article>
  );
}
