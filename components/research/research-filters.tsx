"use client";

interface ResearchFiltersProps {
  visible: boolean;
}

export function ResearchFilters({
  visible,
}: ResearchFiltersProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">
          Refine results
        </span>

        <select
          aria-label="Sort results"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue="relevance"
        >
          <option value="relevance">
            Relevance
          </option>

          <option value="latest">
            Latest first
          </option>

          <option value="oldest">
            Oldest first
          </option>
        </select>
      </div>
    </div>
  );
}