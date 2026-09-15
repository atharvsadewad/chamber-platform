"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useNewspaper } from "@/hooks/use-newspaper";
import { NewspaperDateSidebar } from "./newspaper-date-sidebar";
import { NewspaperEditionCard } from "./newspaper-edition-card";
import { NewspaperWeekStrip } from "./newspaper-week-strip";
import { NewspaperReader } from "./newspaper-reader";

const WEEK_SIZE = 7;

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", options).format(
    new Date(`${value}T00:00:00`),
  );
}

function calendarWeek(selectedDate: string, editions: ReturnType<typeof useNewspaper>["editions"]) {
  const selected = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : new Date();

  const start = new Date(selected);
  start.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      value,
      day: date.getDate(),
      weekday: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
      available: editions.some((edition) => edition.edition_date === value),
    };
  });
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
  selectedDate: string;
  editions: ReturnType<typeof useNewspaper>["editions"];
  onSelect: (date: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  const selected = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : new Date();

  const days = calendarWeek(selectedDate, editions);

  return (
    <section className="border-b border-border px-3 py-2 sm:hidden">
      <div className="rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">Select Date</h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous week"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onPrevious}
              disabled={!canPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="min-w-[120px] text-center font-serif text-base font-bold">
              {new Intl.DateTimeFormat("en-IN", {
                month: "long",
                year: "numeric",
              }).format(selected)}
            </span>

            <button
              type="button"
              aria-label="Next week"
              className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              onClick={onNext}
              disabled={!canNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-7 text-center">
          {days.map((item) => {
            const active = item.value === selectedDate;

            return (
              <button
                key={item.value}
                type="button"
                disabled={!item.available}
                onClick={() => onSelect(item.value)}
                className={[
                  "flex min-w-0 flex-col items-center justify-center rounded-md py-1",
                  active
                    ? "bg-primary text-primary-foreground"
                    : item.available
                      ? "hover:bg-primary/10"
                      : "text-muted-foreground/45",
                ].join(" ")}
              >
                <span className="text-[11px]">{item.weekday}</span>
                <span className="mt-1 text-base font-medium">{item.day}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileWeekControls({
  editions,
  week,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  editions: ReturnType<typeof useNewspaper>["editions"];
  week: number;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  const first = editions[week * WEEK_SIZE];
  const last =
    editions[
      Math.min(editions.length - 1, week * WEEK_SIZE + WEEK_SIZE - 1)
    ];

  const range =
    first && last
      ? `${formatDate(first.edition_date, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })} – ${formatDate(last.edition_date, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : "";

  return (
    <section className="px-3 pt-3 sm:hidden">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <button
          type="button"
          disabled={!canPrevious}
          onClick={onPrevious}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-primary px-2 text-sm font-semibold text-primary disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5 shrink-0" />
          <span>Previous Week</span>
        </button>

        <p className="w-[120px] text-center font-serif text-sm font-bold leading-5 text-primary">
          {range}
        </p>

        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-primary px-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          <span>Next Week</span>
          <ChevronRight className="h-5 w-5 shrink-0" />
        </button>
      </div>
    </section>
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

  const [activeCategoryId, setActiveCategoryId] = React.useState<string | null>(null);
  const [reader, setReader] = React.useState(false);
  const [week, setWeek] = React.useState(0);

  const visible = editions.slice(
    week * WEEK_SIZE,
    week * WEEK_SIZE + WEEK_SIZE,
  );

  const articles = edition?.articles ?? [];

  function selectDate(value: string) {
    const foundIndex = editions.findIndex(
      (item) => item.edition_date === value,
    );

    if (foundIndex === -1) return;

    const found = editions[foundIndex];
    if (!found) return;

    setWeek(Math.floor(foundIndex / WEEK_SIZE));
    void selectEdition(found.id);
  }

  function selectCategory(categoryId: string | null) {
    setActiveCategoryId(categoryId);
  }

  const totalWeeks = Math.max(1, Math.ceil(editions.length / WEEK_SIZE));

  function selectWeek(nextWeek: number) {
    const boundedWeek = Math.max(
      0,
      Math.min(totalWeeks - 1, nextWeek),
    );

    const firstEdition = editions[boundedWeek * WEEK_SIZE];

    if (!firstEdition) return;

    setWeek(boundedWeek);
    void selectEdition(firstEdition.id);
    setReader(false);
  }

  const canPreviousWeek = week < totalWeeks - 1;
  const canNextWeek = week > 0;

  return (
    <>
      {/* Navbar is universal and intentionally not rendered by this page. */}

      <main className="min-h-screen bg-background">
        <div className="h-[6px] bg-primary" />

        <div className="flex">
          {/* Desktop archive navigation and category filters. */}
          <NewspaperDateSidebar
            selectedDate={edition?.edition_date ?? ""}
            availableDates={new Set(editions.map((item) => item.edition_date))}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={selectDate}
            onCategorySelect={selectCategory}
          />

          <div className="min-w-0 flex-1">
            {/* Masthead — desktop styling preserved; mobile follows the supplied reference. */}
            <section className="border-b border-border">
              <div className="mx-auto grid max-w-[1280px] items-center gap-4 px-4 py-5 sm:px-8 sm:py-6 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-10 lg:py-6">
                <div>
                  <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Legal <span className="text-primary">Newspaper</span>
                  </h1>

                  <p className="mt-3 max-w-[560px] text-base leading-6 text-muted-foreground sm:text-lg">
                    Daily legal news, updates and developments from across India.
                  </p>
                </div>

                <div className="flex min-h-[80px] items-center justify-end lg:min-h-[110px]">
                  <div className="border-l border-primary/70 pl-6 text-left sm:pl-7 lg:border-l-0 lg:pl-0 lg:text-right">
                    <p className="font-serif text-[20px] font-bold text-primary/80 sm:text-2xl lg:text-3xl">
                      Laws & Judgments
                    </p>
                    <p className="mt-2 max-w-[300px] font-serif text-sm italic leading-6 text-muted-foreground sm:text-base">
                      “A well-informed citizen strengthens a stronger nation.”
                    </p>
                    <div className="mt-4 h-px w-10 bg-primary lg:ml-auto" />
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile reference date selector. */}
            <MobileDateStrip
              selectedDate={edition?.edition_date ?? ""}
              editions={editions}
              onSelect={selectDate}
              onPrevious={() => selectWeek(week + 1)}
              onNext={() => selectWeek(week - 1)}
              canPrevious={canPreviousWeek}
              canNext={canNextWeek}
            />

            {/* Desktop search intentionally omitted; newspaper covers are the primary archive entry point. */}
            {/* Desktop week strip only. The mobile reference has cards immediately after the date selector. */}
            {visible.length > 0 ? (
              <div className="hidden sm:block">
                <NewspaperWeekStrip
                  editions={visible}
                  selectedId={selectedEditionId}
                  onSelect={(id) => {
                    const selectedIndex = editions.findIndex(
                      (item) => item.id === id,
                    );

                    if (selectedIndex === -1) return;

                    setWeek(Math.floor(selectedIndex / WEEK_SIZE));
                    void selectEdition(id);
                  }}
                  onPrevious={() => setWeek((value) => Math.max(0, value - 1))}
                  onNext={() =>
                    setWeek((value) =>
                      Math.min(totalWeeks - 1, value + 1),
                    )
                  }
                  canPrevious={week > 0}
                  canNext={week < totalWeeks - 1}
                />
              </div>
            ) : null}

            <section className="mx-auto max-w-[1280px] px-3 py-3 sm:px-8 sm:py-4 lg:px-10">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: Math.min(7, Math.max(1, visible.length || 3)) }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="h-[320px] animate-pulse rounded-lg border border-border bg-secondary/40 sm:h-[380px]"
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
                    We’re having trouble loading the newspaper. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => void reload()}
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
                    Publish an edition in <code>newspaper_editions</code> to make it appear here.
                    Add its stories through <code>newspaper_articles</code>.
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile: two-column responsive archive grid. */}
                  <div className="grid grid-cols-2 gap-3 sm:hidden">
                    {visible.map((item) => (
                      <NewspaperEditionCard
                        key={item.id}
                        edition={item}
                        article={
                          item.id === edition?.id
                            ? articles[0]
                            : undefined
                        }
                        onOpen={async () => {
                          if (item.id !== selectedEditionId) {
                            await selectEdition(item.id);
                          }
                          setReader(true);
                        }}
                      />
                    ))}
                  </div>

                  {/* Desktop: wider four-column archive grid. */}
                  <div className="hidden sm:block">
                    <div className="mb-3 flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          Daily Newspapers
                        </p>
                        <h2 className="mt-1 font-serif text-xl font-bold">
                          {edition
                            ? new Intl.DateTimeFormat("en-IN", {
                                month: "long",
                                year: "numeric",
                              }).format(
                                new Date(`${edition.edition_date}T00:00:00`),
                              )
                            : ""}
                        </h2>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {articles.length} stories
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {visible.map((item) => (
                        <NewspaperEditionCard
                          key={item.id}
                          edition={item}
                          article={
                            item.id === edition?.id
                              ? articles[0]
                              : undefined
                          }
                          onOpen={async () => {
                            if (item.id !== selectedEditionId) {
                              await selectEdition(item.id);
                            }
                            setReader(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            {editions.length > 0 ? (
              <>
                <MobileWeekControls
                  editions={editions}
                  week={week}
                  onPrevious={() => selectWeek(week + 1)}
                  onNext={() => selectWeek(week - 1)}
                  canPrevious={canPreviousWeek}
                  canNext={canNextWeek}
                />

              </>
            ) : null}
          </div>
        </div>
      </main>


      {reader && edition ? (
        <NewspaperReader
          edition={edition}
          onClose={() => setReader(false)}
        />
      ) : null}
    </>
  );
}
