import {
  Search,
  FileText,
  Scale,
  Sparkles,
  Bookmark,
  ChevronRight,
} from "lucide-react";

import { Eyebrow, H2, Lead } from "@/components/ui/typography";

export function WorkspacePreview() {
  return (
    <section className="border-t border-border bg-secondary/20 py-24">
      <div className="container-laws-and-judgments">

        <div className="max-w-2xl">
          <Eyebrow>Research Workspace</Eyebrow>

          <H2 className="mt-3">
            Everything a legal professional needs.
          </H2>

          <Lead className="mt-4">
            Research, analyse, compare and understand Indian law from a single
            workspace.
          </Lead>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card shadow-card">

          <div className="grid lg:grid-cols-[260px_1fr]">

            {/* Sidebar */}

            <aside className="border-r border-border bg-secondary/30 p-6">

              <h3 className="mb-5 font-semibold">
                Workspace
              </h3>

              <div className="space-y-2">

                {[
                  "Research",
                  "Bare Acts",
                  "Case Laws",
                  "Legal Drafts",
                  "Procedures",
                  "Dictionary",
                ].map((item, i) => (
                  <button
                    key={item}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-background"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />

                    {item}
                  </button>
                ))}

              </div>

            </aside>

            {/* Main */}

            <div className="p-8">

              <div className="rounded-2xl border border-border p-5">

                <div className="flex items-center gap-3 text-muted-foreground">

                  <Search className="h-5 w-5" />

                  Search judgments, Acts or legal concepts...

                </div>

              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">

                <div className="rounded-2xl border border-border p-6">

                  <div className="flex items-center gap-2">

                    <Scale className="h-5 w-5 text-primary" />

                    <span className="font-semibold">

                      Bharatiya Nyaya Sanhita

                    </span>

                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">

                    Latest Bare Act with section-wise navigation,
                    amendments and judicial references.

                  </p>

                </div>

                <div className="rounded-2xl border border-border p-6">

                  <div className="flex items-center gap-2">

                    <Sparkles className="h-5 w-5 text-primary" />

                    <span className="font-semibold">

                      AI Explanation

                    </span>

                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">

                    Understand complex provisions in plain language with
                    AI-generated summaries.

                  </p>

                </div>

                <div className="rounded-2xl border border-border p-6">

                  <div className="flex items-center gap-2">

                    <Bookmark className="h-5 w-5 text-primary" />

                    <span className="font-semibold">

                      Saved Research

                    </span>

                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">

                    Organise judgments, Acts and notes inside personal
                    workspaces.

                  </p>

                </div>

                <div className="rounded-2xl border border-border p-6">

                  <div className="flex items-center gap-2">

                    <FileText className="h-5 w-5 text-primary" />

                    <span className="font-semibold">

                      Draft Generator

                    </span>

                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">

                    Generate notices, petitions and legal drafts using
                    verified legal references.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}