"use client";

import * as React from "react";

import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  PanelLeftClose,
  Scale,
  Star,
} from "lucide-react";

import type {
  NewspaperCategory,
} from "@/types/newspaper";

const ITEMS = [
  ["Daily Newspapers", FileText],
  ["Important Headlines", Star],
  ["Supreme Court Updates", Scale],
  ["High Court Updates", Building2],
  ["Government Notifications", Bell],
] as const;

function calendarCells(
  year: number,
  month: number,
) {
  const first = new Date(
    year,
    month,
    1,
  ).getDay();

  const days = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const cells: Array<
    number | null
  > = Array(first).fill(null);

  for (
    let day = 1;
    day <= days;
    day++
  ) {
    cells.push(day);
  }

  while (cells.length % 7) {
    cells.push(null);
  }

  return cells;
}

function toDateValue(
  year: number,
  month: number,
  day: number,
) {
  return [
    year,
    String(month + 1).padStart(
      2,
      "0",
    ),
    String(day).padStart(
      2,
      "0",
    ),
  ].join("-");
}

function normalize(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "",
    );
}

function findCategory(
  label: string,
  categories: NewspaperCategory[],
) {
  const wanted =
    normalize(label);

  return (
    categories.find(
      (category) =>
        normalize(
          category.name,
        ) === wanted ||
        normalize(
          category.slug,
        ) === wanted,
    ) ?? null
  );
}

export function NewspaperDateSidebar({
  open,
  selectedDate,
  availableDates,
  categories,
  activeCategoryId,
  onSelect,
  onCategorySelect,
}: {
  open: boolean;
  selectedDate: string;
  availableDates: Set<string>;
  categories: NewspaperCategory[];
  activeCategoryId: string | null;
  onSelect: (date: string) => void;
  onCategorySelect: (
    categoryId: string | null,
  ) => void;
}) {
  const selected =
    React.useMemo(() => {
      const value =
        new Date(
          `${selectedDate}T00:00:00`,
        );

      return Number.isNaN(
        value.getTime(),
      )
        ? new Date()
        : value;
    }, [selectedDate]);

  const [
    visibleMonth,
    setVisibleMonth,
  ] = React.useState(
    () =>
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1,
      ),
  );

  React.useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const next =
      new Date(
        `${selectedDate}T00:00:00`,
      );

    if (
      Number.isNaN(
        next.getTime(),
      )
    ) {
      return;
    }

    setVisibleMonth(
      (current) => {
        if (
          current.getFullYear() ===
            next.getFullYear() &&
          current.getMonth() ===
            next.getMonth()
        ) {
          return current;
        }

        return new Date(
          next.getFullYear(),
          next.getMonth(),
          1,
        );
      },
    );
  }, [selectedDate]);

  const year =
    visibleMonth.getFullYear();

  const month =
    visibleMonth.getMonth();

  const cells =
    calendarCells(
      year,
      month,
    );

  const monthLabel =
    new Intl.DateTimeFormat(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      },
    ).format(visibleMonth);

  function changeMonth(
    offset: number,
  ) {
    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            offset,
          1,
        ),
    );
  }

  return (
    <aside
      aria-label="Newspaper archive navigation"
      aria-hidden={!open}
      className={[
        "hidden shrink-0 border-r border-border bg-background transition-[width,opacity] duration-200 lg:block",
        open
          ? "w-[296px] opacity-100"
          : "w-0 overflow-hidden border-r-0 opacity-0",
      ].join(" ")}
    >
      <div className="w-[296px] px-5 py-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">
            Select Date
          </h2>

          <button
            type="button"
            aria-label="Hide newspaper sidebar"
            onClick={() => {
              /*
               * The actual sidebar state lives in
               * NewspaperPage. This button is intentionally
               * kept visual-only through the parent toggle
               * trigger when the sidebar is rendered.
               */
            }}
            className="hidden"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                changeMonth(-1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
            </button>

            <span
              aria-live="polite"
              className="font-serif font-bold"
            >
              {monthLabel}
            </span>

            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                changeMonth(1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </button>
          </div>

          <div
            aria-hidden="true"
            className="mt-3 grid grid-cols-7 text-center text-[10px] text-muted-foreground"
          >
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <span key={day}>
                {day}
              </span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-xs">
            {cells.map(
              (day, index) => {
                if (
                  day === null
                ) {
                  return (
                    <span
                      key={`blank-${index}`}
                      aria-hidden="true"
                      className="h-8"
                    />
                  );
                }

                const value =
                  toDateValue(
                    year,
                    month,
                    day,
                  );

                const active =
                  value ===
                  selectedDate;

                const available =
                  availableDates.has(
                    value,
                  );

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={
                      !available
                    }
                    aria-label={
                      available
                        ? `Select newspaper for ${value}`
                        : `No published newspaper for ${value}`
                    }
                    aria-current={
                      active
                        ? "date"
                        : undefined
                    }
                    onClick={() =>
                      onSelect(value)
                    }
                    className={[
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                      active
                        ? "bg-primary font-bold text-primary-foreground"
                        : available
                          ? "text-foreground hover:bg-primary/10 hover:text-primary"
                          : "cursor-not-allowed text-muted-foreground/35",
                    ].join(" ")}
                  >
                    {day}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <nav
          aria-label="Newspaper categories"
          className="mt-4 space-y-1"
        >
          {ITEMS.map(
            ([label, Icon]) => {
              const isDaily =
                label ===
                "Daily Newspapers";

              const category =
                isDaily
                  ? null
                  : findCategory(
                      label,
                      categories,
                    );

              const active =
                isDaily
                  ? activeCategoryId ===
                    null
                  : category?.id ===
                    activeCategoryId;

              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  disabled={
                    !isDaily &&
                    !category
                  }
                  onClick={() =>
                    onCategorySelect(
                      isDaily
                        ? null
                        : category?.id ??
                            null,
                    )
                  }
                  className={[
                    "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    active
                      ? "bg-primary/10 text-primary"
                      : category ||
                          isDaily
                        ? "text-foreground hover:bg-secondary"
                        : "cursor-not-allowed text-muted-foreground/40",
                  ].join(" ")}
                >
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0"
                  />

                  {label}
                </button>
              );
            },
          )}
        </nav>

        <div className="mt-5 rounded-lg border border-border bg-card p-5">
          <p className="font-serif text-lg font-bold italic">
            “Stay informed.
            <br />
            Stay ahead.”
          </p>

          <div className="mt-4 h-px w-10 bg-primary" />

          <p className="mt-3 text-xs text-muted-foreground">
            Laws & Judgments
          </p>
        </div>
      </div>
    </aside>
  );
}