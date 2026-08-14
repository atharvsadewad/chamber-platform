"use client";

import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  FileText,
  FolderKanban,
  Gavel,
  History,
  Library,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/providers/database/supabase";

const ITEMS = [
  {
    title: "Research",
    href: "/research",
    icon: Search,
  },
  {
    title: "Bare Acts",
    href: "/bare-acts",
    icon: BookOpen,
  },
  {
    title: "Judgments",
    href: "/judgments",
    icon: Gavel,
  },
  {
    title: "Legal Drafts",
    href: "/drafts",
    icon: FileText,
  },
  {
    title: "Procedures",
    href: "/procedures",
    icon: Library,
  },
  {
    title: "Dictionary",
    href: "/dictionary",
    icon: Search,
  },
];

export function ResearchSidebar() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSignedIn(Boolean(session?.user));
      }
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSignedIn(Boolean(session?.user));
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Research
        </h2>

        <nav className="space-y-1">
          {ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Recent Research
          </h2>
        </div>

        {signedIn ? (
          <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-5 text-center">
            <History className="mx-auto h-5 w-5 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              Your research history
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Recent searches and viewed documents will appear
              here as you use Research.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-5 text-center">
            <UserRound className="mx-auto h-5 w-5 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              Sign in to save your research
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Sign in to keep your recent searches and viewed
              documents available across your workspace.
            </p>

            <Link
              href="/auth/sign-in?next=/research"
              className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            Saved Items
          </h2>
        </div>

        {!signedIn ? (
          <div className="mt-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Sign in to save judgments, Bare Acts, sections,
              articles and other research material.
            </p>

            <Link
              href="/auth/sign-in?next=/research"
              className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
            >
              Sign in to save items
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border px-3 py-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Saved research will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-sm font-semibold">
            My Projects
          </h2>
        </div>

        {!signedIn ? (
          <div className="mt-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Create research projects and organise judgments,
              Acts, notes and other material after signing in.
            </p>

            <Link
              href="/auth/sign-in?next=/research"
              className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
            >
              Sign in to create projects
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border px-3 py-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Your research projects will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}