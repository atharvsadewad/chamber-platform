"use client";

import {
  Bookmark,
  Folder,
  Plus,
} from "lucide-react";

export function CollectionsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <button
        type="button"
        className="group flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-6 text-center transition hover:border-primary/50 hover:bg-primary/[0.02]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Plus className="h-5 w-5 text-primary" />
        </div>

        <p className="mt-3 text-sm font-medium">
          Create a collection
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Organize your saved research.
        </p>
      </button>

      <div className="flex min-h-32 items-center justify-center rounded-xl border bg-card p-6 text-center sm:col-span-1 lg:col-span-2">
        <div className="max-w-sm">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Folder className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">
            No collections yet
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Collections you create will appear here. Save
            judgments, provisions, and research for quick access
            later.
          </p>
        </div>
      </div>
    </div>
  );
}