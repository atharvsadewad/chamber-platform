"use client";

import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";

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

type RoleFilter = "all" | "admin" | "user";

export function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [changingUserId, setChangingUserId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.full_name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        user.id
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return Boolean(
        matchesSearch && matchesRole,
      );
    });
  }, [users, search, roleFilter]);

  async function handleRoleChange(
    user: AdminUser,
  ) {
    const nextRole =
      user.role === "admin"
        ? "user"
        : "admin";

    if (user.id === currentUserId) {
      setError(
        "You cannot change your own administrator role.",
      );
      setMessage("");
      return;
    }

    const confirmed = window.confirm(
      nextRole === "admin"
        ? `Grant administrator access to ${
            user.full_name?.trim() ||
            user.email ||
            "this user"
          }?`
        : `Remove administrator access from ${
            user.full_name?.trim() ||
            user.email ||
            "this user"
          }?`,
    );

    if (!confirmed) {
      return;
    }

    setChangingUserId(user.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/users/role",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            role: nextRole,
          }),
        },
      );

      const payload =
        (await response.json()) as {
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

      /*
       * The page is server-rendered, so reload it
       * after a successful server-side change.
       */
      window.location.reload();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update the user role.";

      setError(message);
    } finally {
      setChangingUserId(null);
    }
  }

  function clearSearch() {
    setSearch("");
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Application accounts currently registered
              on Laws & Judgments.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search users..."
                aria-label="Search users"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear user search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value as RoleFilter,
                  )
                }
                aria-label="Filter users by role"
                className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-9 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring sm:w-40"
              >
                <option value="all">
                  All roles
                </option>
                <option value="admin">
                  Administrators
                </option>
                <option value="user">
                  Regular users
                </option>
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {users.length}
            </span>{" "}
            users
          </span>

          {changingUserId && (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating role...
            </span>
          )}
        </div>

        {message && (
          <div
            className="mt-4 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground"
            role="status"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                User
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Role
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Email
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Joined
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Last Sign In
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Verification
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-14 text-center"
                >
                  <Search className="mx-auto h-7 w-7 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium text-foreground">
                    No users found
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term or role
                    filter.
                  </p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUserId={currentUserId}
                  changingUserId={changingUserId}
                  onRoleChange={handleRoleChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UserRow({
  user,
  currentUserId,
  changingUserId,
  onRoleChange,
}: {
  user: AdminUser;
  currentUserId: string;
  changingUserId: string | null;
  onRoleChange: (user: AdminUser) => void;
}) {
  const name =
    user.full_name?.trim() ||
    "Unnamed User";

  const initials = getInitials(name);

  const joinedDate = formatDate(
    user.created_at,
  );

  const lastSignIn = user.last_sign_in_at
    ? formatDate(user.last_sign_in_at)
    : "Never";

  const isCurrentUser =
    user.id === currentUserId;

  const isChanging =
    changingUserId === user.id;

  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="h-10 w-10 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
              <span className="text-sm font-semibold text-primary">
                {initials}
              </span>
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users/${user.id}`}
                className="truncate font-medium text-foreground hover:text-primary"
              >
                {name}
              </Link>

              {isCurrentUser && (
                <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  You
                </span>
              )}
            </div>

            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
              {user.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        {user.role === "admin" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" />
            User
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-foreground">
          {user.email ?? "Unavailable"}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {joinedDate}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {lastSignIn}
        </span>
      </td>

      <td className="px-5 py-4">
        {user.email_confirmed_at ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <XCircle className="h-4 w-4" />
            Unverified
          </span>
        )}
      </td>

      <td className="px-5 py-4 text-right">
        {isCurrentUser ? (
          <span className="text-xs text-muted-foreground">
            Current admin
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onRoleChange(user)}
            disabled={Boolean(changingUserId)}
            className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChanging ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Updating
              </>
            ) : user.role === "admin" ? (
              "Remove Admin"
            ) : (
              "Make Admin"
            )}
          </button>
        )}
      </td>
    </tr>
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
  }).format(date);
}

function getInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .filter(Boolean);

  const first = parts[0] ?? "";

  if (!first) {
    return "?";
  }

  if (parts.length === 1) {
    return first
      .slice(0, 2)
      .toUpperCase();
  }

  const last =
    parts[parts.length - 1] ?? "";

  if (!last) {
    return first
      .slice(0, 2)
      .toUpperCase();
  }

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}