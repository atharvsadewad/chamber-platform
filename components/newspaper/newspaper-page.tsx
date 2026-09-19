"use client";

import * as React from "react";
import {
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import { useNewspaper } from "@/hooks/use-newspaper";

import { NewspaperDateSidebar } from "./newspaper-date-sidebar";
import { NewspaperEditionCard } from "./newspaper-edition-card";
import { NewspaperReader } from "./newspaper-reader";
import { NewspaperWeekStrip } from "./newspaper-week-strip";

import type { NewspaperEdition } from "@/types/newspaper";

const WEEK_SIZE = 7;

function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    options,
  ).format(
    new Date(`${value}T00:00:00`),
  );
}

function MobileDateStrip({
  selectedDate,
  editions,
  onSelect,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  selectedDate: string | null;
  editions: NewspaperEdition[];
  onSelect: (date: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  const selectedIndex = selectedDate
    ? editions.findIndex(
        (item) =>
          item.edition_date === selectedDate,
      )
    : -1;

  const currentWeek =
    selectedIndex >= 0
      ? Math.floor(
          selectedIndex / WEEK_SIZE,
        )
      : 0;

  const startIndex =
    currentWeek * WEEK_SIZE;

  const visible = editions.slice(
    startIndex,
    startIndex + WEEK_SIZE,
  );

  return (
    <section className="border-b border-border sm:hidden">
      <div className="overflow-x-auto px-3 py-3">
        <div className="flex min-w-max gap-2">
          {visible.map((item) => {
            const active =
              item.edition_date ===
              selectedDate;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onSelect(
                    item.edition_date,
                  )
                }
                className={[
                  "min-w-[132px] rounded-lg border px-3 py-2 text-center transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40",
                ].join(" ")}
              >
                <span className="block font-serif text-sm font-bold">
                  {formatDate(
                    item.edition_date,
                    {
                      weekday: "long",
                    },
                  )}
                </span>

                <span className="mt-1 block text-[10px] opacity-75">
                  {formatDate(
                    item.edition_date,
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <button
            type="button"
            disabled={!canPrevious}
            onClick={onPrevious}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-primary px-3 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <p className="w-[120px] text-center font-serif text-xs font-bold leading-5 text-primary">
            {visible.length > 0
              ? `${formatDate(
                  visible[
                    visible.length - 1
                  ]!.edition_date,
                  {
                    day: "numeric",
                    month: "short",
                  },
                )} – ${formatDate(
                  visible[0]!.edition_date,
                  {
                    day: "numeric",
                    month: "short",
                  },
                )}`
              : ""}
          </p>

          <button
            type="button"
            disabled={!canNext}
            onClick={onNext}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function SidebarToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        open
          ? "Hide newspaper sidebar"
          : "Show newspaper sidebar"
      }
      aria-expanded={open}
      className="hidden lg:inline-flex absolute left-4 top-5 z-10 h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {open ? (
        <PanelLeftClose
          className="h-4 w-4"
          aria-hidden="true"
        />
      ) : (
        <PanelLeft
          className="h-4 w-4"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default function NewspaperPage() {
  const {
    editions,
    edition,
    categories,
    selectedEditionId,
    loading,
    error,
    selectEdition,
    reload,
  } = useNewspaper();

  const [
    activeCategoryId,
    setActiveCategoryId,
  ] = React.useState<string | null>(
    null,
  );

  const [
    selectedDateFilter,
    setSelectedDateFilter,
  ] = React.useState<string | null>(
    null,
  );

  const [reader, setReader] =
    React.useState(false);

  const [week, setWeek] =
    React.useState(0);

  const [sidebarOpen, setSidebarOpen] =
    React.useState(true);

  /*
   * `selectedDateFilter` controls the archive grid.
   *
   * null  -> show the normal archive grid
   * date  -> show only that date
   *
   * `edition` remains the actual edition loaded
   * into the reader.
   */
  const visibleEditions =
    selectedDateFilter
      ? editions.filter(
          (item) =>
            item.edition_date ===
            selectedDateFilter,
        )
      : editions.slice(
          week * WEEK_SIZE,
          week * WEEK_SIZE +
            WEEK_SIZE,
        );

  const articles =
    edition?.articles ?? [];

  function selectDate(
    value: string,
  ) {
    const foundIndex =
      editions.findIndex(
        (item) =>
          item.edition_date === value,
      );

    if (foundIndex === -1) {
      return;
    }

    const found =
      editions[foundIndex];

    if (!found) {
      return;
    }

    /*
     * Clicking an actual date activates
     * the single-date filter.
     */
    setSelectedDateFilter(value);

    setWeek(
      Math.floor(
        foundIndex / WEEK_SIZE,
      ),
    );

    setActiveCategoryId(null);

    void selectEdition(found.id);

    setReader(false);
  }

  function showAllEditions() {
    setSelectedDateFilter(null);
    setReader(false);
  }

  function selectCategory(
    categoryId: string | null,
  ) {
    setActiveCategoryId(
      categoryId,
    );
  }

  const totalWeeks = Math.max(
    1,
    Math.ceil(
      editions.length / WEEK_SIZE,
    ),
  );

  function selectWeek(
    nextWeek: number,
  ) {
    const boundedWeek =
      Math.max(
        0,
        Math.min(
          totalWeeks - 1,
          nextWeek,
        ),
      );

    const firstEdition =
      editions[
        boundedWeek * WEEK_SIZE
      ];

    if (!firstEdition) {
      return;
    }

    /*
     * Moving between weeks returns the user
     * to the normal archive grid.
     */
    setWeek(boundedWeek);
    setSelectedDateFilter(null);
    setActiveCategoryId(null);
    setReader(false);

    void selectEdition(
      firstEdition.id,
    );
  }

  const canPreviousWeek =
    week > 0;

  const canNextWeek =
    week < totalWeeks - 1;

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="h-[6px] bg-primary" />

        <div className="relative flex">
          <NewspaperDateSidebar
            open={sidebarOpen}
            selectedDate={
              selectedDateFilter ??
              edition?.edition_date ??
              ""
            }
            availableDates={
              new Set(
                editions.map(
                  (item) =>
                    item.edition_date,
                ),
              )
            }
            categories={categories}
            activeCategoryId={
              activeCategoryId
            }
            onSelect={selectDate}
            onCategorySelect={
              selectCategory
            }
          />

          <div className="min-w-0 flex-1">
            <section className="border-b border-border">
              <div className="relative mx-auto grid max-w-[1280px] items-center gap-4 px-4 py-5 sm:px-8 sm:py-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-10 lg:py-6">
                <SidebarToggle
                  open={sidebarOpen}
                  onClick={() =>
                    setSidebarOpen(
                      (value) =>
                        !value,
                    )
                  }
                />

                <div className="lg:pl-10">
                  <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Legal{" "}
                    <span className="text-primary">
                      Newspaper
                    </span>
                  </h1>

                  <p className="mt-3 max-w-[560px] text-base leading-6 text-muted-foreground sm:text-lg">
                    Daily legal news, updates
                    and developments from
                    across India.
                  </p>
                </div>

                <div className="flex min-h-[80px] items-center justify-end lg:min-h-[110px]">
                  <div className="border-l border-primary/70 pl-6 text-left sm:pl-7 lg:border-l-0 lg:pl-0 lg:text-right">
                    <p className="font-serif text-[20px] font-bold text-primary/80 sm:text-2xl lg:text-3xl">
                      Laws & Judgments
                    </p>

                    <p className="mt-2 max-w-[300px] font-serif text-sm italic leading-6 text-muted-foreground sm:text-base">
                      “A well-informed citizen
                      strengthens a stronger
                      nation.”
                    </p>

                    <div className="mt-4 h-px w-10 bg-primary lg:ml-auto" />
                  </div>
                </div>
              </div>
            </section>

            <MobileDateStrip
              selectedDate={
                selectedDateFilter
              }
              editions={editions}
              onSelect={selectDate}
              onPrevious={() =>
                selectWeek(
                  week - 1,
                )
              }
              onNext={() =>
                selectWeek(
                  week + 1,
                )
              }
              canPrevious={
                canPreviousWeek
              }
              canNext={canNextWeek}
            />

            {editions.length > 0 ? (
              <div className="hidden sm:block">
                <NewspaperWeekStrip
                  editions={editions.slice(
                    week * WEEK_SIZE,
                    week * WEEK_SIZE +
                      WEEK_SIZE,
                  )}
                  selectedId={
                    selectedEditionId
                  }
                  onSelect={(id) => {
                    const selectedIndex =
                      editions.findIndex(
                        (item) =>
                          item.id === id,
                      );

                    if (
                      selectedIndex === -1
                    ) {
                      return;
                    }

                    const selected =
                      editions[
                        selectedIndex
                      ];

                    if (!selected) {
                      return;
                    }

                    /*
                     * Clicking a specific date
                     * in the week strip also
                     * activates the date filter.
                     */
                    setSelectedDateFilter(
                      selected.edition_date,
                    );

                    setWeek(
                      Math.floor(
                        selectedIndex /
                          WEEK_SIZE,
                      ),
                    );

                    setActiveCategoryId(
                      null,
                    );

                    void selectEdition(
                      id,
                    );

                    setReader(false);
                  }}
                  onPrevious={() =>
                    selectWeek(
                      week - 1,
                    )
                  }
                  onNext={() =>
                    selectWeek(
                      week + 1,
                    )
                  }
                  canPrevious={
                    canPreviousWeek
                  }
                  canNext={
                    canNextWeek
                  }
                />
              </div>
            ) : null}

            <section className="mx-auto max-w-[1280px] px-3 py-4 sm:px-8 sm:py-5 lg:px-10">
              {loading ? (
                <div
                  className={[
                    "grid gap-4",
                    selectedDateFilter
                      ? "grid-cols-1"
                      : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  ].join(" ")}
                >
                  {Array.from({
                    length:
                      selectedDateFilter
                        ? 1
                        : 4,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="h-[380px] animate-pulse rounded-lg border border-border bg-secondary/40"
                      />
                    ),
                  )}
                </div>
              ) : error ? (
                <div className="rounded-lg border border-border bg-card p-8 text-center sm:p-10">
                  <h2 className="font-serif text-xl font-bold">
                    Unable to load the newspaper
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    We’re having trouble loading
                    the newspaper. Please try again.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void reload()
                    }
                    className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Try Again
                  </button>
                </div>
              ) : editions.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center sm:p-12">
                  <h2 className="font-serif text-2xl font-bold">
                    No published edition yet
                  </h2>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    Publish an edition in{" "}
                    <code>
                      newspaper_editions
                    </code>{" "}
                    to make it appear here.
                    Add its stories through{" "}
                    <code>
                      newspaper_articles
                    </code>
                    .
                  </p>
                </div>
              ) : (
                <>
                  {selectedDateFilter ? (
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Selected Edition
                        </p>

                        <h2 className="mt-1 font-serif text-xl font-bold">
                          {formatDate(
                            selectedDateFilter,
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={
                          showAllEditions
                        }
                        className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        Show All Editions
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Daily Newspapers
                        </p>

                        <h2 className="mt-1 font-serif text-xl font-bold">
                          {editions.length > 0
                            ? formatDate(
                                editions[
                                  week *
                                    WEEK_SIZE
                                ]!.edition_date,
                                {
                                  month:
                                    "long",
                                  year: "numeric",
                                },
                              )
                            : ""}
                        </h2>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {visibleEditions.length}{" "}
                        editions
                      </span>
                    </div>
                  )}

                  <div
                    className={[
                      "grid gap-4",
                      selectedDateFilter
                        ? "grid-cols-1"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                    ].join(" ")}
                  >
                    {visibleEditions.map(
                      (item) => (
                        <NewspaperEditionCard
                          key={item.id}
                          edition={item}
                          article={
                            item.id ===
                            edition?.id
                              ? articles[0]
                              : undefined
                          }
                          onOpen={async () => {
                            if (
                              item.id !==
                              selectedEditionId
                            ) {
                              await selectEdition(
                                item.id,
                              );
                            }

                            setReader(true);
                          }}
                        />
                      ),
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      {edition && reader ? (
        <NewspaperReader
          edition={edition}
          onClose={() =>
            setReader(false)
          }
        />
      ) : null}
    </>
  );
}