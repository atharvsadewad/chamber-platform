import { Users } from "lucide-react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { AdminUsersTable } from "@/components/admin/admin-users-table";

interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
}

export const metadata: Metadata = {
  title: "A | Users",
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

export default async function AdminUsersPage() {
  const { user: currentUser } = await requireAdmin();

  const [
    { data: profiles, error: profilesError },
    { data: authData, error: authError },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select(
        "id, full_name, avatar_url, role, created_at, updated_at",
      )
      .order("created_at", { ascending: false }),

    supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    }),
  ]);

  if (profilesError) {
    console.error(
      "Unable to load admin profiles:",
      profilesError,
    );

    throw new Error("Unable to load users.");
  }

  if (authError) {
    console.error(
      "Unable to load authenticated users:",
      authError,
    );

    throw new Error("Unable to load users.");
  }

  const authUsers = authData?.users ?? [];

  const authById = new Map(
    authUsers.map((user) => [user.id, user]),
  );

  const users: AdminUser[] = (profiles ?? []).map(
    (profile) => {
      const authUser = authById.get(profile.id);

      return {
        id: profile.id,
        email: authUser?.email ?? null,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role:
          profile.role === "admin"
            ? "admin"
            : "user",
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        email_confirmed_at:
          authUser?.email_confirmed_at ?? null,
        last_sign_in_at:
          authUser?.last_sign_in_at ?? null,
      };
    },
  );

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin",
  ).length;

  const totalRegularUsers =
    totalUsers - totalAdmins;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Administration
            </p>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            User{" "}
            <span className="text-primary">
              Management
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            View registered accounts, account status,
            and application roles.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Users"
            value={totalUsers}
          />

          <StatCard
            label="Administrators"
            value={totalAdmins}
          />

          <StatCard
            label="Regular Users"
            value={totalRegularUsers}
          />
        </div>

        <AdminUsersTable
          users={users}
          currentUserId={currentUser.id}
        />
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 font-serif text-3xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}