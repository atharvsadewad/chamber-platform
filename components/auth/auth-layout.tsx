import { ReactNode } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-[calc(100vh-72px)] justify-center px-4 pt-10 pb-8">
        <div className="w-full max-w-lg space-y-5">
          {/* Branding */}
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card shadow-sm">
                <Scale className="h-5 w-5" />
              </div>

              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">
                  Laws and Judgments
                </h1>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground">
              India's modern legal research and knowledge platform.
            </p>
          </div>

          {/* Auth Content */}
          {children}
        </div>
      </div>
    </main>
  );
}