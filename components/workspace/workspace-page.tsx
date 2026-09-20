"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/providers/database/supabase";
import { WorkspaceDashboard } from "@/components/workspace/workspace-dashboard";

export default function WorkspacePage() {
  const router = useRouter();

  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        router.replace(
          `/auth/sign-in?next=${encodeURIComponent("/workspace")}`,
        );
        return;
      }

      const fullName = session.user.user_metadata?.full_name;
      const email = session.user.email;

      if (
        typeof fullName === "string" &&
        fullName.trim()
      ) {
        const firstName = fullName.trim().split(/\s+/)[0];

        if (firstName) {
          setUserName(firstName);
        }
      } else if (email) {
        const emailName = email.split("@")[0];

        if (emailName) {
          setUserName(emailName);
        }
      }

      setLoading(false);
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10">
          <div className="flex min-h-[calc(100vh-5rem)] items-center">
            <div className="w-full animate-pulse space-y-7">
              <div className="h-32 rounded-2xl bg-muted" />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 rounded-xl bg-muted"
                  />
                ))}
              </div>

              <div className="h-64 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <WorkspaceDashboard userName={userName} />;
}
