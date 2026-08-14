"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Act {
  id: number;
  act_name: string;
  short_name: string | null;
  year: number | null;
  description: string | null;
  subject: string | null;
  instrument_type: string | null;
  source: string | null;
  source_url: string | null;
}

interface Section {
  id: number;
  act_id: number;
  section: string;
  title: string | null;
  content: string | null;
  description: string | null;
}

export default function ResearchActPage() {
  const params = useParams();
  const router = useRouter();

  const actId = String(params.actId);

  const [act, setAct] = useState<Act | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sectionQuery, setSectionQuery] = useState("");

  useEffect(() => {
    if (!actId) return;

    async function loadAct() {
      setLoading(true);
      setError("");

      try {
        const [actsResponse, sectionsResponse] =
          await Promise.all([
            fetch("/api/acts", {
              cache: "no-store",
            }),
            fetch(`/api/acts/${encodeURIComponent(actId)}/sections`, {
              cache: "no-store",
            }),
          ]);

        const actsPayload = await actsResponse.json();
        const sectionsPayload =
          await sectionsResponse.json();

        if (!actsResponse.ok || actsPayload.success === false) {
          throw new Error(
            actsPayload.error ||
              "Unable to load the Act.",
          );
        }

        if (
          !sectionsResponse.ok ||
          sectionsPayload.success === false
        ) {
          throw new Error(
            sectionsPayload.error ||
              "Unable to load Act sections.",
          );
        }

        const foundAct = Array.isArray(actsPayload.data)
          ? actsPayload.data.find(
              (item: Act) =>
                String(item.id) === actId,
            )
          : null;

        if (!foundAct) {
          throw new Error("Act not found.");
        }

        setAct(foundAct);
        setSections(
          Array.isArray(sectionsPayload.data)
            ? sectionsPayload.data
            : [],
        );
      } catch (loadError) {
        console.error(
          "Research Act loading error:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this Act.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAct();
  }, [actId]);

  const filteredSections = sections.filter(
    (section) => {
      const query =
        sectionQuery.trim().toLowerCase();

      if (!query) return true;

      return (
        section.section
          ?.toLowerCase()
          .includes(query) ||
        section.title
          ?.toLowerCase()
          .includes(query) ||
        section.description
          ?.toLowerCase()
          .includes(query)
      );
    },
  );

  if (loading) {
    return (
      <main className="container-laws-and-judgments py-10">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Act...
          </div>
        </div>
      </main>
    );
  }

  if (error || !act) {
    return (
      <main className="container-laws-and-judgments py-10">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Research
        </Link>

        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <h1 className="text-xl font-semibold">
            Unable to load Act
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "The requested Act could not be found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container-laws-and-judgments py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Research
      </button>

      {/* Breadcrumb */}
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/research"
          className="hover:text-foreground"
        >
          Research
        </Link>

        <ChevronRight className="h-3.5 w-3.5" />

        <span>Bare Acts</span>

        <ChevronRight className="h-3.5 w-3.5" />

        <span className="truncate">
          {act.short_name || act.act_name}
        </span>
      </div>

      {/* Act Header */}
      <section className="mt-7 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Bare Act
              </span>

              {act.year && (
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {act.year}
                </span>
              )}

              {act.instrument_type && (
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {act.instrument_type}
                </span>
              )}
            </div>

            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {act.act_name}
            </h1>

            {act.short_name && (
              <p className="mt-2 text-sm font-medium text-primary">
                {act.short_name}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {act.subject && (
                <span>
                  Subject:{" "}
                  <span className="font-medium text-foreground">
                    {act.subject}
                  </span>
                </span>
              )}

              {act.source && (
                <span>
                  Source:{" "}
                  <span className="font-medium text-foreground">
                    {act.source}
                  </span>
                </span>
              )}

              <span>
                {sections.length}{" "}
                {sections.length === 1
                  ? "section"
                  : "sections"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            onClick={() => {
              /*
               * Saving will be connected to authentication
               * and the research workspace later.
               */
            }}
          >
            <Bookmark className="h-4 w-4" />
            Save
          </button>
        </div>

        {act.description && (
          <div className="mt-7 border-t border-border pt-6">
            <h2 className="font-serif text-lg font-semibold">
              About this Act
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-muted-foreground">
              {act.description}
            </p>
          </div>
        )}
      </section>

      {/* Sections */}
      <section className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Act contents
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
              Sections
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Browse the provisions contained in this Act.
            </p>
          </div>

          {sections.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={sectionQuery}
                onChange={(event) =>
                  setSectionQuery(event.target.value)
                }
                placeholder="Find a section..."
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
        </div>

        {filteredSections.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold">
              No sections found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {sections.length === 0
                ? "No sections are currently available for this Act."
                : "Try a different section search."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredSections.map((section) => (
              <Link
                key={section.id}
                href={`/research/sections/${encodeURIComponent(
                  String(section.id),
                )}`}
                className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-primary">
                        Section {section.section}
                      </span>

                      {section.title && (
                        <span className="text-sm font-medium text-foreground">
                          {section.title}
                        </span>
                      )}
                    </div>

                    {section.description && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}