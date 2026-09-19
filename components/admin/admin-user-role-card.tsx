"use client";

import { Loader2, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";

interface AdminUserRoleCardProps {
  user: {
    id: string;
    fullName: string;
    email: string | null;
    role: "user" | "admin";
  };
  currentUserId: string;
}

export function AdminUserRoleCard({
  user,
  currentUserId,
}: AdminUserRoleCardProps) {
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState("");

  const isCurrentUser = user.id === currentUserId;

  async function handleRoleChange() {
    if (isCurrentUser) {
      setError("You cannot change your own administrator role.");
      return;
    }

    const nextRole = user.role === "admin" ? "user" : "admin";

    const confirmed = window.confirm(
      nextRole === "admin"
        ? `Grant administrator access to ${user.fullName}?`
        : `Remove administrator access from ${user.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    setChanging(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users/role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          role: nextRole,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.error ||
            payload.message ||
            "Unable to update the user role.",
        );
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the user role.",
      );
    } finally {
      setChanging(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="h-4 w-4" />
        </div>

        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">
            Access & Role
          </h2>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Control this account&apos;s administrative access.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
            {user.role === "admin" ? (
              <ShieldCheck className="h-4 w-4 text-primary" />
            ) : (
              <UserRound className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {user.role === "admin"
                ? "Administrator"
                : "Regular User"}
            </p>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user.email || "No email address"}
            </p>
          </div>
        </div>
      </div>

      {isCurrentUser ? (
        <p className="mt-4 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs leading-5 text-muted-foreground">
          This is your currently authenticated administrator account.
          Your own administrator role cannot be changed here.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleRoleChange}
          disabled={changing}
          className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {changing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : user.role === "admin" ? (
            "Remove Administrator Access"
          ) : (
            "Grant Administrator Access"
          )}
        </button>
      )}

      {error && (
        <p
          className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs leading-5 text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}