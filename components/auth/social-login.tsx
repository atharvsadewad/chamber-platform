"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/services/auth.service";

interface SocialLoginProps {
  next: string;
}

export function SocialLogin({
  next,
}: SocialLoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");

    try {
      sessionStorage.setItem(
        "auth_next",
        next,
      );

      await signInWithGoogle(next);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to continue with Google.",
      );

      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        <Button
          variant="outline"
          type="button"
          className="w-full gap-2"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5" />

          {loading
            ? "Connecting..."
            : "Continue with Google"}
        </Button>

        <Button
          variant="outline"
          type="button"
          className="w-full gap-2"
          disabled
        >
          <FaMicrosoft className="h-5 w-5 text-[#00a4ef]" />

          Continue with Microsoft
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-destructive text-center"
        >
          {error}
        </p>
      )}
    </div>
  );
}