import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <SignUpForm />
      </AuthCard>
    </AuthLayout>
  );
}