"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Scale,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Act = {
  id: number;
  act_name?: string | null;
  short_name?: string | null;
  year?: number | null;
  act_number?: string | null;
  description?: string | null;
  subject?: string | null;
  instrument_type?: string | null;
  source?: string | null;
  source_url?: string | null;
};

export default function ResearchActPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [act, setAct] = useState<Act | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAct() {
      try {
        const response = await fetch(
          `/api/research/material?type=act&id=${encodeURIComponent(
            params.id,
          )}`,
          {
            cache: "no-store",
          },
        );

        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.message || "Unable to load the Bare Act.",
          );
        }

        setAct(payload.data);
      } catch (loadError) {
        console.error("Research Act error:", loadError);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load the Bare Act.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadAct();
  }, [params.id]);

  if (loading) {
    return (
      <main className="container-laws-and-judgments py-12">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-24 rounded bg-secondary" />
          <div className="h-12 w-3/4 rounded bg-secondary" />
          <div className="h-5 w-1/3 rounded bg-secondary" />
          <div className="h-40 rounded-2xl bg-secondary" />
        </div>
      </main>
    );
  }

  if (error || !act) {
    return (
      <main className="container-laws-and-judgments py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to research
        </button>

        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h1 className="font-serif text-2xl font-semibold">
            Unable to open this Bare Act
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "The requested Act could not be found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-laws-and-judgments py-10 sm:py-12">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to research
      </button>

      <div className="mt-8 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          Bare Act
        </div>

        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {act.act_name || "Untitled Act"}
        </h1>

        {act.short_name && (
          <p className="mt-3 text-lg text-muted-foreground">
            {act.short_name}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {act.year && (
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {act.year}
            </span>
          )}

          {act.act_number && (
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Act No. {act.act_number}
            </span>
          )}

          {act.subject && (
            <span className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              {act.subject}
            </span>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">
            About this Act
          </h2>

          {act.description ? (
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {act.description}
            </p>
          ) : (
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Detailed description is not available for this Act.
            </p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Instrument Type
              </p>

              <p className="mt-2 text-sm font-medium">
                {act.instrument_type || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Source
              </p>

              <p className="mt-2 text-sm font-medium">
                {act.source || "—"}
              </p>
            </div>
          </div>

          {act.source_url && (
            <a
              href={act.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View source
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </main>
  );
}