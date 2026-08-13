import { CardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-laws-and-judgments py-20">
      <div className="mx-auto mb-10 flex max-w-lg flex-col items-center gap-3 text-center">
        <div className="h-4 w-40 animate-pulse rounded-sm bg-muted" />
        <div className="h-8 w-72 animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
