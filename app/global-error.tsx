"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#101815] px-6 text-center font-sans text-[#F2EDE1]">
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-2xl font-medium">
            Laws & Judgments is unavailable.
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#F2EDE1]/70">
            A critical error occurred while loading the application. Please
            try again in a moment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-sm bg-[#B08D57] px-5 py-2 text-sm font-medium text-[#101815] transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
