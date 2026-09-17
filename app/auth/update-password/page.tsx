"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/providers/database/supabase";
import { updatePassword } from "@/services/auth.service";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [checkingSession, setCheckingSession] =
    useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const nextParam = searchParams.get("next");

  const next =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/workspace";

  useEffect(() => {
    let mounted = true;

    async function initializeRecoverySession() {
      try {
        const code = searchParams.get("code");

        /*
         * Supabase's PKCE password-recovery flow returns a
         * one-time code. Exchange it for the authenticated
         * recovery session before allowing a password change.
         */
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(
              code,
            );

          if (exchangeError) {
            throw exchangeError;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (!session) {
          setError(
            "This password reset link is invalid or has expired. Please request a new reset link.",
          );
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to verify this password reset link.";

        setError(message);
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    initializeRecoverySession();

    return () => {
      mounted = false;
    };
  }, [searchParams]);

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
      setError("Passwords do not match.");
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
              Verifying reset link...
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
                    Reset link unavailable
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
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  disabled={loading}
                  minLength={8}
                  required
                />
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Use at least 8 characters. Avoid using a
                password you've used elsewhere.
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

          {!success && !error ? null : null}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}