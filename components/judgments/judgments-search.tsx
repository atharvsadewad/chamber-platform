"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { COURTS } from "@/config/judgments";
import { useJudgments } from "@/hooks/use-judgments";

interface Props {
  judgments: ReturnType<typeof useJudgments>;
}

export function JudgmentsSearch({ judgments }: Props) {
  const {
    search,
    loading,
    filters,
    setFilters,
  } = judgments;

  function updateField(
    field: keyof typeof filters,
    value: string
  ) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSearch() {
    await search();
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm">

      {/* Search */}

      <div className="flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-0 text-muted-foreground" />

          <input
            type="text"
            value={filters.query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateField("query", e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search by case name, citation, judge, act or keyword..."
            className="h-12 w-full rounded-xl border bg-background pl-12 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

        </div>

        <Button
          className="h-12 w-full lg:w-32"
          disabled={loading}
          onClick={handleSearch}
        >
          {loading ? "Searching..." : "Search"}
        </Button>

      </div>

      {/* Filters */}

      <div className="mt-4 flex flex-wrap items-center gap-3">

        <select
          value={filters.court}
          onChange={(e) => updateField("court", e.target.value)}
          className="h-11 min-w-[170px] rounded-xl border bg-background px-3 text-sm"
        >
          <option value="">All Courts</option>

          {COURTS.map((court) => (
            <option key={court} value={court}>
              {court}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="From"
          value={filters.fromYear}
          onChange={(e) =>
            updateField("fromYear", e.target.value)
          }
          className="h-11 w-28 rounded-xl border bg-background px-3 text-sm"
        />

        <input
          type="number"
          placeholder="To"
          value={filters.toYear}
          onChange={(e) =>
            updateField("toYear", e.target.value)
          }
          className="h-11 w-28 rounded-xl border bg-background px-3 text-sm"
        />

        <select
          value={filters.bench}
          onChange={(e) =>
            updateField("bench", e.target.value)
          }
          className="h-11 min-w-[170px] rounded-xl border bg-background px-3 text-sm"
        >
          <option value="">Any Bench</option>

          <option>Single Judge</option>
          <option>Division Bench</option>
          <option>Constitution Bench</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) =>
            updateField("sort", e.target.value)
          }
          className="h-11 min-w-[170px] rounded-xl border bg-background px-3 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <Button
          variant="outline"
          className="ml-0 h-11 gap-2 lg:ml-auto"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced Filters
        </Button>

      </div>

    </section>
  );
}