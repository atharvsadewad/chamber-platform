"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const SCOPES = [
  "All",
  "Bare Acts",
  "Judgments",
  "Sections",
  "AI",
];

const TRENDING = [
  "Article 21",
  "BNS Section 302",
  "Cheque Bounce",
  "Motor Vehicle Act",
  "GST",
];

export function ResearchSearch() {
  const [scope, setScope] = useState("All");

  return (
    <div className="space-y-6">

      {/* Heading */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight">
          Legal Research
        </h1>

        <p className="mt-2 text-muted-foreground">
          Search across Bare Acts, Judgments, Sections, Drafts and Legal
          Dictionary.
        </p>

      </div>

      {/* Search */}

      <div className="rounded-2xl border border-border bg-card p-6">

        <div className="flex items-center gap-4 rounded-xl border border-border px-5 py-4">

          <Search className="h-5 w-5 text-muted-foreground" />

          <input
            placeholder="Search laws, judgments, sections..."
            className="flex-1 bg-transparent outline-none"
          />

          <button className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">

            Search

          </button>

        </div>

        {/* Scope */}

        <div className="mt-5 flex flex-wrap gap-3">

          {SCOPES.map((item) => (

            <button
              key={item}
              onClick={() => setScope(item)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                scope === item
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-secondary"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* Trending */}

      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 text-sm font-medium">

          <SlidersHorizontal className="h-4 w-4" />

          Trending

        </div>

        {TRENDING.map((item) => (

          <button
            key={item}
            className="rounded-full border border-border px-4 py-2 text-sm transition hover:bg-secondary"
          >
            {item}
          </button>

        ))}

      </div>

    </div>
  );
}