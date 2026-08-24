"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/providers/database/supabase";
import { WorkspaceDashboard } from "@/components/workspace/workspace-dashboard";

export default function WorkspacePage() {
  const router = useRouter();

  const [userName, setUserName] =
    useState("there");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session?.user) {
        router.replace(
          `/auth/sign-in?next=${encodeURIComponent(
            "/workspace",
          )}`,
        );

        return;
      }

      const fullName =
        session.user.user_metadata?.full_name;

      const email = session.user.email;

      if (
        typeof fullName === "string" &&
        fullName.trim()
      ) {
        const firstName =
          fullName.trim().split(/\s+/)[0];

        if (firstName) {
          setUserName(firstName);
        }
      } else if (email) {
        const emailName =
          email.split("@")[0];

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
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded-md bg-muted" />
            <div className="h-4 w-96 rounded-md bg-muted" />

            <div className="grid gap-4 pt-8 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-36 rounded-xl bg-muted"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <WorkspaceDashboard
      userName={userName}
    />
  );
}