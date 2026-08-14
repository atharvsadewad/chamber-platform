"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  FolderKanban,
  Gavel,
  Home,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";

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

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="hidden w-64 shrink-0 border-r bg-card/50 md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b px-6 py-5">
          <Link
            href="/workspace"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FolderKanban className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Chamber
              </p>

              <p className="text-xs text-muted-foreground">
                Workspace
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}