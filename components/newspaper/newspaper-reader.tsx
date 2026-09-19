"use client";

import * as React from "react";

import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  NewspaperEditionWithArticles,
} from "@/services/newspaper.service";

import {
  isBookmarked,
  toggleBookmark,
  type BookmarkItem,
} from "@/lib/workspace/bookmarks";

function splitParagraphs(
  value: string | null | undefined,
) {
  return (value ?? "")
    .split(/\n+/)
    .map((paragraph) =>
      paragraph.trim(),
    )
    .filter(Boolean);
}

export function NewspaperReader({
  edition,
  onClose,
}: {
  edition: NewspaperEditionWithArticles;
  onClose: () => void;
}) {
  const [index, setIndex] =
    React.useState(0);

  const [bookmarked, setBookmarked] =
    React.useState(false);

  const article =
    edition.articles[index];

  React.useEffect(() => {
    setIndex(0);
    setBookmarked(
      isBookmarked(edition.id),
    );
  }, [edition.id]);

  React.useEffect(() => {
    const close = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      close,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        close,
      );
  }, [onClose]);

  if (!article) {
    return null;
  }

  function bookmark() {
  if (!article) {
    return;
  }

  const item: BookmarkItem = {
    id: edition.id,
    type: "newspaper",
    title: `Legal Newspaper — ${edition.edition_date}`,
    source: "Laws & Judgments",
    year: edition.edition_date.slice(
      0,
      4,
    ),
    summary:
      article.summary ??
      article.headline ??
      "",
    path: `/newspaper?edition=${edition.id}`,
    url: `/newspaper?edition=${edition.id}`,
  };

  setBookmarked(
    toggleBookmark(item),
  );
}

  /*
   * Summary is part of the article body.
   *
   * It must NOT be used as a fallback for content,
   * because both fields can legitimately exist.
   */
  const summaryParagraphs =
    splitParagraphs(
      article.summary,
    );

  const contentParagraphs =
    splitParagraphs(
      article.content,
    );

  const hasSummary =
    summaryParagraphs.length > 0;

  const hasContent =
    contentParagraphs.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex h-full flex-col">
        <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />

              <span className="hidden sm:inline">
                Back to editions
              </span>
            </button>

            <div className="text-center">
              <p className="font-serif text-sm font-bold">
                {edition.title}
              </p>

              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {edition.edition_date}
              </p>
            </div>

            <button
              type="button"
              onClick={bookmark}
              aria-label={
                bookmarked
                  ? "Remove bookmark"
                  : "Bookmark edition"
              }
              aria-pressed={bookmarked}
              className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-secondary"
            >
              <Bookmark
                className="h-4 w-4"
                fill={
                  bookmarked
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
            {article.category?.name ? (
              <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {article.category.name}
              </p>
            ) : null}

            <h1 className="mt-4 text-center font-serif text-3xl font-bold leading-tight sm:text-5xl">
              {article.headline}
            </h1>

            {article.subheadline ? (
              <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-muted-foreground">
                {article.subheadline}
              </p>
            ) : null}

            {article.image_path ? (
              <img
                src={article.image_path}
                alt=""
                className="mt-8 max-h-[520px] w-full rounded-lg object-cover"
              />
            ) : null}

            <div className="mt-9 space-y-6">
              {hasSummary ? (
                <div className="space-y-6">
                  {summaryParagraphs.map(
                    (paragraph, i) => (
                      <p
                        key={`summary-${i}`}
                        className={[
                          "font-serif text-[17px] leading-[1.9] sm:text-[19px]",
                          i === 0
                            ? "first-letter:text-[24px] first-letter:font-bold"
                            : "",
                        ].join(" ")}
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              ) : null}

              {hasContent ? (
                <div className="space-y-6">
                  {contentParagraphs.map(
                    (paragraph, i) => (
                      <p
                        key={`content-${i}`}
                        className="font-serif text-[17px] leading-[1.9] sm:text-[19px]"
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              ) : null}

              {!hasSummary &&
              !hasContent ? (
                <p className="font-serif text-[17px] leading-[1.9] text-muted-foreground sm:text-[19px]">
                  No article content is
                  available for this story.
                </p>
              ) : null}
            </div>

            <div className="mt-12 border-t border-border pt-5">
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Source —
                </span>{" "}
                {article.source_name ??
                  "Laws & Judgments"}
                {article.author
                  ? ` · ${article.author}`
                  : ""}
              </p>
            </div>
          </article>
        </main>

        <footer className="shrink-0 border-t border-border">
          <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
            <button
              type="button"
              disabled={
                edition.articles
                  .length <= 1
              }
              onClick={() =>
                setIndex((value) =>
                  value > 0
                    ? value - 1
                    : edition.articles
                        .length - 1,
                )
              }
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            <span className="text-xs text-muted-foreground">
              {index + 1} /{" "}
              {edition.articles.length}
            </span>

            <button
              type="button"
              disabled={
                edition.articles
                  .length <= 1
              }
              onClick={() =>
                setIndex((value) =>
                  value <
                  edition.articles.length -
                    1
                    ? value + 1
                    : 0,
                )
              }
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-40"
            >
              <span className="hidden sm:inline">
                Next
              </span>

              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}