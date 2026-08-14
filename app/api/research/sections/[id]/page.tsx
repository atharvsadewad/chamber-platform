"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Section = {
  id: number;
  act_id?: number | null;
  section?: string | null;
  title?: string | null;
  content?: string | null;
  description?: string | null;
};

type Act = {
  id: number;
  act_name?: string | null;
  short_name?: string | null;
  year?: number | null;
  act_number?: string | null;
};

export default function ResearchSectionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<{
    section: Section;
    act: Act | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSection() {
      try {
        const response = await fetch(
          `/api/research/material?type=section&id=${encodeURIComponent(
            params.id,
          )}`,
          {
            cache: "no-store",
          },
        );

        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.message || "Unable to load the section.",
          );
        }

        setData(payload.data);
      } catch (loadError) {
        console.error(
          "Research section error:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load the section.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSection();
  }, [params.id]);

  if (loading) {
    return (
      <main className="container-laws-and-judgments py-12">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-24 rounded bg-secondary" />
          <div className="h-12 w-3/4 rounded bg-secondary" />
          <div className="h-5 w-1/3 rounded bg-secondary" />
          <div className="h-64 rounded-2xl bg-secondary" />
        </div>
      </main>
    );
  }

  if (error || !data) {
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
            Unable to open this section
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "The requested section could not be found."}
          </p>
        </div>
      </main>
    );
  }

  const { section, act } = data;

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
          Section {section.section || "—"}
        </div>

        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {section.title || `Section ${section.section}`}
        </h1>

        {act?.act_name && (
          <p className="mt-3 text-lg text-primary">
            {act.act_name}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          {act?.year && (
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {act.year}
            </span>
          )}

          {act?.act_number && (
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Act No. {act.act_number}
            </span>
          )}
        </div>

        {section.description && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold">
              Description
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {section.description}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold">
            Provision
          </h2>

          {section.content ? (
            <div className="mt-5 whitespace-pre-wrap text-sm leading-8 text-foreground sm:text-base">
              {section.content}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              The provision text is not available.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}