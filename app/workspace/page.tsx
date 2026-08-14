"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderOpen,
  Gavel,
  Search,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";
import { Button } from "@/components/ui/button";

export default function WorkspacePage() {
  const router = useRouter();

  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        router.replace(
          `/auth/sign-in?next=${encodeURIComponent("/workspace")}`,
        );
        return;
      }

      const fullName = session.user.user_metadata?.full_name;
      const email = session.user.email;

      if (typeof fullName === "string") {
        const trimmedName = fullName.trim();

        if (trimmedName) {
          const firstName = trimmedName.split(" ")[0];

          if (firstName) {
            setUserName(firstName);
          }
        } else if (email) {
          const emailName = email.split("@")[0];

          if (emailName) {
            setUserName(emailName);
          }
        }
      } else if (email) {
        const emailName = email.split("@")[0];

        if (emailName) {
          setUserName(emailName);
        }
      }

      setLoading(false);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded-md bg-muted" />
            <div className="h-4 w-96 rounded-md bg-muted" />

            <div className="grid gap-4 pt-8 md:grid-cols-3">
              <div className="h-36 rounded-xl bg-muted" />
              <div className="h-36 rounded-xl bg-muted" />
              <div className="h-36 rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium text-primary">
            Your workspace
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {userName}.
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Continue your legal research, explore Indian laws, or
            start something new.
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => router.push("/research")}
            className="group rounded-xl border bg-card p-6 text-left transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-semibold">Research</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Search judgments, legal authorities, and research
              material.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
              Start researching
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/bare-acts")}
            className="group rounded-xl border bg-card p-6 text-left transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-semibold">Bare Acts</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Browse Indian statutes and explore provisions in
              structured form.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
              Browse laws
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/ai")}
            className="group rounded-xl border bg-card p-6 text-left transition hover:border-primary/40 hover:shadow-sm"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <h2 className="font-semibold">Legal AI</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ask questions and understand legal concepts in simple
              language.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
              Ask Legal AI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </section>

        {/* Workspace sections */}
        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />

                  <h2 className="font-semibold">
                    Your workspace
                  </h2>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  Your saved research, collections, and legal work
                  will appear here.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/drafts")}
              >
                Open drafts
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-dashed p-5">
                <FileText className="h-5 w-5 text-muted-foreground" />

                <h3 className="mt-4 text-sm font-medium">
                  Saved work
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your saved documents and drafts will appear here.
                </p>
              </div>

              <div className="rounded-lg border border-dashed p-5">
                <Gavel className="h-5 w-5 text-muted-foreground" />

                <h3 className="mt-4 text-sm font-medium">
                  Research collections
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Organise important judgments and legal authorities.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Get started</h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose a module to begin working with Laws &
              Judgments.
            </p>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => router.push("/judgments")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <span>Search judgments</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/dictionary")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <span>Legal dictionary</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/procedures")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition hover:bg-muted"
              >
                <span>Legal procedures</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}