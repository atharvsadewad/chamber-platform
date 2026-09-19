import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, profile } = await requireAdmin();

  return (
    <AdminShell
      user={{
        id: user.id,
        email: user.email ?? null,
        fullName: profile.full_name,
      }}
    >
      {children}
    </AdminShell>
  );
}