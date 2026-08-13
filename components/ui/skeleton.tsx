import * as React from "react";

import { cn } from "@/lib/utils";

/** Base shimmering placeholder block. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-muted", className)}
      {...props}
    />
  );
}

/** Placeholder for a single case-result row while search results load. */
export function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-20 rounded-sm" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center gap-3 pt-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/** A stacked list of result skeletons, e.g. for a search results page. */
export function ResultListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: rows }).map((_, index) => (
        <ResultSkeleton key={index} />
      ))}
    </div>
  );
}

/** Placeholder for a feature/summary card while content loads. */
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-6">
      <Skeleton className="size-9 rounded-sm" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}
