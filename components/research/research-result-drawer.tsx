"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  Search,
  Scale,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ResearchResult } from "./research-results";

interface ResearchResultDrawerProps {
  result: ResearchResult | null;
  onClose: () => void;
}

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

type SectionSummary = {
  id: number;
  act_id?: number | null;
  section?: string | null;
  title?: string | null;
  description?: string | null;
};

type Section = SectionSummary & {
  content?: string | null;
};

type MaterialData = {
  act?: Act | null;
  sections?: SectionSummary[];
  section?: Section | null;
};

export function ResearchResultDrawer({
  result: selectedResult,
  onClose,
}: ResearchResultDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] =
    useState<MaterialData | null>(null);

  const [selectedSection, setSelectedSection] =
    useState<Section | null>(null);

  const [sectionLoading, setSectionLoading] =
    useState(false);

  const [sectionError, setSectionError] =
    useState("");

  const [error, setError] = useState("");

  const [sectionQuery, setSectionQuery] =
    useState("");

  /*
   * ---------------------------------------------------------
   * FILTER ACT SECTIONS
   * ---------------------------------------------------------
   *
   * This hook intentionally runs on every render.
   * It must remain above the null guard so the Hooks order
   * never changes when the drawer opens or closes.
   */
  const filteredSections = useMemo(() => {
    const sections = material?.sections ?? [];
    const query = sectionQuery.trim().toLowerCase();

    if (!query) {
      return sections;
    }

    return sections.filter((item) => {
      const section =
        item.section?.toLowerCase() ?? "";

      const title =
        item.title?.toLowerCase() ?? "";

      const description =
        item.description?.toLowerCase() ?? "";

      return (
        section.includes(query) ||
        title.includes(query) ||
        description.includes(query)
      );
    });
  }, [material?.sections, sectionQuery]);

  /*
   * ---------------------------------------------------------
   * LOAD MATERIAL
   * ---------------------------------------------------------
   *
   * Acts and Sections are loaded through:
   *
   * /api/research/material
   *
   * That route uses chamberSupabase, which is the correct
   * database for Acts and Act Sections.
   */
  useEffect(() => {
    if (!selectedResult) {
      document.body.style.overflow = "";
      return;
    }

    const currentResult = selectedResult;

    document.body.style.overflow = "hidden";

    let cancelled = false;

    setLoading(currentResult.type !== "judgment");
    setError("");
    setMaterial(null);
    setSelectedSection(null);
    setSectionError("");
    setSectionQuery("");

    async function loadDetails() {
      if (currentResult.type === "judgment") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/research/material?type=${encodeURIComponent(
            currentResult.type,
          )}&id=${encodeURIComponent(
            currentResult.id,
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const payload = await response
          .json()
          .catch(() => null);

        if (!response.ok || !payload?.success) {
          throw new Error(
            payload?.message ||
              "Unable to load this material.",
          );
        }

        if (!cancelled) {
          setMaterial(payload.data ?? null);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Research result modal error:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this material.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetails();

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [selectedResult]);

  /*
   * ---------------------------------------------------------
   * ESCAPE KEY
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!selectedResult) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [selectedResult, onClose]);

  /*
   * ---------------------------------------------------------
   * NOTHING SELECTED
   * ---------------------------------------------------------
   *
   * All hooks have already executed above.
   * Therefore this guard is safe and does not cause a
   * Hooks-order violation.
   */
  if (!selectedResult) {
    return null;
  }

  /*
   * From this point onward TypeScript knows that `result`
   * cannot be null.
   */
  const result = selectedResult;

  const Icon =
    result.type === "judgment"
      ? Scale
      : result.type === "section"
        ? BookOpen
        : FileText;

  const typeLabel =
    result.type === "judgment"
      ? "Judgment"
      : result.type === "section"
        ? "Section"
        : "Bare Act";

  const act = material?.act ?? null;

  const section =
    selectedSection ??
    material?.section ??
    null;

  const viewingSectionFromAct =
    result.type === "act" &&
    Boolean(selectedSection);

  /*
   * ---------------------------------------------------------
   * OPEN SECTION FROM ACT
   * ---------------------------------------------------------
   */
  async function openSection(
    sectionSummary: SectionSummary,
  ) {
    setSectionLoading(true);
    setSectionError("");
    setSelectedSection(null);

    try {
      const response = await fetch(
        `/api/research/material?type=section&id=${encodeURIComponent(
          String(sectionSummary.id),
        )}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok || !payload?.success) {
        throw new Error(
          payload?.message ||
            "Unable to load this section.",
        );
      }

      const loadedSection =
        payload.data?.section ?? null;

      if (!loadedSection) {
        throw new Error(
          "The section record was not returned.",
        );
      }

      setSelectedSection(
        loadedSection as Section,
      );
    } catch (loadError) {
      console.error(
        "Research section modal error:",
        loadError,
      );

      setSectionError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this section.",
      );
    } finally {
      setSectionLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * BACK TO ACT
   * ---------------------------------------------------------
   */
  function backToAct() {
    setSelectedSection(null);
    setSectionError("");
    setSectionQuery("");
  }

  /*
   * ---------------------------------------------------------
   * JUDGMENT VIEW
   * ---------------------------------------------------------
   */
  function renderJudgment() {
    return (
      <div className="mt-7 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-serif text-xl font-semibold">
          Research Summary
        </h2>

        {result.summary ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {result.summary}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            No additional summary was returned by the
            judgment search service.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {result.source && (
            <Info
              label="Court / Source"
              value={result.source}
              icon={
                <Scale className="h-4 w-4" />
              }
            />
          )}

          {result.year && (
            <Info
              label="Year / Date"
              value={result.year}
              icon={
                <CalendarDays className="h-4 w-4" />
              }
            />
          )}
        </div>

        {result.sourceUrl && (
          <a
            href={result.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Open judgment source
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * SECTION VIEW
   * ---------------------------------------------------------
   */
  function renderSection() {
    if (!section) {
      return (
        <div className="mt-7 rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />

          <h2 className="mt-3 font-serif text-xl font-semibold">
            Section unavailable
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The section record could not be loaded.
          </p>
        </div>
      );
    }

    return (
      <>
        {viewingSectionFromAct && (
          <button
            type="button"
            onClick={backToAct}
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Act
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Section {section.section || "—"}
          </span>
        </div>

        <h1 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground">
          {section.title ||
            `Section ${section.section || "—"}`}
        </h1>

        {act?.act_name && (
          <p className="mt-3 text-sm font-medium text-primary">
            {act.act_name}
          </p>
        )}

        {act?.year && (
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {act.year}
          </div>
        )}

        {section.description && (
          <div className="mt-7 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl font-semibold">
              Description
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {section.description}
            </p>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />

            <h2 className="font-serif text-xl font-semibold">
              Provision
            </h2>
          </div>

          {section.content ? (
            <div className="mt-5 whitespace-pre-wrap text-sm leading-8 text-foreground sm:text-base">
              {section.content}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              The provision text is not available in the
              current record.
            </p>
          )}
        </div>

        {act?.source_url && (
          <a
            href={act.source_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View official Act source
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </>
    );
  }

  /*
   * ---------------------------------------------------------
   * ACT VIEW
   * ---------------------------------------------------------
   */
  function renderAct() {
    if (!act) {
      return (
        <div className="mt-7 rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <FileText className="mx-auto h-7 w-7 text-muted-foreground" />

          <h2 className="mt-3 font-serif text-xl font-semibold">
            Act unavailable
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The Act record could not be loaded from the
            Chamber database.
          </p>
        </div>
      );
    }

    const sections = material?.sections ?? [];

    return (
      <>
        {act.short_name && (
          <p className="mt-3 text-lg text-primary">
            {act.short_name}
          </p>
        )}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Info
            label="Year"
            value={act.year}
          />

          <Info
            label="Act Number"
            value={
              act.act_number
                ? `Act No. ${act.act_number}`
                : null
            }
          />

          <Info
            label="Subject"
            value={act.subject}
          />

          <Info
            label="Source"
            value={act.source}
          />

          <Info
            label="Instrument"
            value={act.instrument_type}
          />
        </div>

        {act.description && (
          <div className="mt-5 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl font-semibold">
              About this Act
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {act.description}
            </p>
          </div>
        )}

        {act.source_url && (
          <a
            href={act.source_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View official source
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        <section className="mt-8 border-t border-border pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Act Contents
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold">
                Sections
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Browse the provisions contained in this Act.
              </p>
            </div>

            {sections.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={sectionQuery}
                  onChange={(event) =>
                    setSectionQuery(
                      event.target.value,
                    )
                  }
                  placeholder="Find a section..."
                  className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Find a section in this Act"
                />
              </div>
            )}
          </div>

          {sectionLoading && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading provision...
            </div>
          )}

          {sectionError && (
            <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {sectionError}
            </div>
          )}

          {!sectionLoading &&
            !sectionError &&
            filteredSections.length === 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-border px-5 py-10 text-center">
                <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />

                <h3 className="mt-3 font-serif text-lg font-semibold">
                  No sections found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {sections.length === 0
                    ? "No sections are currently available for this Act."
                    : "Try a different section search."}
                </p>
              </div>
            )}

          {!sectionLoading &&
            !sectionError &&
            filteredSections.length > 0 && (
              <div className="mt-5 space-y-2">
                {filteredSections.map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        void openSection(item)
                      }
                      className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
                    >
                      <div className="flex h-9 min-w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 px-2 text-xs font-semibold text-primary">
                        § {item.section || "—"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {item.title ||
                            `Section ${
                              item.section || "—"
                            }`}
                        </p>

                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  ),
                )}
              </div>
            )}
        </section>
      </>
    );
  }

  /*
   * ---------------------------------------------------------
   * MODAL
   * ---------------------------------------------------------
   */
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onMouseDown={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="research-result-title"
        className="absolute left-1/2 top-1/2 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {typeLabel}
              </p>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                Legal Research
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close result viewer"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />

            <span className="hidden sm:inline">
              Close
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />

              <p className="mt-4 text-sm font-medium text-foreground">
                Loading legal material...
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Please wait while we retrieve the
                authoritative material.
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <FileText className="h-5 w-5" />
              </div>

              <h2 className="mt-4 font-serif text-xl font-semibold">
                Unable to open this material
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {!selectedSection && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Icon className="h-3.5 w-3.5" />
                      {typeLabel}
                    </span>

                    {result.section && (
                      <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Section {result.section}
                      </span>
                    )}
                  </div>

                  <h1
                    id="research-result-title"
                    className="mt-5 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground"
                  >
                    {result.title}
                  </h1>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {result.source && (
                      <Info
                        label="Source"
                        value={result.source}
                        icon={
                          <Scale className="h-4 w-4" />
                        }
                      />
                    )}

                    {result.year && (
                      <Info
                        label="Year"
                        value={result.year}
                        icon={
                          <CalendarDays className="h-4 w-4" />
                        }
                      />
                    )}
                  </div>

                  {result.actName && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Act
                      </p>

                      <p className="mt-2 text-base font-semibold text-foreground">
                        {result.actName}
                      </p>
                    </div>
                  )}

                  {result.actNumber && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Act Number
                      </p>

                      <p className="mt-2 text-sm text-foreground">
                        {result.actNumber}
                      </p>
                    </div>
                  )}

                  {result.tags.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Classification
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.tags.map(
                          (tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {result.type === "act" &&
                    renderAct()}

                  {result.type === "section" &&
                    renderSection()}

                  {result.type === "judgment" &&
                    renderJudgment()}
                </>
              )}

              {selectedSection &&
                renderSection()}
            </>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-secondary/20 px-5 py-4 sm:px-6">
          <p className="hidden text-xs text-muted-foreground sm:block">
            Verify important legal information against
            the authoritative source.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="mt-2 text-sm font-medium text-foreground">
        {value || "—"}
      </p>
    </div>
  );
}