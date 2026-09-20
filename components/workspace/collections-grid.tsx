"use client";

import {
  Bookmark,
  ExternalLink,
  FileText,
  FolderOpen,
  Gavel,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  loadBookmarks,
  removeBookmark,
  type BookmarkItem,
} from "@/lib/workspace/bookmarks";

const BOOKMARK_EVENT =
  "lawsandjudgments:bookmarks-changed";

function getIcon(type: string) {
  if (type === "judgment") {
    return Gavel;
  }

  if (type === "section") {
    return FileText;
  }

  return BookOpen;
}

export function CollectionsGrid() {
  const [items, setItems] =
    useState<BookmarkItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const bookmarks =
        await loadBookmarks();

      if (!cancelled) {
        setItems(bookmarks);
        setLoading(false);
      }
    }

    void refresh();

    function handleChange() {
      void refresh();
    }

    window.addEventListener(
      BOOKMARK_EVENT,
      handleChange,
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        BOOKMARK_EVENT,
        handleChange,
      );
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-xl border border-border bg-card"
            />
          ),
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">
          No saved research yet
        </p>

        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          Bookmark Acts, sections, and judgments while researching.
          They will appear here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = getIcon(item.type);

        return (
          <article
            key={`${item.type}:${item.id}`}
            className="group rounded-xl border bg-card p-5 transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              <button
                type="button"
                onClick={async () => {
                  await removeBookmark(
                    item.id,
                    item.type,
                  );

                  const bookmarks =
                    await loadBookmarks();

                  setItems(bookmarks);
                }}
                aria-label={`Remove ${item.title} from saved research`}
                title="Remove from saved research"
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Bookmark
                  className="h-4 w-4"
                  fill="currentColor"
                />
              </button>
            </div>

            <h3
              className="mt-4 line-clamp-2 text-sm font-semibold"
              title={item.title}
            >
              {item.title}
            </h3>

            {item.section && (
              <p className="mt-1 text-xs font-medium text-primary">
                Section {item.section}
              </p>
            )}

            {item.actName && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {item.actName}
              </p>
            )}

            {item.summary && (
              <p className="mt-3 line-clamp-3 text-xs leading-5 text-muted-foreground">
                {item.summary}
              </p>
            )}

            {item.path && (
              <a
                href={item.path}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                Open
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}