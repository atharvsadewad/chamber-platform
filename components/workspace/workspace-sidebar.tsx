"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderKanban,
  Gavel,
  Home,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import { supabase } from "@/providers/database/supabase";

const navigation = [
  {
    label: "Workspace",
    href: "/workspace",
    icon: Home,
  },
  {
    label: "Research",
    href: "/research",
    icon: Search,
  },
  {
    label: "Judgments",
    href: "/judgments",
    icon: Gavel,
  },
  {
    label: "Bare Acts",
    href: "/bare-acts",
    icon: BookOpen,
  },
  {
    label: "Drafts",
    href: "/drafts",
    icon: FileText,
  },
  {
    label: "AI Assistant",
    href: "/ai",
    icon: Sparkles,
  },
];

const STORAGE_KEY = "chamber:workspace-sidebar-collapsed";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  return (
    <aside
      className={[
        "hidden shrink-0 border-r bg-card/50 transition-[width] duration-200 ease-out md:block",
        collapsed ? "w-[72px]" : "w-64",
      ].join(" ")}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div
          className={[
            "flex h-[69px] items-center border-b",
            collapsed ? "justify-center px-2" : "justify-between px-4",
          ].join(" ")}
        >
          <Link
            href="/workspace"
            className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={collapsed ? "Chamber Workspace" : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderKanban className="h-4 w-4" />
            </div>

            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">L&J</p>
                <p className="text-xs text-muted-foreground">Workspace</p>
              </div>
            ) : null}
          </Link>

          {!collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {collapsed ? (
          <div className="flex justify-center border-b px-2 py-2">
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <nav
          aria-label="Workspace navigation"
          className={[
            "flex-1 space-y-1 py-5",
            collapsed ? "px-2" : "px-3",
          ].join(" ")}
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/workspace" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={[
                  "flex h-10 items-center rounded-lg text-sm font-medium transition",
                  collapsed
                    ? "justify-center px-2"
                    : "gap-3 px-3",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />

                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div
          className={[
            "border-t",
            collapsed ? "p-2" : "p-3",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={handleSignOut}
            title={collapsed ? "Sign out" : undefined}
            aria-label="Sign out"
            className={[
              "flex h-10 w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
              collapsed ? "justify-center px-2" : "gap-3 px-3",
            ].join(" ")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>Sign out</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );
}
