"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { draftLibrary } from "@/lib/drafts/mock-drafts";
import { DraftFolderRow } from "@/components/drafts/draft-folder";

export function DraftLibrary() {
  const [search, setSearch] = React.useState("");

  return (
    <section className="container-laws-and-judgments py-10 sm:py-12">
      {/* Library header */}
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Draft Library
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Browse legal drafts by folder and document type.
          </p>
        </div>

        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <SlidersHorizontal className="h-4 w-4" />
          Library
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search drafts..."
          className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Library tree */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background">
        {draftLibrary.children.map((node) => {
          if (node.type !== "folder") {
            return null;
          }

          return (
            <DraftFolderRow
              key={node.id}
              folder={node}
              level={0}
            />
          );
        })}
      </div>

      {search.trim() && (
        <p className="mt-3 text-xs text-muted-foreground">
          Search indexing will be connected with the Supabase draft library.
        </p>
      )}
    </section>
  );
}