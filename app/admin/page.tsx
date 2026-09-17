import { requireAdmin } from "@/lib/auth/server";

export default async function AdminPage() {
  const { user, profile } = await requireAdmin();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Administration
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Admin <span className="text-primary">Dashboard</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage users, content, newspaper editions, and platform
            administration from one place.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Administrator"
            value={profile.full_name || "Admin"}
            description={user.email ?? "Authenticated account"}
          />

          <AdminStatCard
            label="Role"
            value="Administrator"
            description="Full platform access"
          />

          <AdminStatCard
            label="Account"
            value="Active"
            description="Authenticated with Supabase"
          />

          <AdminStatCard
            label="User ID"
            value={`${user.id.slice(0, 8)}…`}
            description="Authenticated user"
          />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <AdminSection
            title="User Management"
            description="View registered users, inspect profiles, and manage administrative roles."
          />

          <AdminSection
            title="Content Management"
            description="Manage legal newspaper editions and other platform content."
          />

          <AdminSection
            title="Platform Overview"
            description="Review the overall state of Laws & Judgments and its stored data."
          />

          <AdminSection
            title="Security"
            description="Administrative actions are protected by server-side authorization and database policies."
          />
        </section>
      </div>
    </main>
  );
}

function AdminStatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 truncate font-serif text-xl font-bold text-foreground">
        {value}
      </p>

      <p className="mt-1 truncate text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AdminSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-serif text-xl font-bold text-foreground">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}