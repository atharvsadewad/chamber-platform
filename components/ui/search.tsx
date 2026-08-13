"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const SCOPES = [
  { id: "acts", label: "Acts" },
  { id: "judgments", label: "Judgments" },
  { id: "sections", label: "Sections" },
  { id: "dictionary", label: "Dictionary" },
  { id: "drafts", label: "Drafts" },
  { id: "ai", label: "AI" },
] as const;

type ScopeId = (typeof SCOPES)[number]["id"];

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  defaultScope?: ScopeId;
  navigate?: boolean;
  onSearch?: (query: string, scope: ScopeId) => void;
}

export function SearchBar({
  className,
  placeholder = "Search laws, judgments, sections, legal terms...",
  defaultScope = "acts",
  navigate = true,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [scope, setScope] = React.useState(defaultScope);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    onSearch?.(trimmed, scope);

    if (navigate) {
      router.push(
        `/research?q=${encodeURIComponent(trimmed)}&scope=${scope}`
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl",
        className
      )}
      role="search"
    >
      {/* Search Input */}

      <div className="flex items-center gap-4 px-6 py-5">

        <Search
          className="h-5 w-5 shrink-0 text-muted-foreground"
          strokeWidth={2}
        />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={!query.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-200 hover:scale-105 hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowRight
            className="h-5 w-5"
            strokeWidth={2}
          />
        </button>

      </div>

      {/* Divider */}

      <div className="border-t border-border" />

      {/* Search Scopes */}

      <div className="flex flex-wrap gap-2 p-4">

        {SCOPES.map((item) => {

          const active = scope === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setScope(item.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow"
                  : "border-border bg-background hover:border-primary hover:text-primary"
              )}
            >
              {item.label}
            </button>
          );
        })}

      </div>
    </form>
  );
}