"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";

type DictionaryEntry = {
  s_no: number;
  word: string;
  meaning: string;
};

const PAGE_SIZE = 50;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DictionaryPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState("");
  const [searchedTerm, setSearchedTerm] = React.useState("");

  const [selectedLetter, setSelectedLetter] =
    React.useState<string | null>(null);

  const [entries, setEntries] = React.useState<
    DictionaryEntry[]
  >([]);

  const [totalCount, setTotalCount] = React.useState(0);

  const [page, setPage] = React.useState(1);

  const [loading, setLoading] = React.useState(true);
  const [searching, setSearching] = React.useState(false);

  const [error, setError] = React.useState<string | null>(
    null
  );

  const [selectedIndex, setSelectedIndex] =
    React.useState<number | null>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / PAGE_SIZE)
  );

  /*
   * ---------------------------------------------------------
   * SORT
   * ---------------------------------------------------------
   */

  const sortEntries = React.useCallback(
    (data: DictionaryEntry[]) =>
      [...data].sort(
        (a, b) =>
          Number(a.s_no) - Number(b.s_no)
      ),
    []
  );

  /*
   * ---------------------------------------------------------
   * FETCH DICTIONARY
   * ---------------------------------------------------------
   *
   * Three possible states:
   *
   * 1. No search + no letter
   *    → normal dictionary
   *
   * 2. Search term
   *    → searches the whole dictionary
   *
   * 3. Selected letter
   *    → terms beginning with that letter
   */

  const fetchDictionary = React.useCallback(
    async (
      pageNumber: number,
      term: string,
      letter: string | null
    ) => {
      const from =
        (pageNumber - 1) * PAGE_SIZE;

      const to =
        from + PAGE_SIZE - 1;

      let query = supabase
        .from("dictionary")
        .select("s_no, word, meaning", {
          count: "exact",
        })
        .order("s_no", {
          ascending: true,
        })
        .range(from, to);

      /*
       * Search takes priority over alphabet filtering.
       */
      if (term.trim()) {
        query = query.ilike(
          "word",
          `%${term.trim()}%`
        );
      } else if (letter) {
        /*
         * Alphabet filter.
         *
         * Example:
         * A → A%
         * B → B%
         * ...
         */
        query = query.ilike(
          "word",
          `${letter}%`
        );
      }

      const {
        data,
        error: queryError,
        count,
      } = await query;

      if (queryError) {
        console.error(
          "Dictionary load error:",
          queryError
        );

        setError(
          `Unable to load the legal dictionary. ${
            queryError.message || ""
          }`
        );

        setEntries([]);
        setTotalCount(0);

        return;
      }

      setEntries(
        sortEntries(
          (data ?? []) as DictionaryEntry[]
        )
      );

      setTotalCount(count ?? 0);
    },
    [sortEntries]
  );

  /*
   * ---------------------------------------------------------
   * LOAD DICTIONARY
   * ---------------------------------------------------------
   */

  const loadDictionary = React.useCallback(
    async (
      pageNumber = 1,
      term = "",
      letter: string | null = null
    ) => {
      setLoading(true);
      setError(null);

      await fetchDictionary(
        pageNumber,
        term,
        letter
      );

      setLoading(false);
    },
    [fetchDictionary]
  );

  /*
   * ---------------------------------------------------------
   * INITIAL LOAD
   * ---------------------------------------------------------
   *
   * No alphabet selected by default.
   * This preserves the existing behaviour.
   */

  React.useEffect(() => {
    const query = searchParams.get("q")?.trim() ?? "";

    setSearch(query);
    setSearchedTerm(query);
    setSelectedLetter(null);
    setPage(1);
    setSelectedIndex(null);

    void loadDictionary(1, query, null);
  }, [searchParams, loadDictionary]);

  /*
   * ---------------------------------------------------------
   * SEARCH
   * ---------------------------------------------------------
   */

  const searchDictionary = async () => {
    const term = search.trim();

    setSelectedIndex(null);
    setPage(1);
    setSearchedTerm(term);

    /*
     * Searching the dictionary clears
     * the currently selected alphabet.
     */
    setSelectedLetter(null);

    setSearching(true);
    setError(null);

    await fetchDictionary(
      1,
      term,
      null
    );

    setSearching(false);
  };

  /*
   * ---------------------------------------------------------
   * SEARCH KEYBOARD
   * ---------------------------------------------------------
   */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();

      void searchDictionary();
    }
  };

  /*
   * ---------------------------------------------------------
   * CLEAR SEARCH
   * ---------------------------------------------------------
   */

  const clearSearch = async () => {
    setSearch("");
    setSearchedTerm("");
    setSelectedIndex(null);
    setSelectedLetter(null);
    setPage(1);

    await loadDictionary(
      1,
      "",
      null
    );
  };

  /*
   * ---------------------------------------------------------
   * ALPHABET FILTER
   * ---------------------------------------------------------
   */

  const selectLetter = async (
    letter: string
  ) => {
    /*
     * Clicking the active letter again
     * returns to the normal dictionary.
     */
    if (selectedLetter === letter) {
      setSelectedLetter(null);
      setSearchedTerm("");
      setSearch("");
      setSelectedIndex(null);
      setPage(1);

      await loadDictionary(
        1,
        "",
        null
      );

      return;
    }

    setSearch("");
    setSearchedTerm("");
    setSelectedIndex(null);
    setSelectedLetter(letter);
    setPage(1);

    setLoading(true);
    setError(null);

    await fetchDictionary(
      1,
      "",
      letter
    );

    setLoading(false);
  };

  /*
   * ---------------------------------------------------------
   * PAGINATION
   * ---------------------------------------------------------
   */

  const changePage = async (
    nextPage: number
  ) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    setSelectedIndex(null);
    setPage(nextPage);

    await loadDictionary(
      nextPage,
      searchedTerm,
      selectedLetter
    );

    /*
     * Instant scroll is better on mobile.
     * Smooth scrolling can feel laggy on
     * lower-powered devices.
     */
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  /*
   * ---------------------------------------------------------
   * ENTRY MODAL
   * ---------------------------------------------------------
   */

  const openEntry = (
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const closeEntry = () => {
    setSelectedIndex(null);
  };

  const previousEntry = () => {
    if (
      selectedIndex === null ||
      selectedIndex <= 0
    ) {
      return;
    }

    setSelectedIndex(
      selectedIndex - 1
    );
  };

  const nextEntry = () => {
    if (
      selectedIndex === null ||
      selectedIndex >= entries.length - 1
    ) {
      return;
    }

    setSelectedIndex(
      selectedIndex + 1
    );
  };

  /*
   * ---------------------------------------------------------
   * KEYBOARD NAVIGATION
   * ---------------------------------------------------------
   */

  React.useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeEntry();
      }

      if (
        event.key === "ArrowLeft"
      ) {
        previousEntry();
      }

      if (
        event.key === "ArrowRight"
      ) {
        nextEntry();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    selectedIndex,
    entries.length,
  ]);

  /*
   * ---------------------------------------------------------
   * DERIVED VALUES
   * ---------------------------------------------------------
   */

  const selectedEntry =
    selectedIndex !== null
      ? entries[selectedIndex]
      : null;

  const firstDisplayedNumber =
    totalCount === 0
      ? 0
      : (page - 1) *
          PAGE_SIZE +
        1;

  const lastDisplayedNumber =
    Math.min(
      page * PAGE_SIZE,
      totalCount
    );

  /*
   * ---------------------------------------------------------
   * FILTER DESCRIPTION
   * ---------------------------------------------------------
   */

  const currentFilterLabel =
    selectedLetter
      ? `Terms beginning with ${selectedLetter}`
      : searchedTerm
        ? `Results for “${searchedTerm}”`
        : "All legal terms";

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-background">
      <section className="container-laws-and-judgments py-8 sm:py-10 lg:py-12">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Legal Dictionary
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Legal Dictionary
          </h1>

          <p className="mt-3 text-base leading-7 text-muted-foreground sm:mt-4 sm:text-lg">
            Explore legal terms and open any term
            to read its meaning.
          </p>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              placeholder="Search a legal term..."
              className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-11 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search legal dictionary"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  void clearSearch()
                }
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              void searchDictionary()
            }
            disabled={searching}
            className="h-12 shrink-0 rounded-xl bg-primary px-7 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {searching
              ? "Searching..."
              : "Search"}
          </button>
        </div>

        {/* =================================================
            A-Z NAVIGATION
        ================================================= */}

        <section className="mt-7 sm:mt-8">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Browse alphabetically
            </p>

            {selectedLetter && (
              <button
                type="button"
                onClick={() =>
                  void selectLetter(
                    selectedLetter
                  )
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear letter
              </button>
            )}
          </div>

          <div
            className="overflow-x-auto overscroll-x-contain pb-1"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <div className="flex min-w-max gap-1.5">
              {ALPHABET.map(
                (letter) => {
                  const active =
                    selectedLetter ===
                    letter;

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() =>
                        void selectLetter(
                          letter
                        )
                      }
                      aria-pressed={active}
                      aria-label={`Browse terms beginning with ${letter}`}
                      className={[
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                      ].join(" ")}
                    >
                      {letter}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            SECTION HEADING
        ================================================= */}

        <div className="mt-7 flex flex-col gap-3 border-b border-border pb-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {searchedTerm
                ? "Search results"
                : selectedLetter
                  ? selectedLetter
                  : "Dictionary"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalCount > 0
                ? `${firstDisplayedNumber}–${lastDisplayedNumber} of ${totalCount} terms`
                : "No terms found"}
            </p>

            {(selectedLetter ||
              searchedTerm) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {currentFilterLabel}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />

            <span>
              50 terms per page
            </span>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* =================================================
            DICTIONARY TABLE
        ================================================= */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
          {loading ? (
            <DictionarySkeleton />
          ) : entries.length === 0 &&
            !error ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-foreground">
                No terms found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {selectedLetter
                  ? `There are no dictionary terms beginning with ${selectedLetter}.`
                  : searchedTerm
                    ? "Try searching for another legal term."
                    : "No dictionary terms are currently available."}
              </p>

              {(selectedLetter ||
                searchedTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      selectedLetter
                    ) {
                      void selectLetter(
                        selectedLetter
                      );
                    } else {
                      void clearSearch();
                    }
                  }}
                  className="mt-4 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop column header */}
              <div className="hidden grid-cols-[90px_1fr] border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
                <div>S.No.</div>
                <div>Legal Term</div>
              </div>

              {/* Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map(
                  (
                    entry,
                    index
                  ) => (
                    <button
                      key={entry.s_no}
                      type="button"
                      onClick={() =>
                        openEntry(index)
                      }
                      className={[
                        "group flex min-h-[58px] items-center gap-3 border-b border-border px-5 py-3 text-left transition-colors",
                        "hover:bg-secondary/40",
                        "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                        "sm:nth-[2n]:border-r-0 sm:[&:nth-child(odd)]:border-r",
                        "lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n+1)]:border-r",
                      ].join(" ")}
                    >
                      <span className="w-10 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                        {entry.s_no}
                      </span>

                      <span className="min-w-0 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {entry.word}
                      </span>
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          totalPages > 1 && (
            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {firstDisplayedNumber}–
                  {lastDisplayedNumber}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalCount}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void changePage(
                      page - 1
                    )
                  }
                  disabled={page === 1}
                  className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 sm:h-9"
                >
                  <ChevronLeft className="h-4 w-4" />

                  <span className="hidden xs:inline">
                    Previous
                  </span>

                  <span className="sm:hidden">
                    Prev
                  </span>
                </button>

                <div className="flex h-10 min-w-16 items-center justify-center rounded-lg bg-secondary px-3 text-sm font-medium text-foreground sm:h-9">
                  {page} /{" "}
                  {totalPages}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void changePage(
                      page + 1
                    )
                  }
                  disabled={
                    page === totalPages
                  }
                  className="flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 sm:h-9"
                >
                  <span>
                    Next
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        {/* =================================================
            ENTRY MODAL
        ================================================= */}

        {selectedEntry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeEntry();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="dictionary-entry-title"
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:max-h-[85vh]"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Legal Term
                  </p>

                  <h2
                    id="dictionary-entry-title"
                    className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                  >
                    {selectedEntry.word}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    S.No.{" "}
                    {selectedEntry.s_no}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeEntry
                  }
                  aria-label="Close"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Meaning */}
              <div className="overflow-y-auto px-5 py-6 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Meaning
                </p>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground sm:text-base">
                  {
                    selectedEntry.meaning
                  }
                </p>
              </div>

              {/* Modal navigation */}
              <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={
                    previousEntry
                  }
                  disabled={
                    selectedIndex ===
                    0
                  }
                  className="flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Previous
                  </span>

                  <span className="sm:hidden">
                    Prev
                  </span>
                </button>

                <span className="text-xs text-muted-foreground">
                  {selectedIndex !==
                  null
                    ? `${
                        selectedIndex +
                        1
                      } of ${
                        entries.length
                      }`
                    : ""}
                </span>

                <button
                  type="button"
                  onClick={
                    nextEntry
                  }
                  disabled={
                    selectedIndex ===
                    entries.length -
                      1
                  }
                  className="flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>
                    Next
                  </span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function DictionarySkeleton() {
  return (
    <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
      {Array.from({
        length: 18,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-5 py-4"
        >
          <div className="h-3 w-8 animate-pulse rounded bg-secondary" />

          <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}