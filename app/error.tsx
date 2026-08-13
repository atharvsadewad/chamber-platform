"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Citation, H1, Lead } from "@/components/ui/typography";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your monitoring service here.
    console.error(error);
  }, [error]);

  return (
    <div className="container-chamber flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-sm border border-border bg-secondary text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </div>

      <div className="flex flex-col gap-3">
        <H1>The record didn&apos;t load.</H1>
        <Lead className="mx-auto max-w-md">
          Something went wrong while retrieving this page. Nothing was
          saved or lost — try again, or return to research.
        </Lead>
        {error.digest && (
          <Citation className="mx-auto">Reference: {error.digest}</Citation>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="default" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to research</Link>
        </Button>
      </div>
    </div>
  );
}
