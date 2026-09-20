"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  FileText,
  FolderOpen,
  Gavel,
  Newspaper,
  Search,
  Sparkles,
  Scale,
  BookMarked,
} from "lucide-react";
import * as React from "react";

import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { RecentActivity } from "@/components/workspace/recent-activity";
import {
  loadBookmarks,
  removeBookmark,
  type BookmarkItem,
} from "@/lib/workspace/bookmarks";

interface WorkspaceDashboardProps {
  userName: string;
}

const quickActions = [
  {
    title: "Research",
    description: "Search judgments and legal materials.",
    href: "/research",
    icon: Search,
  },
  {
    title: "AI Assistant",
    description: "Ask questions about Indian law.",
    href: "/ai",
    icon: Sparkles,
  },
  {
    title: "Drafts",
    description: "Create and manage legal drafts.",
    href: "/drafts",
    icon: FileText,
  },
  {
    title: "Bare Acts",
    description: "Browse Indian statutes and provisions.",
    href: "/bare-acts",
    icon: Gavel,
  },
];

type BookmarkGroup = {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  types: string[];
};

const bookmarkGroups: BookmarkGroup[] = [
  {
    key: "newspaper",
    label: "Legal Newspaper",
    description: "Saved editions and legal news.",
    icon: Newspaper,
    types: ["newspaper"],
  },
  {
    key: "procedure",
    label: "Procedures",
    description: "Saved procedural guides and materials.",
    icon: Scale,
    types: ["procedure", "procedures"],
  },
  {
    key: "draft",
    label: "Drafts",
    description: "Saved legal draft documents.",
    icon: FileText,
    types: ["draft", "drafts"],
  },
  {
    key: "dictionary",
    label: "Dictionary",
    description: "Saved legal terms and meanings.",
    icon: BookMarked,
    types: ["dictionary", "legal_dictionary"],
  },
  {
    key: "judgment",
    label: "Judgments",
    description: "Saved judicial decisions.",
    icon: Gavel,
    types: ["judgment", "judgments"],
  },
  {
    key: "bare-act",
    label: "Bare Acts",
    description: "Saved statutes and provisions.",
    icon: BookOpen,
    types: ["bare-act", "bare_acts", "bare-act-section"],
  },
  {
    key: "research",
    label: "Research",
    description: "Saved research material.",
    icon: Search,
    types: ["research"],
  },
];

function getBookmarkGroup(item: BookmarkItem) {
  return bookmarkGroups.find((group) =>
    group.types.includes(item.type.toLowerCase()),
  );
}

function getBookmarkHref(item: BookmarkItem) {
  return item.path || item.url || "#";
}

