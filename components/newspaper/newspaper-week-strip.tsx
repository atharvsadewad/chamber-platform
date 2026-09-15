"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewspaperEdition } from "@/types/newspaper";

function d(value: string) {
  return new Date(`${value}T00:00:00`);
}

function weekday(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
  }).format(d(value));
}

function dateText(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d(value));
}

export function NewspaperWeekStrip({
  editions,
  selectedId,
  onSelect,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  editions: NewspaperEdition[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  const firstEdition = editions[0];
  const lastEdition = editions[editions.length - 1];

  const rangeLabel =
    firstEdition && lastEdition
      ? `${dateText(lastEdition.edition_date)} – ${dateText(firstEdition.edition_date)}`
      : "";

  return (
    <section
      aria-label="Newspaper edition navigation"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-8 lg:px-10">
        {editions.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
            {editions.map((item) => {
              const active = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(item.id)}
                  className={[
                    "rounded-lg border px-3 py-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  ].join(" ")}
                >
                  <span className="block font-serif text-sm font-bold sm:text-base">
                    {weekday(item.edition_date)}
                  </span>

                  <span className="mt-1 block text-[10px] opacity-75">
                    {dateText(item.edition_date)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="py-2 text-center text-sm text-muted-foreground">
            No newspaper editions available.
          </p>
        )}

        {editions.length > 0 && (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              disabled={!canPrevious}
              onClick={onPrevious}
              aria-label="View previous newspaper week"
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Previous Week
            </button>

            <span
              aria-live="polite"
              className="hidden text-center text-sm font-semibold text-primary md:block"
            >
              {rangeLabel}
            </span>

            <button
              type="button"
              disabled={!canNext}
              onClick={onNext}
              aria-label="View next newspaper week"
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next Week
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
