"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";

import { supabase } from "@/providers/database/supabase";
import type {
  NewspaperArticle,
  NewspaperEdition,
} from "@/types/newspaper";

const NEWSPAPER_MEDIA_BUCKET = "newspaper-media";

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
  const day = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
  }).format(date);

  const formatted = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const coverImageUrl = React.useMemo(() => {
    if (!edition.cover_image_path) {
      return null;
    }

    const { data } = supabase.storage
      .from(NEWSPAPER_MEDIA_BUCKET)
      .getPublicUrl(edition.cover_image_path);

    return data.publicUrl;
  }, [edition.cover_image_path]);

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-1.5 shadow-sm">
      <div className="px-1.5 pb-1.5 text-center">
        <h3 className="font-serif text-lg font-bold text-primary">
          {day}
        </h3>

        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {formatted}
        </p>

        <div className="mx-auto mt-2 h-px w-8 bg-primary/60" />
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="group block w-full overflow-hidden rounded-md border border-border bg-background text-left"
      >
        <div className="aspect-[3/4] overflow-hidden bg-secondary">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={`${edition.title} cover`}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <BookOpen className="h-9 w-9 text-primary/50" />

              <p className="mt-3 font-serif text-xl font-bold">
                {edition.title}
              </p>

              {edition.subtitle ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {edition.subtitle}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="mt-1.5 flex min-h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"
      >
        <BookOpen className="h-4 w-4" />
        Read Newspaper
      </button>
    </article>
  );
}
