"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/providers/database/supabase";
import { updatePassword } from "@/services/auth.service";

function getSafeNextPath(
  next: string | null,
) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return "/workspace";
  }

  return next;
}

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const next = getSafeNextPath(
    searchParams.get("next"),
  );

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        /*
         * The recovery token has already been verified
         * by /auth/recover.
         *
         * At this stage we only need to confirm that
         * Supabase has an authenticated session in the
         * current browser.
         */
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (!session) {
          setError(
            "Your password reset session is unavailable or has expired. Please request a new reset link.",
          );
        }
      } catch {
        if (!mounted) {
          return;
        }

        setError(
          "Unable to verify your password reset session. Please request a new reset link.",
        );
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);

      setSuccess(true);

      window.setTimeout(() => {
        router.replace(next);
        router.refresh();
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update your password. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="flex min-h-40 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying reset session...
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">
              Set New Password
            </h2>

            <p className="text-sm text-muted-foreground">
              Choose a new password for your account.
            </p>
          </div>

          {success ? (
            <div
              className="rounded-xl border border-border bg-secondary/40 p-5"
              role="status"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="font-medium text-foreground">
                    Password updated
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Your password has been changed
                    successfully. Redirecting you now...
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-5">
              <div
                className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                <div>
                  <p className="font-medium text-foreground">
                    Reset session unavailable
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>

              <Link
                href="/auth/forgot-password"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label htmlFor="password">
                  New Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm New Password
                </Label>

                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  disabled={loading}
                  minLength={8}
                  required
                />
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Use at least 8 characters. Avoid using
                a password you've used elsewhere.
              </p>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}