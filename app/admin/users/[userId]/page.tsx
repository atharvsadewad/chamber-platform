import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AdminUserRoleCard } from "@/components/admin/admin-user-role-card";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function AdminUserDetailPage({
  params,
}: PageProps) {
  const { user: currentUser } = await requireAdmin();
  const { userId } = await params;

  const [
    { data: profile, error: profileError },
    { data: authResult, error: authError },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select(
        "id, full_name, avatar_url, role, created_at, updated_at",
      )
      .eq("id", userId)
      .maybeSingle(),

    supabaseAdmin.auth.admin.getUserById(userId),
  ]);

  if (profileError) {
    console.error("Unable to load admin user profile:", profileError);
    throw new Error("Unable to load user.");
  }

  if (authError) {
    console.error("Unable to load admin auth user:", authError);
    throw new Error("Unable to load user.");
  }

  if (!profile || !authResult.user) {
    notFound();
  }

  const authUser = authResult.user;

  const fullName =
    profile.full_name?.trim() ||
    authUser.user_metadata?.full_name?.trim() ||
    "Unnamed User";

  const isCurrentUser = currentUser.id === userId;

  const accountStatus = authUser.banned_until
    ? "Suspended"
    : "Active";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-16 w-16 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
                <UserRound className="h-7 w-7 text-primary" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {fullName}
                </h1>

                {isCurrentUser && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    You
                  </span>
                )}
              </div>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {authUser.email ?? "Email unavailable"}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={ShieldCheck}
            label="Role"
            value={profile.role === "admin" ? "Administrator" : "Regular User"}
          />

          <InfoCard
            icon={accountStatus === "Active" ? CheckCircle2 : XCircle}
            label="Account"
            value={accountStatus}
          />

          <InfoCard
            icon={authUser.email_confirmed_at ? CheckCircle2 : XCircle}
            label="Email"
            value={authUser.email_confirmed_at ? "Verified" : "Unverified"}
          />

          <InfoCard
            icon={Clock3}
            label="Last Sign In"
            value={
              authUser.last_sign_in_at
                ? formatDate(authUser.last_sign_in_at)
                : "Never"
            }
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-5">
              <h2 className="font-serif text-xl font-bold text-foreground">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Authentication and profile information for this account.
              </p>
            </div>

            <div className="divide-y divide-border">
              <DetailRow
                label="Full Name"
                value={fullName}
              />

              <DetailRow
                label="Email Address"
                value={authUser.email ?? "Unavailable"}
                icon={<Mail className="h-4 w-4" />}
              />

              <DetailRow
                label="User ID"
                value={authUser.id}
                mono
              />

              <DetailRow
                label="Account Created"
                value={formatDate(authUser.created_at)}
                icon={<CalendarDays className="h-4 w-4" />}
              />

              <DetailRow
                label="Profile Updated"
                value={formatDate(profile.updated_at)}
                icon={<CalendarDays className="h-4 w-4" />}
              />

              <DetailRow
                label="Email Verified"
                value={
                  authUser.email_confirmed_at
                    ? formatDate(authUser.email_confirmed_at)
                    : "Not verified"
                }
              />

              <DetailRow
                label="Last Sign In"
                value={
                  authUser.last_sign_in_at
                    ? formatDate(authUser.last_sign_in_at)
                    : "Never"
                }
              />
            </div>
          </section>

          <div className="space-y-6">
            <AdminUserRoleCard
              user={{
                id: authUser.id,
                fullName,
                email: authUser.email ?? null,
                role: profile.role === "admin" ? "admin" : "user",
              }}
              currentUserId={currentUser.id}
            />

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Account Metadata
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Metadata currently stored with the Supabase authentication
                account.
              </p>

              <pre className="mt-4 max-h-80 overflow-auto rounded-lg border border-border bg-secondary/40 p-4 text-[11px] leading-5 text-foreground">
                {JSON.stringify(
                  authUser.user_metadata ?? {},
                  null,
                  2,
                )}
              </pre>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <p className="text-xs font-semibold uppercase tracking-[0.15em]">
          {label}
        </p>
      </div>

      <p className="mt-3 truncate font-serif text-xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <div className="flex min-w-0 items-center gap-2 sm:max-w-[65%] sm:justify-end">
        {icon && (
          <span className="shrink-0 text-muted-foreground">
            {icon}
          </span>
        )}

        <p
          className={`break-all text-sm text-foreground sm:text-right ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}