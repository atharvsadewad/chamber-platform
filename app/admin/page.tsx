import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  LayoutDashboard,
  Newspaper,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Admin",
  description: "Manage Laws & Judgments platform content, users and administration.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminPage() {
  const { user, profile } = await requireAdmin();

  const administratorName = profile.full_name || "Administrator";
  const administratorEmail = user.email ?? "Authenticated account";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 xl:px-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-accent/[0.08]" />

          <div className="relative flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Administration
              </div>

              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Admin <span className="text-primary">Dashboard</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Welcome back, {administratorName}. Manage users, newspaper
                content and platform administration from one place.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href="/admin/users"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-secondary"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Link>

              <Link
                href="/admin/newspaper/new"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Edition
              </Link>
            </div>
          </div>
        </section>

        {/* Account overview */}
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AdminOverviewCard
            label="Administrator"
            value={administratorName}
            description={administratorEmail}
            icon={ShieldCheck}
          />

          <AdminOverviewCard
            label="Access level"
            value="Administrator"
            description="Full platform access"
            icon={Users}
          />

          <AdminOverviewCard
            label="Account status"
            value="Active"
            description="Authenticated with Supabase"
            icon={ShieldCheck}
            status
          />

          <AdminOverviewCard
            label="User ID"
            value={`${user.id.slice(0, 8)}…`}
            description="Authenticated user"
            icon={FileText}
          />
        </section>

        {/* Management */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Platform
              </p>

              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
                Management
              </h2>
            </div>

            <span className="hidden text-xs text-muted-foreground sm:block">
              Administrative controls
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ManagementCard
              href="/admin/users"
              icon={Users}
              title="User Management"
              description="View registered users, inspect profiles and manage administrative roles."
              action="Manage users"
            />

            <ManagementCard
              href="/admin/newspaper"
              icon={Newspaper}
              title="Newspaper Management"
              description="Create, edit and publish legal newspaper editions and their articles."
              action="Manage newspaper"
            />
          </div>
        </section>

        {/* Quick actions + security */}
        <section className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Quick Actions
              </p>

              <h2 className="mt-1 font-serif text-xl font-bold text-foreground">
                Get things done
              </h2>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <QuickAction
                href="/admin/newspaper/new"
                icon={Plus}
                label="Create newspaper edition"
              />

              <QuickAction
                href="/admin/newspaper"
                icon={Newspaper}
                label="Open newspaper CMS"
              />

              <QuickAction
                href="/admin/users"
                icon={Users}
                label="Review users"
              />

              <QuickAction
                href="/"
                icon={BookOpen}
                label="View public platform"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-5 shadow-sm sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h2 className="mt-4 font-serif text-xl font-bold text-foreground">
              Security
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Administrative routes require server-side authorization.
              Database policies and protected API routes enforce access to
              administrative operations.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background px-3 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Protected admin session
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              More controls
            </p>

            <h2 className="mt-1 font-serif text-xl font-bold text-foreground">
              Platform modules
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ComingSoonCard
              icon={BookOpen}
              title="Bare Acts"
              description="Act and section management"
            />

            <ComingSoonCard
              icon={FileText}
              title="Drafts"
              description="Legal draft library management"
            />

            <ComingSoonCard
              icon={FileText}
              title="Judgments"
              description="Judgment content management"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminOverviewCard({
  label,
  value,
  description,
  icon: Icon,
  status = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: typeof ShieldCheck;
  status?: boolean;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {status ? (
          <span className="h-2 w-2 rounded-full bg-primary" />
        ) : null}

        <p className="truncate font-serif text-lg font-bold text-foreground">
          {value}
        </p>
      </div>

      <p className="mt-1 truncate text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ManagementCard({
  href,
  icon: Icon,
  title,
  description,
  action,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
    >
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/[0.045] transition-transform duration-300 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>

          <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
        </div>

        <h3 className="mt-5 font-serif text-xl font-bold text-foreground">
          {title}
        </h3>

        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-5 text-xs font-semibold text-primary">
          {action} →
        </div>
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 transition-all duration-200 hover:border-primary/25 hover:bg-secondary/60"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <span className="flex-1 text-sm font-medium text-foreground">
        {label}
      </span>

      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function ComingSoonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {title}
            </h3>

            <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              Soon
            </span>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}