"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  KeyRound,
  LogOut,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

import { supabase } from "@/providers/database/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    const first = parts[0] ?? "";
    const last = parts[parts.length - 1] ?? first;

    return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const loadProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      router.replace(`/auth/sign-in?next=${encodeURIComponent("/profile")}`);
      return;
    }

    setEmail(session.user.email ?? "");

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, created_at, updated_at")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setError("Your profile record could not be found. Please contact the administrator.");
      setLoading(false);
      return;
    }

    const next = data as Profile;
    setProfile(next);
    setFullName(next.full_name ?? "");
    setAvatarUrl(next.avatar_url ?? "");
    setLoading(false);
  }, [router]);

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", profile.id)
      .select("id, full_name, avatar_url, role, created_at, updated_at")
      .single();

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    const next = data as Profile;
    setProfile(next);
    setFullName(next.full_name ?? "");
    setAvatarUrl(next.avatar_url ?? "");
    setSuccess("Profile updated successfully.");
    setSaving(false);
  }

  async function handlePasswordReset() {
    if (!email) return;

    setResetting(true);
    setError(null);
    setSuccess(null);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess("Password reset instructions have been sent to your email.");
    }

    setResetting(false);
  }

  async function handleSignOut() {
    setSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-32 rounded-md bg-muted" />
            <div className="h-48 rounded-2xl bg-muted" />
            <div className="h-80 rounded-2xl bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-5">
          <div className="w-full rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-medium">{error || "Unable to load your profile."}</p>
            <button
              type="button"
              onClick={() => void loadProfile()}
              className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initials = getInitials(profile.full_name, email);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-6 mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            View and manage the information associated with your Chamber account.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            <Check className="h-4 w-4" />
            {success}
          </div>
        ) : null}

        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-lg font-semibold text-primary">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{profile.full_name || "Unnamed user"}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {email || "No email available"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Shield className="h-3 w-3" />
                      {profile.role === "admin" ? "Administrator" : "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Member since {formatDate(profile.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 px-5 py-6 sm:px-6">
              <div>
                <h3 className="text-sm font-semibold">Profile details</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update the information displayed across your account.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium">Full name</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    maxLength={120}
                    placeholder="Your full name"
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium">Avatar URL</span>
                  <input
                    value={avatarUrl}
                    onChange={(event) => setAvatarUrl(event.target.value)}
                    type="url"
                    placeholder="https://..."
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="mt-1.5 block text-[11px] text-muted-foreground">
                    Enter a publicly accessible image URL.
                  </span>
                </label>
              </div>

              <div className="flex justify-end border-t border-border pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <h2 className="text-sm font-semibold">Account information</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Authentication and system-managed account details.
              </p>
            </div>

            <div className="divide-y divide-border">
              <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email address</p>
                  <p className="mt-1 text-sm font-medium">{email || "Not available"}</p>
                </div>
                <span className="text-xs text-muted-foreground">Managed by authentication</span>
              </div>

              <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Account role</p>
                  <p className="mt-1 text-sm font-medium">
                    {profile.role === "admin" ? "Administrator" : "User"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Role changes are restricted</span>
              </div>

              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Password</p>
                  <p className="mt-1 text-sm font-medium">Send a password reset email</p>
                </div>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetting || !email}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {resetting ? "Sending..." : "Reset password"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-destructive/20 bg-card">
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">Sign out</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  End your current session on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </section>

          <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" />
            Profile ID: {profile.id}
          </div>
        </div>
      </div>
    </main>
  );
}
