import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-xl border bg-card">
      <div className="mx-auto max-w-lg text-center px-8">
        <SearchX className="mx-auto h-14 w-14 text-muted-foreground" />

        <h2 className="mt-6 text-2xl font-semibold">
          Start your legal research
        </h2>

        <p className="mt-4 text-muted-foreground leading-7">
          Search Supreme Court, High Courts, Tribunals and District Courts
          using case names, citations, judges, statutes or legal principles.
        </p>
      </div>
    </div>
  );
}