import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search";
import { Citation, H1, Lead } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="container-laws-and-judgments flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-sm border border-border bg-secondary text-muted-foreground">
        <FileQuestion className="size-6" aria-hidden />
      </div>

      <div className="flex flex-col gap-3">
        <Citation>No record — 404</Citation>
        <H1>This page isn&apos;t on the docket.</H1>
        <Lead className="mx-auto max-w-md">
          The page you&apos;re looking for may have moved or never existed.
          Search the library, or head back to research.
        </Lead>
      </div>

      <div className="w-full max-w-lg">
        <SearchBar placeholder="Search Chamber…" />
      </div>

      <Button variant="outline" asChild>
        <Link href="/">Back to research</Link>
      </Button>
    </div>
  );
}
