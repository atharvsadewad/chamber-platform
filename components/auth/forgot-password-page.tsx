"use client";

import type { Metadata } from "next";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { resetPassword } from "@/services/auth.service";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        normalizedEmail,
        "/workspace",
      );

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to send the reset link. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">
              Forgot Password?
            </h2>

            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a password
              reset link.
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
                    Reset link sent
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    If an account exists for{" "}
                    <span className="font-medium text-foreground">
                      {email.trim()}
                    </span>
                    , you'll receive an email with instructions
                    to reset your password.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Check your spam or junk folder if you don't
                    see it shortly.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  required
                />
              </div>

              {error ? (
                <p
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}