function BookmarkCard({
  item,
  onRemove,
}: {
  item: BookmarkItem;
  onRemove: (item: BookmarkItem) => void;
}) {
  const group = getBookmarkGroup(item);
  const Icon = group?.icon ?? Bookmark;
  const href = getBookmarkHref(item);

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={href}
              className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground hover:text-primary"
              title={item.title}
            >
              {item.title}
            </Link>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onRemove(item)}
                aria-label={`Remove bookmark from ${item.title}`}
                title="Remove bookmark"
                className="flex h-8 w-8 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10"
              >
                <Bookmark
                  className="h-4 w-4"
                  fill="currentColor"
                />
              </button>

              <Link
                href={href}
                aria-label={`Open ${item.title}`}
                title="Open saved item"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <Link href={href} className="block">
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {item.summary ||
                item.source ||
                group?.description ||
                "Saved legal material."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {group?.label ?? item.type}
              </span>

              {item.year ? (
                <span className="text-[11px] text-muted-foreground">
                  {item.year}
                </span>
              ) : null}

              {item.section ? (
                <span className="truncate text-[11px] text-muted-foreground">
                  § {item.section}
                </span>
              ) : null}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SavedBookmarks() {
  const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeFilter, setActiveFilter] = React.useState("all");

  const refresh = React.useCallback(async () => {
    setLoading(true);

    try {
      const items = await loadBookmarks();
      setBookmarks(items);
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleRemoveBookmark(item: BookmarkItem) {
    await removeBookmark(item.id, item.type);
    await refresh();
  }

  React.useEffect(() => {
    void refresh();

    const handleChange = () => {
      void refresh();
    };

    window.addEventListener(
      "lawsandjudgments:bookmarks-changed",
      handleChange,
    );

    return () => {
      window.removeEventListener(
        "lawsandjudgments:bookmarks-changed",
        handleChange,
      );
    };
  }, [refresh]);

  const grouped = React.useMemo(() => {
    return bookmarkGroups
      .map((group) => ({
        ...group,
        items: bookmarks.filter((item) =>
          group.types.includes(item.type.toLowerCase()),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [bookmarks]);

  const knownBookmarkCount = grouped.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  const unknownBookmarks = bookmarks.filter(
    (item) => !getBookmarkGroup(item),
  );

  const filteredGroups =
    activeFilter === "all"
      ? grouped
      : grouped.filter((group) => group.key === activeFilter);

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Bookmark className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-4 text-sm font-semibold">
          Nothing saved yet
        </p>

        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          Bookmark a newspaper edition, procedure, draft, dictionary term,
          judgment, Bare Act, or research item and it will appear here.
        </p>

        <Link
          href="/newspaper"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted"
        >
          Explore legal materials
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          All saved
          <span className="ml-1.5 opacity-70">{bookmarks.length}</span>
        </button>

        {grouped.map((group) => (
          <button
            key={group.key}
            type="button"
            onClick={() => setActiveFilter(group.key)}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              activeFilter === group.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {group.label}
            <span className="ml-1.5 opacity-70">{group.items.length}</span>
          </button>
        ))}
      </div>

      {activeFilter === "all" ? (
        <div className="space-y-6">
          {filteredGroups.map((group) => {
            const Icon = group.icon;

            return (
              <section key={group.key}>
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold">{group.label}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {group.items.slice(0, 6).map((item) => (
                    <BookmarkCard
                      key={`${item.type}:${item.id}`}
                      item={item}
                      onRemove={handleRemoveBookmark}
                    />
                  ))}
                </div>

                {group.items.length > 6 ? (
                  <button
                    type="button"
                    onClick={() => setActiveFilter(group.key)}
                    className="mt-3 text-xs font-medium text-primary hover:underline"
                  >
                    View all {group.items.length} saved items
                  </button>
                ) : null}
              </section>
            );
          })}

          {unknownBookmarks.length > 0 ? (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">Other saved material</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Bookmarks from modules not yet assigned a workspace category.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {unknownBookmarks.slice(0, 6).map((item) => (
                  <BookmarkCard
                    key={`${item.type}:${item.id}`}
                    item={item}
                    onRemove={handleRemoveBookmark}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(filteredGroups[0]?.items ?? []).map((item) => (
            <BookmarkCard
              key={`${item.type}:${item.id}`}
              item={item}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      )}

      {knownBookmarkCount === 0 && unknownBookmarks.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {unknownBookmarks.map((item) => (
            <BookmarkCard
              key={`${item.type}:${item.id}`}
              item={item}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function WorkspaceDashboard({
  userName,
}: WorkspaceDashboardProps) {
  return (
    <WorkspaceLayout>
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-7 sm:px-8 sm:py-9">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Your Workspace
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back, {userName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Your central workspace for legal research, drafting, saved
              materials, and analysis.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-accent/5 blur-2xl" />
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Quick actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump directly into your legal workflow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  <h3 className="mt-5 font-semibold">{action.title}</h3>

                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Saved research</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your bookmarks are automatically organized by legal module.
              </p>
            </div>

            <Link
              href="/workspace"
              className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:flex"
            >
              Workspace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <SavedBookmarks />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your recent workspace activity will appear here.
            </p>
          </div>

          <RecentActivity />
        </section>
      </div>
    </WorkspaceLayout>
  );
}
