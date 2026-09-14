"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewspaperEdition } from "@/types/newspaper";

function d(value: string) {
  return new Date(`${value}T00:00:00`);
}

function weekday(value: string) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(d(value));
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
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {editions.map((item) => {
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={[
                  "rounded-lg border px-3 py-2 text-center transition",
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

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <button
            type="button"
            disabled={!canPrevious}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </button>

          <span className="hidden text-sm font-semibold text-primary md:block">
            {editions.length
              ? `${dateText(editions[0]?.edition_date ?? "")} – ${dateText(editions[editions.length - 1]?.edition_date ?? "")}`
              : ""}
          </span>

          <button
            type="button"
            disabled={!canNext}
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-35"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
