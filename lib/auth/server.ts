import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "user" | "admin";

export interface CurrentProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, role, created_at, updated_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load current profile:",
      error,
    );

    return null;
  }

  return data as CurrentProfile | null;
}

export async function requireUser(next = "/workspace") {
  const user = await getCurrentUser();

  if (!user) {
    const safeNext =
      next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/workspace";

    redirect(
      `/auth/sign-in?next=${encodeURIComponent(safeNext)}`,
    );
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(
      "/auth/sign-in?next=%2Fadmin",
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    error ||
    !profile ||
    profile.role !== "admin"
  ) {
    redirect("/workspace");
  }

  return {
    user,
    profile: profile as Pick<
      CurrentProfile,
      "id" | "full_name" | "avatar_url" | "role"
    >,
  };
}