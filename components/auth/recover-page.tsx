"use client";
import type { Metadata } from "next";
import {
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
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";

import { supabase } from "@/providers/database/supabase";

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

export const metadata: Metadata = {
  title: "Reset Password",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RecoverPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenHash =
    searchParams.get("token_hash");

  const type =
    searchParams.get("type");

  const next = getSafeNextPath(
    searchParams.get("next"),
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const hasValidRecoveryLink =
    Boolean(tokenHash) &&
    type === "recovery";

  async function handleContinue() {
    if (!tokenHash || type !== "recovery") {
      setError(
        "This password reset link is invalid or has expired. Please request a new reset link.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      /*
       * The token is verified only after an explicit
       * user action.
       *
       * This is intentional. Email security scanners
       * and link prefetchers can open URLs automatically.
       * Verifying the recovery token on page load could
       * consume a one-time token before the user clicks it.
       */
      const { error: verifyError } =
        await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

      if (verifyError) {
        throw verifyError;
      }

      /*
       * The browser Supabase client persists the
       * recovery session. The token is removed from
       * the address bar before showing the password
       * form.
       */
      router.replace(
        `/auth/update-password?next=${encodeURIComponent(
          next,
        )}`,
      );

      router.refresh();
    } catch {
      setError(
        "This password reset link is invalid or has expired. Please request a new reset link.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                Reset Your Password
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your password reset request has been
                received. Continue to securely set a
                new password.
              </p>
            </div>
          </div>

          {error ? (
            <div
              className="space-y-5"
              role="alert"
            >
              <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
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
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-secondary/40 p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  For your security, this one-time reset
                  link will only be used after you
                  choose to continue.
                </p>
              </div>

              <Button
                type="button"
                className="w-full"
                disabled={
                  loading ||
                  !hasValidRecoveryLink
                }
                onClick={handleContinue}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue to Reset Password"
                )}
              </Button>

              <Link
                href="/auth/sign-in"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}