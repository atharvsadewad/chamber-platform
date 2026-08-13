"use client";

import { SearchX, Loader2, AlertTriangle } from "lucide-react";

import { JudgmentCard } from "./judgment-card";
import { useJudgments } from "@/hooks/use-judgments";

interface Props {
  judgments: ReturnType<typeof useJudgments>;
}

export function JudgmentsResults({ judgments }: Props) {
  const {
    data,
    loading,
    error,
  } = judgments;

  // Loading
  if (loading) {
    return (
      <section className="flex min-h-[620px] items-center justify-center rounded-2xl border bg-card">

        <div className="flex items-center gap-3 text-muted-foreground">

          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Searching judgments...</span>

        </div>

      </section>
    );
  }

  // Error

  if (error) {
    return (
      <section className="flex min-h-[620px] items-center justify-center rounded-2xl border bg-card">

        <div className="text-center">

          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />

          <h2 className="mt-4 text-xl font-semibold">
            Search Failed
          </h2>

          <p className="mt-2 text-muted-foreground">
            {error}
          </p>

        </div>

      </section>
    );
  }

  const results = data?.results ?? [];

  // Empty

  if (results.length === 0) {
    return (
      <section className="flex min-h-[620px] items-center justify-center rounded-2xl border bg-card">

        <div className="mx-auto max-w-xl text-center">

          <SearchX className="mx-auto h-16 w-16 text-muted-foreground" />

          <h2 className="mt-6 text-4xl font-semibold">
            Start your legal research
          </h2>

          <p className="mt-5 text-muted-foreground">
            Search Supreme Court, High Courts,
            Tribunals and District Courts
            using case names, citations,
            judges and legal principles.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold">
          Search Results
        </h2>

        <span className="text-sm text-muted-foreground">
          {data?.pagination.totalResults ?? results.length}
          {" "}
          judgments found
        </span>

      </div>

      <div className="space-y-4">

        {results.map((judgment) => (
          <JudgmentCard
            key={judgment.id}
            judgment={judgment}
          />
        ))}

      </div>

    </section>
  );
}