"use client";

import { Clock3, History } from "lucide-react";

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex min-h-40 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <Clock3 className="h-5 w-5 text-muted-foreground" />
        </div>

        <p className="mt-3 text-sm font-medium">
          No recent activity
        </p>

        <p className="mt-1 max-w-md text-xs leading-5 text-muted-foreground">
          Your searches, saved judgments, drafts, and other workspace
          activity will appear here as you use Chamber.
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <History className="h-3.5 w-3.5" />
          Activity history is ready for integration.
        </div>
      </div>
    </div>
  );
}
