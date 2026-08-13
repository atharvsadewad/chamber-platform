import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">Forgot Password?</h2>

            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a password reset link.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
              />
            </div>

            <Button className="w-full">
              Send Reset Link
            </Button>
          </form>

          <div className="text-center">
            <Link
              href="/auth/sign-in"
              className="text-sm text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}