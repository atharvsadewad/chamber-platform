"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  MailCheck,
} from "lucide-react";
import { useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { resendVerificationEmail } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  const verified =
    searchParams.get("verified") === "true";

  const nextParam = searchParams.get("next");

  const next =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/";

  const [email, setEmail] = useState("");
  const [resending, setResending] =
    useState(false);
  const [resent, setResent] =
    useState(false);
  const [error, setError] = useState("");

  async function handleResend() {
    if (!email.trim()) {
      setError(
        "Enter your email address to resend the verification email.",
      );
      return;
    }

    setResending(true);
    setError("");
    setResent(false);

    try {
      await resendVerificationEmail(
        email.trim(),
        next,
      );

      setResent(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend the verification email.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6 text-center">
          {verified ? (
            <>
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  Email verified
                </h2>

                <p className="text-sm leading-6 text-muted-foreground">
                  Your email address has been
                  verified successfully. Your account
                  is ready to use.
                </p>
              </div>

              <Link
                href={`/auth/sign-in?next=${encodeURIComponent(
                  next,
                )}`}
                className="flex h-12 w-full items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Proceed to Sign In
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <MailCheck className="h-7 w-7 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">
                  Verify your email
                </h2>

                <p className="text-sm leading-6 text-muted-foreground">
                  We&apos;ve sent a verification link
                  to your email address. Please check
                  your inbox and click the link to verify
                  your account.
                </p>
              </div>

              <div className="space-y-3 text-left">
                <label
                  htmlFor="verification-email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="verification-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-left text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {resent && (
                <p className="text-sm text-primary">
                  Verification email sent
                  successfully.
                </p>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex h-12 w-full items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? "Sending..."
                  : "Resend Verification Email"}
              </button>

              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check
                your spam or junk folder.
              </p>

              <Link
                href={`/auth/sign-in?next=${encodeURIComponent(
                  next,
                )}`}
                className="block text-sm text-primary hover:underline"
              >
                Return to Sign In
              </Link>
            </>
          )}
        </div>
      </AuthCard>
    </AuthLayout>
  );
}