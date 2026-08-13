"use client";

import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  Gavel,
  Scale,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Judgment } from "@/types/judgment";

interface Props {
  judgment: Judgment;
}

export function JudgmentCard({ judgment }: Props) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">

      {/* Header */}

      <div className="flex items-start justify-between gap-5">

        <div className="flex-1">

          <h2 className="text-xl font-semibold leading-snug">
            {judgment.title}
          </h2>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">

            <span className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              {judgment.court}
            </span>

            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {judgment.date}
            </span>

            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {judgment.judges.join(", ")}
            </span>

          </div>

        </div>

        <div className="flex gap-2">

          <Button
            size="icon"
            variant="outline"
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          <Button size="icon">
            <ArrowUpRight className="h-4 w-4" />
          </Button>

        </div>

      </div>

      {/* Summary */}

      {judgment.summary && (
        <div className="mt-6 rounded-xl bg-muted/40 p-4">

          <div className="mb-2 flex items-center gap-2 text-sm font-medium">

            <Gavel className="h-4 w-4 text-primary" />

            AI Summary

          </div>

          <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
            {judgment.summary}
          </p>

        </div>
      )}

      {/* Footer */}

      <div className="mt-6 flex flex-wrap items-center gap-3">

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Constitutional
        </span>

        <span className="rounded-full bg-muted px-3 py-1 text-xs">
          Civil
        </span>

        <span className="rounded-full bg-muted px-3 py-1 text-xs">
          Reportable
        </span>

        <span className="ml-auto text-sm font-medium text-primary">
          View Judgment →
        </span>

      </div>

    </article>
  );
}