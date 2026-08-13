import { AuthCard } from "@/components/auth/auth-card";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <SignInForm />
      </AuthCard>
    </AuthLayout>
  );
}