"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

import { signUp } from "@/services/auth.service";
import { SocialLogin } from "./social-login";

export function SignUpForm() {
  const searchParams = useSearchParams();

  const nextParam = searchParams.get("next");

  const next =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validName = name.trim().length > 0;

  const validEmail =
    email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validPassword = password.length >= 8;

  const canCreateAccount =
    validName &&
    validEmail &&
    validPassword &&
    termsAccepted &&
    !loading;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canCreateAccount) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const data = await signUp(
        email.trim(),
        password,
        name.trim(),
        next,
      );

      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setErrorMessage(
          "An account with this email address may already exist. Please sign in instead.",
        );
        return;
      }

      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Something went wrong while creating your account. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  /*
   * -------------------------
   * Success state
   * -------------------------
   */
  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Account created
          </h2>

          <p className="text-sm leading-6 text-muted-foreground">
            Your Laws and Judgments account has been created
            successfully.
          </p>

          <p className="text-sm leading-6 text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">
              {email}
            </span>
            . Please verify your email before signing in.
          </p>
        </div>

        <Link
          href={`/auth/sign-in?next=${encodeURIComponent(next)}`}
          className="flex h-12 w-full items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Proceed to Sign In
        </Link>

        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive the email? Check your spam or junk
          folder.
        </p>
      </div>
    );
  }

  /*
   * -------------------------
   * Signup form
   * -------------------------
   */
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h2>

        <p className="text-sm text-muted-foreground">
          Get started with Laws and Judgments.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="signup-name"
            className="text-sm font-medium"
          >
            Full Name
          </label>

          <input
            id="signup-name"
            name="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {email.length > 0 && !validEmail && (
            <p className="text-xs text-muted-foreground">
              Enter a valid email address.
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              onFocus={() => setPasswordFocused(true)}
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              disabled={loading}
              className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {passwordFocused && !validPassword && (
            <p className="text-xs text-muted-foreground">
              Password must contain at least 8 characters.
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            id="signup-terms"
            name="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) =>
              setTermsAccepted(event.target.checked)
            }
            disabled={loading}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
          />

          <label
            htmlFor="signup-terms"
            className="cursor-pointer text-sm leading-snug text-muted-foreground"
          >
            I agree to the{" "}
            <Link
              href={`/terms?next=${encodeURIComponent(next)}`}
              className="font-medium text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href={`/privacy?next=${encodeURIComponent(next)}`}
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {!termsAccepted && (
          <p className="text-xs text-muted-foreground">
            Please accept the Terms of Service and Privacy Policy
            to continue.
          </p>
        )}

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}

        {/* Create Account */}
        <button
          type="submit"
          disabled={!canCreateAccount}
          className="flex h-12 w-full items-center justify-center rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      {/* Social Login */}
      <SocialLogin next={next} />

      {/* Sign In */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/auth/sign-in?next=${encodeURIComponent(next)}`}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}