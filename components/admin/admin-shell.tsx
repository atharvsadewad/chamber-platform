"use client";

import type { ReactNode } from "react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: ReactNode;
  user: {
    id: string;
    email: string | null;
    fullName: string | null;
  };
}

const primaryNavigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Newspaper",
    href: "/admin/newspaper",
    icon: Newspaper,
  },
];

const comingSoonNavigation = [
  {
    label: "Bare Acts",
    icon: BookOpen,
  },
  {
    label: "Judgments",
    icon: Gavel,
  },
  {
    label: "Drafts",
    icon: FileText,
  },
  {
    label: "Activity",
    icon: Activity,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Admin sign out error:", error);
    }
  }

  const navigation = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-20 items-center border-b border-border px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
          aria-label="Admin Dashboard"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="font-serif text-base font-bold text-foreground">
                Laws & Judgments
              </p>
              <p className="text-xs text-muted-foreground">
                Administration
              </p>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:flex"
            aria-label="Collapse admin sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="hidden justify-center border-b border-border py-3 lg:flex">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Expand admin sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Administration
          </p>
        )}

        {primaryNavigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <p className="mb-3 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Content
          </p>
        )}

        {comingSoonNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              title={`${item.label} — coming soon`}
              className={cn(
                "flex cursor-not-allowed items-center rounded-lg text-sm font-medium text-muted-foreground/45",
                collapsed
                  ? "justify-center px-2 py-3"
                  : "gap-3 px-3 py-2.5",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />

              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] uppercase tracking-wide">
                    Soon
                  </span>
                </>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg bg-secondary/50 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">
              {user.fullName || "Administrator"}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user.email || "Administrator account"}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            collapsed
              ? "justify-center px-2 py-3"
              : "gap-3 px-3 py-2.5",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-[width] duration-200 lg:block",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        {navigation}
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card shadow-xl transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute right-3 top-5 z-10">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close admin navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {navigation}
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen transition-[padding-left] duration-200",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64",
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Administration
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
                Administrator
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-primary">
                {getInitials(user.fullName || user.email || "Admin")}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}

function getInitials(value: string) {
  const parts = value.split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";

  if (!first) {
    return "?";
  }

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts[parts.length - 1] ?? "";

  if (!last) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}