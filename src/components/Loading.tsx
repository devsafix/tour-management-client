import { Skeleton } from "./ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
      <div className="space-y-4 w-full max-w-lg">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <div className="grid gap-4 mt-8">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}
