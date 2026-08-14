"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/services/auth.service";
import { SocialLogin } from "./social-login";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextParam = searchParams.get("next");

  /*
   * If the user was sent here from a protected page,
   * return them there after signing in.
   *
   * Otherwise, authenticated users should land in Workspace.
   */
  const next =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/workspace";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signIn(email.trim(), password);

      /*
       * Store the destination so OAuth and other auth flows
       * can use the same post-login destination.
       */
      sessionStorage.setItem("auth_next", next);

      router.replace(next);
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in.";

      if (
        message.toLowerCase().includes("email not confirmed")
      ) {
        setError(
          "Please verify your email address before signing in.",
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h2>

        <p className="text-sm text-muted-foreground">
          Sign in to continue to your workspace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={
                showPassword ? "text" : "password"
              }
              autoComplete="current-password"
              className="pr-10"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) =>
                setRememberMe(checked === true)
              }
            />

            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Link
            href={`/auth/forgot-password?next=${encodeURIComponent(
              next,
            )}`}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Continue"}
        </Button>
      </form>

      <SocialLogin next={next} />

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/sign-up?next=${encodeURIComponent(
            next,
          )}`}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}